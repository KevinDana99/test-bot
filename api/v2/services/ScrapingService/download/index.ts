import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';

import { BASE_URL, createSession, defaultHeaders, fetchPlayerAudioSource } from '../browser/index.js';
import type { DownloadTrackQuery } from './types.js';

function buildSafeFilename(trackId: string, query: DownloadTrackQuery): string {
  const title = query.title || trackId;
  const artist = query.artist || 'Unknown';
  const mix = query.mix || '';

  return `${artist} - ${title}${mix ? ` (${mix})` : ''}`
    .replace(/[^a-zA-Z0-9\s\-_()áéíóúñüÁÉÍÓÚÑÜ.,!&']/g, '')
    .trim();
}

async function fetchAudioResponse(trackId: string, referer: string): Promise<Response> {
  const session = await createSession(trackId);
  const audioSrc = await fetchPlayerAudioSource(trackId, session);

  const response = await fetch(audioSrc, {
    headers: {
      ...defaultHeaders,
      Range: 'bytes=0-',
      Referer: referer,
      ...(session.cookieHeader ? { Cookie: session.cookieHeader } : {}),
    },
  });

  if (!response.ok && response.status !== 206) {
    throw new Error(`Failed to fetch audio with status ${response.status}`);
  }

  return response;
}

function toNodeReadableStream(stream: ReadableStream<Uint8Array>): NodeReadableStream {
  return stream as unknown as NodeReadableStream;
}

async function pipeDownload(trackId: string, query: DownloadTrackQuery, response: import('express').Response): Promise<void> {
  const audioResponse = await fetchAudioResponse(trackId, `${BASE_URL}/en/tracks/${trackId}/`);
  const fileName = buildSafeFilename(trackId, query);

  response.setHeader('Content-Type', 'audio/mpeg');
  response.setHeader('Content-Disposition', `attachment; filename="${fileName}.mp3"`);

  const contentLength = audioResponse.headers.get('content-length');
  if (contentLength) {
    response.setHeader('Content-Length', contentLength);
  }

  if (!audioResponse.body) {
    throw new Error('Audio response body is empty');
  }

  Readable.fromWeb(toNodeReadableStream(audioResponse.body)).pipe(response);
}

async function pipePreview(trackId: string, response: import('express').Response): Promise<void> {
  const audioResponse = await fetchAudioResponse(trackId, `${BASE_URL}/`);

  response.setHeader('Content-Type', 'audio/mpeg');
  response.setHeader('Accept-Ranges', 'bytes');

  const contentLength = audioResponse.headers.get('content-length');
  if (contentLength) {
    response.setHeader('Content-Length', contentLength);
  }

  if (!audioResponse.body) {
    throw new Error('Audio response body is empty');
  }

  Readable.fromWeb(toNodeReadableStream(audioResponse.body)).pipe(response);
}

export { pipeDownload, pipePreview };
