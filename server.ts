import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import TelegramBot from 'node-telegram-bot-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  const port = 3000;

  app.use(express.json());

  // Telegram Bot Management
  const bots = new Map<string, TelegramBot>();
  const messageToSocket = new Map<number, string>(); // telegramMessageId -> socketId

  const getBot = (token: string) => {
    if (bots.has(token)) return bots.get(token)!;
    
    try {
      const bot = new TelegramBot(token, { polling: true });
      bots.set(token, bot);

      bot.on('message', (msg) => {
        // Check if this is a reply to a message we sent
        if (msg.reply_to_message && msg.text) {
          const targetSocketId = messageToSocket.get(msg.reply_to_message.message_id);
          if (targetSocketId) {
            io.to(targetSocketId).emit('server_message', {
              text: msg.text,
              sender: 'admin',
              timestamp: new Date().toISOString()
            });
          }
        }
      });

      console.log(`Telegram bot initialized for token: ${token.substring(0, 10)}...`);
      return bot;
    } catch (err) {
      console.error('Error initializing Telegram bot:', err);
      return null;
    }
  };

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);
    
    socket.on('update_telegram_config', (config) => {
      if (config.token && config.chatId) {
        getBot(config.token);
        socket.data.telegramToken = config.token;
        socket.data.telegramChatId = config.chatId;
      }
    });

    socket.on('client_message', async (msg) => {
      console.log('Message from client:', msg);
      const { telegramToken, telegramChatId } = socket.data;

      if (telegramToken && telegramChatId && bots.has(telegramToken)) {
        const bot = bots.get(telegramToken)!;
        try {
          const now = new Date();
          const dateStr = now.toLocaleDateString('ru-RU');
          const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

          const text = `📩 <b>Новое сообщение с сайта</b>\n\n` +
                       `👤 <b>Имя:</b> ${msg.user?.name || 'Не указано'}\n` +
                       `📧 <b>Email:</b> ${msg.user?.email || 'Не указано'}\n` +
                       `📱 <b>Телефон:</b> ${msg.user?.phone || 'Не указано'}\n` +
                       `💬 <b>Сообщение:</b> ${msg.text}\n\n` +
                       `🕒 <b>Дата:</b> ${dateStr}\n` +
                       `⏰ <b>Время:</b> ${timeStr}\n\n` +
                       `💡 <i>Используйте функцию "Ответить" (Reply), чтобы написать пользователю.</i>`;

          const sentMsg = await bot.sendMessage(telegramChatId, text, { parse_mode: 'HTML' });
          messageToSocket.set(sentMsg.message_id, socket.id);
          
          // Cleanup old mappings after 24 hours to prevent memory leak
          setTimeout(() => messageToSocket.delete(sentMsg.message_id), 24 * 60 * 60 * 1000);
          
          console.log('Telegram notification sent');
        } catch (error) {
          console.error('Failed to send Telegram notification:', error);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  // Mock AI routes
  app.post('/api/ai/enrich', (req, res) => {
    const { brand, model } = req.body;
    res.json({
      description: `Это премиальный продукт от ${brand} (${model}). Он отличается высоким качеством и надежностью.`,
      features: ['Премиум дизайн', 'Высокая производительность', 'Гарантия 2 года']
    });
  });

  app.post('/api/ai/chat', (req, res) => {
    const { message } = req.body;
    res.json({
      text: `Здравствуйте! Я ваш ИИ-ассистент. Вы спросили: "${message}". Чем я могу вам помочь?`
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
