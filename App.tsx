
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AnalysisState, MultiAngleImages } from './types';
import { analyzeFaceImage } from './services/geminiService';
import { ReportView } from './components/ReportView';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    images: { frontal: null, side: null, oblique: null },
    report: null,
    error: null,
  });

  const handleFileUpload = (angle: keyof MultiAngleImages, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setState(prev => ({
        ...prev,
        images: { ...prev.images, [angle]: event.target?.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  const isAllImagesUploaded = state.images.frontal && state.images.side && state.images.oblique;

  const startAnalysis = async () => {
    if (!isAllImagesUploaded) {
      setState(prev => ({ ...prev, error: "请务必上传全部三个维度的照片以进行最专业的深度分析。" }));
      return;
    }
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await analyzeFaceImage(state.images);
      setState(prev => ({ ...prev, report: result, isLoading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false, error: "AI 分析遇到错误，请检查网络并重试。" }));
    }
  };

  const reset = () => {
    setState({ isLoading: false, images: { frontal: null, side: null, oblique: null }, report: null, error: null });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {!state.report && !state.isLoading && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900 leading-tight">全维度面部美学诊断</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                为了获得最专业的医学级报告，请务必提供以下三个角度的照片。AI 将综合分析您的骨相与皮相立体结构。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUploadBox 
                label="正脸 (Frontal)" 
                desc="分析三庭五眼及对称性" 
                image={state.images.frontal} 
                onChange={(e) => handleFileUpload('frontal', e)} 
              />
              <ImageUploadBox 
                label="45° 斜位 (Oblique)" 
                desc="分析苹果肌与鼻翼基底" 
                image={state.images.oblique} 
                onChange={(e) => handleFileUpload('oblique', e)} 
              />
              <ImageUploadBox 
                label="90° 侧脸 (Profile)" 
                desc="分析侧颜 E-line 与下颌线" 
                image={state.images.side} 
                onChange={(e) => handleFileUpload('side', e)} 
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={startAnalysis}
                disabled={!isAllImagesUploaded}
                className={`px-12 py-4 rounded-2xl font-bold text-xl shadow-xl transition-all ${isAllImagesUploaded ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {isAllImagesUploaded ? '生成深度美学诊断' : '请上传三张完整的照片'}
              </button>
              {state.error && <p className="text-red-500 text-sm font-medium">{state.error}</p>}
            </div>
          </div>
        )}

        {state.isLoading && (
          <div className="py-24 flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <p className="text-xl font-bold text-slate-800">深度解剖学建模中...</p>
            <p className="text-slate-400 mt-2">正在综合三个维度的面部影像数据，这需要一点时间</p>
          </div>
        )}

        {state.report && state.images.frontal && (
          <div className="animate-in fade-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-8">
               <button onClick={reset} className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium">
                 <i className="fas fa-arrow-left"></i> 重新测量
               </button>
               <div className="flex gap-4">
                  <div className="flex -space-x-3">
                    {Object.values(state.images).map((img, i) => img && (
                      <img key={i} src={img} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                    ))}
                  </div>
               </div>
            </div>
            <ReportView report={state.report} imageUrl={state.images.frontal} />
          </div>
        )}
      </div>
    </Layout>
  );
};

const ImageUploadBox = ({ label, desc, image, onChange }: any) => (
  <div className="relative group overflow-hidden bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all">
    <input type="file" accept="image/*" onChange={onChange} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
    <div className="aspect-[3/4] flex flex-col items-center justify-center p-6 text-center">
      {image ? (
        <img src={image} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
      ) : (
        <>
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
            <i className="fas fa-camera text-2xl"></i>
          </div>
          <h4 className="font-bold text-slate-700">{label}</h4>
          <p className="text-xs text-slate-400 mt-2">{desc}</p>
        </>
      )}
    </div>
    {image && (
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">点击更换</span>
      </div>
    )}
  </div>
);

export default App;
