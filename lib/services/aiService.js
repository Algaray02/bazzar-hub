import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCategoryLabel } from "@/constant/category-store";

const genAI = process.env.GOOGLE_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

const MODEL_NAME = "gemini-2.5-flash";

async function urlToGenerativePart(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    return {
      inlineData: {
        data: Buffer.from(arrayBuffer).toString("base64"),
        mimeType: response.headers.get("content-type") || "image/jpeg",
      },
    };
  } catch (error) {
    return null;
  }
}

export async function verifyPaymentReceipt(imageUrl, expectedAmount) {
  if (!genAI || !imageUrl)
    return { isValid: false, reason: "Service unavailable or invalid image" };

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" },
    });

    const imagePart = await urlToGenerativePart(imageUrl);
    if (!imagePart)
      return { isValid: false, reason: "Failed to process image" };

    const prompt = `
      Analyze this payment receipt.
      Extract the amount and date.
      Compare the extracted amount with the expected amount: ${expectedAmount}.
      Return JSON:
      {
        "detectedAmount": number,
        "detectedDate": "YYYY-MM-DD",
        "senderName": "string",
        "isAmountMatch": boolean,
        "analysis": "string"
      }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    return JSON.parse(result.response.text());
  } catch (error) {
    return { isValid: false, reason: "AI processing failed" };
  }
}

export async function generateStoreDescription(storeName, category) {
  const categoryLabel = getCategoryLabel(category) || category;

  if (!genAI) return `Welcome to ${storeName}, the best place for ${category}.`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Bertindaklah sebagai ahli branding dan copywriting UMKM. Buatkan deskripsi booth bazaar yang menarik, persuasif, dan mampu meningkatkan minat pengunjung.

      Detail Booth:
      - Nama Toko: ${storeName}
      - Kategori: ${categoryLabel}

      Panduan Gaya:
      - Gunakan Bahasa Indonesia yang luwes, friendly, dan menggugah rasa penasaran.
      - Tekankan keunikan produk, nilai jual utama, dan alasan pengunjung harus mampir.
      - Gunakan sedikit emoji yang relevan untuk menambah daya tarik.
      - Maksimal 3 kalimat, tanpa paragraf panjang.
      - Output berupa teks deskripsi saja tanpa judul atau header.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return `Selamat datang di ${storeName}, tempat terbaik untuk menemukan produk ${categoryLabel}.`;
  }
}

export async function generateEventDescription(title, city, type) {
  if (!genAI)
    return `Bergabunglah di ${title}, sebuah event ${type} yang berlokasi di ${city}. Jangan lewatkan keseruannya!`;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const typeLabel =
      type === "WEEKLY" ? "Event Mingguan/Regular" : "Event Spesial/Besar";

    const prompt = `
      Bertindaklah sebagai Event Organizer profesional. Buatkan deskripsi event bazaar yang menarik, persuasif, dan mengundang antusiasme pengunjung.
      
      Detail Event:
      - Judul: ${title}
      - Kota: ${city}
      - Tipe: ${typeLabel}

      Panduan Gaya:
      - Gunakan Bahasa Indonesia yang luwes dan engaging (marketing friendly).
      - Sertakan call-to-action untuk mengajak tenant bergabung atau pengunjung datang.
      - Gunakan beberapa emoji yang relevan agar tidak kaku.
      - Maksimal 2 paragraf pendek.
      - Tanpa judul/header, langsung ke isi deskripsi.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return `Saksikan keseruan ${title} di ${city}! Event ini menghadirkan berbagai tenant menarik dan aktivitas seru untuk Anda.`;
  }
}

export async function analyzeReviewSummary(reviews) {
  if (!genAI || reviews.length < 3) return null;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" },
    });

    const reviewsText = reviews
      .map((r) => `"${r.comment}" (Rating: ${r.rating})`)
      .join("\n");

    const prompt = `
      Analisislah kumpulan review berikut yang diberikan kepada tenant.

      Review:
      ${reviewsText}

      Instruksi:
      - Nilai pola bahasa, nada ulasan, dan kecenderungan rating.
      - Identifikasi pujian utama dan keluhan utama yang paling sering muncul.
      - Buat ringkasan singkat yang menggambarkan persepsi umum pelanggan.
      - Jawaban **harus** dalam format JSON yang valid.

      Format Output (JSON):
      {
        "overallSentiment": "Positif" | "Netral" | "Negatif",
        "averageRating": number,
        "summary": "string",
        "topComplaints": ["string"],
        "topPraises": ["string"]
      }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    return null;
  }
}

export async function generateArticleContent(title, topic) {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Write an article about: "${title}"
      Topic: ${topic}
      Language: Indonesian
      Format: Markdown
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return null;
  }
}
