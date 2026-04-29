import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

const publicId = "nodejs-file-uploader/qublz7obc3dvpxzyjynv";
const version = "1777499075";

const urlWithFormat = cloudinary.url(publicId, {
  resource_type: "image",
  format: "pdf",
  version,
  flags: "attachment",
  sign_url: true,
  type: "authenticated",
});

console.log(urlWithFormat);

(async () => {
  const res = await fetch(urlWithFormat);
  console.log("HTTP", res.status);
  console.log("Content-Type", res.headers.get("content-type"));
  if (!res.ok) {
    console.log((await res.text()).slice(0, 200));
  }
  process.exit(0);
})();
