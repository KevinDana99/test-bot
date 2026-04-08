export type TrackMixType = 'extended' | 'radio' | 'original' | 'remix' | 'edit' | 'unknown';

export interface TrackSummary {
  id: string;
  title: string;
  artists: string[];
  mix: string;
  mixType: TrackMixType;
  duration: string;
  label: string;
  image?: string;
  previewUrl: string;
  pageUrl?: string;
}

export interface SearchTracksResponse {
  tracks: TrackSummary[];
  csrfToken: string;
  total: number;
}

export interface ListTracksFilters {
  page?: number;
  artist?: string;
  label?: string;
  year?: string;
  genre?: string;
}

export interface ListTracksResponse {
  tracks: TrackSummary[];
  total: number;
  page: number;
}
