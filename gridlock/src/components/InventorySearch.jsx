import React, { useState, useMemo } from 'react';

// Using GitHub Raw Content as our ultra-stable Content Delivery Network (CDN)
const GITHUB_ASSETS_URL = "https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.19.1/items/";

const MINECRAFT_ITEMS = [
  // Default Building & Crafting Materials
  { id: 'oak_planks', name: 'Oak Planks', image: '/images/Oak_planks.png' },
  { id: 'stick', name: 'Stick', image: '/images/Stick.png' },
  { id: 'cobblestone', name: 'Cobblestone', image: '/images/Cobblestone.png' },
  
  // Ores & Minerals
  { id: 'coal', name: 'Coal', image: '/images/Coal.png' },
  { id: 'iron_ingot', name: 'Iron Ingot', image: '/images/Iron_Ingot.png' },
  { id: 'gold_ingot', name: 'Gold Ingot', image: '/images/Gold_Ingot.png' },
  { id: 'diamond', name: 'Diamond', image: '/images/Diamond.png' },
  { id: 'emerald', name: 'Emerald', image: '/images/Emerald.png' },
  { id: 'redstone', name: 'Redstone Dust', image: '/images/Redstone.png' },
  { id: 'lapis_lazuli', name: 'Lapis Lazuli', image: '/images/Lapis_Lazuli.png' },
  
  // Mob Drops & Foraging
  { id: 'string', name: 'String', image: '/images/String.png' },
  { id: 'gunpowder', name: 'Gunpowder', image: '/images/Gunpowder.png' },
  { id: 'bone', name: 'Bone', image: '/images/Bone.png' },
  { id: 'slime_ball', name: 'Slimeball', image: '/images/Slime_Ball.png' },
  { id: 'feather', name: 'Feather', image: '/images/Feather.png' },
  { id: 'leather', name: 'Leather', image: '/images/Leather.png' },
  { id: 'flint', name: 'Flint', image: '/images/Flint.png' },
  
  // Advanced / Magic
  { id: 'blaze_rod', name: 'Blaze Rod', image: '/images/Blaze_Rod.png' },
  { id: 'ender_pearl', name: 'Ender Pearl', image: '/images/Ender_Pearl.png' },
  { id: 'obsidian', name: 'Obsidian', image: '/images/Obsidian.png' }
];

const InventorySearch = ({ onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return MINECRAFT_ITEMS;
    return MINECRAFT_ITEMS.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelect = (item) => {
    onSelectItem(item); 
    setSearchTerm('');  
    setIsOpen(false);   
  };

  return (
    <div className="inventory-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <input
        type="text"
        className="email-input" 
        placeholder="Search for an ingredient..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && filteredItems.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, width: '100%',
          backgroundColor: '#151515', borderRadius: '12px', padding: '8px',
          listStyle: 'none', margin: '8px 0 0 0', zIndex: 10,
          maxHeight: '200px', overflowY: 'auto'
        }}>
          {filteredItems.map(item => (
            <li 
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                borderBottom: '1px solid #222'
              }}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }} 
              />
              <span style={{ color: '#fff' }}>{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InventorySearch;