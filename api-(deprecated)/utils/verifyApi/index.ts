import config from "@/config";

const verifyApi = async () => {
  try {
    const req = await fetch(`${config.API_HOST}/api/v1`);
    const res = await req.json();
    console.log(` ✅ Api working in port: ${config.PORT}`);
    return res;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      throw Error(err.message);
    }
  }
};

export default verifyApi;
