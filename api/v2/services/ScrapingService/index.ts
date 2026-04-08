import type { Response } from 'express';

import { pipeDownload, pipePreview } from './download/index.js';
import type { DownloadTrackQuery } from './download/types.js';
import { listTracks, searchTracks } from './search/index.js';
import type { ListTracksFilters } from './search/types.js';
import { getTrackById } from './track/index.js';

class ScrapingService {
  searchTracks(query: string) {
    return searchTracks(query);
  }

  getTrackById(trackId: string, pageUrl?: string) {
    return getTrackById(trackId, pageUrl);
  }

  getTracks(filters: ListTracksFilters) {
    return listTracks(filters);
  }

  async downloadTrack(trackId: string, query: DownloadTrackQuery, response: Response) {
    await pipeDownload(trackId, query, response);
  }

  async streamPreview(trackId: string, response: Response) {
    await pipePreview(trackId, response);
  }
}

const scrapingService = new ScrapingService();

export { scrapingService, ScrapingService };
