import React, { useState, useMemo } from 'react';
import { MarketplaceItem } from '../types';
import { 
  Search, 
  Plus, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  Tag,
  Clock,
  ArrowRight,
  ArrowUpDown,
  Filter,
  Layers,
  RotateCcw
} from 'lucide-react';

interface MarketplaceSectionProps {
  items: MarketplaceItem[];
  onSelectItem: (item: MarketplaceItem) => void;
  onOpenCreateModal: () => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  items,
  onSelectItem,
  onOpenCreateModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'newest'>('recommended');

  const categories = ['All', 'Electronics', 'Books', 'Furniture', 'Equipment', 'Notes'];

  // Dynamic Filtering & Sorting Logic
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter((item) => {
      const matchesCat = 
        selectedCategory === 'All' || 
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.sellerName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCat && matchesQuery;
    });

    // Apply Sorter
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // Sort by creation date if available, or maintain reverse chronological
      result = [...result].reverse();
    }

    return result;
  }, [items, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="marketplace" className="py-24 sm:py-28 border-b border-zinc-800 relative bg-[#0d0e13] text-white overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[750px] h-[550px] bg-[#fbcfe8]/5 rounded-full blur-[170px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[650px] h-[450px] bg-[#f472b6]/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* TOP SECTION HEADER */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-normal font-heading">
              Give unused things a second life.
            </h2>
            <p className="text-zinc-400 mt-2 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Buy, sell, or trade lab gear, laptops, textbooks, and hostel essentials directly with verified peers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="marketplace-list-item-btn"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-300 hover:brightness-105 text-zinc-950 font-bold text-xs sm:text-sm rounded-full transition-all cursor-pointer shadow-[0_2px_16px_rgba(251,207,232,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>List an Item</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTER, SEARCH & ITEM SORTER ROW */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap uppercase ${
                  selectedCategory === cat
                    ? 'bg-pink-950/40 border border-pink-300/40 text-pink-200 font-bold shadow-[0_0_12px_rgba(251,207,232,0.15)]'
                    : 'bg-[#151620] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar & Sorter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gear, laptops, books..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#151620] border border-zinc-800 focus:border-pink-300 rounded-full text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors font-mono-tech"
              />
            </div>

            {/* Sorter Selector */}
            <div className="flex items-center gap-2 bg-[#151620] border border-zinc-800 rounded-full px-3.5 py-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-pink-300" />
              <span className="text-[11px] font-mono-tech text-zinc-400 uppercase hidden sm:inline">Sort:</span>
              <select
                id="marketplace-sorter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-mono-tech text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="recommended" className="bg-[#151620] text-white">Recommended</option>
                <option value="price-asc" className="bg-[#151620] text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-[#151620] text-white">Price: High to Low</option>
                <option value="newest" className="bg-[#151620] text-white">Newest Listed</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DYNAMIC MARKETPLACE GRID (Bento + Grid Hybrid) */}
        {/* ========================================================================= */}
        {filteredAndSortedItems.length === 0 ? (
          <div className="py-16 text-center bg-[#151620] border border-zinc-800 rounded-3xl p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-pink-950/40 border border-pink-300/30 text-pink-300 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">No listings found</h3>
            <p className="text-sm text-zinc-400 mt-1 mb-6 font-mono-tech">
              No campus items match "{searchQuery || selectedCategory}". Try clearing your filters.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setSortBy('recommended');
                }}
                className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-tech text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
              <button
                onClick={onOpenCreateModal}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-200 to-rose-200 text-xs font-mono-tech text-zinc-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>List an Item</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {filteredAndSortedItems.map((item, idx) => {
              // Create an asymmetric clean 12-col rhythm
              const isLargeLead = idx === 0;
              const isMedium = idx === 1 || idx === 4;
              const colSpan = isLargeLead 
                ? 'col-span-1 md:col-span-12 lg:col-span-6' 
                : isMedium 
                  ? 'col-span-1 md:col-span-6 lg:col-span-6' 
                  : 'col-span-1 md:col-span-6 lg:col-span-3';

              return (
                <div 
                  key={item.id}
                  id={`marketplace-card-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className={`${colSpan} rounded-3xl bg-[#14151f] border border-zinc-800 hover:border-pink-300/40 p-6 sm:p-7 min-h-[380px] relative flex flex-col justify-between overflow-hidden group cursor-pointer transition-all duration-500 shadow-2xl`}
                >
                  {/* Background Image with Gradient Overlay */}
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f15] via-[#0e0f15]/70 to-transparent pointer-events-none" />
                  
                  {/* Top Bar with Category, Location & Handover Badges */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-300">
                        <span className="px-2.5 py-0.5 rounded bg-pink-950/50 border border-pink-300/30 text-pink-200 font-bold text-[10px] uppercase">
                          {item.category}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[11px] text-zinc-300 truncate max-w-[140px]">{item.location}</span>
                      </div>
                    </div>

                    {/* Floating Price Badge */}
                    <div className="px-3 py-1.5 rounded-2xl bg-[#1a1b26]/90 backdrop-blur-xl border border-zinc-700/80 text-xs font-mono-tech font-bold text-white shadow-xl flex items-center gap-1.5 shrink-0">
                      <span className="text-pink-200">₹{item.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Bottom Headline & Seller Action */}
                  <div className="relative z-10 pt-16">
                    <div className="flex items-center gap-2 text-[10px] font-mono-tech text-zinc-400 mb-1 uppercase tracking-wider">
                      <span>Condition: {item.condition}</span>
                    </div>

                    <h3 className={`${isLargeLead ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-black text-white font-heading tracking-tight group-hover:text-pink-200 transition-colors leading-tight line-clamp-2`}>
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-300 max-w-md mt-1.5 line-clamp-2 font-normal">
                      {item.description}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                      <span className="text-xs font-mono-tech text-zinc-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-pink-300" />
                        <span className="truncate max-w-[150px]">{item.sellerName}</span>
                      </span>

                      <div className="w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-gradient-to-r group-hover:from-pink-200 group-hover:to-rose-200 group-hover:text-zinc-950 flex items-center justify-center text-zinc-200 transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
