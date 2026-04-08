import { BASE_URL, createSession, fetchDocument, fetchPlayerAudioSource } from '../browser/index.js';
import { parseTrackCards } from '../search/index.js';
import type { TrackDetails } from './types.js';

async function getTrackById(trackId: string, pageUrl?: string): Promise<TrackDetails> {
  const $ = pageUrl
    ? await fetchDocument(pageUrl)
    : (await createSession(trackId)).$;

  const session = await createSession(trackId);
  const previewUrl = await fetchPlayerAudioSource(trackId, session);
  const tracklist = parseTrackCards($).map((track) => ({
    ...track,
    previewUrl: `${BASE_URL}/track_preview/375/${track.id}`,
  }));

  return {
    id: trackId,
    previewUrl,
    ...(tracklist.length > 0 ? { tracklist } : {}),
  };
}

export { getTrackById };
