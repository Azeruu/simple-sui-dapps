import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { useNetworkVariable } from "../networkConfig";

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
        showType: true
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
      ids: allNFTs?.map(nft => nft.data?.objectId!) || [],
      options: {
        showContent: true,
        showOwner: true,
        showDisplay: true,
      }
    },
    {
      enabled: !!allNFTs && allNFTs.length > 0 && !!collectionId,
      queryKey: ["multiGetNFTsWithCollection", allNFTs?.length, collectionId],
    }
  );

  const filteredNFTs = useMemo(async () => {
    if (!allNFTs || !collectionId) return [];

    const filteredResults = [];

    for (const nft of allNFTs) {
      if (!nft.data?.objectId) continue;

      try {
        // Query dynamic fields untuk setiap NFT
        const dynamicFieldsResponse = await fetch('/api/sui/getDynamicFields', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parentId: nft.data.objectId,
          })
        });

        if (dynamicFieldsResponse.ok) {
          const dynamicFields = await dynamicFieldsResponse.json();

          // Cari field dengan name "collection_id"
          const collectionField = dynamicFields.data?.find((field: any) =>
            field.name.value === "collection_id" ||
            Buffer.from(field.name.value, 'base64').toString() === "collection_id"
          );

          if (collectionField && collectionField.value === collectionId) {
            filteredResults.push(nft);
          }
        }
      } catch (error) {
        console.error('Error fetching dynamic fields for NFT:', nft.data.objectId, error);
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
import { Eye, Heart, Flame } from "lucide-react";
import { useEffect, useState } from "react";

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
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'suix_getDynamicFields',
              params: [nft.data.objectId]
            })
          });

          const result = await response.json();

          if (result.result?.data) {
            // Cari field collection_id
            for (const field of result.result.data) {
              // Check jika nama field adalah "collection_id"
              let fieldName = '';
              if (typeof field.name.value === 'string') {
                // Jika sudah string
                fieldName = field.name.value;
              } else if (Array.isArray(field.name.value)) {
                // Jika array bytes, convert ke string
                fieldName = String.fromCharCode(...field.name.value);
              }

              if (fieldName === 'collection_id') {
                // Ambil nilai collection_id
                const fieldValueResponse = await fetch(`https://fullnode.testnet.sui.io/`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'suix_getDynamicFieldObject',
                    params: [nft.data.objectId, field.name]
                  })
                });

                const fieldResult = await fieldValueResponse.json();
                const fieldCollectionId = fieldResult.result?.data?.content?.fields?.value;

                if (fieldCollectionId === collectionId) {
                  filtered.push(nft);
                  break;
                }
              }
            }
          }
        } catch (error) {
          console.error('Error checking NFT collection:', error);
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
          <Card key={i} className="bg-[#313244] border-[#45475a] animate-pulse">
            <CardContent className="p-0">
              <div className="h-64 bg-[#45475a] rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-[#45475a] rounded mb-2"></div>
                <div className="h-3 bg-[#45475a] rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNFTs.map((nft, index) => {
          const content = nft.data?.content;
          const fields = content?.fields;

          return (
            <Card
              key={nft.data?.objectId || index}
              className="bg-[#313244] border-[#45475a] hover:border-[#cba6f7] transition-all duration-300 group flex flex-col justify-between"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={fields?.image_url || "/placeholder.png"}
                    alt={fields?.name || "NFT"}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#cdd6f4] mb-2 truncate">
                    {fields?.name || "Unnamed NFT"}
                  </h3>
                  <p className="text-sm text-[#a6adc8] mb-4 h-10 overflow-hidden">
                    {fields?.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between text-sm text-[#a6adc8]">
                    <div className="flex items-center gap-1 text-[#f38ba8]">
                      <Heart className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 100)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 pt-0">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  disabled={isBurning}
                  onClick={() => handleBurnClick(nft.data?.objectId)}
                >
                  <Flame className="w-4 h-4 mr-2" />
                  {isBurning ? "Burning..." : "Burn NFT"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredNFTs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-[#6c7086] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#bac2de] mb-2">
            No NFTs found in this collection
          </h3>
          <p className="text-[#a6adc8] mb-2">
            Collection ID: {collectionId}
          </p>
          <p className="text-[#6c7086] text-sm">
            This collection might be empty or you don't own any NFTs from it.
          </p>
        </div>
      )}

      {allNFTs?.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-[#6c7086] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#bac2de] mb-2">
            No NFTs found
          </h3>
          <p className="text-[#a6adc8]">
            Try minting a new one!
          </p>
        </div>
      )}
    </>
  );
}

export default NFTGrid;