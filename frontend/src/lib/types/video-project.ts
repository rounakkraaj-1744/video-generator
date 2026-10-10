export type SceneType = "hook" | "text" | "code" | "diagram" | string;

export type Scene = {
  id?: string;
  type: SceneType;
  start?: number;
  duration?: number;
  narration?: string;
  title?: string;
  text?: string;
  language?: string;
  code?: string;
  highlightedLines?: number[];
  nodes?: Array<{ id?: string; label?: string; x?: number; y?: number }>;
  edges?: Array<{ from?: string; to?: string; label?: string }>;
  [key: string]: unknown;
};

export type VideoProject = {
  id?: string;
  version?: string;
  title?: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  scenes: Scene[];
  [key: string]: unknown;
};

export type GenerationRequest = {
  prompt: string;
  language: string;
  duration: number;
  audience: string;
};
export type ApiError = { message: string; status?: number; details?: unknown };
export type GenerationResult = VideoProject | { project: VideoProject };
