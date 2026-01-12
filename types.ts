
export interface FacialReport {
  overallScore: number;
  summary: string;
  proportions: {
    threeParts: {
      upper: string;
      middle: string;
      lower: string;
      analysis: string;
    };
    fiveEyes: {
      leftSide: string;
      leftEye: string;
      middle: string;
      rightEye: string;
      rightSide: string;
      analysis: string;
    };
  };
  features: {
    name: string;
    observation: string;
    suggestion: string;
  }[];
  styleAdvice: string;
  medicalSuggestion: string[];
}

export interface MultiAngleImages {
  frontal: string | null;
  side: string | null;
  oblique: string | null;
}

export interface AnalysisState {
  isLoading: boolean;
  images: MultiAngleImages;
  report: FacialReport | null;
  error: string | null;
}
