const prisma = require("./src/lib/prisma").default;
const { v2: cloudinary } = require("cloudinary");

(async () => {
  try {
    // get first file from db
    const file = await prisma.file.findFirst();
    
    if (!file) {
      console.log("❌ No files found in database. Upload a file first.");
      process.exit(0);
    }
    
    console.log("✅ Found file in DB:");
    console.log(`  name: ${file.name}`);
    console.log(`  public_id: ${file.public_id}`);
    console.log(`  resource_type: ${file.resource_type}`);
    console.log(`  version: ${file.version}`);
    
    // generate signed URL
    const signedUrl = cloudinary.url(file.public_id, {
      resource_type: file.resource_type,
      version: file.version,
      flags: "attachment",
      sign_url: true,
      type: "private",
    });
    
    console.log("\n✅ Signed URL generated:");
    console.log(signedUrl);
    
    // test the URL with a fetch
    console.log("\n⏳ Testing signed URL...");
    const response = await fetch(signedUrl);
    console.log(`HTTP ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      console.log("✅ SUCCESS - file download URL works!");
    } else {
      console.log(`❌ FAILED - HTTP ${response.status}`);
      const text = await response.text();
      console.log("Response:", text.slice(0, 200));
    }
    
    await prisma.$disconnect();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
