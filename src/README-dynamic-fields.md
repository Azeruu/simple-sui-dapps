# 🚀 Dynamic Fields Implementation Guide

## 📋 Overview

Implementasi lengkap untuk menggunakan function `add_dynamic_field` dari smart contract Move. Fitur ini memungkinkan creator NFT untuk menambahkan metadata dinamis ke NFT mereka.

## 📁 Files yang Dibuat

### 1. **Hooks**
- `hooks/use-add-dynamic-field.ts` - Hook utama untuk menambahkan dynamic fields
- `hooks/use-get-user-nft.ts` - Hook untuk membaca dynamic fields (sudah ada, ditambahkan function baru)

### 2. **Components**
- `components/add-dynamic-field-form.tsx` - Form UI untuk menambahkan fields
- `components/nft-card-with-dynamic-fields.tsx` - Enhanced NFT card dengan dynamic fields display

### 3. **Documentation & Examples**
- `docs/dynamic-fields-guide.md` - Dokumentasi lengkap
- `examples/dynamic-fields-example.tsx` - Contoh penggunaan

## 🔧 Cara Penggunaan

### **1. Basic Usage**

```typescript
import { useAddNFTDynamicFields } from '../hooks/use-add-dynamic-field';
import { useNetworkVariable } from '../networkConfig';

function MyComponent() {
  const packageId = useNetworkVariable('simpleArtNFT');
  const { addStringField, addNumberField, addBooleanField } = useAddNFTDynamicFields();
  
  const handleAddField = () => {
    // Menambahkan field string
    addStringField(nftId, 'color', 'blue', packageId);
    
    // Menambahkan field number
    addNumberField(nftId, 'level', 10, packageId);
    
    // Menambahkan field boolean
    addBooleanField(nftId, 'special', true, packageId);
  };
}
```

### **2. Preset Fields**

```typescript
const { addRarityField, addLevelField, addPowerField } = useAddNFTDynamicFields();

// Quick add common fields
addRarityField(nftId, 'Legendary', packageId);
addLevelField(nftId, 50, packageId);
addPowerField(nftId, 1000, packageId);
```

### **3. UI Component**

```typescript
import { AddDynamicFieldForm } from '../components/add-dynamic-field-form';

function NFTCard({ nft }) {
  return (
    <div>
      <h3>{nft.name}</h3>
      <AddDynamicFieldForm 
        nftId={nft.objectId} 
        nftName={nft.name}
      />
    </div>
  );
}
```

### **4. Enhanced NFT Card**

```typescript
import { NFTCardWithDynamicFields } from '../components/nft-card-with-dynamic-fields';

function NFTGrid({ nfts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {nfts.map(nft => (
        <NFTCardWithDynamicFields 
          key={nft.objectId}
          nft={nft}
          onBurn={handleBurnNFT}
        />
      ))}
    </div>
  );
}
```

## 📊 Jenis Data yang Didukung

### **String Fields**
```typescript
addStringField(nftId, 'color', 'red', packageId);
addStringField(nftId, 'weapon_type', 'sword', packageId);
addStringField(nftId, 'element', 'fire', packageId);
```

### **Number Fields**
```typescript
addNumberField(nftId, 'level', 25, packageId);
addNumberField(nftId, 'power', 1500, packageId);
addNumberField(nftId, 'health', 100, packageId);
```

### **Boolean Fields**
```typescript
addBooleanField(nftId, 'special', true, packageId);
addBooleanField(nftId, 'limited_edition', false, packageId);
addBooleanField(nftId, 'exclusive', true, packageId);
```

## 🎨 Contoh Implementasi Lengkap

### **Gaming NFT Example**
```typescript
const addGameAttributes = () => {
  addStringField(nftId, 'character_class', 'Warrior', packageId);
  addNumberField(nftId, 'level', 50, packageId);
  addNumberField(nftId, 'strength', 85, packageId);
  addNumberField(nftId, 'agility', 70, packageId);
  addNumberField(nftId, 'intelligence', 45, packageId);
  addStringField(nftId, 'weapon', 'Dragon Sword', packageId);
  addBooleanField(nftId, 'legendary', true, packageId);
};
```

### **Art NFT Example**
```typescript
const addArtMetadata = () => {
  addStringField(nftId, 'artist', 'Vincent van Gogh', packageId);
  addStringField(nftId, 'style', 'Impressionism', packageId);
  addStringField(nftId, 'medium', 'Oil on Canvas', packageId);
  addNumberField(nftId, 'year_created', 1889, packageId);
  addStringField(nftId, 'dimensions', '73.7 x 92.1 cm', packageId);
  addBooleanField(nftId, 'authenticated', true, packageId);
};
```

## 🔍 Membaca Dynamic Fields

### **Menggunakan Hook**
```typescript
import { useGetNFTDynamicFields } from '../hooks/use-get-user-nft';

function NFTDetails({ nftId }) {
  const [fieldsData] = useGetNFTDynamicFields(nftId);
  
  useEffect(() => {
    if (fieldsData?.data) {
      const fields = fieldsData.data.map(field => ({
        name: field.name,
        value: field.value,
        type: field.type
      }));
      console.log('Dynamic fields:', fields);
    }
  }, [fieldsData]);
}
```

### **Direct RPC Call**
```typescript
const getDynamicFields = async (nftId: string) => {
  const response = await fetch('https://fullnode.testnet.sui.io/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'suix_getDynamicFields',
      params: [nftId]
    })
  });
  
  const result = await response.json();
  return result.result?.data || [];
};
```

## ⚠️ Batasan dan Persyaratan

### **Authorization**
- Hanya **creator NFT** yang dapat menambahkan dynamic fields
- Function akan gagal jika dipanggil oleh non-creator

### **Data Types**
- Field key harus berupa string
- Field value akan dikonversi ke string untuk kompatibilitas
- Supported types: String, Number, Boolean (dikonversi ke string)

### **Gas Costs**
- Setiap penambahan field memerlukan gas fee
- Semakin besar data, semakin tinggi gas cost

## 🎯 Best Practices

### **1. Naming Convention**
```typescript
// Gunakan snake_case untuk key names
addStringField(nftId, 'weapon_type', 'sword', packageId);
addStringField(nftId, 'character_class', 'warrior', packageId);
addNumberField(nftId, 'power_level', 100, packageId);
```

### **2. Error Handling**
```typescript
const { addStringField, error, isLoading } = useAddNFTDynamicFields();

useEffect(() => {
  if (error) {
    console.error('Failed to add dynamic field:', error);
    toast.error('Failed to add field. Please try again.');
  }
}, [error]);
```

### **3. Loading States**
```typescript
const { addStringField, isLoading } = useAddNFTDynamicFields();

<Button disabled={isLoading}>
  {isLoading ? 'Adding...' : 'Add Field'}
</Button>
```

## 🚀 Advanced Usage

### **Batch Operations**
```typescript
const addMultipleFields = async (nftId: string, fields: Array<{key: string, value: any}>) => {
  for (const field of fields) {
    await addStringField(nftId, field.key, field.value, packageId);
  }
};
```

### **Conditional Fields**
```typescript
const addConditionalFields = (nftId: string, rarity: string) => {
  addStringField(nftId, 'rarity', rarity, packageId);
  
  if (rarity === 'Legendary') {
    addBooleanField(nftId, 'special_effects', true, packageId);
    addNumberField(nftId, 'bonus_power', 500, packageId);
  }
};
```

## 📱 UI Integration

### **Form Component**
```typescript
<AddDynamicFieldForm 
  nftId={nft.objectId}
  nftName={nft.display?.name}
/>
```

### **Display Component**
```typescript
<NFTCardWithDynamicFields 
  nft={nft}
  onBurn={handleBurnNFT}
/>
```

## 🔧 Testing

### **Unit Test Example**
```typescript
describe('Dynamic Fields', () => {
  it('should add string field successfully', async () => {
    const { addStringField } = useAddNFTDynamicFields();
    
    await addStringField(nftId, 'test_field', 'test_value', packageId);
    
    // Verify field was added
    const fields = await getDynamicFields(nftId);
    expect(fields).toContainEqual({
      name: 'test_field',
      value: 'test_value'
    });
  });
});
```

## 🎨 Styling

Semua komponen menggunakan Tailwind CSS dengan tema pastel cream yang konsisten:

```css
/* Colors */
bg-amber-100/80 to-orange-100/60  /* Card backgrounds */
border-amber-300/50               /* Borders */
text-amber-900                    /* Text colors */
bg-gradient-to-r from-amber-500 to-orange-500  /* Buttons */
```

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Periksa console untuk error messages
2. Pastikan wallet terhubung dan Anda adalah creator NFT
3. Periksa gas balance untuk transaksi
4. Lihat dokumentasi lengkap di `docs/dynamic-fields-guide.md`

## 🔄 Updates

- **v1.0.0**: Initial implementation
- **v1.1.0**: Added preset fields and UI components
- **v1.2.0**: Added error handling and loading states
- **v1.3.0**: Added comprehensive documentation and examples

---

**Happy Coding! 🚀** 