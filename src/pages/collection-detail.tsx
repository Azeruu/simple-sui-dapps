import { useGetCollectionInfo } from "../hooks/use-get-collection-info";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Zap,
  Eye,
  Home,
  Clock,
  Sparkles,
  PlusCircle, // <-- 1. Icon baru diimpor
} from "lucide-react";
import { MintSection } from "../components/mint-section";
import { NFTGrid } from "../components/nft-grid";
import { formatSUI } from "../lib/utils";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";

export function CollectionDetail() {
  // Mendapatkan ID dari URL params
  const { id } = useParams();
  const selectedCollectionId = id as string;

  const [collectionInfo] = useGetCollectionInfo(selectedCollectionId);

  if (!collectionInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-amber-100/80 backdrop-blur-md rounded-2xl p-8 border border-amber-300/50 shadow-lg"
        >
          <div className="text-xl text-amber-900 mb-4 font-semibold">
            Collection not found
          </div>
          <Link
            to="/"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Back to Collections
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen py-20 pb-10">
        {/* Back button */}
        <motion.div
          className="mb-8 ml-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-amber-100/70 backdrop-blur-md hover:bg-amber-100/90 text-amber-900 hover:text-amber-800 px-6 py-3 rounded-xl transition-all duration-300 border border-amber-300/50 hover:border-amber-400/60 shadow-lg hover:shadow-xl font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Collections
          </Link>
        </motion.div>
        {/* end back button */}
        <div className="max-w-7xl mx-auto px-4 py-8 bg-amber-100 rounded-2xl">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Collection Banner - Enhanced with 3D effects */}
            <motion.div
              className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 flex items-center justify-center shadow-2xl border-4 border-amber-200/50 overflow-hidden group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>

              {/* Icon dengan efek glow */}
              <div className="relative z-10">
                <Sparkles className="w-16 h-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Floating Elements */}
              <div className="absolute top-3 right-3 w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
              <div className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse"></div>
            </motion.div>

            <div className="flex-1">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 bg-clip-text text-transparent drop-shadow-sm leading-tight">
                    {collectionInfo.name}
                  </h1>
                  {collectionInfo.isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.6,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full animate-pulse shadow-lg font-semibold">
                        <Clock className="w-4 h-4 mr-2" />
                        Live Mint
                      </Badge>
                    </motion.div>
                  )}
                </div>
                <p className="text-amber-800 mb-4 text-lg font-medium">
                  Created by{" "}
                  <span className="text-amber-900 font-semibold bg-gradient-to-r from-amber-200/60 to-orange-200/60 px-3 py-1.5 rounded-xl shadow-sm">
                    {collectionInfo.creator}
                  </span>
                </p>
                <p className="text-amber-800/90 mb-8 max-w-3xl text-xl leading-relaxed font-medium">
                  {collectionInfo.description}
                </p>
              </motion.div>

              {/* Stats Section Header */}
            </div>
          </div>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-amber-900 mb-2">
              Collection Statistics
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
          </motion.div>

          {/* Stats Grid - Enhanced with modern effects */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              {
                label: "Floor",
                value: "1.2 SUI",
                icon: <TrendingUp className="w-5 h-5 text-green-600" />,
                bgColor: "bg-green-500/20",
                delay: 0.1,
              },
              {
                label: "Owners",
                value: "3,247",
                icon: <Users className="w-5 h-5 text-blue-600" />,
                bgColor: "bg-blue-500/20",
                delay: 0.2,
              },
              {
                label: "Volume",
                value: "1,234 SUI",
                icon: <Zap className="w-5 h-5 text-yellow-600" />,
                bgColor: "bg-yellow-500/20",
                delay: 0.3,
              },
              {
                label: "Supply",
                value: `${collectionInfo.totalSupply.toLocaleString()}/${collectionInfo.maxSupply.toLocaleString()}`,
                icon: <Eye className="w-5 h-5 text-orange-600" />,
                bgColor: "bg-orange-500/20",
                delay: 0.4,
              },
              {
                label: "Mint Price",
                value: `${formatSUI(collectionInfo.mintPrice)} SUI`,
                icon: <span className="text-2xl">💎</span>,
                bgColor: "bg-purple-500/20",
                delay: 0.5,
              },
              {
                label: "Status",
                value: collectionInfo.isActive ? "Minting" : "Sold Out",
                icon: <span className="text-2xl">⏰</span>,
                bgColor: "bg-teal-500/20",
                delay: 0.6,
                valueColor: collectionInfo.isActive
                  ? "text-green-600"
                  : "text-red-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group relative bg-gradient-to-br from-amber-100/80 to-orange-100/60 backdrop-blur-md border border-amber-300/40 rounded-2xl p-4 hover:from-amber-100/90 hover:to-orange-100/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + stat.delay }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-orange-400/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className={`p-2 bg-gradient-to-br from-amber-200/60 to-orange-200/60 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 ${stat.bgColor}`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-amber-700/80 text-xs font-medium uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div
                      className={`font-bold text-lg ${stat.valueColor || "text-amber-950"}`}
                    >
                      {stat.value}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mint Section - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <MintSection
              id={selectedCollectionId}
              collectionInfo={collectionInfo}
            />
          </motion.div>
          {/* end mint section */}
        </div>

        {/* NFT Grid Section */}
        <motion.div
          className="mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                Collection Items
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
            </div>
            <NFTGrid collectionId={selectedCollectionId} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CollectionDetail;
