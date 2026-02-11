import yts from "yt-search";
import config from "@/config";
import type { DonwloadYtRequest } from "./types";

export const download = async (artist: string, title: string) => {
  try {
    const search = await yts(`${title} ${artist} Hardstyle`);
    const video = search.videos[0];
    if (!video) return null;
    const options: DonwloadYtRequest = {
      method: "GET",
      headers: {
        "x-rapidapi-key": config.RAPID_API_SECRET_KEY ?? "",
        "x-rapidapi-host": config.RAPID_API_HOST ?? "",
      },
    };
    console.log({ options, config });
    const response = await fetch(
      `https://${config.RAPID_API_HOST}/dl?id=${video.videoId}`,
      options
    );

    const data = (await response.json()) as any;
    console.log(`🎬 Video encontrado: ${video.title}`);
    console.log({ video });

    const audioFormat = await data.adaptiveFormats?.find(
      (f: any) => f.itag === 140 || f.itag === 251
    );
    console.log({ audioFormat, data });
    if (audioFormat && audioFormat.url) {
      console.log("✅ Link directo de audio extraído con éxito");
      const size = audioFormat.contentLength;
      console.log({ size });
      return {
        audio_track: audioFormat.url,
        meta_data: { ...video, size },
      };
    } else {
      console.error(
        "❌ No se encontró un formato de audio compatible en la respuesta."
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Error en el servicio:", error);
    return null;
  }
};
