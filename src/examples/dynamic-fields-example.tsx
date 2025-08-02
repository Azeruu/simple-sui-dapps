import React from 'react';
import { useAddNFTDynamicFields } from '../hooks/use-add-dynamic-field';
import { useNetworkVariable } from '../networkConfig';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star, Zap, Shield, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

export function DynamicFieldsExample() {
  const packageId = useNetworkVariable('simpleArtNFT');
  const { 
    addStringField, 
    addNumberField, 
    addBooleanField,
    addRarityField,
    addLevelField,
    addPowerField,
    addCustomAttribute,
    isLoading 
  } = useAddNFTDynamicFields();

  // Contoh NFT ID (ganti dengan ID NFT yang sebenarnya)
  const exampleNFTId = "0x1234567890abcdef";

  const handleAddGamingAttributes = async () => {
    try {
      // Menambahkan atribut karakter game
      await addStringField(exampleNFTId, 'character_class', 'Warrior', packageId);
      await addNumberField(exampleNFTId, 'level', 50, packageId);
      await addNumberField(exampleNFTId, 'strength', 85, packageId);
      await addNumberField(exampleNFTId, 'agility', 70, packageId);
      await addNumberField(exampleNFTId, 'intelligence', 45, packageId);
      await addStringField(exampleNFTId, 'weapon', 'Dragon Sword', packageId);
      await addBooleanField(exampleNFTId, 'legendary', true, packageId);
      
      toast.success('Gaming attributes added successfully!');
    } catch (error) {
      toast.error('Failed to add gaming attributes');
      console.error(error);
    }
  };

  const handleAddArtMetadata = async () => {
    try {
      // Menambahkan metadata seni
      await addStringField(exampleNFTId, 'artist', 'Vincent van Gogh', packageId);
      await addStringField(exampleNFTId, 'style', 'Impressionism', packageId);
      await addStringField(exampleNFTId, 'medium', 'Oil on Canvas', packageId);
      await addNumberField(exampleNFTId, 'year_created', 1889, packageId);
      await addStringField(exampleNFTId, 'dimensions', '73.7 x 92.1 cm', packageId);
      await addBooleanField(exampleNFTId, 'authenticated', true, packageId);
      
      toast.success('Art metadata added successfully!');
    } catch (error) {
      toast.error('Failed to add art metadata');
      console.error(error);
    }
  };

  const handleAddPresetFields = async () => {
    try {
      // Menggunakan preset fields
      await addRarityField(exampleNFTId, 'Legendary', packageId);
      await addLevelField(exampleNFTId, 100, packageId);
      await addPowerField(exampleNFTId, 1000, packageId);
      
      toast.success('Preset fields added successfully!');
    } catch (error) {
      toast.error('Failed to add preset fields');
      console.error(error);
    }
  };

  const handleAddCustomField = async () => {
    try {
      // Menambahkan field kustom
      await addCustomAttribute(exampleNFTId, 'color', 'blue', packageId);
      await addCustomAttribute(exampleNFTId, 'size', 'large', packageId);
      await addCustomAttribute(exampleNFTId, 'material', 'gold', packageId);
      
      toast.success('Custom fields added successfully!');
    } catch (error) {
      toast.error('Failed to add custom fields');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-4">
          Dynamic Fields Example
        </h1>
        <p className="text-amber-700">
          Demonstrasi penggunaan function add_dynamic_field untuk menambahkan metadata ke NFT
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gaming NFT Example */}
        <Card className="bg-gradient-to-br from-amber-100/80 to-orange-100/60 border border-amber-300/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-amber-900">Gaming NFT</h2>
          </div>
          
          <div className="space-y-3 mb-4">
            <Badge className="bg-blue-500/20 text-blue-700">Character Class: Warrior</Badge>
            <Badge className="bg-green-500/20 text-green-700">Level: 50</Badge>
            <Badge className="bg-red-500/20 text-red-700">Strength: 85</Badge>
            <Badge className="bg-purple-500/20 text-purple-700">Weapon: Dragon Sword</Badge>
            <Badge className="bg-yellow-500/20 text-yellow-700">Legendary: Yes</Badge>
          </div>

          <Button 
            onClick={handleAddGamingAttributes}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            {isLoading ? 'Adding...' : 'Add Gaming Attributes'}
          </Button>
        </Card>

        {/* Art NFT Example */}
        <Card className="bg-gradient-to-br from-amber-100/80 to-orange-100/60 border border-amber-300/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-bold text-amber-900">Art NFT</h2>
          </div>
          
          <div className="space-y-3 mb-4">
            <Badge className="bg-yellow-500/20 text-yellow-700">Artist: Vincent van Gogh</Badge>
            <Badge className="bg-green-500/20 text-green-700">Style: Impressionism</Badge>
            <Badge className="bg-blue-500/20 text-blue-700">Medium: Oil on Canvas</Badge>
            <Badge className="bg-purple-500/20 text-purple-700">Year: 1889</Badge>
            <Badge className="bg-red-500/20 text-red-700">Authenticated: Yes</Badge>
          </div>

          <Button 
            onClick={handleAddArtMetadata}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
          >
            {isLoading ? 'Adding...' : 'Add Art Metadata'}
          </Button>
        </Card>

        {/* Preset Fields Example */}
        <Card className="bg-gradient-to-br from-amber-100/80 to-orange-100/60 border border-amber-300/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-amber-900">Preset Fields</h2>
          </div>
          
          <div className="space-y-3 mb-4">
            <Badge className="bg-yellow-500/20 text-yellow-700">Rarity: Legendary</Badge>
            <Badge className="bg-blue-500/20 text-blue-700">Level: 100</Badge>
            <Badge className="bg-red-500/20 text-red-700">Power: 1000</Badge>
          </div>

          <Button 
            onClick={handleAddPresetFields}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
          >
            {isLoading ? 'Adding...' : 'Add Preset Fields'}
          </Button>
        </Card>

        {/* Custom Fields Example */}
        <Card className="bg-gradient-to-br from-amber-100/80 to-orange-100/60 border border-amber-300/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold text-amber-900">Custom Fields</h2>
          </div>
          
          <div className="space-y-3 mb-4">
            <Badge className="bg-blue-500/20 text-blue-700">Color: Blue</Badge>
            <Badge className="bg-green-500/20 text-green-700">Size: Large</Badge>
            <Badge className="bg-yellow-500/20 text-yellow-700">Material: Gold</Badge>
          </div>

          <Button 
            onClick={handleAddCustomField}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
          >
            {isLoading ? 'Adding...' : 'Add Custom Fields'}
          </Button>
        </Card>
      </div>

      <Card className="bg-amber-100/50 border-amber-300/30 p-4">
        <h3 className="font-bold text-amber-900 mb-2">📝 Instructions:</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Ganti <code className="bg-amber-200/50 px-1 rounded">exampleNFTId</code> dengan ID NFT yang sebenarnya</li>
          <li>• Pastikan wallet terhubung dan Anda adalah creator NFT</li>
          <li>• Setiap field akan disimpan permanen di blockchain</li>
          <li>• Hanya creator NFT yang dapat menambahkan dynamic fields</li>
        </ul>
      </Card>
    </div>
  );
} 