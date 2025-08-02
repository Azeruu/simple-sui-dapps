# 🚀 Dynamic Fields Implementation Guide

## 📋 Overview

Function `add_dynamic_field` memungkinkan creator NFT untuk menambahkan field dinamis ke NFT mereka. Field ini disimpan secara permanen di blockchain dan dapat berisi berbagai jenis data.

## 🔧 Smart Contract Function

```move
/// Add dynamic field to NFT
public fun add_dynamic_field<T: store>(
    nft: &mut SimpleNFT,
    key: vector<u8>,
    value: T,
    ctx: &TxContext
) {
    assert!(tx_context::sender(ctx) == nft.creator, ENotAuthorized);
    df::add(&mut nft.id, key, value);
}
```

## 🎯 Cara Penggunaan

### 1. **Basic Usage dengan Hook**

```typescript
import { useAddNFTDynamicFields } from '../hooks/use-add-dynamic-field';

function MyComponent() {
  const { addStringField, addNumberField, addBooleanField, isLoading } = useAddNFTDynamicFields();
  
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

### 2. **Preset Fields**

```typescript
// Rarity field
addRarityField(nftId, 'Legendary', packageId);

// Level field
addLevelField(nftId, 50, packageId);

// Power field
addPowerField(nftId, 1000, packageId);

// Custom attribute
addCustomAttribute(nftId, 'weapon_type', 'sword', packageId);
```

### 3. **UI Component Usage**

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

## 📊 Jenis Data yang Didukung

### **String Fields**
```typescript
// Contoh: Color, Name, Description
addStringField(nftId, 'color', 'red', packageId);
addStringField(nftId, 'weapon_type', 'sword', packageId);
addStringField(nftId, 'element', 'fire', packageId);
```

### **Number Fields**
```typescript
// Contoh: Level, Power, Health, Attack
addNumberField(nftId, 'level', 25, packageId);
addNumberField(nftId, 'power', 1500, packageId);
addNumberField(nftId, 'health', 100, packageId);
```

### **Boolean Fields**
```typescript
// Contoh: Special, Limited, Exclusive
addBooleanField(nftId, 'special', true, packageId);
addBooleanField(nftId, 'limited_edition', false, packageId);
addBooleanField(nftId, 'exclusive', true, packageId);
```

## 🎨 Contoh Implementasi Lengkap

### **Gaming NFT Example**
```typescript
// Menambahkan atribut karakter game
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
// Menambahkan metadata seni
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
- Field key harus berupa `vector<u8>` (bytes)
- Field value harus memiliki trait `store`
- Supported types: `String`, `u64`, `u32`, `u16`, `u8`, `bool`, `address`

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

### **2. Data Validation**
```typescript
const addValidatedField = (nftId: string, key: string, value: any) => {
  // Validate input
  if (!key.trim()) {
    toast.error('Field name cannot be empty');
    return;
  }
  
  if (typeof value === 'number' && (value < 0 || value > 1000)) {
    toast.error('Number must be between 0 and 1000');
    return;
  }
  
  // Add field
  addStringField(nftId, key, value, packageId);
};
```

### **3. Error Handling**
```typescript
const { addStringField, error, isLoading } = useAddNFTDynamicFields();

useEffect(() => {
  if (error) {
    console.error('Failed to add dynamic field:', error);
    toast.error('Failed to add field. Please try again.');
  }
}, [error]);
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

---

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan tentang implementasi dynamic fields, silakan buat issue di repository atau hubungi tim development. 