import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/features/ImagesUpload";
import { CategoryTreeSelect } from "@/components/category/CategoryTreeSelect";
import InputComponent from "@/components/common/InputComponent";
import { Field, FieldLabel } from "@/components/ui/field";
import { Product, type ProductSaleUnit } from "@/types/product.types";
import { useProducts } from "@/hooks/useProducts";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Precio debe ser mayor o igual a 0"),
  stock: z.coerce.number().int().min(0, "Stock debe ser entero no negativo"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  isWholesale: z.boolean().optional(),
  saleUnit: z.enum(["BOX", "PALLET"]),
});

type ProductFormValues = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  isWholesale?: boolean;
  saleUnit: ProductSaleUnit;
};

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
}

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const { createProduct, updateProduct, isLoading } = useProducts();
  const [existingImageUrls] = useState<string[]>(() => product?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const isEditing = !!product;

  const { register, handleSubmit, control, reset } = useForm<ProductFormValues>(
    {
      defaultValues: {
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price ?? 0,
        stock: product?.stock ?? 0,
        categoryId: product?.categoryId || "",
        isWholesale: product?.isWholesale ?? false,
        saleUnit: product?.saleUnit ?? "BOX",
      },
    },
  );

  useEffect(() => {
    reset({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      categoryId: product?.categoryId || "",
      isWholesale: product?.isWholesale ?? false,
      saleUnit: product?.saleUnit ?? "BOX",
    });
  }, [product, reset]);

  const handleAddImage = (file: File | null) => {
    if (!file) return;
    setNewImageFiles((prev) => [...prev, file]);
    setNewImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const parsed = productSchema.safeParse(data);
      if (!parsed.success) {
        console.error("Errores de validación:", parsed.error.flatten());
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      formData.append("categoryId", data.categoryId);
      // send boolean as string so backend (multipart) receives it
      formData.append("isWholesale", String(!!data.isWholesale));
      formData.append("saleUnit", data.saleUnit);

      newImageFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (isEditing && product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  };

  const hasExistingImages = existingImageUrls.length > 0;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputComponent
        htmlForm="name-product"
        label="Nombre"
        placeholder="Ej: Café Premium"
        type="text"
        {...register("name")}
      />
      <InputComponent
        htmlForm="description-product"
        label="Descripción"
        placeholder="Breve descripción del producto"
        type="text"
        {...register("description")}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputComponent
          htmlForm="price-product"
          label="Precio"
          placeholder="0.00"
          type="number"
          step="0.01"
          {...register("price")}
        />
        <InputComponent
          htmlForm="stock-product"
          label="Stock"
          placeholder="0"
          type="number"
          {...register("stock")}
        />
      </div>

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <div className="space-y-2">
            <CategoryTreeSelect
              value={field.value ?? null}
              onChange={(value) => field.onChange(value ?? null)}
              placeholder="Seleccionar categoría"
            />
          </div>
        )}
      />

      <Controller
        name="saleUnit"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="saleUnit">Unidad de venta</FieldLabel>
            <select
              id="saleUnit"
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="BOX">Caja</option>
              <option value="PALLET">Parlet</option>
            </select>
          </Field>
        )}
      />

      <Field className="items-center gap-3" orientation="horizontal">
        <Controller
          name="isWholesale"
          control={control}
          render={({ field }) => (
            <>
              <input
                id="isWholesale"
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <FieldLabel htmlFor="isWholesale" className="text-sm font-medium">
                Venta mayorista
              </FieldLabel>
            </>
          )}
        />
      </Field>

      <div>
        <label className="text-sm font-medium">Imágenes</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {hasExistingImages &&
            existingImageUrls.map((url, idx) => (
              <div
                key={`existing-${idx}`}
                className="relative w-24 h-24 border rounded overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Imagen existente ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

          {newImagePreviews.map((url, idx) => (
            <div
              key={`new-${idx}`}
              className="relative w-24 h-24 border rounded overflow-hidden group"
            >
              <img
                src={url}
                alt={`Nueva imagen ${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveNewImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <ImageUpload onChange={handleAddImage} label="Añadir imagen" />
        </div>
        {isEditing && hasExistingImages && (
          <p className="text-xs text-gray-500 mt-1">
            Las imágenes existentes se conservarán mientras no subas nuevas.
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
      </Button>
    </form>
  );
};
