// src/components/CollectionCard.tsx
import { Link } from "react-router-dom";
import { useGetCollectionInfo } from "../hooks/use-get-collection-info";
import { formatSUI } from "../lib/utils";
import { Badge } from "@/components/ui/badge";
import { useGetUserNFTWithDynamicFields } from "./nft-grid";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Definisikan tipe untuk props komponen
interface CollectionCardProps {
    collectionId: string;
}

export function CollectionCard({ collectionId }: CollectionCardProps) {
    // Setiap kartu akan memanggil hook ini dengan ID-nya sendiri
    const [collectionInfo] = useGetCollectionInfo(collectionId);
    const [allNFTs] = useGetUserNFTWithDynamicFields();
    const [filteredNFTs, setFilteredNFTs] = useState<any[]>([]);
    const [currentNFTIndex, setCurrentNFTIndex] = useState(0);
    const [loading, setLoading] = useState(false);

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

    // Auto-rotate carousel
    useEffect(() => {
        if (filteredNFTs.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentNFTIndex((prev) => (prev + 1) % filteredNFTs.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [filteredNFTs.length]);

    const nextNFT = () => {
        if (filteredNFTs.length > 1) {
            setCurrentNFTIndex((prev) => (prev + 1) % filteredNFTs.length);
        }
    };

    const prevNFT = () => {
        if (filteredNFTs.length > 1) {
            setCurrentNFTIndex((prev) => (prev - 1 + filteredNFTs.length) % filteredNFTs.length);
        }
    };

    // Tampilkan skeleton/loading state selagi data diambil
    if (!collectionInfo) {
        return (
            <div className="border-amber-300 bg-amber-100/60 border rounded-2xl p-6 animate-pulse backdrop-blur-sm shadow-lg">
                <div className="h-7 bg-amber-200/60 rounded w-3/4 mb-4"></div>
                <div className="aspect-video bg-amber-200/50 rounded-xl mb-6"></div>
                <div className="h-5 bg-amber-200/60 rounded w-full mb-2"></div>
                <div className="h-5 bg-amber-200/60 rounded w-5/6"></div>
            </div>
        );
    }

    const currentNFT = filteredNFTs[currentNFTIndex];
    const content = currentNFT?.data?.content;
    const fields = content?.fields;

    // Setelah data siap, tampilkan kartu dengan informasi yang benar
    return (
        <Link to={`/collection/${collectionId}`}>
            <div
                key={collectionId}
                className="border-amber-300/60 ring-2 ring-amber-300/30 bg-amber-100/70 backdrop-blur-sm border rounded-2xl p-6 hover:border-amber-400/80 hover:ring-amber-400/40 hover:bg-amber-100/90 transition-all duration-300 hover:scale-105 cursor-pointer group h-full flex flex-col shadow-lg hover:shadow-xl"
            >

                <div className="aspect-video bg-gradient-to-br from-amber-200/70 via-orange-200/50 to-yellow-200/60 rounded-xl mb-6 relative overflow-hidden">
                    {/* NFT Image Carousel */}
                    {filteredNFTs.length > 0 ? (
                        <>
                            <img
                                src={fields?.image_url || "/placeholder.png"}
                                alt={fields?.name || "NFT"}
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                                className="w-full h-full object-cover transition-opacity duration-500"
                            />
                            
                            {/* Carousel Controls */}
                            {filteredNFTs.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            prevNFT();
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber-900/70 hover:bg-amber-900/90 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            nextNFT();
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber-900/70 hover:bg-amber-900/90 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                    
                                    {/* Carousel Indicators */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                        {filteredNFTs.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    index === currentNFTIndex
                                                        ? 'bg-white shadow-lg'
                                                        : 'bg-white/50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {/* NFT Info Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h4 className="text-white font-semibold text-sm truncate">
                                        {fields?.name || "Unnamed NFT"}
                                    </h4>
                                    <p className="text-amber-100 text-xs truncate">
                                        {fields?.description || "No description"}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-amber-900/80 font-semibold">
                            {loading ? "Loading NFTs..." : "No NFTs in Collection"}
                        </div>
                    )}
                    
                    {/* Live Mint Badge */}
                    {collectionInfo.isActive && (
                        <Badge className="absolute top-3 left-3 z-30 w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg"/>
                    )}
                </div>

                <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-amber-950 mb-3 group-hover:text-amber-800 transition-colors drop-shadow-sm">
                        {collectionInfo.name}
                    </h3>
                    <p className="text-amber-800/90 text-sm leading-relaxed mb-4 font-medium">
                        {collectionInfo.description}
                    </p>
                </div>

                <div className="flex justify-between items-center text-sm mt-auto">
                    <div className="text-amber-800 font-medium">
                        <span className="font-semibold">Floor:</span>{" "}
                        <span className="text-amber-950 font-bold">
                            {formatSUI(collectionInfo.mintPrice)} SUI
                        </span>
                    </div>
                    <div className="text-amber-800 font-medium">
                        <span className="font-semibold">Supply:</span>{" "}
                        <span className="text-amber-950 font-bold">
                            {collectionInfo.totalSupply}/{collectionInfo.maxSupply}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}