import React, { useEffect, useState } from "react";
import {
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { ApiProduct, ApiProductImage, ApiSubcategory } from "@ornate/types";
import { getApiErrorMessage, paiseToRupees } from "@ornate/utils";
import { adminApi, uploadImageToImageKit } from "@/lib/adminApi";

interface ProductFormModalProps {
  open: boolean;
  product: ApiProduct | null;
  subcategories: ApiSubcategory[];
  onClose: () => void;
  onSaved: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  product,
  subcategories,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(product);
  const isExternal = product?.source === "external";

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("Ornate Studio");
  const [subcategoryName, setSubcategoryName] = useState("Living Room Furniture");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [dealActive, setDealActive] = useState(false);
  const [dealPrice, setDealPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [images, setImages] = useState<ApiProductImage[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([
    { key: "material", value: "" },
  ]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setBrand(product.brand || "Ornate Studio");
      setSubcategoryName(product.subcategoryName || "Living Room Furniture");
      setCustomSubcategory("");
      setShortDescription(product.shortDescription || "");
      setLongDescription(product.longDescription || "");
      setMrp(String(paiseToRupees(product.pricing?.mrp)));
      setSellingPrice(String(paiseToRupees(product.pricing?.sellingPrice)));
      setDealActive(Boolean(product.pricing?.dealActive));
      setDealPrice(
        product.pricing?.dealPrice ? String(paiseToRupees(product.pricing.dealPrice)) : ""
      );
      setStock(String(product.stock ?? 0));
      setIsFeatured(Boolean(product.isFeatured));
      setIsPublished(product.isPublished !== false && !product.isHidden);
      setImages(product.images || []);
      setAttributes(
        product.attributes && product.attributes.length > 0
          ? product.attributes
          : [{ key: "material", value: "" }]
      );
    } else {
      setName("");
      setSku(`ORN-${Date.now().toString().slice(-4)}`);
      setBrand("Ornate Studio");
      setSubcategoryName(subcategories[0]?.name || "Living Room Furniture");
      setCustomSubcategory("");
      setShortDescription("");
      setLongDescription("");
      setMrp("");
      setSellingPrice("");
      setDealActive(false);
      setDealPrice("");
      setStock("10");
      setIsFeatured(false);
      setIsPublished(true);
      setImages([]);
      setAttributes([{ key: "material", value: "" }]);
    }
  }, [open, product, subcategories]);

  if (!open) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadImageToImageKit(file);
        setImages((prev) => [
          ...prev,
          {
            id: uploaded.fileId,
            fileId: uploaded.fileId,
            url: uploaded.url,
            alt: name || uploaded.name,
            order: prev.length,
          },
        ]);
      }
      toast.success("Image uploaded to ImageKit (Ornate_Firnitures)");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "ImageKit upload failed"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setImages((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}`,
        url,
        alt: name || "Furniture preview",
        order: prev.length,
      },
    ]);
    setImageUrlInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedSubcategory =
      subcategoryName === "__custom__" ? customSubcategory.trim() : subcategoryName;

    if (!name.trim() || !sku.trim() || !resolvedSubcategory) {
      toast.error("Name, SKU, and Category are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        sku: sku.trim(),
        brand: brand.trim(),
        subcategoryName: resolvedSubcategory,
        shortDescription: shortDescription.trim(),
        longDescription: longDescription.trim(),
        mrp: Number(mrp || sellingPrice),
        sellingPrice: Number(sellingPrice),
        dealActive,
        dealPrice: dealActive && dealPrice ? Number(dealPrice) : null,
        stock: Number(stock || 0),
        isFeatured,
        isPublished,
        isHidden: !isPublished,
        images,
        attributes: attributes.filter((a) => a.key.trim() && a.value.trim()),
      };

      if (isEditing && product) {
        await adminApi.patch(`/products/${product.id}`, payload);
        toast.success(
          isExternal
            ? "External product override saved in MongoDB"
            : "Product updated in MongoDB"
        );
      } else {
        await adminApi.post("/products", payload);
        toast.success("New product added to MongoDB catalog");
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to save product"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-lg border border-ornate-gold/30 shadow-xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-ornate-cream/60 border-b border-ornate-gold/20 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-display uppercase tracking-widest text-ornate-darkgold">
              {isExternal
                ? "External API Product · Admin Override"
                : isEditing
                ? "MongoDB Product · Edit"
                : "New Product · Ornate Catalog DB"}
            </p>
            <h2 className="font-serif text-xl text-ornate-charcoal">
              {isEditing ? product?.name : "Add Furniture Piece"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ornate-charcoal/60 hover:text-ornate-charcoal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Vijayanagar Solid Oak Dining Table"
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">SKU *</label>
              <input
                type="text"
                required
                disabled={isEditing}
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Collection / Category *</label>
              <select
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm bg-white"
              >
                {subcategories.map((sub) => (
                  <option key={sub.slug} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
                <option value="__custom__">+ Create New Category</option>
              </select>
              {subcategoryName === "__custom__" && (
                <input
                  type="text"
                  value={customSubcategory}
                  onChange={(e) => setCustomSubcategory(e.target.value)}
                  placeholder="Enter new collection name"
                  className="w-full mt-2 px-3 py-2 border border-ornate-gold/30 rounded text-sm"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-ornate-offwhite p-4 rounded border border-ornate-gold/20">
            <div>
              <label className="block text-xs font-medium mb-1">MRP (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Stock Qty *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm bg-white"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-medium mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dealActive}
                  onChange={(e) => setDealActive(e.target.checked)}
                />
                Deal Price (₹)
              </label>
              <input
                type="number"
                min="1"
                disabled={!dealActive}
                value={dealPrice}
                onChange={(e) => setDealPrice(e.target.value)}
                placeholder="Deal ₹"
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm bg-white disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* ImageKit Upload & URLs */}
          <div className="space-y-3 border border-ornate-gold/25 rounded-md p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-ornate-charcoal">
                  Product Images (ImageKit → <code className="text-xs">Ornate_Firnitures</code>)
                </h3>
                <p className="text-xs text-ornate-charcoal/65">
                  Upload images directly to ImageKit CDN or paste external image URLs.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-ornate-charcoal text-white text-xs font-medium cursor-pointer hover:bg-ornate-darkgold transition-colors">
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <UploadCloud size={14} />
                )}
                {uploading ? "Uploading to ImageKit..." : "Upload Image(s)"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste an image URL..."
                className="flex-1 px-3 py-2 border border-ornate-gold/30 rounded text-xs"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 border border-ornate-charcoal rounded text-xs font-medium inline-flex items-center gap-1"
              >
                <ImagePlus size={14} /> Add URL
              </button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={img.id || img.url}
                    className="relative group border border-ornate-gold/25 rounded overflow-hidden aspect-square bg-ornate-cream"
                  >
                    <img
                      src={img.url}
                      alt={img.alt || name}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-ornate-charcoal/85 text-white text-[9px] rounded">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute top-1 right-1 p-1 bg-white/90 text-rose-700 rounded shadow opacity-90 hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Short Description</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Detailed Overview</label>
              <textarea
                rows={3}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className="w-full px-3 py-2 border border-ornate-gold/30 rounded text-sm"
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Specifications &amp; Attributes</label>
              <button
                type="button"
                onClick={() => setAttributes((prev) => [...prev, { key: "", value: "" }])}
                className="text-xs text-ornate-darkgold font-medium inline-flex items-center gap-1"
              >
                <Plus size={13} /> Add Attribute
              </button>
            </div>
            {attributes.map((attr, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. dimensions)"
                  value={attr.key}
                  onChange={(e) =>
                    setAttributes((prev) =>
                      prev.map((a, i) => (i === idx ? { ...a, key: e.target.value } : a))
                    )
                  }
                  className="col-span-5 px-3 py-1.5 border border-ornate-gold/30 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 180 x 90 x 76 cm)"
                  value={attr.value}
                  onChange={(e) =>
                    setAttributes((prev) =>
                      prev.map((a, i) => (i === idx ? { ...a, value: e.target.value } : a))
                    )
                  }
                  className="col-span-6 px-3 py-1.5 border border-ornate-gold/30 rounded text-xs"
                />
                <button
                  type="button"
                  onClick={() =>
                    setAttributes((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="col-span-1 flex items-center justify-center text-rose-700"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-ornate-gold/15">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured on Storefront
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              {isExternal ? "Visible on Storefront (uncheck to hide)" : "Published"}
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-ornate-gold/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-ornate-gold/30 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-5 py-2 bg-ornate-charcoal text-white rounded text-sm font-medium hover:bg-ornate-darkgold transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
