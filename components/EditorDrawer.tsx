
import React, { useState } from 'react';

interface EditorDrawerProps {
  sectionId: string | null;
  sectionTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

// Fix: Made children optional to resolve TypeScript JSX inference errors where it thinks props are empty
const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4 mt-8 first:mt-0">{children}</h4>
);

// Fix: Moved ToggleRow outside for consistency and performance
const ToggleRow = ({ label, checked, onChange, hasInfo = false }: { label: string, checked: boolean, onChange: (v: boolean) => void, hasInfo?: boolean }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-1.5">
      <span className="text-[12px] font-medium text-slate-700 leading-tight max-w-[200px]">{label}</span>
      {hasInfo && <span className="text-slate-300 cursor-help text-xs">ⓘ</span>}
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-[#4a90e2]' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

// Fix: Moved Counter outside for consistency and performance
const Counter = ({ label, value, onChange, step = 1, min = 0, hasInfo = false }: { label: string, value: number, onChange: (v: number) => void, step?: number, min?: number, hasInfo?: boolean }) => (
  <div className="space-y-1.5 mb-4">
    <div className="flex items-center gap-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{label}</label>
      {hasInfo && <span className="text-slate-300 cursor-help text-xs">ⓘ</span>}
    </div>
    <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden h-10 shadow-sm">
      <input 
        type="text" 
        value={value} 
        readOnly 
        className="flex-grow px-4 text-sm font-medium text-slate-700 outline-none bg-transparent"
      />
      <button onClick={() => onChange(Math.max(min, value - step))} className="w-10 flex items-center justify-center border-l border-slate-100 hover:bg-slate-50 text-slate-400 text-lg transition-colors">—</button>
      <button onClick={() => onChange(value + step)} className="w-10 flex items-center justify-center border-l border-slate-100 hover:bg-slate-50 text-slate-400 text-lg transition-colors">+</button>
    </div>
  </div>
);

// Fix: Moved AlignmentControl outside for consistency and performance
const AlignmentControl = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2 mb-4">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{label}</label>
    <div className="flex bg-white border border-slate-200 rounded-lg p-1 gap-1">
      {['left', 'center', 'right'].map((align) => (
        <button 
          key={align}
          onClick={() => onChange(align)}
          className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${value === align ? 'bg-blue-50 border border-blue-200 text-blue-500' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            {align === 'left' && <path d="M4 5h16v2H4zm0 4h10v2H4zm0 4h16v2H4zm0 4h10v2H4z"/>}
            {align === 'center' && <path d="M4 5h16v2H4zm3 4h10v2H7zm-3 4h16v2H4zm3 4h10v2H7z"/>}
            {align === 'right' && <path d="M4 5h16v2H4zm6 4h10v2H10zm-6 4h16v2H4zm6 4h10v2H10z"/>}
          </svg>
        </button>
      ))}
    </div>
  </div>
);

// Fix: Moved SelectControl outside for consistency and performance
const SelectControl = ({ label, value, options, hasInfo = false }: { label: string, value: string, options: string[], hasInfo?: boolean }) => (
  <div className="space-y-1.5 mb-4">
    <div className="flex items-center gap-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{label}</label>
      {hasInfo && <span className="text-slate-300 cursor-help text-xs">ⓘ</span>}
    </div>
    <div className="relative">
      <select 
        defaultValue={value}
        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none appearance-none shadow-sm cursor-pointer focus:border-blue-400 transition-colors"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  </div>
);

// Fix: Moved ColorControl outside for consistency and performance
const ColorControl = ({ label, value, onChange, hasInfo = false }: { label: string, value: string, onChange: (v: string) => void, hasInfo?: boolean }) => (
  <div className="space-y-1.5 mb-4">
    <div className="flex items-center gap-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{label}</label>
      {hasInfo && <span className="text-slate-300 cursor-help text-xs">ⓘ</span>}
    </div>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: value }} />
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-400 shadow-sm transition-all"
      />
    </div>
  </div>
);

export const EditorDrawer: React.FC<EditorDrawerProps> = ({ sectionId, sectionTitle, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  
  // States for all UI elements shown in the screenshots
  const [settings, setSettings] = useState({
    // Category section
    hideIncompleteRows: true,
    itemsCount: 12,
    categoryLinkAlign: 'center',
    menuItemsAlign: 'center',
    // Header section
    fontSize: 1.25,
    fontWeight: 400,
    // Sizes section
    minCardWidth: 180,
    verticalGap: 2,
    horizontalGap: 2,
    // Image section
    imgBgColor: '',
    imgAspectRatio: 1,
    imgSizeOption: 'Сохранить пропорции',
    changeImgOnHover: false,
    imgBorderRadius: 0,
    // Additional styling
    rounding: true,
    ratingColor: '#ff4100',
    accentuate: 'Без акцентирования',
    infoAlign: 'left',
    stickerSize: 0.7,
    // Quick View
    quickViewRatingColor: '#ff4100',
    // Mobile
    mobileMinWidth: 130,
    mobileVGap: 2,
    mobileHGap: 1,
    mobilePropsDisplay: 'Текст',
    hideQuickViewVariants: false,
    // Background
    widgetBgColor: 'Из палитры шаблона',
    stretchBg: true,
    // Paddings
    paddingTop: 0,
    paddingBottom: 2,
    // Content
    maxWidth: 'Из настроек шаблона (1240)',
    stretchContent: false,
    removeSidePaddings: false,
    // Adaptivity
    hideOnDesktop: false,
    hideOnPhone: false
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-[#f4f7f6] shadow-2xl z-[3000] flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="bg-white p-6 border-b border-slate-200 flex flex-col gap-5">
        <div className="flex items-start justify-between">
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{sectionId || 'SP9-1'}</span>
              <h3 className="text-[15px] font-bold text-[#333] leading-tight pr-10">{sectionTitle}</h3>
           </div>
           <div className="flex items-center gap-3">
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
           </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f1f3f4] p-1 rounded-xl">
           <button 
             onClick={() => setActiveTab('content')}
             className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Контент
           </button>
           <button 
             onClick={() => setActiveTab('design')}
             className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'design' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Дизайн
           </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-6 hide-scrollbar pb-32">
        {activeTab === 'content' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="space-y-4">
               <p className="text-[13px] font-medium text-slate-700 leading-tight">Ограничение количества слов в кратком описании товара</p>
               <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-slate-300 transition-all shadow-sm">10</button>
                  <button className="flex-1 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-slate-300 transition-all shadow-sm">20</button>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
               <div className="space-y-1">
                  <h4 className="text-[13px] font-bold text-slate-800">Включить избранное</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">Чтобы показать или скрыть избранное, перейдите в настройки шаблона и включите избранное</p>
               </div>
               <div className="space-y-2">
                  <ToggleRow label="Скрыть рейтинг" checked={true} onChange={()=>{}} />
                  <ToggleRow label="Скрыть краткое описание" checked={true} onChange={()=>{}} />
               </div>
            </div>

            <div>
              <SectionTitle>БЫСТРЫЙ ПРОСМОТР ТОВАРА</SectionTitle>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <ToggleRow label="Скрыть рейтинг" checked={true} onChange={()=>{}} />
              </div>
            </div>

            <div>
              <SectionTitle>КАТЕГОРИИ</SectionTitle>
              <div className="space-y-2">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-slate-50">
                  <span className="text-sm font-medium text-slate-700">Каталог</span>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </div>
                <button className="w-full py-4 bg-white border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center gap-3 text-slate-400 hover:text-blue-500 hover:border-blue-100 transition-all group font-bold text-xs uppercase tracking-widest">
                   <span className="text-xl group-hover:scale-110 transition-transform">+</span>
                   Добавить категорию
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            
            <section>
              <SectionTitle>КАТЕГОРИЯ</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <ToggleRow label="Скрывать строки не заполненные по всей ширине" checked={settings.hideIncompleteRows} onChange={(v) => setSettings({...settings, hideIncompleteRows: v})} hasInfo />
                <Counter label="Количество выводимых товаров" value={settings.itemsCount} onChange={(v) => setSettings({...settings, itemsCount: v})} />
                <AlignmentControl label="Выравнивание ссылки на категорию" value={settings.categoryLinkAlign} onChange={(v) => setSettings({...settings, categoryLinkAlign: v})} />
                <AlignmentControl label="Выравнивание пунктов меню" value={settings.menuItemsAlign} onChange={(v) => setSettings({...settings, menuItemsAlign: v})} />
              </div>
            </section>

            <section>
              <SectionTitle>ЗАГОЛОВОК</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <Counter label="Размер шрифта" value={settings.fontSize} step={0.05} onChange={(v) => setSettings({...settings, fontSize: v})} />
                <Counter label="Вес шрифта" value={settings.fontWeight} step={100} min={100} onChange={(v) => setSettings({...settings, fontWeight: v})} />
              </div>
            </section>

            <section>
              <SectionTitle>РАЗМЕРЫ</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <Counter label="Минимальная ширина карточки товара, (px)" value={settings.minCardWidth} hasInfo onChange={(v) => setSettings({...settings, minCardWidth: v})} />
                <Counter label="Вертикальный отступ между карточками (rem)" value={settings.verticalGap} step={0.5} hasInfo onChange={(v) => setSettings({...settings, verticalGap: v})} />
                <Counter label="Горизонтальный отступ между карточками (rem)" value={settings.horizontalGap} step={0.5} hasInfo onChange={(v) => setSettings({...settings, horizontalGap: v})} />
              </div>
            </section>

            <section>
              <SectionTitle>ИЗОБРАЖЕНИЕ</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Цвет фона</label>
                  <div className="w-full p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-3 text-slate-300 text-sm shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                     <div className="w-5 h-5 border border-slate-200 rounded-sm relative overflow-hidden bg-white">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-px bg-rose-400 rotate-45" />
                     </div>
                     <span className="font-medium">Нет цвета</span>
                  </div>
                </div>
                <Counter label="Пропорции изображения" value={settings.imgAspectRatio} step={0.1} onChange={(v) => setSettings({...settings, imgAspectRatio: v})} />
                <SelectControl label="Размер изображения" value={settings.imgSizeOption} options={['Сохранить пропорции', 'Заполнить по ширине', 'Центрировать']} />
                <ToggleRow label="Менять фото товара при наведении" checked={settings.changeImgOnHover} onChange={(v) => setSettings({...settings, changeImgOnHover: v})} />
                <Counter label="Скругление углов изображения (px)" value={settings.imgBorderRadius} hasInfo onChange={(v) => setSettings({...settings, imgBorderRadius: v})} />
              </div>
            </section>

            <section>
              <SectionTitle>ДОПОЛНИТЕЛЬНАЯ СТИЛИЗАЦИЯ</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <ToggleRow label="Закругление" checked={settings.rounding} onChange={(v) => setSettings({...settings, rounding: v})} hasInfo />
                <ColorControl label="Цвет рейтинга" value={settings.ratingColor} onChange={(v) => setSettings({...settings, ratingColor: v})} hasInfo />
                <SelectControl label="Акцентировать" value={settings.accentuate} options={['Без акцентирования', 'Тень', 'Обводка']} />
                <AlignmentControl label="Выравнивание информации о товаре" value={settings.infoAlign} onChange={(v) => setSettings({...settings, infoAlign: v})} />
                <Counter label="Размер стикеров (rem)" value={settings.stickerSize} step={0.1} hasInfo onChange={(v) => setSettings({...settings, stickerSize: v})} />
                <button className="text-blue-500 text-[12px] font-bold flex items-center gap-2 hover:underline pt-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                   Цвета стикеров
                </button>
              </div>
            </section>

            <section>
              <SectionTitle>БЫСТРЫЙ ПРОСМОТР ТОВАРА</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <ColorControl label="Цвет рейтинга" value={settings.quickViewRatingColor} onChange={(v) => setSettings({...settings, quickViewRatingColor: v})} hasInfo />
              </div>
            </section>

            <section>
              <SectionTitle>НАСТРОЙКИ МОБИЛЬНОЙ ВЕРСИИ</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <Counter label="Минимальная ширина карточки товара для мобильных устройств, (px)" value={settings.mobileMinWidth} hasInfo onChange={(v) => setSettings({...settings, mobileMinWidth: v})} />
                <Counter label="Вертикальный отступ между карточками для мобильных устройств (rem)" value={settings.mobileVGap} step={0.5} hasInfo onChange={(v) => setSettings({...settings, mobileVGap: v})} />
                <Counter label="Горизонтальный отступ между карточками для мобильных устройств (rem)" value={settings.mobileHGap} step={0.5} hasInfo onChange={(v) => setSettings({...settings, mobileHGap: v})} />
                <SelectControl label="Отображение свойств" value={settings.mobilePropsDisplay} options={['Текст', 'Иконки', 'Скрыто']} hasInfo />
                <ToggleRow label="Скрыть быстрый просмотр вариантов товара" checked={settings.hideQuickViewVariants} onChange={(v) => setSettings({...settings, hideQuickViewVariants: v})} />
              </div>
            </section>

            <section>
              <SectionTitle>ФОН</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <SelectControl label="Цвет фона виджета" value={settings.widgetBgColor} options={['Из палитры шаблона', 'Прозрачный', 'Свой цвет']} />
                <ToggleRow label="Растянуть фон" checked={settings.stretchBg} onChange={(v) => setSettings({...settings, stretchBg: v})} />
              </div>
            </section>

            <section>
              <SectionTitle>ОТСТУПЫ</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <Counter label="Внутренний отступ сверху (vw)" value={settings.paddingTop} hasInfo onChange={(v) => setSettings({...settings, paddingTop: v})} />
                <Counter label="Внутренний отступ снизу (vw)" value={settings.paddingBottom} hasInfo onChange={(v) => setSettings({...settings, paddingBottom: v})} />
              </div>
            </section>

            <section>
              <SectionTitle>КОНТЕНТ</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <SelectControl label="Максимальная ширина контента (px)" value={settings.maxWidth} options={['Из настроек шаблона (1240)', '1000', '1400', '1600']} hasInfo />
                <ToggleRow label="Растянуть контент" checked={settings.stretchContent} onChange={(v) => setSettings({...settings, stretchContent: v})} />
                <ToggleRow label="Убрать отступы по краям" checked={settings.removeSidePaddings} onChange={(v) => setSettings({...settings, removeSidePaddings: v})} />
              </div>
            </section>

            <section>
              <SectionTitle>АДАПТИВНОСТЬ</SectionTitle>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <ToggleRow label="Скрыть на десктопе" checked={settings.hideOnDesktop} onChange={(v) => setSettings({...settings, hideOnDesktop: v})} />
                <ToggleRow label="Скрыть на телефоне" checked={settings.hideOnPhone} onChange={(v) => setSettings({...settings, hideOnPhone: v})} />
              </div>
            </section>

          </div>
        )}
      </div>

      {/* Footer Fixed Actions */}
      <div className="mt-auto bg-white border-t border-slate-200 divide-y divide-slate-100 shrink-0 z-10">
         <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-[#4a90e2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm font-medium text-slate-700">Переместить виджет</span>
         </button>
         <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-[#4a90e2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm font-medium text-slate-700">Код виджета</span>
         </button>
         <button className="w-full flex items-center gap-4 px-6 py-5 hover:bg-rose-50 transition-colors group">
            <svg className="w-5 h-5 text-rose-300 group-hover:text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm font-bold text-rose-500">Удалить виджет</span>
         </button>
      </div>
    </div>
  );
};
