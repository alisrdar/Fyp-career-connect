// Quiz Types
export type QuestionType = 
  | 'sequence_order'
  | 'pair_match'
  | 'image_choice'
  | 'visual_swipe'
  | 'budget_slider'
  | 'scenario_mcq'
  | 'likert_5';

export type Option = {
  id: string;
  text: string;
  media_url?: string; // Match Python backend key name
  image?: string;     // Keep for backwards compatibility
  correct?: boolean;
  weights?: Record<string, number>;
};

export type Question = {
  id: string;
  type: QuestionType;
  text: string;
  media_url?: string;
  options?: Option[];
  pairs?: Array<{ id: string; left: string; right: string }>;
  items?: Array<{ id: string; text: string }>;
  scenario?: string;
  min?: number;
  max?: number;
  labels?: { min: string; max: string };
  interaction_config?: {
    correct_order?: string[];
    matches?: Record<string, string>;
    target_sum?: number;
    slider_range?: [number, number];
  };
  weights?: Record<string, number>;
  tags?: {
    primary: string;
    secondary: string[];
    demographic_mask: string[];
  };
  difficulty?: number;
  time_limit?: number;
};

export type Stage = {
  name: string;
  color: string;
  textColor: string;
  icon: string;
};

export type Badge = {
  name: string;
  icon: string;
};

export type Recommendation = {
  id: string;
  title: string;
  description?: string;
};

export type QuizView = 'welcome' | 'demographic' | 'stages' | 'transition' | 'game' | 'results';
