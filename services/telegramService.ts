import { Order, StoreSettings } from '../types';

export const sendOrderToTelegram = async (order: Order, settings: StoreSettings) => {
  const telegram = settings.telegram;
  if (!telegram || !telegram.enabled || !telegram.botToken || !telegram.chatId) {
    console.log('Telegram notifications are disabled or not configured.');
    return;
  }

  const itemsList = order.items
    .map((item, index) => `${index + 1}. ${item.name} — ${item.quantity} шт — ${item.price.toLocaleString()} ${settings.currency}`)
    .join('\n');

  const message = `
📦 *Новый заказ*
№${order.orderNumber}

👤 *Клиент:*
Имя: ${order.customerName || 'Не указано'}
Телефон: ${order.customerPhone || 'Не указано'}
Email: ${order.customerEmail || 'Не указано'}

🚚 *Доставка:*
Способ: ${order.deliveryMethod || 'Курьерская'}
Адрес: ${order.deliveryAddress}
${order.deliveryDate ? `Дата: ${order.deliveryDate}` : ''}
${order.deliveryTime ? `Время: ${order.deliveryTime}` : ''}

💳 *Оплата:*
Способ: ${order.paymentMethod || 'При получении'}

🛒 *Товары:*
${itemsList}

💰 *Итого:* ${order.total.toLocaleString()} ${settings.currency}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegram.botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegram.chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send Telegram message:', errorData);
    } else {
      console.log('Telegram notification sent successfully.');
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};
