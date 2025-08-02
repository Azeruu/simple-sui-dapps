// src/pages/HomePage.tsx

import { useNetworkVariable } from '../networkConfig';
import { CollectionCard } from '../components/collection-card';
import { motion } from 'framer-motion'; // Import motion

export function HomePage() {
    const collections = useNetworkVariable("collectionId");

    return (
        // Bungkus dengan motion.div untuk animasi
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="text-center py-20 pb-10">
                <h2 className="text-4xl font-bold text-amber-900 py-4 drop-shadow-sm">Choose Your Collection</h2>
                <p className="text-amber-800 text-lg font-medium">Select from our exclusive NFT collections</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 px-4 sm:px-10 md:px-20 py-5 -mt-10">
                {Object.entries(collections).map(([_,id]) => (
                    <CollectionCard key={id} collectionId={id} />
                ))}
            </div>
        </motion.div>
    );
}

export default HomePage;