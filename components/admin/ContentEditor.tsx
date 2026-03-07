
import React, { useState, useEffect } from 'react';
import { StoreSettings, ContentSection, ContentBlock } from '../../types';
import { Plus, Trash2, GripVertical, Type, Image as ImageIcon, Video, Heading } from 'lucide-react';

interface ContentEditorProps {
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
  initialSectionId?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ settings, onUpdateSettings, initialSectionId }) => {
  const sections = settings.contentSections || [];
  const [activeSectionId, setActiveSectionId] = useState<string | null>(initialSectionId || sections[0]?.id || null);

  useEffect(() => {
    if (initialSectionId) {
      setActiveSectionId(initialSectionId);
    }
  }, [initialSectionId]);

  const activeSection = sections.find(s => s.id === activeSectionId);

  const updateSections = (newSections: ContentSection[]) => {
    onUpdateSettings({ ...settings, contentSections: newSections });
  };

  const addSection = () => {
    const newSection: ContentSection = {
      id: Date.now().toString(),
      title: 'Новая страница',
      slug: 'new-page',
      isVisible: true,
      blocks: []
    };
    updateSections([...sections, newSection]);
    setActiveSectionId(newSection.id);
  };

  const addBlock = (type: ContentBlock['type']) => {
    if (!activeSectionId) return;
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: type === 'header' ? 'Новый заголовок' : type === 'text' ? 'Новый текст...' : ''
    };
    const newSections = sections.map(s => 
      s.id === activeSectionId ? { ...s, blocks: [...s.blocks, newBlock] } : s
    );
    updateSections(newSections);
  };

  const updateBlock = (blockId: string, content: string) => {
    const newSections = sections.map(s => 
      s.id === activeSectionId ? { 
        ...s, 
        blocks: s.blocks.map(b => b.id === blockId ? { ...b, content } : b) 
      } : s
    );
    updateSections(newSections);
  };

  const removeBlock = (blockId: string) => {
    const newSections = sections.map(s => 
      s.id === activeSectionId ? { 
        ...s, 
        blocks: s.blocks.filter(b => b.id !== blockId) 
      } : s
    );
    updateSections(newSections);
  };

  return (
    <div className="p-10 space-y-10 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">Редактор Контента</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Управление страницами и текстовыми блоками</p>
        </div>
        <button 
          onClick={addSection}
          className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
        >
          <Plus size={16} /> Создать страницу
        </button>
      </div>

      <div className="flex gap-10">
        {/* Sidebar: Pages */}
        <div className="w-64 shrink-0 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">Страницы</p>
          {sections.map(section => (
            <button 
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${activeSectionId === section.id ? 'bg-[#6C5DD3] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Editor Area */}
        <div className="flex-grow space-y-8">
          {activeSection ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                <input 
                  type="text" 
                  value={activeSection.title}
                  onChange={e => {
                    const newSections = sections.map(s => s.id === activeSectionId ? { ...s, title: e.target.value } : s);
                    updateSections(newSections);
                  }}
                  className="text-2xl font-black text-slate-900 italic uppercase outline-none focus:text-[#6C5DD3] transition-colors"
                />
                <div className="flex gap-4">
                  <button onClick={() => addBlock('header')} className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-[#6C5DD3] transition-all" title="Заголовок"><Heading size={20} /></button>
                  <button onClick={() => addBlock('text')} className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-[#6C5DD3] transition-all" title="Текст"><Type size={20} /></button>
                  <button onClick={() => addBlock('image')} className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-[#6C5DD3] transition-all" title="Изображение"><ImageIcon size={20} /></button>
                  <button onClick={() => addBlock('video')} className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:text-[#6C5DD3] transition-all" title="Видео"><Video size={20} /></button>
                </div>
              </div>

              <div className="p-10 space-y-6">
                {activeSection.blocks.map((block) => (
                  <div key={block.id} className="relative group">
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="text-slate-300 cursor-grab" size={20} />
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-grow">
                        {block.type === 'header' ? (
                          <input 
                            type="text" 
                            value={block.content}
                            onChange={e => updateBlock(block.id, e.target.value)}
                            className="w-full text-xl font-black text-slate-900 outline-none border-b-2 border-transparent focus:border-[#6C5DD3] py-2"
                          />
                        ) : block.type === 'text' ? (
                          <textarea 
                            value={block.content}
                            onChange={e => updateBlock(block.id, e.target.value)}
                            className="w-full text-slate-600 font-medium outline-none border-none resize-none min-h-[100px] py-2"
                          />
                        ) : (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">URL {block.type === 'image' ? 'изображения' : 'видео'}</label>
                            <input 
                              type="text" 
                              value={block.content}
                              onChange={e => updateBlock(block.id, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]"
                              placeholder="https://..."
                            />
                            {block.content && block.type === 'image' && (
                              <img src={block.content} className="mt-4 max-h-48 rounded-2xl object-cover" alt="Preview" />
                            )}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => removeBlock(block.id)}
                        className="p-3 text-rose-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                {activeSection.blocks.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <p className="text-slate-300 font-black uppercase tracking-widest text-sm">Добавьте блоки контента сверху</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem]">
              <p className="text-slate-300 font-black uppercase tracking-widest">Выберите или создайте страницу</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
