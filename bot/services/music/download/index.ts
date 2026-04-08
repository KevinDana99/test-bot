import type { DownloadResult, DownloadTrackInput } from "./types";

function parseDurationToSeconds(duration?: string): number | undefined {
  if (!duration) {
    return undefined;
  }

  const parts = duration
    .split(":")
    .map((part) => Number.parseInt(part, 10))
    .filter((part) => !Number.isNaN(part));

  if (parts.length === 0) {
    return undefined;
  }

  return parts.reduce((total, part) => total * 60 + part, 0);
}

export const downloadService = async (
  track: DownloadTrackInput,
  ctx: any
): Promise<DownloadResult> => {
  const displayTitle = track.mix ? `${track.title} (${track.mix})` : track.title;

  await ctx.reply(
    `Descargando ${track.artist} - ${displayTitle}...\n\n🕛 Tu descarga estara lista enseguida`
  );

  return {
    soundTrack: track.downloadUrl,
    durationTrack: parseDurationToSeconds(track.duration),
    title: displayTitle,
    performer: track.artist,
  };
};

export default downloadService;
