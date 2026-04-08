import type { TrackSummary } from '../search/types.js';

export interface TrackDetails {
  id: string;
  previewUrl: string;
  tracklist?: TrackSummary[];
}
