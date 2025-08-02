import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { useNetworkVariable } from "../networkConfig";

export function useGetUserNFT(collectionId?: string) {
  const account = useCurrentAccount();
  const simpleArtNFT = useNetworkVariable("simpleArtNFT");
  
  const { data, ...rest } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address!,
      filter: {
        // Jika setiap collection punya package/module berbeda
        StructType: collectionId 
          ? `${collectionId}::simple_art_nft::SimpleNFT`
          : `${simpleArtNFT}::simple_art_nft::SimpleNFT`,
      },
      options: { showContent: true, showOwner: true },
    },
    {
      enabled: account !== null,
      queryKey: ["getUserNFT", collectionId],
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