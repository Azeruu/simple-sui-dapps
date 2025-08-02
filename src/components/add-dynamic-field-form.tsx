import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAddNFTDynamicFields } from '../hooks/use-add-dynamic-field';
import { useNetworkVariable } from '../networkConfig';
import { Plus, Sparkles, Zap, Star, Crown, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddDynamicFieldFormProps {
  nftId: string;
  nftName?: string;
}

export function AddDynamicFieldForm({ nftId, nftName }: AddDynamicFieldFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fieldType, setFieldType] = useState<'string' | 'number' | 'boolean'>('string');
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('');

  const packageId = useNetworkVariable('simpleArtNFT');
  const { 
    addStringField, 
    addNumberField, 
    addBooleanField,
    addRarityField,
    addLevelField,
    addPowerField,
    isLoading 
  } = useAddNFTDynamicFields();

  const presetFields = [
    {
      name: 'Rarity',
      key: 'rarity',
      type: 'string',
      options: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
      icon: <Star className="w-4 h-4" />,
      color: 'bg-yellow-500/20 text-yellow-700'
    },
    {
      name: 'Level',
      key: 'level',
      type: 'number',
      min: 1,
      max: 100,
      icon: <Zap className="w-4 h-4" />,
      color: 'bg-blue-500/20 text-blue-700'
    },
    {
      name: 'Power',
      key: 'power',
      type: 'number',
      min: 1,
      max: 1000,
      icon: <Shield className="w-4 h-4" />,
      color: 'bg-red-500/20 text-red-700'
    },
    {
      name: 'Special',
      key: 'special',
      type: 'boolean',
      icon: <Crown className="w-4 h-4" />,
      color: 'bg-purple-500/20 text-purple-700'
    }
  ];

  const handlePresetField = (preset: typeof presetFields[0]) => {
    if (preset.type === 'string' && preset.options) {
      // For rarity, use the first option as default
      addRarityField(nftId, preset.options[0], packageId);
    } else if (preset.type === 'number') {
      // For level/power, use min value as default
      const defaultValue = preset.min || 1;
      if (preset.key === 'level') {
        addLevelField(nftId, defaultValue, packageId);
      } else if (preset.key === 'power') {
        addPowerField(nftId, defaultValue, packageId);
      }
    } else if (preset.type === 'boolean') {
      addBooleanField(nftId, preset.key, false, packageId);
    }
    
    toast.success(`${preset.name} field added to NFT!`);
  };

  const handleCustomField = () => {
    if (!customKey.trim() || !customValue.trim()) {
      toast.error('Please fill in both key and value');
      return;
    }

    if (fieldType === 'string') {
      addStringField(nftId, customKey, customValue, packageId);
    } else if (fieldType === 'number') {
      const numValue = parseFloat(customValue);
      if (isNaN(numValue)) {
        toast.error('Please enter a valid number');
        return;
      }
      addNumberField(nftId, customKey, numValue, packageId);
    } else if (fieldType === 'boolean') {
      const boolValue = customValue.toLowerCase() === 'true';
      addBooleanField(nftId, customKey, boolValue, packageId);
    }

    setCustomKey('');
    setCustomValue('');
    toast.success(`Custom field "${customKey}" added successfully!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-gradient-to-r from-amber-100/80 to-orange-100/60 border-amber-300/50 hover:from-amber-200/80 hover:to-orange-200/60 text-amber-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Dynamic Field
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gradient-to-br from-amber-50/90 to-orange-50/80 backdrop-blur-md border border-amber-300/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-900 font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Add Dynamic Field to NFT
          </DialogTitle>
          {nftName && (
            <p className="text-amber-700 text-sm">NFT: {nftName}</p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset Fields */}
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-3">Quick Add Fields</h3>
            <div className="grid grid-cols-2 gap-2">
              {presetFields.map((preset) => (
                <Button
                  key={preset.key}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetField(preset)}
                  disabled={isLoading}
                  className={`${preset.color} border-current hover:opacity-80 transition-all`}
                >
                  {preset.icon}
                  <span className="ml-1">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Field */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-amber-900">Custom Field</h3>
            
            <div className="space-y-3">
              <Input
                placeholder="Field name (e.g., 'color', 'size')"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="bg-white/50 border-amber-300/50 focus:border-amber-500"
              />
              
              <Select value={fieldType} onValueChange={(value: any) => setFieldType(value)}>
                <SelectTrigger className="bg-white/50 border-amber-300/50">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">True/False</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder={
                  fieldType === 'string' ? 'Enter text value' :
                  fieldType === 'number' ? 'Enter number value' :
                  'Enter true or false'
                }
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="bg-white/50 border-amber-300/50 focus:border-amber-500"
              />

              <Button
                onClick={handleCustomField}
                disabled={isLoading || !customKey.trim() || !customValue.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {isLoading ? 'Adding...' : 'Add Custom Field'}
              </Button>
            </div>
          </div>

          {/* Info */}
          <Card className="bg-amber-100/50 border-amber-300/30 p-3">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> Only the NFT creator can add dynamic fields. 
              These fields will be permanently stored on the blockchain.
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 