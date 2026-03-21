export async function generateMetadata({ params }) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/${params.slug}`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      const vendor = data.vendor;
      return {
        title: `${vendor.shopName} — Tsen@be`,
        description: vendor.description || `Découvrez les produits de ${vendor.shopName} sur Tsen@be`,
        openGraph: {
          title: vendor.shopName,
          description: vendor.description || '',
          images: vendor.profileImageUrl ? [vendor.profileImageUrl] : [],
        }
      };
    } catch {
      return { title: 'Boutique — Tsen@be' };
    }
  }
  
  export default function ShopLayout({ children }) {
    return children;
  }