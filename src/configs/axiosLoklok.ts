import axios from "axios";
import { randomDeviceId } from "utils/helper";

const axiosLoklok = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_API,
  headers: {
    lang: "en",
    versioncode: "11",
    clienttype: "ios_jike_default",
    deviceid: randomDeviceId(16),
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36 OPR/84.0.4316.52"
  }
});

axiosLoklok.interceptors.request.use(
  async (config) => {
    const customConfig = {
      ...config,
      headers: {
        lang: "en",
        versioncode: "11",
        clienttype: "ios_jike_default",
        deviceid: randomDeviceId(16),
        sign: randomDeviceId(32),
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36 OPR/84.0.4316.52"
      }
    };
    return customConfig;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosLoklok.interceptors.response.use(
  async (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  async (error) => {
    const { response } = error;
    const errorResult = { ...response.data, status: response.status };
    return Promise.reject(errorResult);
  }
);

export default axiosLoklok;