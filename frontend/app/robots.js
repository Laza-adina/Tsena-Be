export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/'],
      },
      sitemap: 'https://tsena-be.vercel.app/sitemap.xml',
    };
  }