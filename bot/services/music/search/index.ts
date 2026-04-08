import config from "@/config";
import type {
  ApiV2SearchResponse,
  ApiV2TrackSummary,
  GroupedSearchResultType,
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
    mixType: track.mixType,
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

export function groupTracksBySong(
  tracks: SearchResultType[]
): GroupedSearchResultType[] {
  const groups = new Map<string, GroupedSearchResultType>();

  for (const track of tracks) {
    const key = `${track.artist}__${track.title}`.toLowerCase();
    const currentGroup = groups.get(key) ?? {
      key,
      title: track.title,
      artist: track.artist,
    };

    if (track.mixType === "original" && !currentGroup.original) {
      currentGroup.original = track;
    }

    if (track.mixType === "extended" && !currentGroup.extended) {
      currentGroup.extended = track;
    }

    if (track.mixType === "radio" && !currentGroup.radio) {
      currentGroup.radio = track;
    }

    groups.set(key, currentGroup);
  }

  return Array.from(groups.values()).filter(
    (group) => group.original || group.extended || group.radio
  );
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
