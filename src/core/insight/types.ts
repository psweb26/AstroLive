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

export type InsightProfile = {
  id: string;
  session_id?: string;
  free_text?: string;
  concernCategory: string;
  subcategory: string;
  primaryNeed: PrimaryNeed;
  urgency: Urgency;
  consultationStyleHint?: ConsultationStyle;
  suggestedConsultation: string;
  confidence: number; // 0..97
  explanation: string[];
  quickInsightText: string;
  created_at: string;
};

export type UserSelections = {
  chosenCategory?: string;
  chosenUrgency?: Urgency;
  chosenStyle?: ConsultationStyle;
};
