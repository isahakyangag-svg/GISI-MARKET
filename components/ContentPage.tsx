
import React from 'react';
import { ContentSection } from '../types';

interface ContentPageProps {
  section: ContentSection;
}

export const ContentPage: React.FC<ContentPageProps> = ({ section }) => {
  if (!section) return null;
  return (
    <div className="container-premium py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900">{section.title}</h1>
          <div className="h-1.5 w-24 bg-[#82C12D] mx-auto rounded-full" />
        </div>

        <div className="space-y-10">
          {section.blocks.map((block) => (
            <div key={block.id} className="animate-in slide-in-from-bottom-4 duration-500">
              {block.type === 'header' && (
                <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tight">{block.content}</h2>
              )}
              {block.type === 'text' && (
                <p className="text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{block.content}</p>
              )}
              {block.type === 'image' && (
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                  <img src={block.content} alt="Content" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              {block.type === 'video' && (
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 aspect-video bg-black/5">
                  {block.content.includes('youtube') ? (
                    <iframe className="w-full h-full" src={block.content.replace('watch?v=', 'embed/')} frameBorder="0" allowFullScreen />
                  ) : (
                    <video src={block.content} controls className="w-full h-full object-cover" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
