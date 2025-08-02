import {
  CreateMintTransactionDto,
  useCreateMintTransaction,
} from "@/hooks/use-create-mint-transaction";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CollectionInfo } from "@/hooks/use-get-collection-info";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { formatSUI } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Upload, X, Coins } from "lucide-react";

function MintForm({
  collectionId,
  mintPrice,
  onSuccess,
}: {
  collectionId: string;
  mintPrice: number;
  onSuccess: () => void;
}) {
  const { isPending: isLoading, mutate } = useCreateMintTransaction();
  const [formData, setFormData] = useState<CreateMintTransactionDto>({
    name: "",
    description: "",
    imageFile: null as never,
    collectionId: collectionId,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateMintTransactionDto, string>>
  >({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateMintTransactionDto, string>> =
      {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.imageFile) {
      newErrors.imageFile = "Image file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          imageFile: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imageFile: "File size must be less than 10MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, imageFile: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.imageFile) {
        setErrors((prev) => ({ ...prev, imageFile: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    mutate([
      formData,
      mintPrice,
      () => {
        // Reset form on success
        setFormData({
          name: "",
          description: "",
          imageFile: null,
          collectionId: collectionId,
        });
        setImagePreview(null);
        
        // Close dialog after successful mint
        setTimeout(() => {
          onSuccess();
        }, 1000); // Small delay to show success state
      },
    ]);
  };

  const handleInputChange = (
    field: keyof CreateMintTransactionDto,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex gap-6">
      <div className="flex flex-col gap-6 flex-1">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-amber-900 mb-3"
          >
            NFT Name *
          </label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Cosmic Cat Supreme"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`bg-amber-50/30 backdrop-blur-md border-amber-300/30 text-amber-900 placeholder:text-amber-600/60 focus:border-amber-500/70 focus:ring-amber-500/20 ${
              errors.name ? "border-red-400/50 focus:border-red-400/50" : ""
            }`}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-amber-900 mb-3"
          >
            Description *
          </label>
          <textarea
            id="description"
            placeholder="Describe your unique cat's personality and traits..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 bg-amber-50/30 backdrop-blur-md border border-amber-300/30 rounded-xl text-amber-900 placeholder:text-amber-600/60 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/70 transition-all duration-300 ${
              errors.description
                ? "border-red-400/50 focus:border-red-400/50"
                : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.description}
            </p>
          )}
        </div>

        <div className="bg-gradient-to-r from-amber-200/20 to-orange-200/20 backdrop-blur-md border border-amber-300/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Coins className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-amber-900 font-medium">Total Cost</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-amber-700 text-sm">Mint Price</span>
            <span className="text-2xl font-bold text-amber-950">
              {formatSUI(mintPrice)} SUI
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-amber-600">+ Gas fees (estimated)</span>
            <span className="text-amber-800 font-medium">~0.005 SUI</span>
          </div>
        </div>

        <Button
          id="mint-button"
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Minting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Mint NFT for {formatSUI(mintPrice)} SUI
            </div>
          )}
        </Button>
      </div>

      <div className="flex-1">
        <label
          htmlFor="imageFile"
          className="block text-sm font-medium text-amber-900 mb-3"
        >
          NFT Image *
        </label>
        <div className="space-y-4 aspect-[9/16] flex max-h-96">
          {imagePreview ? (
            <div className="relative w-full">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover rounded-2xl border-2 border-amber-300/30 shadow-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, imageFile: null }));
                  setImagePreview(null);
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 w-full ${
                errors.imageFile
                  ? "border-red-400/50 bg-red-100/10"
                  : "border-amber-300/30 hover:border-amber-500/70 hover:bg-amber-50/20"
              }`}
            >
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-2xl flex items-center justify-center border border-amber-300/30">
                  <Upload className="w-8 h-8 text-amber-700" />
                </div>
                <div>
                  <p className="text-amber-900 font-medium text-lg">
                    {formData.imageFile
                      ? formData.imageFile.name
                      : "Click to upload image"}
                  </p>
                  <p className="text-amber-600 text-sm mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {errors.imageFile && (
          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
            <X className="w-4 h-4" />
            {errors.imageFile}
          </p>
        )}
      </div>
    </form>
  );
}

export function MintSection({
  collectionInfo,
  id,
}: {
  collectionInfo: CollectionInfo;
  id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
          <Sparkles className="w-5 h-5 mr-2" />
          Mint
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-amber-50/20 backdrop-blur-md border border-amber-300/30 min-w-max p-0 rounded-2xl">
        {collectionInfo.isActive && (
          <div className="bg-gradient-to-r from-amber-100/20 to-orange-100/20 border border-amber-300/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent mb-4">
                    Mint Your NFT
                  </h3>
                  <p className="text-amber-800 mb-6 text-lg leading-relaxed font-medium">
                    Create your unique NFT with custom traits and personality
                  </p>
                </motion.div>

                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-amber-700 font-medium">Minting Progress</span>
                    <span className="text-amber-800 font-semibold">
                      {collectionInfo.totalSupply.toLocaleString()}/
                      {collectionInfo.maxSupply.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-amber-200/30 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (collectionInfo.totalSupply /
                            collectionInfo.maxSupply) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-amber-600 text-sm">
                    {(
                      ((collectionInfo.maxSupply - collectionInfo.totalSupply) /
                        collectionInfo.maxSupply) *
                      100
                    ).toFixed(1)}
                    % remaining
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-amber-100/30 backdrop-blur-md border border-amber-300/30 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Coins className="w-5 h-5 text-amber-700" />
                    </div>
                    <span className="text-amber-900 font-medium">Pricing</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-700">Mint Price</span>
                    <span className="text-2xl font-bold text-amber-950">
                      {formatSUI(collectionInfo.mintPrice)} SUI
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-600">Gas Fee (estimated)</span>
                    <span className="text-amber-800 font-medium">~0.005 SUI</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <MintForm
                  collectionId={id}
                  mintPrice={collectionInfo.mintPrice}
                  onSuccess={handleSuccess}
                />
              </motion.div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}