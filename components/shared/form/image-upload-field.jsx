"use client";

import { Upload, X, ImageIcon, File } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { useWatch } from "react-hook-form";

export function ImageUploadField({
  control,
  name,
  label,
  placeholder = "Upload gambar atau drag & drop di sini",
  disabled,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const value = useWatch({ control, name });

  useEffect(() => {
    if (value && typeof value === "string" && previews.length === 0) {
      setPreviews([
        {
          url: value,
          name: "Current Image",
          size: 0,
          file: null,
        },
      ]);
    }
  }, [value]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) return "File harus berupa gambar";
    if (file.size > maxSize)
      return `Ukuran file maksimal ${(maxSize / 1024 / 1024).toFixed(0)}MB`;
    return null;
  };

  const processFiles = (files, onChange) => {
    const file = files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    const preview = {
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    };

    setPreviews([preview]);
    onChange(file);
  };

  const handleDrop = (e, onChange) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0)
      processFiles(e.dataTransfer.files, onChange);
  };

  const handleFileSelect = (e, onChange) => {
    if (e.target.files.length > 0) processFiles(e.target.files, onChange);
  };

  const removePreview = (onChange) => {
    setPreviews([]);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
            {label}
          </FormLabel>

          <FormControl>
            <div className="space-y-4">
              <motion.div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => handleDrop(e, onChange)}
                onClick={() => !disabled && fileInputRef.current?.click()}
                whileTap={{ scale: disabled ? 1 : 0.99 }}
                className={`
                  relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer
                  transition-all duration-300 group
                  ${
                    isDragging
                      ? "border-fuchsia-500 bg-fuchsia-500/20 scale-[1.02]"
                      : "border-zinc-700 hover:border-fuchsia-500/50 bg-black"
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={accept}
                  disabled={disabled}
                  onChange={(e) => handleFileSelect(e, onChange)}
                  name={field.name}
                />

                <div className="relative z-10">
                  <motion.div
                    animate={{ y: isDragging ? -10 : [0, -10, 0] }}
                    transition={{
                      duration: isDragging ? 0.3 : 2,
                      repeat: isDragging ? 0 : Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-linear-to-br from-fuchsia-600/20 via-pink-600/20 to-rose-600/20 group-hover:from-fuchsia-600/30 group-hover:via-pink-600/30 group-hover:to-rose-600/30 transition-all duration-300"
                  >
                    <Upload
                      className={`w-8 h-8 transition-colors duration-300 ${
                        isDragging
                          ? "text-fuchsia-400"
                          : "text-zinc-400 group-hover:text-fuchsia-400"
                      }`}
                    />
                  </motion.div>

                  <p className="text-base font-semibold text-white mb-2">
                    {isDragging ? "Lepaskan file di sini" : placeholder}
                  </p>
                  <p className="text-sm text-zinc-400 mb-4">
                    atau klik untuk memilih file
                  </p>

                  <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <File className="w-3 h-3" />
                      PNG, JPG, GIF
                    </span>
                    <span>•</span>
                    <span>Max {(maxSize / 1024 / 1024).toFixed(0)}MB</span>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {previews.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 gap-4"
                  >
                    {previews.map((preview, index) => (
                      <motion.div
                        key={preview.url || index}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-fuchsia-500/50 transition-all duration-300"
                      >
                        <div className="aspect-video relative overflow-hidden bg-zinc-950">
                          <img
                            src={preview.url}
                            alt={preview.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removePreview(onChange)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <div className="p-3 space-y-1">
                          <p className="text-sm font-medium text-white truncate">
                            {preview.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <ImageIcon className="w-3 h-3" />
                            <span>{formatFileSize(preview.size)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}