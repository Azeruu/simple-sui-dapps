import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        // TODO: Update with your deployed contract address
        simpleArtNFT: "0x0",
        collectionId: "0x0",
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        // replacce with your deployed contract address
        simpleArtNFT:
          "0xae083b73070b61fcef93d0d54b92144ebe2b290fce848181e584825c962e19a9",
        // replacce with your collection id
        collectionId: {
        "Cat Meme": "0x05247649aed9d51dc73267bef59d6191d85fa0c7fe76f7e512685421e022eacb",
        "onepiece": "0x413e213a73e3d79535a1b0125e5c9cf49738bd2a06368b50bd8d252aeb7a0861",
        },
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        // TODO: Update with your deployed contract address
        simpleArtNFT: "0x0",
        collectionId: "0x0",
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };