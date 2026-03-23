export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/"],
    },
    sitemap: "https://tsenabe.app/sitemap.xml",
  };
}
