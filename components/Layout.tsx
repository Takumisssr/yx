
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-morphism border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              {/* 装饰性背景 */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              {/* 主 Logo 容器 */}
              <div className="relative w-11 h-11 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white"></div>
                
                {/* 显微镜图标 */}
                <div className="relative z-10 flex items-center justify-center">
                  <div className="absolute w-8 h-8 bg-indigo-600 rounded-full opacity-5 scale-150 animate-pulse"></div>
                  <i className="fas fa-microscope text-indigo-600 text-xl"></i>
                  
                  {/* 微光特效 */}
                  <div className="absolute -top-1 -right-1">
                    <i className="fas fa-sparkle text-[8px] text-amber-400 animate-bounce"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col leading-none">
              <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">
                  FaceAura
                </span>
                <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-black tracking-tighter shadow-sm">
                  AI
                </span>
              </h1>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-1">
                Precision Aesthetics
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="py-8 bg-white border-t border-slate-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 FaceAura 美业 AI 美学顾问 - 仅供参考，具体调整请咨询专业医师</p>
        </div>
      </footer>
    </div>
  );
};
