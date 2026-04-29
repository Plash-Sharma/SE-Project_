import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// Test with JPEG public_id (id 18)
const pdfPublicId = "nodejs-file-uploader/qublz7obc3dvpxzyjynv";
const jpegPublicId = "nodejs-file-uploader/iweudqtuebboleszqezg";

// Generate signed URLs for both
const pdfUrl = cloudinary.url(pdfPublicId, {
  resource_type: "image",
  version: "1777499075",
  flags: "attachment",
  sign_url: true,
  type: "authenticated",
});

const jpegUrl = cloudinary.url(jpegPublicId, {
  resource_type: "image",
  version: "1777501989",
  flags: "attachment",
  sign_url: true,
  type: "authenticated",
});

console.log("Testing PDF vs JPEG downloads:\n");
console.log("PDF URL:", pdfUrl);
console.log("JPEG URL:", jpegUrl);

(async () => {
  console.log("\n\nFetching:\n");
  
  try {
    const res1 = await fetch(pdfUrl);
    console.log(`PDF → HTTP ${res1.status}`);
    const contentType = res1.headers.get("content-type");
    console.log(`  Content-Type: ${contentType}`);
    if (!res1.ok) {
      const text = await res1.text();
      console.log(`  Body: ${text.substring(0, 300)}`);
    }
  } catch (e: any) {
    console.log(`PDF → Error: ${e.message}`);
  }
  
  try {
    const res2 = await fetch(jpegUrl);
    console.log(`\nJPEG → HTTP ${res2.status}`);
    const contentType = res2.headers.get("content-type");
    console.log(`  Content-Type: ${contentType}`);
    if (!res2.ok) {
      const text = await res2.text();
      console.log(`  Body: ${text.substring(0, 300)}`);
    }
  } catch (e: any) {
    console.log(`JPEG → Error: ${e.message}`);
  }

  process.exit(0);
})();
