import type * as cheerio from 'cheerio';

import { BASE_URL, fetchDocument, getCSRFToken, toAbsoluteUrl } from '../browser/index.js';
import type { ListTracksFilters, ListTracksResponse, SearchTracksResponse, TrackMixType, TrackSummary } from './types.js';

function detectMixType(mix: string): TrackMixType {
  const mixLower = mix.toLowerCase();

  if (mixLower.includes('extended')) return 'extended';
  if (mixLower.includes('radio')) return 'radio';
  if (mixLower.includes('original')) return 'original';
  if (mixLower.includes('remix')) return 'remix';
  if (mixLower.includes('edit')) return 'edit';
  if (!mix) return 'original';

  return 'unknown';
}

function parseTrackCards($: cheerio.CheerioAPI): TrackSummary[] {
  const tracks: TrackSummary[] = [];
  const seen = new Set<string>();

  $('[data-track-id]').each((_, element) => {
    const $el = $(element);
    const trackId = $el.attr('data-track-id');

    if (!trackId || seen.has(trackId)) {
      return;
    }

    seen.add(trackId);

    const titleEl = $el.find('.trackTitle .innerLink').first();
    const title = titleEl.text().trim() || $el.find('.trackTitle').text().trim();

    if (!title) {
      return;
    }

    const mixMarquees = $el.find('.trackContent > .hoverMarquee');
    const mix = mixMarquees.eq(1).find('.linkTitle').text().trim() || '';

    const artists: string[] = [];

    $el.find('.artists .highlight .innerLink').each((_, artistElement) => {
      const name = $(artistElement)
        .text()
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/Verified$/, '')
        .trim();

      if (name) {
        artists.push(name);
      }
    });

    const duration = $el.find('.innerDuration').text().trim() || '';
    const label = $el.find('.label .link').first().text().trim() || '';
    const imageEl = $el.find('.imageWrapper img, .trackPoster img').first();
    const imageSrc = imageEl.attr('src') || imageEl.attr('data-src') || '';
    const pagePath = $el.find('.playButton').attr('data-track-url') || '';

    tracks.push({
      id: trackId,
      title,
      artists,
      mix,
      mixType: detectMixType(mix),
      duration,
      label,
      image: imageSrc ? toAbsoluteUrl(imageSrc) : undefined,
      previewUrl: `${BASE_URL}/track_preview/128/${trackId}`,
      pageUrl: pagePath ? toAbsoluteUrl(pagePath) : undefined,
    });
  });

  return tracks;
}

async function searchTracks(query: string): Promise<SearchTracksResponse> {
  const $ = await fetchDocument(`${BASE_URL}/en/search?search=${encodeURIComponent(query)}`);
  const tracks = parseTrackCards($);

  return {
    tracks,
    csrfToken: getCSRFToken($),
    total: tracks.length,
  };
}

async function listTracks(filters: ListTracksFilters): Promise<ListTracksResponse> {
  const page = filters.page ?? 1;
  const params = new URLSearchParams();

  if (page > 1) params.append('page', String(page));
  if (filters.artist) params.append('artist', filters.artist);
  if (filters.label) params.append('label', filters.label);
  if (filters.year) params.append('year', filters.year);
  if (filters.genre) params.append('genre', filters.genre);

  const qs = params.toString();
  const url = `${BASE_URL}/en/tracks${qs ? `?${qs}` : ''}`;
  const $ = await fetchDocument(url);
  const tracks = parseTrackCards($);

  return {
    tracks,
    total: tracks.length,
    page,
  };
}

export { listTracks, parseTrackCards, searchTracks };
