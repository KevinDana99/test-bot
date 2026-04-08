export interface ApiV2TrackSummary {
  id: string;
  title: string;
  artists: string[];
  mix: string;
  duration: string;
  label: string;
  image?: string;
  previewUrl: string;
  pageUrl?: string;
}

export interface ApiV2SearchResponse {
  tracks: ApiV2TrackSummary[];
  csrfToken: string;
  total: number;
}

export interface SearchResultType {
  id: string;
  title: string;
  artist: string;
  artists: string[];
  mix?: string;
  duration?: string;
  label?: string;
  image?: string;
  previewUrl: string;
  pageUrl?: string;
  downloadUrl: string;
}
