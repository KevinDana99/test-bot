import * as cheerio from 'cheerio';

const BASE_URL = 'https://hardstyle.com';

const defaultHeaders = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: `${BASE_URL}/`,
} as const;

type BrowserSession = {
  cookieHeader: string;
  csrfToken: string;
  $: cheerio.CheerioAPI;
};

function getCSRFToken($: cheerio.CheerioAPI): string {
  return $('meta[name="csrf-token"]').attr('content') || '';
}

function toAbsoluteUrl(path: string): string {
  if (!path) {
    return '';
  }

  return path.startsWith('http') ? path : `${BASE_URL}${path}`;
}

async function fetchHtml(url: string, init?: RequestInit): Promise<string> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream request failed with status ${response.status}`);
  }

  return response.text();
}

async function fetchDocument(url: string, init?: RequestInit): Promise<cheerio.CheerioAPI> {
  const html = await fetchHtml(url, init);
  return cheerio.load(html);
}

async function createSession(searchTerm: string): Promise<BrowserSession> {
  const response = await fetch(`${BASE_URL}/en/search?search=${encodeURIComponent(searchTerm)}`, {
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error(`Failed to initialize session with status ${response.status}`);
  }

  const cookies = response.headers.getSetCookie();
  const cookieHeader = cookies.map((cookie) => cookie.split(';')[0]).join('; ');
  const html = await response.text();
  const $ = cheerio.load(html);

  return {
    cookieHeader,
    csrfToken: getCSRFToken($),
    $,
  };
}

async function fetchPlayerAudioSource(trackId: string, session: BrowserSession): Promise<string> {
  const response = await fetch(`${BASE_URL}/player/${trackId}`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'X-CSRF-TOKEN': session.csrfToken,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(session.cookieHeader ? { Cookie: session.cookieHeader } : {}),
    },
    body: '',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch player with status ${response.status}`);
  }

  const playerHtml = await response.text();
  const $player = cheerio.load(playerHtml);
  const audioSrc = $player('audio').attr('src') || '';

  if (!audioSrc) {
    throw new Error('Audio source not found');
  }

  return toAbsoluteUrl(audioSrc);
}

export {
  BASE_URL,
  createSession,
  defaultHeaders,
  fetchDocument,
  fetchHtml,
  fetchPlayerAudioSource,
  getCSRFToken,
  toAbsoluteUrl,
};
export type { BrowserSession };
