import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface AddDynamicFieldParams {
  nftId: string;
  key: string;
  value: any; // Can be string, number, boolean, etc.
  packageId: string;
  moduleName?: string;
}

export function useAddDynamicField() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();

  const addDynamicField = useMutation({
    mutationFn: async ({
      nftId,
      key,
      value,
      packageId,
      moduleName = 'simple_art_nft'
    }: AddDynamicFieldParams) => {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }

      const tx = new Transaction();

      // Call the add_dynamic_field function
      tx.moveCall({
        target: `${packageId}::${moduleName}::add_dynamic_field`,
        arguments: [
          tx.object(nftId), // NFT object
          tx.pure("string", key), // Key as string
          tx.pure("string", value.toString()), // Value as string
        ],
      });

      const result = await signAndExecute({
        transaction: tx,
      });

      return result;
    },
    onSuccess: (data) => {
      toast.success('Dynamic field added successfully!');
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['getUserNFTs'] });
      queryClient.invalidateQueries({ queryKey: ['getNFTDynamicFields'] });
      
      console.log('Dynamic field added:', data);
    },
    onError: (error) => {
      toast.error(`Failed to add dynamic field: ${error.message}`);
      console.error('Error adding dynamic field:', error);
    },
  });

  return {
    addDynamicField: addDynamicField.mutate,
    addDynamicFieldAsync: addDynamicField.mutateAsync,
    isLoading: addDynamicField.isPending,
    error: addDynamicField.error,
    isSuccess: addDynamicField.isSuccess,
  };
}

// Hook untuk menambahkan berbagai jenis dynamic fields
export function useAddNFTDynamicFields() {
  const { addDynamicField, isLoading, error } = useAddDynamicField();

  const addStringField = (nftId: string, key: string, value: string, packageId: string) => {
    addDynamicField({ nftId, key, value, packageId });
  };

  const addNumberField = (nftId: string, key: string, value: number, packageId: string) => {
    addDynamicField({ nftId, key, value, packageId });
  };

  const addBooleanField = (nftId: string, key: string, value: boolean, packageId: string) => {
    addDynamicField({ nftId, key, value, packageId });
  };

  const addRarityField = (nftId: string, rarity: string, packageId: string) => {
    addDynamicField({ nftId, key: 'rarity', value: rarity, packageId });
  };

  const addLevelField = (nftId: string, level: number, packageId: string) => {
    addDynamicField({ nftId, key: 'level', value: level, packageId });
  };

  const addPowerField = (nftId: string, power: number, packageId: string) => {
    addDynamicField({ nftId, key: 'power', value: power, packageId });
  };

  const addCustomAttribute = (nftId: string, attributeName: string, attributeValue: string, packageId: string) => {
    addDynamicField({ nftId, key: attributeName, value: attributeValue, packageId });
  };

  return {
    addStringField,
    addNumberField,
    addBooleanField,
    addRarityField,
    addLevelField,
    addPowerField,
    addCustomAttribute,
    isLoading,
    error,
  };
} 