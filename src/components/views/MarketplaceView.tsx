import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles,
  Tag,
  CheckCircle
} from 'lucide-react';
import { MarketplaceItem, UserProfile } from '../../types';

interface MarketplaceViewProps {
  items: MarketplaceItem[];
  currentUser: UserProfile;
  onSelectItem: (item: MarketplaceItem) => void;
  onOpenCreateListing: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items,
  currentUser,
  onSelectItem,
  onOpenCreateListing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceSort, setPriceSort] = useState<'default' | 'low-high' | 'high-low' | 'newest'>('default');

  const categories: string[] = ['All', 'Electronics', 'Books', 'Furniture', 'Equipment', 'Notes'];

  let filteredItems = items.filter((item) => {
    const matchesCat = 
      selectedCategory === 'All' || 
      item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(item.category.toLowerCase());
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.sellerName.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  if (priceSort === 'low-high') {
    filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  } else if (priceSort === 'high-low') {
    filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
  } else if (priceSort === 'newest') {
    filteredItems = [...filteredItems].reverse();
  }

  return (
    <div id="marketplace-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#00f2ff] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-[#00f2ff] tracking-[3px] uppercase font-bold">
            <ShoppingBag className="w-4 h-4 text-[#00f2ff]" />
            <span>ZERO-FEE CAMPUS COMMERCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            PEER-TO-PEER MARKETPLACE
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-xl font-normal">
            Buy, sell, or trade textbooks, monitors, drafting tools, and tech directly with peers across campus hostels and departments.
          </p>
        </div>

        <button
          id="marketplace-create-listing-btn"
          onClick={onOpenCreateListing}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-bold text-xs font-mono-tech tracking-[2px] uppercase rounded-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.25)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ LIST AN ITEM</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 bg-[#121212] border border-white/[0.08] rounded-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbooks, tech, sellers..."
            className="w-full pl-9 pr-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono-tech tracking-[1px] uppercase rounded-sm transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#00f2ff]/20 border border-[#00f2ff] text-[#00f2ff] font-bold'
                  : 'bg-[#050505] border border-white/5 text-white/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price sort */}
        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value as any)}
          className="px-3 py-1.5 bg-[#050505] border border-white/10 rounded-sm text-xs text-white font-mono-tech focus:outline-none focus:border-[#00f2ff]"
        >
          <option value="default">Sort: Recommended</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            id={`marketplace-card-${item.id}`}
            onClick={() => onSelectItem(item)}
            className="group relative rounded-sm bg-[#121212] border border-white/[0.08] hover:border-[#00f2ff] transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Image Box */}
            <div className="relative aspect-4/3 w-full bg-[#050505] overflow-hidden border-b border-white/[0.06]">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-sm bg-[#050505]/90 border border-white/10 text-[9px] font-mono-tech text-white uppercase">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span className="px-2.5 py-0.5 rounded-sm bg-[#00f2ff] text-black font-black text-xs font-mono-tech shadow-md">
                  ₹{item.price}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#00f2ff] transition-colors font-heading line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-white/60 line-clamp-2 mb-3 font-normal">
                  {item.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/[0.04]">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-white/50">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00f2ff]" />
                    <span className="text-white/80">{item.sellerName}</span>
                  </div>
                  <span>{item.condition}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono-tech text-white/40">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white/40" />
                    <span>{item.location}</span>
                  </div>
                  <span>{item.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Bottom View Trigger */}
            <div className="px-4 py-2.5 bg-[#050505] border-t border-white/[0.06] flex items-center justify-between text-xs font-mono-tech text-[#00f2ff] font-bold uppercase tracking-[1px] group-hover:bg-[#00f2ff] group-hover:text-black transition-colors">
              <span>VIEW DETAILS</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
