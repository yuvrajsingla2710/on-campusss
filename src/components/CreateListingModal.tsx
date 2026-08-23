import React, { useState } from 'react';
import { MarketplaceItem } from '../types';
import { X, Plus, ShoppingBag, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateItem?: (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'available'>) => void;
  onCreateListing?: (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'available'>) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onCreateItem,
  onCreateListing,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketplaceItem['category']>('Books');
  const [price, setPrice] = useState<number>(350);
  const [condition, setCondition] = useState<MarketplaceItem['condition']>('Good');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    const createFn = onCreateListing || onCreateItem;
    if (createFn) {
      createFn({
        title,
        category,
        price: Number(price),
        condition,
        location,
        sellerId: 'u-current',
        sellerName: 'You (Verified Student)',
        sellerVerified: true,
        sellerDepartment: 'Campus Student',
        description: description || 'No extra description provided.',
        symbol: category === 'Books' ? '∿' : category === 'Electronics' ? '01' : '▱',
        size: 'standard',
        imageUrl: imageUrl || undefined,
      });
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTitle('');
      setLocation('');
      setDescription('');
      setImageUrl('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#090C12] border border-cyan-400/40 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              LIST A MARKETPLACE ITEM
            </h2>
            <p className="text-xs font-mono-tech text-cyan-400">
              Give unused items a second student life. +30 Impact points.
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-center font-mono-tech text-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <div>Listing published successfully to ON CAMPUS Marketplace!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                ITEM TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Engineering Mathematics Kreyszig 10th Ed or Casio FX-991"
                required
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                >
                  <option value="Books">Books</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Notes">Notes</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  PRICE (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  CONDITION
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like new">Like new</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Digital scan">Digital scan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  CAMPUS LOCATION / HOSTEL
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Block C or PG near Gate 2"
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                IMAGE URL (OPTIONAL)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                DESCRIPTION & NOTES
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State any markings, included chargers, semester applicability..."
                rows={3}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs font-mono-tech tracking-wider uppercase rounded transition-all cursor-pointer shadow-lg"
              >
                PUBLISH LISTING TO CAMPUS
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
