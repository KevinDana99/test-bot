import type { SearchResultType } from "../search/types";

export interface DownloadResult {
  soundTrack: string;
  durationTrack?: number;
  title: string;
  performer: string;
}

export type DownloadTrackInput = Pick<
  SearchResultType,
  "artist" | "title" | "mix" | "duration" | "downloadUrl"
>;
