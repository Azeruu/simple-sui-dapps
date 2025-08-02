// src/pages/HomePage.tsx

import React from 'react';
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
                <h2 className="text-4xl font-bold text-white py-4">Choose Your Collection</h2>
                <p className="text-blue-300 text-lg">Select from our exclusive NFT collections</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 px-4 sm:px-10 md:px-20 py-5 -mt-10">
                {Object.entries(collections).map(([name, id]) => (
                    <CollectionCard key={id} collectionId={id} />
                ))}
            </div>
        </motion.div>
    );
}

export default HomePage;