"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "../../../../lib/auth";
import api from "../../../../lib/api";

const C = {
  main: "#D9D9D9",
  light: "#EBEBEB",
  cream: "#FFFFFF",
  beige: "#F5F5F5",
  caramel: "#3C6E71",
  dark: "#353535",
  text: "#353535",
  muted: "#284B63",
};

export default function ProduitsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [currency, setCurrency] = useState("MGA");
  const [menuOpen, setMenuOpen] = useState(false);
  const [exportingType, setExportingType] = useState("");
  const [form, setForm] = useState({
    name: "",
    reference: "",
    price: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
    isPromo: false,
    promoPrice: "",
    promoStartDate: "",
    promoEndDate: "",
  });

  const fetchProducts = useCallback(async (searchTerm = "") => {
    try {
      setError("");
      const limit = 100;
      let page = 1;
      let hasNextPage = true;
      const allProducts = [];

      while (hasNextPage) {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (searchTerm) params.set("search", searchTerm);

        const { data } = await api.get(`/products?${params.toString()}`);
        const batch = data?.products || [];

        allProducts.push(...batch);
        hasNextPage = Boolean(data?.pagination?.hasNextPage);
        page += 1;

        if (batch.length === 0 || page > 1000) break;
      }

      setProducts(allProducts);
    } catch (err) {
      setProducts([]);
      setError(
        err?.response?.data?.error ||
          "Impossible de charger les produits. Verifiez la connexion avec le backend.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    fetchProducts();
    api
      .get("/auth/me")
      .then(({ data }) => {
        setCurrency(data.user?.display_currency || "MGA");
      })
      .catch(() => {});
  }, [router, fetchProducts]);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchProducts]);

  const resetForm = () => {
    setForm({
      name: "",
      reference: "",
      price: "",
      description: "",
      imageUrl: "",
      isFeatured: false,
      isPromo: false,
      promoPrice: "",
      promoStartDate: "",
      promoEndDate: "",
    });
    setEditing(null);
    setError("");
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };
  const openEdit = (p) => {
    setForm({
      name: p.name,
      reference: p.reference,
      price: p.price,
      description: p.description || "",
      imageUrl: p.image_url || "",
      isFeatured: p.is_featured || false,
      isPromo: p.is_promo || false,
      promoPrice: p.promo_price || "",
      promoStartDate: p.promo_start_date
        ? p.promo_start_date.split("T")[0]
        : "",
      promoEndDate: p.promo_end_date ? p.promo_end_date.split("T")[0] : "",
    });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setError("");
    if (!form.name || !form.price) {
      setError("Nom et prix requis.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        reference: form.reference,
        price: parseInt(form.price),
        description: form.description,
        imageUrl: form.imageUrl,
        isFeatured: form.isFeatured,
        isPromo: form.isPromo,
        promoPrice: form.promoPrice ? parseInt(form.promoPrice) : null,
        promoStartDate: form.promoStartDate
          ? new Date(form.promoStartDate).toISOString()
          : null,
        promoEndDate: form.promoEndDate
          ? new Date(form.promoEndDate).toISOString()
          : null,
      };
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post("/products", payload);
      await fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await api.post("/upload/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, imageUrl: data.imageUrl }));
    } catch {
      setError("Erreur lors de l'upload de l'image.");
    }
  };

  const formatPrice = (price) => {
    if (currency === "USD") return `$${price.toLocaleString()}`;
    if (currency === "EUR") return `€${price.toLocaleString()}`;
    return `${price.toLocaleString()} Ar`;
  };

  const fetchAllProductsForExport = useCallback(async () => {
    const limit = 100;
    let page = 1;
    let hasNextPage = true;
    const allProducts = [];

    while (hasNextPage) {
      const { data } = await api.get(`/products?page=${page}&limit=${limit}`);
      const batch = data?.products || [];

      allProducts.push(...batch);
      hasNextPage = Boolean(data?.pagination?.hasNextPage);
      page += 1;

      if (batch.length === 0 || page > 1000) break;
    }

    return allProducts;
  }, []);

  const imageUrlToJpegDataUrl = async (url) => {
    if (!url) return null;

    try {
      const response = await fetch(url);
      if (!response.ok) return null;

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const img = await new Promise((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = objectUrl;
      });

      const size = 90;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return null;
      }

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      const ratio = Math.min(size / img.width, size / img.height);
      const drawWidth = img.width * ratio;
      const drawHeight = img.height * ratio;
      const offsetX = (size - drawWidth) / 2;
      const offsetY = (size - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      URL.revokeObjectURL(objectUrl);

      return canvas.toDataURL("image/jpeg", 0.9);
    } catch {
      return null;
    }
  };

  const exportCatalogExcel = async () => {
    setError("");
    setExportingType("excel");

    try {
      const allProducts = await fetchAllProductsForExport();
      if (allProducts.length === 0) {
        setError("Aucun produit a exporter.");
        return;
      }

      const excelJsModule = await import("exceljs");
      const ExcelJS = excelJsModule.default || excelJsModule;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Catalogue");

      worksheet.columns = [
        { header: "Produit", key: "name", width: 42 },
        { header: "Prix", key: "price", width: 18 },
        { header: "Image", key: "image", width: 16 },
      ];

      worksheet.getRow(1).font = { bold: true };

      for (const product of allProducts) {
        const row = worksheet.addRow({
          name: product.name || "",
          price: formatPrice(product.price || 0),
          image: product.image_url ? "" : "-",
        });

        row.height = 46;
        const rowNumber = row.number;

        if (product.image_url) {
          const dataUrl = await imageUrlToJpegDataUrl(product.image_url);
          if (dataUrl) {
            const base64 = dataUrl.replace(
              /^data:image\/[a-zA-Z]+;base64,/,
              "",
            );
            const imageId = workbook.addImage({
              base64,
              extension: "jpeg",
            });

            worksheet.addImage(imageId, {
              tl: { col: 2.15, row: rowNumber - 1 + 0.12 },
              ext: { width: 40, height: 40 },
            });
          }
        }
      }

      worksheet.getColumn("name").alignment = { vertical: "middle" };
      worksheet.getColumn("price").alignment = { vertical: "middle" };
      worksheet.getColumn("image").alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      link.href = downloadUrl;
      link.download = `catalogue-produits-${stamp}.xlsx`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      setError("Erreur lors de l'export Excel.");
    } finally {
      setExportingType("");
    }
  };

  const exportCatalogPdf = async () => {
    setError("");
    setExportingType("pdf");

    try {
      const allProducts = await fetchAllProductsForExport();
      if (allProducts.length === 0) {
        setError("Aucun produit a exporter.");
        return;
      }

      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFontSize(16);
      doc.text("Catalogue produits", 40, 42);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 40, 60);

      const imageByRow = {};
      await Promise.all(
        allProducts.map(async (product, idx) => {
          if (!product.image_url) return;
          const dataUrl = await imageUrlToJpegDataUrl(product.image_url);
          if (dataUrl) imageByRow[idx] = dataUrl;
        }),
      );

      autoTable(doc, {
        startY: 74,
        head: [["Image", "Produit", "Prix"]],
        body: allProducts.map((p) => [
          p.image_url ? "" : "-",
          p.name || "",
          formatPrice(p.price || 0),
        ]),
        styles: {
          fontSize: 10,
          cellPadding: 8,
          valign: "middle",
        },
        headStyles: {
          fillColor: [53, 53, 53],
        },
        columnStyles: {
          0: { cellWidth: 72 },
          1: { cellWidth: 300 },
          2: { cellWidth: 120, halign: "right" },
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 0) {
            data.cell.styles.minCellHeight = 58;
          }
        },
        didDrawCell: (data) => {
          if (data.section !== "body" || data.column.index !== 0) return;
          const imageData = imageByRow[data.row.index];
          if (!imageData) return;

          const size = 42;
          const x = data.cell.x + (data.cell.width - size) / 2;
          const y = data.cell.y + (data.cell.height - size) / 2;
          doc.addImage(imageData, "JPEG", x, y, size, size);
        },
      });

      const stamp = new Date().toISOString().slice(0, 10);
      doc.save(`catalogue-produits-${stamp}.pdf`);
    } catch {
      setError("Erreur lors de l'export PDF.");
    } finally {
      setExportingType("");
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.cream,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: `2px solid ${C.light}`,
              borderTopColor: C.dark,
              animation: "spin .7s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <span
            style={{
              fontSize: "13px",
              color: C.muted,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Chargement…
          </span>
        </div>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pr-fade-in { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }

        .pr-root { min-height: 100vh; background: ${C.beige}; font-family: 'DM Sans', sans-serif; color: ${C.text}; }

        /* ── Navbar ── */
        .pr-nav {
          background: ${C.cream}; border-bottom: 1px solid ${C.light};
          height: 58px; display: flex; align-items: center;
          position: sticky; top: 0; z-index: 100;
        }
        .pr-nav-inner { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0 24px; }
        .pr-nav-brand {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 20px; font-weight: 700; color: ${C.dark};
          text-decoration: none; letter-spacing: -0.3px;
        }
        .pr-nav-links { display: flex; align-items: center; gap: 4px; }
        .pr-nav-link {
          font-size: 13px; font-weight: 500; color: ${C.dark};
          text-decoration: none; padding: 6px 12px; border-radius: 6px;
          transition: background .15s;
        }
        .pr-nav-link:hover { background: ${C.light}; }
        .pr-nav-link.active { background: ${C.light}; }

        /* hamburger */
        .pr-hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }

        /* mobile nav drawer */
        .pr-mobile-nav {
          background: ${C.cream}; border-bottom: 1px solid ${C.light};
          padding: 12px 24px; display: flex; flex-direction: column; gap: 4px;
          position: sticky; top: 58px; z-index: 99;
        }
        .pr-mobile-nav a { font-size: 14px; font-weight: 500; color: ${C.dark}; text-decoration: none; padding: 8px 12px; border-radius: 6px; }
        .pr-mobile-nav a:hover { background: ${C.light}; }

        /* ── Body ── */
        .pr-body { max-width: 960px; margin: 0 auto; padding: 32px 16px 80px; }

        /* ── Page header ── */
        .pr-page-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 28px; }
        .pr-page-eyebrow {
          display: inline-block; font-size: 10px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase; color: ${C.muted};
          background: ${C.light}; padding: 4px 16px; border-radius: 20px; margin-bottom: 10px;
        }
        .pr-page-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 30px; font-weight: 700; color: ${C.dark};
          line-height: 1.05; letter-spacing: -0.5px;
        }
        .pr-page-sub { font-size: 13px; color: ${C.muted}; margin-top: 4px; font-weight: 300; }

        .pr-header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

        /* ── Btn primary ── */
        .pr-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 20px;
          background: ${C.dark}; color: ${C.cream};
          border: none; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; letter-spacing: .01em;
          transition: transform .2s, box-shadow .2s;
          white-space: nowrap;
        }
        .pr-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(53,53,53,.15); }
        .pr-btn-primary:disabled { background: ${C.muted}; cursor: not-allowed; transform: none; box-shadow: none; }

        .pr-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 11px 14px;
          background: ${C.cream};
          color: ${C.dark};
          border: 1.5px solid ${C.light};
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .2s, border-color .2s, box-shadow .2s;
          white-space: nowrap;
        }
        .pr-btn-secondary:hover {
          transform: translateY(-2px);
          border-color: ${C.main};
          box-shadow: 0 8px 24px rgba(53,53,53,.08);
        }
        .pr-btn-secondary:disabled {
          opacity: .6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* ── Search ── */
        .pr-search-wrap { position: relative; margin-bottom: 20px; }
        .pr-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: ${C.muted}; opacity: .55; pointer-events: none; display: flex; }
        .pr-search-input {
          width: 100%; padding: 12px 16px 12px 42px;
          border: 1.5px solid ${C.light}; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
          color: ${C.dark}; background: ${C.cream}; outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .pr-search-input:focus { border-color: ${C.caramel}; box-shadow: 0 0 0 3px ${C.caramel}20; }
        .pr-search-input::placeholder { color: ${C.muted}; opacity: .5; }

        /* ── Alert ── */
        .pr-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; margin-bottom: 20px; animation: pr-fade-in .2s ease; }
        .pr-alert-err { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; }

        /* ── Form card ── */
        .pr-form-card { background: ${C.cream}; border: 1px solid ${C.light}; border-radius: 20px; overflow: hidden; margin-bottom: 20px; }
        .pr-form-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid ${C.light}; background: ${C.cream}; }
        .pr-form-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 700; color: ${C.dark}; }
        .pr-form-close { width: 30px; height: 30px; border-radius: 8px; border: 1px solid ${C.light}; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: ${C.muted}; transition: background .12s, color .12s; }
        .pr-form-close:hover { background: ${C.light}; color: ${C.dark}; }

        .pr-form-body { padding: 20px; display: flex; flex-direction: column; gap: 18px; }

        .pr-form-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }

        .pr-field { display: flex; flex-direction: column; gap: 6px; }
        .pr-label { font-size: 11px; font-weight: 600; color: ${C.muted}; letter-spacing: .08em; text-transform: uppercase; }
        .pr-hint  { font-size: 11px; font-weight: 300; color: ${C.muted}; text-transform: none; letter-spacing: 0; margin-left: 6px; }
        .pr-input {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid ${C.light}; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
          color: ${C.dark}; background: ${C.cream}; outline: none;
          transition: border-color .15s, box-shadow .15s;
          -moz-appearance: textfield;
        }
        .pr-input:focus { border-color: ${C.caramel}; box-shadow: 0 0 0 3px ${C.caramel}20; }
        .pr-input::placeholder { color: ${C.muted}; opacity: .5; font-weight: 300; }
        .pr-input::-webkit-inner-spin-button { -webkit-appearance: none; }

        .pr-image-preview { width: 72px; height: 72px; border-radius: 10px; border: 1.5px solid ${C.light}; overflow: hidden; position: relative; margin-top: 8px; flex-shrink: 0; }

        .pr-form-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .pr-btn-cancel {
          padding: 11px 20px; background: transparent; color: ${C.muted};
          border: 1.5px solid ${C.light}; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: border-color .15s, color .15s;
        }
        .pr-btn-cancel:hover { border-color: ${C.muted}; color: ${C.dark}; }

        /* ── File input ── */
        .pr-file-label {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 16px; border: 1.5px dashed ${C.main};
          border-radius: 10px; cursor: pointer; background: ${C.cream};
          font-size: 13px; color: ${C.muted}; font-weight: 400;
          transition: border-color .15s, background .15s;
        }
        .pr-file-label:hover { border-color: ${C.caramel}; background: ${C.beige}; }

        /* ── Empty state ── */
        .pr-empty { background: ${C.cream}; border: 1px solid ${C.light}; border-radius: 20px; padding: 56px 24px; text-align: center; }
        .pr-empty-icon { width: 52px; height: 52px; border-radius: 16px; background: ${C.light}; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; color: ${C.muted}; }
        .pr-empty-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 700; color: ${C.dark}; margin-bottom: 8px; }
        .pr-empty-sub { font-size: 14px; color: ${C.muted}; font-weight: 300; margin-bottom: 24px; }

        /* ── Product list ── */
        .pr-list { display: flex; flex-direction: column; gap: 8px; }

        /* desktop row */
        .pr-product-row {
          background: ${C.cream}; border: 1px solid ${C.light}; border-radius: 14px;
          padding: 14px 18px; display: flex; align-items: center; gap: 14px;
          transition: box-shadow .18s, border-color .18s;
        }
        .pr-product-row:hover { box-shadow: 0 4px 16px rgba(53,53,53,.07); border-color: ${C.main}; }

        .pr-product-img { width: 52px; height: 52px; border-radius: 10px; overflow: hidden; position: relative; flex-shrink: 0; background: ${C.light}; border: 1px solid ${C.main}; }
        .pr-product-img-placeholder { width: 52px; height: 52px; border-radius: 10px; background: ${C.light}; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: ${C.muted}; }

        .pr-product-info { flex: 1; min-width: 0; }
        .pr-product-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 700; color: ${C.dark}; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pr-product-meta { font-size: 12px; color: ${C.muted}; font-weight: 300; }
        .pr-product-price { font-size: 13px; font-weight: 600; color: ${C.dark}; }

        .pr-product-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .pr-btn-edit {
          padding: 8px 14px; background: transparent; color: ${C.dark};
          border: 1.5px solid ${C.light}; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: border-color .15s, background .15s;
          white-space: nowrap;
        }
        .pr-btn-edit:hover { border-color: ${C.main}; background: ${C.light}; }
        .pr-btn-delete {
          padding: 8px 14px; background: transparent; color: #991B1B;
          border: 1.5px solid #FECACA; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: border-color .15s, background .15s;
          white-space: nowrap;
        }
        .pr-btn-delete:hover { background: #FEF2F2; border-color: #FCA5A5; }

        /* ── RESPONSIVE ── */
        @media (min-width: 540px) {
          .pr-form-grid { grid-template-columns: 1fr 1fr; }
          .pr-body { padding: 40px 32px 80px; }
        }

        @media (max-width: 639px) {
          /* navbar */
          .pr-nav-links { display: none !important; }
          .pr-hamburger { display: flex !important; }

          /* page header stack */
          .pr-page-header { flex-direction: column; align-items: flex-start; gap: 14px; }
          .pr-page-title { font-size: 26px; }
          .pr-header-actions { width: 100%; flex-direction: column; align-items: stretch; }
          .pr-btn-secondary { width: 100%; }
          .pr-btn-primary-full { width: 100%; justify-content: center; }

          /* product row → card layout on mobile */
          .pr-product-row {
            flex-wrap: wrap;
            padding: 14px;
            gap: 12px;
          }
          .pr-product-info { min-width: 0; flex: 1 1 calc(100% - 64px); }
          .pr-product-actions {
            width: 100%;
            border-top: 1px solid ${C.light};
            padding-top: 12px;
            margin-top: 2px;
          }
          .pr-btn-edit, .pr-btn-delete { flex: 1; justify-content: center; text-align: center; }

          /* form full width buttons */
          .pr-form-actions { flex-direction: column; }
          .pr-form-actions .pr-btn-primary,
          .pr-form-actions .pr-btn-cancel { width: 100%; justify-content: center; }
        }

        @media (min-width: 640px) and (max-width: 768px) {
          .pr-nav-links { display: none !important; }
          .pr-hamburger { display: flex !important; }
          .pr-page-title { font-size: 28px; }
        }
      `}</style>

      <div className="pr-root">
        {/* Navbar */}
        <nav className="pr-nav">
          <div className="pr-nav-inner">
            <Link href="/dashboard" className="pr-nav-brand">
              Tsen
              <Image
                src="/logo.png"
                alt="@"
                width={25}
                height={25}
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                  margin: "0 0 5px 0",
                }}
              />
              be
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 300,
                  color: C.muted,
                  marginLeft: "8px",
                }}
              >
                by Keyros
              </span>
            </Link>
            <div className="pr-nav-links">
              <Link href="/dashboard" className="pr-nav-link">
                Accueil
              </Link>
              <Link href="/dashboard/produits" className="pr-nav-link active">
                Produits
              </Link>
              <Link href="/dashboard/stats" className="pr-nav-link">
                Stats
              </Link>
              <Link href="/dashboard/profil" className="pr-nav-link">
                Profil
              </Link>
            </div>
            <button
              className="pr-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div
                style={{
                  width: "22px",
                  height: "2px",
                  background: C.dark,
                  transition: "transform .2s",
                  transform: menuOpen
                    ? "rotate(45deg) translateY(7px)"
                    : "none",
                }}
              />
              <div
                style={{
                  width: "22px",
                  height: "2px",
                  background: C.dark,
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity .2s",
                }}
              />
              <div
                style={{
                  width: "22px",
                  height: "2px",
                  background: C.dark,
                  transition: "transform .2s",
                  transform: menuOpen
                    ? "rotate(-45deg) translateY(-7px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="pr-mobile-nav">
            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
              Accueil
            </Link>
            <Link href="/dashboard/produits" onClick={() => setMenuOpen(false)}>
              Produits
            </Link>
            <Link href="/dashboard/stats" onClick={() => setMenuOpen(false)}>
              Stats
            </Link>
            <Link href="/dashboard/profil" onClick={() => setMenuOpen(false)}>
              Profil
            </Link>
          </div>
        )}

        <div className="pr-body">
          {/* Header */}
          <div className="pr-page-header">
            <div>
              <div className="pr-page-eyebrow">Dashboard</div>
              <h1 className="pr-page-title">Produits</h1>
              <p className="pr-page-sub">
                {products.length} article{products.length !== 1 ? "s" : ""} dans
                votre catalogue
              </p>
            </div>
            <div className="pr-header-actions">
              <button
                className="pr-btn-secondary"
                onClick={exportCatalogExcel}
                disabled={exportingType !== ""}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {exportingType === "excel"
                  ? "Export Excel..."
                  : "Exporter Excel"}
              </button>

              <button
                className="pr-btn-secondary"
                onClick={exportCatalogPdf}
                disabled={exportingType !== ""}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {exportingType === "pdf" ? "Export PDF..." : "Exporter PDF"}
              </button>

              <button
                className="pr-btn-primary pr-btn-primary-full"
                onClick={openAdd}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Ajouter un produit
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="pr-search-wrap">
            <span className="pr-search-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              className="pr-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou référence…"
            />
          </div>

          {/* Formulaire */}
          {showForm && (
            <div className="pr-form-card">
              <div className="pr-form-header">
                <span className="pr-form-title">
                  {editing ? "Modifier le produit" : "Nouveau produit"}
                </span>
                <button
                  className="pr-form-close"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="pr-form-body">
                {error && (
                  <div className="pr-alert pr-alert-err">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: "1px" }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className="pr-form-grid">
                  <div className="pr-field">
                    <label className="pr-label">Nom du produit</label>
                    <input
                      type="text"
                      className="pr-input"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Ex: Robe fleurie"
                    />
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">
                      Référence <span className="pr-hint">auto si vide</span>
                    </label>
                    <input
                      type="text"
                      className="pr-input"
                      value={form.reference}
                      onChange={(e) =>
                        setForm({ ...form, reference: e.target.value })
                      }
                      placeholder="Ex: REF-001"
                    />
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">
                      Prix{" "}
                      <span className="pr-hint">
                        en{" "}
                        {currency === "USD"
                          ? "dollars"
                          : currency === "EUR"
                            ? "euros"
                            : "ariary"}
                      </span>
                    </label>
                    <input
                      type="number"
                      className="pr-input"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="Ex: 25000"
                    />
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">
                      Description <span className="pr-hint">optionnel</span>
                    </label>
                    <input
                      type="text"
                      className="pr-input"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Courte description"
                    />
                  </div>
                  <div className="pr-field" style={{ gridColumn: "1 / -1" }}>
                    <label className="pr-label">Image du produit</label>
                    <label className="pr-file-label">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {form.imageUrl ? "Changer l'image" : "Choisir une image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                    {form.imageUrl && (
                      <div className="pr-image-preview">
                        <Image
                          src={form.imageUrl}
                          alt="preview"
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="72px"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Mise en avant et Promo */}
                <div
                  style={{
                    borderTop: `1px solid ${C.light}`,
                    paddingTop: "20px",
                    marginTop: "20px",
                  }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: form.isPromo ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: form.isPromo ? C.muted : C.dark,
                        opacity: form.isPromo ? 0.6 : 1,
                        transition: "all 0.2s",
                      }}
                      title={
                        form.isPromo
                          ? "Automatiquement activé pour les produits en promotion"
                          : ""
                      }
                    >
                      <input
                        type="checkbox"
                        checked={form.isFeatured || form.isPromo}
                        onChange={(e) => {
                          if (!form.isPromo) {
                            setForm({ ...form, isFeatured: e.target.checked });
                          }
                        }}
                        disabled={form.isPromo}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: form.isPromo ? "not-allowed" : "pointer",
                          accentColor: C.caramel,
                          opacity: form.isPromo ? 0.6 : 1,
                        }}
                      />
                      Mettre en avant dans la carousel
                      {form.isPromo && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "11px",
                            color: C.accent,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          ✓ Auto
                        </span>
                      )}
                    </label>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: C.dark,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.isPromo}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            isPromo: e.target.checked,
                            isFeatured: e.target.checked
                              ? true
                              : form.isFeatured,
                          });
                        }}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: C.caramel,
                        }}
                      />
                      Mettre en promotion
                    </label>
                  </div>

                  {form.isPromo && (
                    <div className="pr-form-grid">
                      <div className="pr-field">
                        <label className="pr-label">Prix réduit</label>
                        <input
                          type="number"
                          className="pr-input"
                          value={form.promoPrice}
                          onChange={(e) =>
                            setForm({ ...form, promoPrice: e.target.value })
                          }
                          placeholder="Prix pendant la promo"
                        />
                      </div>
                      <div className="pr-field">
                        <label className="pr-label">Début de la promo</label>
                        <input
                          type="date"
                          className="pr-input"
                          value={form.promoStartDate}
                          onChange={(e) =>
                            setForm({ ...form, promoStartDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="pr-field">
                        <label className="pr-label">Fin de la promo</label>
                        <input
                          type="date"
                          className="pr-input"
                          value={form.promoEndDate}
                          onChange={(e) =>
                            setForm({ ...form, promoEndDate: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pr-form-actions">
                  <button
                    className="pr-btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving && (
                      <div
                        style={{
                          width: "13px",
                          height: "13px",
                          borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,.4)",
                          borderTopColor: "#fff",
                          animation: "spin .6s linear infinite",
                        }}
                      />
                    )}
                    {saving
                      ? "Sauvegarde…"
                      : editing
                        ? "Mettre à jour"
                        : "Ajouter"}
                  </button>
                  <button
                    className="pr-btn-cancel"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Liste */}
          {products.length === 0 ? (
            <div className="pr-empty">
              <div className="pr-empty-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="pr-empty-title">Pas encore de produits</p>
              <p className="pr-empty-sub">
                Ajoutez votre premier article pour remplir votre boutique
              </p>
              <button
                className="pr-btn-primary"
                onClick={openAdd}
                style={{ margin: "0 auto" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Ajouter un produit
              </button>
            </div>
          ) : (
            <div className="pr-list">
              {products.map((p) => (
                <div key={p.id} className="pr-product-row">
                  {p.image_url ? (
                    <div className="pr-product-img">
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="52px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="pr-product-img-placeholder">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}

                  <div className="pr-product-info">
                    <div className="pr-product-name">{p.name}</div>
                    <div className="pr-product-meta">
                      <span>{p.reference}</span>
                      <span style={{ margin: "0 6px", opacity: 0.4 }}>
                        &middot;
                      </span>
                      <span className="pr-product-price">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </div>

                  <div className="pr-product-actions">
                    <button className="pr-btn-edit" onClick={() => openEdit(p)}>
                      Modifier
                    </button>
                    <button
                      className="pr-btn-delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
