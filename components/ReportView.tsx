
import React, { useState } from 'react';
import { FacialReport } from '../types';

interface ReportViewProps {
  report: FacialReport;
  imageUrl: string;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, imageUrl }) => {
  const [expandedFeatures, setExpandedFeatures] = useState<number[]>([]);

  const toggleFeature = (index: number) => {
    setExpandedFeatures(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header & Medical Rx (Core Strategy) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <div className="sticky top-24">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white relative">
              <img src={imageUrl} alt="Analyzed Face" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white italic">{report.overallScore}</span>
                  <span className="text-white/60 font-bold uppercase tracking-widest text-xs">Aura Index</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-8 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-prescription-bottle-medical text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black">医学级美学方案建议</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-tighter">Clinical Aesthetic Prescription</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {report.medicalSuggestion.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-colors">
                    <span className="text-indigo-400 font-black text-lg">0{idx + 1}</span>
                    <p className="text-slate-200 text-sm font-medium leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-5">
               <i className="fas fa-microscope text-[15rem]"></i>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative">
            <i className="fas fa-quote-left text-slate-100 text-6xl absolute top-4 left-4"></i>
            <div className="relative z-10 italic text-slate-600 text-lg leading-relaxed pt-4">
              {report.summary}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Proportions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3">
            <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
            正位平面分析 (三庭比例)
          </h3>
          <div className="space-y-8">
            <ProportionBar label="上庭 (Forehead)" value={report.proportions.threeParts.upper} color="bg-indigo-500" />
            <ProportionBar label="中庭 (Midface)" value={report.proportions.threeParts.middle} color="bg-indigo-400" />
            <ProportionBar label="下庭 (Lowerface)" value={report.proportions.threeParts.lower} color="bg-slate-900" />
          </div>
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl text-sm text-slate-500 leading-relaxed border border-slate-100">
             <strong className="text-slate-800 block mb-1">专业诊断：</strong>
             {report.proportions.threeParts.analysis}
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3">
            <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
            横向均衡分析 (五眼比例)
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-8 px-4">
             {[1,2,3,4,5].map(i => (
               <div key={i} className={`h-16 rounded-xl flex items-center justify-center font-black text-xs ${i%2===0 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-300'}`}>
                 {i%2===0 ? 'EYE' : ''}
               </div>
             ))}
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl text-sm text-slate-500 leading-relaxed border border-slate-100">
             <strong className="text-slate-800 block mb-1">平衡评估：</strong>
             {report.proportions.fiveEyes?.analysis || "通过三个角度的对比，您的五眼比例符合东方美学标准。"}
          </div>
        </section>
      </div>

      {/* 3. Detailed Anatomy Features (Interactive) */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black px-4 flex items-center gap-4">
          精细解剖学拆解分析
          <div className="h-px flex-grow bg-slate-100"></div>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {report.features.map((feature, idx) => {
            const isExpanded = expandedFeatures.includes(idx);
            return (
              <div 
                key={idx} 
                className={`group bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden ${isExpanded ? 'border-indigo-200 shadow-xl ring-4 ring-indigo-50' : 'border-slate-100 hover:border-indigo-100 shadow-sm'}`}
              >
                <button 
                  onClick={() => toggleFeature(idx)}
                  className="w-full p-8 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'}`}>
                      <i className={`fas ${getFeatureIcon(feature.name)} text-2xl`}></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900">{feature.name}</h4>
                      {!isExpanded && <p className="text-sm text-slate-400 mt-1 line-clamp-1">{feature.observation}</p>}
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-indigo-100 text-indigo-600 rotate-180' : 'bg-slate-50 text-slate-300'}`}>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-8 pb-8 pt-0 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                          <i className="fas fa-magnifying-glass"></i> 临床观察 Observation
                        </div>
                        <p className="text-slate-700 text-lg leading-relaxed">{feature.observation}</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-500 text-xs font-black uppercase tracking-widest">
                          <i className="fas fa-wand-magic-sparkles"></i> 调整方案 Suggestion
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-[1.5rem] border border-indigo-100 text-indigo-900 text-lg leading-relaxed font-bold">
                          {feature.suggestion}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Style & Footer */}
      <div className="bg-slate-900 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-3xl font-black mb-6">日常形象管理建议</h3>
          <p className="text-slate-400 text-xl leading-relaxed">
            {report.styleAdvice}
          </p>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i className="fas fa-palette text-[15rem]"></i>
        </div>
      </div>
    </div>
  );
};

const ProportionBar = ({ label, value, color }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="font-bold text-slate-700">{label}</span>
      <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{value}</span>
    </div>
    <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
      <div 
        className={`${color} h-full rounded-full transition-all duration-1000 ease-out shadow-lg`}
        style={{ width: `${parseFloat(value) || 33.3}%` }}
      ></div>
    </div>
  </div>
);

const getFeatureIcon = (name: string): string => {
  if (name.includes('眼')) return 'fa-eye';
  if (name.includes('鼻')) return 'fa-nose';
  if (name.includes('嘴') || name.includes('唇')) return 'fa-lips';
  if (name.includes('廓') || name.includes('面') || name.includes('脸')) return 'fa-user-doctor';
  if (name.includes('额') || name.includes('发')) return 'fa-crown';
  if (name.includes('肌') || name.includes('纹')) return 'fa-wave-square';
  return 'fa-dna';
};
