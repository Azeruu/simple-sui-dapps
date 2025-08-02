import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBurnTx() {
  const queryClient = useQueryClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const packageId = useNetworkVariable("simpleArtNFT");

  const mutation = useMutation({
    // Mutation key untuk identifikasi
    mutationKey: ["burnNft", account?.address],

    // Fungsi utama yang dieksekusi saat mutasi dipanggil
    mutationFn: async (nftObjectId: string) => {
      if (!account?.address) {
        throw new Error("Wallet not connected.");
      }

      const tx = new Transaction();

      // Memanggil fungsi `burn_nft` di smart contract
      tx.moveCall({
        target: `${packageId}::simple_art_nft::burn_nft`,
        arguments: [
          tx.object(nftObjectId), // Argumennya hanya objek NFT itu sendiri
        ],
      });

      // Menandatangani dan mengirim transaksi
      return signAndExecute({
        transaction: tx,
      });
    },

    // Callback saat transaksi berhasil
    onSuccess: () => {
      toast.success("NFT has been burned!", { id: "burn-nft" });
      // Me-refresh data NFT pengguna agar UI terupdate
      queryClient.refetchQueries({ queryKey: ["getUserNFT"] });
    },

    // Callback saat terjadi error
    onError: (error: Error) => {
      toast.error(error.message, { id: "burn-nft" });
    },

    // Callback yang dieksekusi tepat sebelum mutationFn
    onMutate: () => {
      toast.loading("Burning NFT...", { id: "burn-nft" });
    },
  });

  return mutation;
}