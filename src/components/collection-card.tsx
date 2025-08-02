// src/components/CollectionCard.tsx
import { Link } from "react-router-dom";
import { useGetCollectionInfo } from "../hooks/use-get-collection-info";
import { formatSUI } from "../lib/utils";
import { Badge } from "@/components/ui/badge";

// Definisikan tipe untuk props komponen
interface CollectionCardProps {
    collectionId: string;
}

export function CollectionCard({ collectionId }: CollectionCardProps) {
    // Setiap kartu akan memanggil hook ini dengan ID-nya sendiri
    const [collectionInfo] = useGetCollectionInfo(collectionId);

    // Tampilkan skeleton/loading state selagi data diambil
    if (!collectionInfo) {
        return (
            <div className="border-blue-500/30 bg-slate-800/50 border rounded-2xl p-6 animate-pulse">
                <div className="h-7 bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="aspect-video bg-slate-700 rounded-xl mb-6"></div>
                <div className="h-5 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-5 bg-slate-700 rounded w-5/6"></div>
            </div>
        );
    }

    // Setelah data siap, tampilkan kartu dengan informasi yang benar
    return (
        <Link to={`/collection/${collectionId}`}>
            <div
                key={collectionId}
                className="border-blue-500 ring-2 ring-blue-500/30 bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer group h-full flex flex-col"
            >

                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl mb-6 relative overflow-hidden">
                    {/* Anda bisa menambahkan gambar koleksi di sini */}
                    {collectionInfo.isActive && (
                        <Badge className="absolute top-3 left-3 z-30 w-2 h-2 rounded-full bg-green-400 animate-pulse animate-pulse"/>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white/50">
                        Collection Cover
                    </div>
                </div>

                <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                        {collectionInfo.name}
                    </h3>
                    <p className="text-blue-300 text-sm leading-relaxed mb-4">
                        {collectionInfo.description}
                    </p>
                </div>

                <div className="flex justify-between items-center text-sm mt-auto">
                    <div className="text-blue-400">
                        <span className="font-medium">Floor:</span>{" "}
                        <span className="text-white">
                            {formatSUI(collectionInfo.mintPrice)} SUI
                        </span>
                    </div>
                    <div className="text-blue-400">
                        <span className="font-medium">Supply:</span>{" "}
                        <span className="text-white">
                            {collectionInfo.totalSupply}/{collectionInfo.maxSupply}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}