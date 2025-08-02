import { useGetCollectionInfo } from "../hooks/use-get-collection-info";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Coins, Users, Zap, Eye, ChevronDown } from "lucide-react";
import { useNetworkVariable } from "../networkConfig";
import { MintSection } from "../components/mint-section";
import { NFTGrid } from "../components/nft-grid";
import { formatSUI } from "../lib/utils";
import React, { useState } from "react";
import { Navbar } from "../components/navbar";

export default function nftPage() {
    // Mengambil seluruh objek koleksi dari networkConfig
    const collections = useNetworkVariable("collectionId");

    // Membuat daftar nama dan ID untuk dropdown dan state
    const collectionNames = Object.keys(collections);
    const collectionIds = Object.values(collections);
    const collectionCount = Object.keys(collections).length;

    // Menginisialisasi state dengan ID koleksi pertama dari daftar. Ini cara yang aman.
    const [selectedCollectionId, setSelectedCollectionId] = useState(
        collectionIds[0],
    );

    // Mengambil info koleksi berdasarkan ID yang sedang dipilih dari state
    const [collectionInfo] = useGetCollectionInfo(selectedCollectionId);

    // Fungsi untuk mengubah state saat pengguna memilih koleksi lain
    const handleCollectionChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSelectedCollectionId(event.target.value);
    };

    // Tampilan loading jika data koleksi belum siap
    if (!collectionInfo) return <div>Loading Collection...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            <div className="bg-[#181825] border-b border-[#313244]">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#cba6f7] to-[#f38ba8] flex justify-center">
                            <span className="text-2xl font-bold text-[#11111b]"></span>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#cba6f7] to-[#f38ba8] bg-clip-text text-transparent">
                                    {collectionInfo.name}
                                </h1>

                                <div className="relative">
                                    <select
                                        value={selectedCollectionId}
                                        onChange={handleCollectionChange}
                                        className="appearance-none bg-[#313244] border border-[#45475a] text-white text-sm rounded-lg focus:ring-[#89b4fa] focus:border-[#89b4fa] block w-full p-2.5 pr-8 cursor-pointer"
                                    >
                                        {Object.entries(collections).map(([name, id]) => (
                                            <option key={id} value={id}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
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
                            <p className="text-[#bac2de] mb-4 max-w-2xl">
                                {collectionInfo.description}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                                {/* Menambahkan kembali card info yang hilang */}
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

                            <MintSection id={selectedCollectionId} collectionInfo={collectionInfo} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto px-4 py-6">
                <NFTGrid collectionId={selectedCollectionId} />
            </div>
        </div>
    );
}