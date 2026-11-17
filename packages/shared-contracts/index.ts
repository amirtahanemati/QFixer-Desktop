export type ProtocolVersion = "2.0.0";

export type MessageType =
  | "initialize"
  | "process_image"
  | "analyze_image"
  | "preview"
  | "export"
  | "cancel"
  | "progress"
  | "result"
  | "error"
  | "health_check";

export interface IpcBaseMessage<T = unknown> {
  protocol_version: ProtocolVersion;
  message_type: MessageType;
  request_id: string;
  payload: T;
}

export interface HardwareInfo {
  cpu_model: string;
  ram_total_bytes: number;
  gpu_available: boolean;
  gpu_name?: string;
  vram_bytes?: number;
  cuda_available: boolean;
  active_backend: "cpu" | "cuda" | "directml";
}

export interface InitializePayload {
  app_data_dir: string;
  cache_dir: string;
  preferred_backend?: "cpu" | "gpu";
}

export interface ProcessImageOptions {
  input_path: string;
  output_path: string;
  auto_enhance?: boolean;
  brightness?: number;
  contrast?: number;
  remove_shadows?: boolean;
  remove_noise?: boolean;
  protect_text?: boolean;
  protect_formulas?: boolean;
  protect_diagrams?: boolean;
}

export interface ProgressPayload {
  percent: number;
  stage: string;
  eta_seconds?: number;
}

export interface ResultPayload {
  output_path: string;
  width: number;
  height: number;
  processing_time_ms: number;
  metrics?: {
    sharpness_score?: number;
    noise_reduction_ratio?: number;
    protected_regions_count?: number;
  };
}

export interface ErrorPayload {
  code: string;
  message: string;
  details?: string;
}
