require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL atau Key tidak ditemukan di .env");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
  console.error("   SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_ANON_KEY diperlukan");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);


// Mapping file asset ke bucket
const ASSET_BUCKET_MAP = {
  "avatar-user.jpg": "avatar-user",
  "avatar-post.jpg": "avatar-post",
  "image-event.jpg": "image-event",
  "image-post.jpg": "image-post",
  "banner-booking.jpg": "banner-booking",
  "logo-booking.jpg": "logo-booking",
  "payment-proof-booking.jpg": "payment-proof-booking",
  "gallery-booking.jpg": "gallery-booking",
};

async function uploadAssets() {
  console.log("📤 Mulai upload assets ke Supabase...\n");

  const assetsDir = path.join(__dirname, "../public/assets");

  if (!fs.existsSync(assetsDir)) {
    console.error(`❌ Folder ${assetsDir} tidak ditemukan`);
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const [fileName, bucketName] of Object.entries(ASSET_BUCKET_MAP)) {
    const filePath = path.join(assetsDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File tidak ditemukan: ${fileName}`);
      errorCount++;
      continue;
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = "image/jpeg";

      // Upload ke Supabase
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
          contentType: mimeType,
          upsert: true, // Replace jika sudah ada
        });

      if (error) {
        console.error(`❌ Error upload ${fileName}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ ${fileName} → ${bucketName}`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing ${fileName}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Upload selesai: ${successCount} berhasil, ${errorCount} gagal`);
  process.exit(errorCount > 0 ? 1 : 0);
}

uploadAssets();
