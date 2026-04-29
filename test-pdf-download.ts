import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// Test with one of the PDF public_ids
const publicId = "nodejs-file-uploader/qublz7obc3dvpxzyjynv";
const version = "1777499075";

// Try with resource_type "image" (current stored value - WRONG for PDFs)
const urlImage = cloudinary.url(publicId, {
  resource_type: "image",
  version: version,
  flags: "attachment",
  sign_url: true,
  type: "authenticated",
});

// Try with resource_type "raw" (correct for PDFs)
const urlRaw = cloudinary.url(publicId, {
  resource_type: "raw",
  version: version,
  flags: "attachment",
  sign_url: true,
  type: "authenticated",
});

// Try with resource_type "auto" (what we should have used)
const urlAuto = cloudinary.url(publicId, {
  resource_type: "auto",
  version: version,
  flags: "attachment",
  sign_url: true,
  type: "authenticated",
});

console.log("Testing PDF download with different resource_type values:\n");
console.log("With resource_type: 'image' (current DB value - WRONG):");
console.log(urlImage);
console.log("\nWith resource_type: 'raw' (CORRECT for PDFs):");
console.log(urlRaw);
console.log("\nWith resource_type: 'auto' (auto-detect):");
console.log(urlAuto);

// Test fetching
(async () => {
  console.log("\n\nTesting HTTP requests:\n");
  
  try {
    const res1 = await fetch(urlImage);
    console.log(`resource_type: 'image' → HTTP ${res1.status}`);
    if (!res1.ok) {
      const text = await res1.text();
      console.log(`  Error: ${text.substring(0, 200)}`);
    }
  } catch (e: any) {
    console.log(`resource_type: 'image' → Fetch error: ${e.message}`);
  }
  
  try {
    const res2 = await fetch(urlRaw);
    console.log(`resource_type: 'raw' → HTTP ${res2.status}`);
    if (!res2.ok) {
      const text = await res2.text();
      console.log(`  Error: ${text.substring(0, 200)}`);
    }
  } catch (e: any) {
    console.log(`resource_type: 'raw' → Fetch error: ${e.message}`);
  }

  try {
    const res3 = await fetch(urlAuto);
    console.log(`resource_type: 'auto' → HTTP ${res3.status}`);
    if (!res3.ok) {
      const text = await res3.text();
      console.log(`  Error: ${text.substring(0, 200)}`);
    }
  } catch (e: any) {
    console.log(`resource_type: 'auto' → Fetch error: ${e.message}`);
  }

  process.exit(0);
})();
