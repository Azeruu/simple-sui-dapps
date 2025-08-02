import { ConnectButton } from "@mysten/dapp-kit";
import { useGetCollectionInfo } from "../hooks/use-get-collection-info";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Zap, Eye, Home } from "lucide-react";
import { useNetworkVariable } from "../networkConfig";
import { MintSection } from "../components/mint-section";
import { NFTGrid } from "../components/nft-grid";
import { formatSUI } from "../lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';

export function CollectionDetail() {
    // Mendapatkan ID dari URL params
    const { id } = useParams();
    const selectedCollectionId = id as string;
    // const navigate = useNavigate();

    // const collectionID = useNetworkVariable("collectionId");
    // const collectionIds = Object.values(collectionID);

    // Menggunakan ID dari params sebagai selectedCollectionId
    // const [selectedCollectionId, setSelectedCollectionId] = useState(id);
    const [collectionInfo] = useGetCollectionInfo(selectedCollectionId);


    if (!collectionInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl text-[#bac2de] mb-4">Collection not found</div>
                    <Link
                        to="/"
                        className="bg-[#89b4fa] hover:bg-[#74c7ec] text-[#11111b] px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Collections
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div>
            <div className="min-h-screen py-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Back button */}
                    <div className="mb-6">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-[#313244] hover:bg-[#45475a] text-[#bac2de] px-4 py-2 rounded-lg transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Back to Collections
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Collection Banner */}
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#cba6f7] to-[#f38ba8] flex justify-center">
                            <img src="" alt="ini banner" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#cba6f7] to-[#f38ba8] bg-clip-text text-transparent">
                                    {collectionInfo.name}
                                </h1>
                                {collectionInfo.isActive && (
                                    <Badge className="bg-[#a6e3a1] text-[#11111b] animate-pulse">
                                        Live Mint
                                    </Badge>
                                )}
                            </div>
                            <p className="text-[#bac2de] mb-2">
                                Created by{" "}
                                <span className="text-[#89b4fa] font-semibold">
                                    {collectionInfo.creator}
                                </span>
                            </p>
                            <p className="text-[#6c7086] text-sm mb-2">
                                Collection ID: {selectedCollectionId}
                            </p>
                            <p className="text-[#bac2de] mb-4 max-w-2xl">
                                {collectionInfo.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                                <div className="flex items-center gap-2 bg-[#313244] px-3 py-2 rounded-lg">
                                    <TrendingUp className="w-4 h-4 text-[#a6e3a1]" />
                                    <div className="text-sm">
                                        <div className="text-[#6c7086]">Floor</div>
                                        <div className="font-semibold">1.2 SUI</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#313244] px-3 py-2 rounded-lg">
                                    <Users className="w-4 h-4 text-[#89b4fa]" />
                                    <div className="text-sm">
                                        <div className="text-[#6c7086]">Owners</div>
                                        <div className="font-semibold">3,247</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#313244] px-3 py-2 rounded-lg">
                                    <Zap className="w-4 h-4 text-[#f9e2af]" />
                                    <div className="text-sm">
                                        <div className="text-[#6c7086]">Volume</div>
                                        <div className="font-semibold">1,234 SUI</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#313244] px-3 py-2 rounded-lg">
                                    <Eye className="w-4 h-4 text-[#fab387]" />
                                    <div className="text-sm">
                                        <div className="text-[#6c7086]">Supply</div>
                                        <div className="font-semibold">
                                            {collectionInfo.totalSupply.toLocaleString()}/
                                            {collectionInfo.maxSupply.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#313244] px-3 py-2 rounded-lg">
                                    <span className="w-4 h-4 text-[#f38ba8]">💎</span>
                                    <div className="text-sm">
                                        <div className="text-[#6c7086]">Mint Price</div>
                                        <div className="font-semibold">
                                            {formatSUI(collectionInfo.mintPrice)} SUI
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#313244] px-3 py-2 rounded-lg">
                                    <span className="w-4 h-4 text-[#94e2d5]">⏰</span>
                                    <div className="text-sm">
                                        <div className="text-[#6c7086]">Status</div>
                                        <div className="font-semibold text-[#a6e3a1]">
                                            {collectionInfo.isActive ? "Minting" : "Sold Out"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mint Section - menggunakan selectedCollectionId */}
                            <MintSection id={selectedCollectionId} collectionInfo={collectionInfo} />
                        </div>
                    </div>
                </div>

                {/* NFT Grid - menampilkan NFT dari collection yang dipilih */}
                <div className="mx-auto px-4 py-6">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold text-[#cdd6f4] mb-6">Collection Items</h2>
                        <NFTGrid collectionId={selectedCollectionId} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CollectionDetail;