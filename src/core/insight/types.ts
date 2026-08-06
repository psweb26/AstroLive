export type Urgency = 'low' | 'medium' | 'high';

export type ConsultationStyle =
  | 'practical'
  | 'analytical'
  | 'empathetic'
  | 'traditional'
  | 'direct'
  | 'strategic';

export type PrimaryNeed =
  | 'Decision Support'
  | 'Compatibility'
  | 'Timing'
  | 'Guidance'
  | 'Growth'
  | 'Remediation'
  | 'Education';

export type Explanation = {
  ruleId: string;
  type: 'phrase' | 'token' | 'urgency' | 'style' | 'other';
  weight: number;
  message: string;
};

export type InsightProfile = {
  id: string;
  engineVersion: string; // version of the insight engine that produced this profile
  session_id?: string;
  free_text?: string;
  concernCategory: string;
  subcategory: string;
  primaryNeed: PrimaryNeed;
  urgency: Urgency;
  consultationStyleHint?: ConsultationStyle;
  suggestedConsultation: string;
  confidence: number; // 0..97
  explanation: Explanation[];
  quickInsightText: string;
  created_at: string;
};

export type UserSelections = {
  chosenCategory?: string;
  chosenUrgency?: Urgency;
  chosenStyle?: ConsultationStyle;
};
