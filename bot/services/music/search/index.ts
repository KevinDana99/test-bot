import config from "@/config";

export const search = async (query: string) => {
  try {
    const req = await fetch(
      `${config.API_HOST}/api/v1/music/search?q=${encodeURIComponent(query)}`
    );
    const res = await req.json();
    return res;
  } catch (err) {
    console.log(err);
  }
};
