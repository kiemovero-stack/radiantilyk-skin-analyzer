/**
 * ClientShop — In-App Skincare Store
 *
 * Displays products from the catalog, organized by category.
 * One-click to open product on rkaskin.co storefront.
 * Shows bundles and deals prominently.
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, Search, ArrowLeft, ExternalLink,
  Star, Package, Tag, ChevronRight, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { clientPath } from "@/lib/clientPaths";
import { PRODUCT_CATALOG, BUNDLE_DEALS, type ProductItem, type BundleDeal } from "@shared/productCatalog";

const C = {
  gold: "#B8964A",
  goldLight: "#C4A882",
  ivory: "#FAF7F2",
  charcoal: "#2C2C2C",
  charcoalLight: "#4A4A4A",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ClientShop() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = PRODUCT_CATALOG.map((c) => c.category);
    return ["All", ...cats];
  }, []);

  const allProducts = useMemo(() => {
    return PRODUCT_CATALOG.flatMap((cat) => cat.products);
  }, []);

  const filteredProducts = useMemo(() => {
    let products = selectedCategory === "All"
      ? allProducts
      : PRODUCT_CATALOG.find((c) => c.category === selectedCategory)?.products || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.keyBenefits.some((b) => b.toLowerCase().includes(q))
      );
    }
    return products;
  }, [selectedCategory, searchQuery, allProducts]);

  return (
    <div className="min-h-screen pb-24" style={{ background: C.ivory }}>
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.charcoal} 0%, ${C.charcoalLight} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 30%, ${C.gold}30 0%, transparent 50%)` }} />
        </div>
        <div className="relative px-5 pt-12 pb-5">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setLocation(clientPath("/home"))}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <h1
              className="text-xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontWeight: 400 }}
            >
              Shop Skincare
            </h1>
          </div>

          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Search className="w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, ingredients..."
              className="flex-1 text-sm bg-transparent outline-none text-white placeholder:text-white/40"
            />
          </div>
        </div>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto">
        {/* Bundle Deals */}
        {BUNDLE_DEALS && BUNDLE_DEALS.length > 0 && !searchQuery && selectedCategory === "All" && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4" style={{ color: C.gold }} />
              <p className="text-xs font-medium tracking-wider uppercase" style={{ color: C.gold }}>
                Bundle Deals
              </p>
            </div>
            <div className="space-y-3">
              {BUNDLE_DEALS.slice(0, 3).map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: selectedCategory === cat ? C.gold : "white",
                color: selectedCategory === cat ? "white" : C.charcoalLight,
                border: `1px solid ${selectedCategory === cat ? C.gold : C.gold + "20"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Count */}
        <p className="text-xs mb-4" style={{ color: C.charcoalLight + "60" }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.sku} product={product} index={i} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3" style={{ color: C.gold + "40" }} />
            <p className="text-sm" style={{ color: C.charcoalLight + "60" }}>
              No products found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product, index }: { product: ProductItem; index: number }) {
  return (
    <motion.a
      href={product.shopUrl || "https://rkaskin.co"}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="block rounded-2xl bg-white border overflow-hidden hover:shadow-md transition-shadow"
      style={{ borderColor: C.gold + "12" }}
    >
      {product.imageUrl ? (
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-square bg-gray-50 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" style={{ color: C.gold + "30" }} />
        </div>
      )}
      <div className="p-3">
        <p className="text-xs font-medium line-clamp-2 leading-snug mb-1.5" style={{ color: C.charcoal }}>
          {product.name}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: C.gold }}>
            {product.price}
          </p>
          <ExternalLink className="w-3 h-3" style={{ color: C.gold + "40" }} />
        </div>
      </div>
    </motion.a>
  );
}

/* ── Bundle Card ── */
function BundleCard({ bundle }: { bundle: BundleDeal }) {
  return (
    <a
      href="https://rkaskin.co"
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-2xl bg-white border hover:shadow-md transition-shadow"
      style={{ borderColor: C.gold + "20" }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold" style={{ color: C.charcoal }}>
            {bundle.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: C.charcoalLight + "80" }}>
            {bundle.tagline}
          </p>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
          style={{ background: C.gold + "15", color: C.gold }}
        >
          Save {bundle.savings}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs line-through" style={{ color: C.charcoalLight + "50" }}>
          {bundle.originalPrice}
        </span>
        <span className="text-sm font-bold" style={{ color: C.gold }}>
          {bundle.bundlePrice}
        </span>
      </div>
      <p className="text-[10px] mt-2" style={{ color: C.charcoalLight + "60" }}>
        {bundle.productNames.join(" + ")}
      </p>
    </a>
  );
}
