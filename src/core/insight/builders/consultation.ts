export type ConsultationType = 'decision' | 'timing' | 'education' | 'relationship' | 'general';

export type ConsultationProfile = {
  type: ConsultationType;
  description: string;
};
