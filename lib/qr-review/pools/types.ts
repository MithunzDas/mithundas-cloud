export interface QuestionOption {
  label: string;
  sentiment: "positive" | "neutral";
  keywords: string[];
}

export interface PoolQuestion {
  id: string;
  category: string;
  categoryLabel?: string;
  question: string;
  options: QuestionOption[];
}

export interface IndustryConfig {
  id: string;
  name: string;
  icon: string;
  defaultPlaceHolder: string;
  sampleReview: string;
  questions: PoolQuestion[];
}
