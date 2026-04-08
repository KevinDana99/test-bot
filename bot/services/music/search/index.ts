import config from "@/config";
import type {
  ApiV2SearchResponse,
  ApiV2TrackSummary,
  SearchResultType,
} from "./types";

const trackCache = new Map<string, SearchResultType>();

function buildDownloadUrl(track: ApiV2TrackSummary): string {
  const params = new URLSearchParams();

  params.set("title", track.title);
  params.set(
    "artist",
    track.artists.length > 0 ? track.artists.join(", ") : "Unknown Artist"
  );

  if (track.mix) {
    params.set("mix", track.mix);
  }

  return `${config.API_HOST}/api/v2/download/${track.id}?${params.toString()}`;
}

function toBotTrack(track: ApiV2TrackSummary): SearchResultType {
  const artist =
    track.artists.length > 0 ? track.artists.join(", ") : "Unknown Artist";

  return {
    id: track.id,
    title: track.title,
    artist,
    artists: track.artists,
    mix: track.mix || undefined,
    duration: track.duration || undefined,
    label: track.label || undefined,
    image: track.image,
    previewUrl: `${config.API_HOST}/api/v2/preview/${track.id}`,
    pageUrl: track.pageUrl,
    downloadUrl: buildDownloadUrl(track),
  };
}

function cacheTracks(tracks: SearchResultType[]) {
  for (const track of tracks) {
    trackCache.set(track.id, track);
  }
}

export function getCachedTrack(trackId: string) {
  return trackCache.get(trackId);
}

export const search = async (query: string): Promise<SearchResultType[]> => {
  const req = await fetch(
    `${config.API_HOST}/api/v2/search?q=${encodeURIComponent(query)}`
  );

  if (!req.ok) {
    throw new Error(`Search failed with status ${req.status}`);
  }

  const res = (await req.json()) as ApiV2SearchResponse;
  const tracks = res.tracks.map(toBotTrack);

  cacheTracks(tracks);

  return tracks;
};
