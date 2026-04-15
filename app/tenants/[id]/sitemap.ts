import { MetadataRoute } from "next";

export default function sitemap({ params }) {
  const baseUrl = "https://bazzarhub.algaray.biz.id";

  return [
    {
      url: `${baseUrl}/tenants/${params.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
