export interface DownloadResult {
  soundTrack: string;
  durationTrack: number;
}
export interface DownloadRequest {
  audio_track: string;
  meta_data: {
    duration: {
      seconds: string;
    };
    size: string;
  };
}
