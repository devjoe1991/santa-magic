export interface DoorInfo {
  type: string;
  position: string;
  material?: string;
  color?: string;
}

export interface WindowInfo {
  position: string;
  size?: string;
  style?: string;
}

export interface Decorations {
  christmas: boolean;
  holiday: boolean;
  items: string[];
  lights: boolean;
}

export interface LayoutInfo {
  entryType: string;
  description: string;
  lighting: 'bright' | 'dim' | 'dark' | 'daylight' | 'dusk' | 'night' | 'indoor_warm' | 'indoor_cool';
  visibility: 'clear' | 'partially obscured' | 'poor';
  sceneType: 'indoor' | 'outdoor' | 'unclear';
  cameraType?: 'color' | 'night_vision' | 'black_white' | 'monochrome';
  colorGrading?: 'warm_indoor' | 'cool_outdoor' | 'neutral' | 'green_tint' | 'grayscale';
}

export interface SceneAnalysis {
  doors: DoorInfo[];
  windows: WindowInfo[];
  decorations: Decorations;
  furniture: string[];
  plants: string[];
  layout: LayoutInfo;
  suitabilityScore: number; // 0-100 for Santa video creation
  recommendations: string[];
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: SceneAnalysis;
  error?: string;
  details?: string;
}

export interface AnalysisRequest {
  imageData: string; // base64 encoded image
  format?: 'base64' | 'file';
}