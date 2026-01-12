
import { GoogleGenAI, Type } from "@google/genai";
import { FacialReport, MultiAngleImages } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFaceImage = async (images: MultiAngleImages): Promise<FacialReport> => {
  const model = 'gemini-3-pro-preview';
  
  const parts: any[] = [
    { text: `
      作为顶级整形外科专家，请结合提供的三张照片（正脸、45度斜位、侧脸）进行全方位面部美学诊断。
      
      分析维度：
      1. 【正脸】：精准计算三庭五眼比例，分析面部对称性及骨骼宽度。
      2. 【侧脸】：分析E-line（审美平面）、鼻额角（115-135°）、鼻唇角（90-105°）、下颌角弧度。
      3. 【45度斜位】：分析中面部丰盈度（苹果肌）、鼻翼基底凹陷情况、面部光影转折（凸度）。
      
      输出要求：
      - 医美建议必须极其专业，区分注射类（如玻尿酸、肉毒素）、光电类（如超声炮）及手术类。
      - 细节观察需包含解剖学名词（如：内眦、下颌支、颧突）。
      
      严格以 JSON 格式输出。
    ` }
  ];

  // 添加有效的图片到请求中
  if (images.frontal) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: images.frontal.split(',')[1] } });
  }
  if (images.oblique) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: images.oblique.split(',')[1] } });
  }
  if (images.side) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: images.side.split(',')[1] } });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          proportions: {
            type: Type.OBJECT,
            properties: {
              threeParts: {
                type: Type.OBJECT,
                properties: {
                  upper: { type: Type.STRING },
                  middle: { type: Type.STRING },
                  lower: { type: Type.STRING },
                  analysis: { type: Type.STRING }
                },
                required: ["upper", "middle", "lower", "analysis"]
              },
              fiveEyes: {
                type: Type.OBJECT,
                properties: {
                  leftSide: { type: Type.STRING },
                  leftEye: { type: Type.STRING },
                  middle: { type: Type.STRING },
                  rightEye: { type: Type.STRING },
                  rightSide: { type: Type.STRING },
                  analysis: { type: Type.STRING }
                }
              }
            },
            required: ["threeParts"]
          },
          features: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                observation: { type: Type.STRING },
                suggestion: { type: Type.STRING }
              }
            }
          },
          styleAdvice: { type: Type.STRING },
          medicalSuggestion: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    },
  });

  const text = response.text;
  if (!text) throw new Error("未能生成分析报告");
  return JSON.parse(text) as FacialReport;
};
