import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { useNetworkVariable } from "../networkConfig";
import { PlusCircle } from "lucide-react";

// Hook yang dimodifikasi untuk mendapatkan NFT dengan dynamic fields
export function useGetUserNFTWithDynamicFields() {
  const account = useCurrentAccount();
  const simpleArtNFT = useNetworkVariable("simpleArtNFT");

  const { data, ...rest } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address!,
      filter: {
        StructType: `${simpleArtNFT}::simple_art_nft::SimpleNFT`,
      },
      options: {
        showContent: true,
        showOwner: true,
        showDisplay: true,
        showType: true,
      },
    },
    {
      enabled: account !== null,
      queryKey: ["getUserNFTWithDynamicFields"],
      refetchInterval: 10_000,
    },
  );

  const parsed = useMemo(() => {
    return data?.data;
  }, [data?.data]);

  return [parsed, rest] as const;
}

// Hook khusus untuk mendapatkan dynamic fields dari NFT
export function useGetNFTDynamicFields(nftId: string) {
  const { data, ...rest } = useSuiClientQuery(
    "getDynamicFields",
    {
      parentId: nftId,
    },
    {
      enabled: !!nftId,
      queryKey: ["getNFTDynamicFields", nftId],
      refetchInterval: 10_000,
    },
  );

  return [data, rest] as const;
}

// Hook untuk mendapatkan semua NFT dari collection dengan mengambil dynamic fields
export function useGetCollectionNFTs(collectionId: string) {
  const [allNFTs] = useGetUserNFTWithDynamicFields();

  // Untuk setiap NFT, kita perlu check dynamic field collection_id
  const { data: nftsWithCollectionData, ...rest } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: allNFTs?.map((nft) => nft.data?.objectId!) || [],
      options: {
        showContent: true,
        showOwner: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!allNFTs && allNFTs.length > 0 && !!collectionId,
      queryKey: ["multiGetNFTsWithCollection", allNFTs?.length, collectionId],
    },
  );

  const filteredNFTs = useMemo(async () => {
    if (!allNFTs || !collectionId) return [];

    const filteredResults = [];

    for (const nft of allNFTs) {
      if (!nft.data?.objectId) continue;

      try {
        // Query dynamic fields untuk setiap NFT
        const dynamicFieldsResponse = await fetch("/api/sui/getDynamicFields", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentId: nft.data.objectId,
          }),
        });

        if (dynamicFieldsResponse.ok) {
          const dynamicFields = await dynamicFieldsResponse.json();

          // Cari field dengan name "collection_id"
          const collectionField = dynamicFields.data?.find(
            (field: any) =>
              field.name.value === "collection_id" ||
              Buffer.from(field.name.value, "base64").toString() ===
                "collection_id",
          );

          if (collectionField && collectionField.value === collectionId) {
            filteredResults.push(nft);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching dynamic fields for NFT:",
          nft.data.objectId,
          error,
        );
      }
    }

    return filteredResults;
  }, [allNFTs, collectionId]);

  return [filteredNFTs, rest] as const;
}

// NFTGrid component yang diperbaiki
import { useCreateBurnTx } from "@/hooks/use-burn-nft";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Eye, Heart, Flame, Sparkles, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function NFTGrid({ collectionId }: { collectionId: string }) {
  const [allNFTs] = useGetUserNFTWithDynamicFields();
  const [filteredNFTs, setFilteredNFTs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { mutate: burnNft, isPending: isBurning } = useCreateBurnTx();

  // Filter NFTs berdasarkan collection_id dari dynamic fields
  useEffect(() => {
    if (!allNFTs || !collectionId) {
      setFilteredNFTs([]);
      return;
    }

    const filterNFTs = async () => {
      setLoading(true);
      const filtered = [];

      for (const nft of allNFTs) {
        if (!nft.data?.objectId) continue;

        try {
          // Query dynamic fields untuk NFT ini
          const response = await fetch(`https://fullnode.testnet.sui.io/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "suix_getDynamicFields",
              params: [nft.data.objectId],
            }),
          });

          const result = await response.json();

          if (result.result?.data) {
            // Cari field collection_id
            for (const field of result.result.data) {
              // Check jika nama field adalah "collection_id"
              let fieldName = "";
              if (typeof field.name.value === "string") {
                // Jika sudah string
                fieldName = field.name.value;
              } else if (Array.isArray(field.name.value)) {
                // Jika array bytes, convert ke string
                fieldName = String.fromCharCode(...field.name.value);
              }

              if (fieldName === "collection_id") {
                // Ambil nilai collection_id
                const fieldValueResponse = await fetch(
                  `https://fullnode.testnet.sui.io/`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      jsonrpc: "2.0",
                      id: 1,
                      method: "suix_getDynamicFieldObject",
                      params: [nft.data.objectId, field.name],
                    }),
                  },
                );

                const fieldResult = await fieldValueResponse.json();
                const fieldCollectionId =
                  fieldResult.result?.data?.content?.fields?.value;

                if (fieldCollectionId === collectionId) {
                  filtered.push(nft);
                  break;
                }
              }
            }
          }
        } catch (error) {
          console.error("Error checking NFT collection:", error);
        }
      }

      setFilteredNFTs(filtered);
      setLoading(false);
    };

    filterNFTs();
  }, [allNFTs, collectionId]);

  const handleBurnClick = (objectId: string | undefined) => {
    if (!objectId) {
      console.error("Object ID is missing, cannot burn.");
      return;
    }
    burnNft(objectId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-amber-100/60 border-amber-300/50 animate-pulse">
              <CardContent className="p-0">
                <div className="h-64 bg-amber-200/40 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-amber-200/60 rounded mb-3"></div>
                  <div className="h-3 bg-amber-200/60 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-amber-200/60 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* NFT Count Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-200/50 rounded-lg">
              <Package className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900">
              NFTs in Collection
            </h3>
          </div>
          <div className="text-amber-700 font-medium">
            {filteredNFTs.length} {filteredNFTs.length === 1 ? "NFT" : "NFTs"}
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNFTs.map((nft, index) => {
          const content = nft.data?.content;
          const fields = content?.fields;

          return (
            <motion.div
              key={nft.data?.objectId || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-amber-100/70 backdrop-blur-md border border-amber-300/50 hover:border-amber-400/70 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-xl">
                <CardContent className="p-4">
                  {/* NFT Image Section */}
                  <div className="relative overflow-hidden">
                    <img
                      src={fields?.image_url || "/placeholder.png"}
                      alt={fields?.name || "NFT"}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* NFT Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-amber-200/90 backdrop-blur-md rounded-full px-3 py-1 text-amber-900 text-sm font-medium shadow-lg">
                        NFT
                      </div>
                    </div>

                    {/* Hover Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-white font-semibold text-sm truncate">
                          {fields?.name || "Unnamed NFT"}
                        </h4>
                        <p className="text-amber-100 text-xs truncate">
                          {fields?.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NFT Info Section */}
                  <div className="p-6">
                    <h3 className="font-bold text-amber-950 mb-3 text-lg truncate">
                      {fields?.name || "Unnamed NFT"}
                    </h3>
                    <p className="text-amber-800/90 text-sm leading-relaxed mb-4 h-12 overflow-hidden font-medium">
                      {fields?.description || "No description available"}
                    </p>

                    {/* NFT Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-pink-600">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 100)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-700">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Rare</span>
                      </div>
                    </div>

                    {/* --- Tombol untuk menambahkan Dynamic Field --- */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-800 yellow:from-red-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mb-1"
                      onClick={() =>
                        console.log("Logic for adding dynamic field...")
                      }
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {isBurning ? "Adding..." : "Add Dynamic Field"}
                    </Button>
                    {/* --- Akhir dari Tombol Dynamic Field --- */}

                    {/* Burn Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={isBurning}
                      onClick={() => handleBurnClick(nft.data?.objectId)}
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      {isBurning ? "Burning..." : "Burn NFT"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty States */}
      {filteredNFTs.length === 0 && !loading && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <Eye className="w-16 h-16 text-amber-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              No NFTs found in this collection
            </h3>
            <p className="text-amber-600 text-sm">
              This collection might be empty or you don't own any NFTs from it.
            </p>
          </div>
        </motion.div>
      )}

      {allNFTs?.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-amber-100/70 backdrop-blur-md border border-amber-300/50 rounded-2xl p-12 max-w-md mx-auto">
            <Sparkles className="w-16 h-16 text-amber-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              No NFTs found
            </h3>
            <p className="text-amber-700">Try minting a new one!</p>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default NFTGrid;
