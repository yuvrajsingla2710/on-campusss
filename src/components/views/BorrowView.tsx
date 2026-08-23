import React, { useState } from 'react';
import { 
  HandCoins, 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Cpu,
  Book,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BorrowItem, UserProfile } from '../../types';

interface BorrowViewProps {
  items: BorrowItem[];
  currentUser: UserProfile;
  onRequestBorrow: (itemId: string, durationDays: number) => void;
  onAddBorrowItem: (item: Omit<BorrowItem, 'id' | 'available'>) => void;
}

export const BorrowView: React.FC<BorrowViewProps> = ({
  items,
  currentUser,
  onRequestBorrow,
  onAddBorrowItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [borrowDays, setBorrowDays] = useState<number>(3);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Lend form toggle & state
  const [isLendFormOpen, setIsLendFormOpen] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BorrowItem['category']>('Electronics');
  const [location, setLocation] = useState('');
  const [maxDays, setMaxDays] = useState(7);
  const [depositRequired, setDepositRequired] = useState('Campus ID');
  const [description, setDescription] = useState('');

  const categories: string[] = ['All', 'Electronics', 'Calculators', 'Books', 'Gear', 'Lab Equipment'];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleBorrowSubmit = (id: string) => {
    onRequestBorrow(id, borrowDays);
    setSuccessMsg('Borrow request confirmed! Connect with peer for instant locker / lab pickup.');
    setTimeout(() => {
      setSuccessMsg(null);
      setSelectedItemId(null);
    }, 2500);
  };

  const handleLendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    onAddBorrowItem({
      title,
      category,
      location,
      ownerName: `${currentUser.name} (Verified)`,
      ownerVerified: true,
      maxDays,
      depositRequired,
      description,
    });

    setSuccessMsg('Your hardware/book is now listed in the campus inventory! +40 Karma pts awarded.');
    setTitle('');
    setLocation('');
    setDescription('');
    setIsLendFormOpen(false);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div id="borrow-view-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121212] border border-white/[0.08] border-t-2 border-t-[#00f2ff] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-[#00f2ff] tracking-[3px] uppercase font-bold">
            <HandCoins className="w-4 h-4 text-[#00f2ff]" />
            <span>CAMPUS LENDING & LAB PROTOCOL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            BORROW & SHARE INVENTORY
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-xl font-normal">
            Need an Arduino, scientific calculator, DSLR, or GPU lab pass for 48 hours? Zero rental fees — powered by verified campus trust.
          </p>
        </div>

        <button
          id="lend-item-toggle-btn"
          onClick={() => setIsLendFormOpen(!isLendFormOpen)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-bold text-xs font-mono-tech tracking-[2px] uppercase rounded-sm transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.25)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isLendFormOpen ? 'CLOSE FORM' : '+ LEND EQUIPMENT'}</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-[#00f2ff]/10 border border-[#00f2ff] rounded-sm text-xs font-mono-tech text-[#00f2ff] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#00f2ff] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Lend Form Collapse */}
      {isLendFormOpen && (
        <form
          onSubmit={handleLendSubmit}
          className="p-6 bg-[#121212] border border-[#00f2ff]/40 rounded-sm space-y-4 shadow-xl"
        >
          <div className="text-xs font-mono-tech text-[#00f2ff] font-bold tracking-[2px] uppercase">
            LIST ITEM FOR PEER BORROWING
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                ITEM TITLE & MODEL *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio fx-991EX Calculator / STM32 Board"
                required
                className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                CATEGORY *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BorrowItem['category'])}
                className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
              >
                <option value="Electronics">Electronics</option>
                <option value="Calculators">Calculators</option>
                <option value="Books">Books</option>
                <option value="Gear">Gear</option>
                <option value="Lab Equipment">Lab Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                PICKUP CAMPUS LOCATION *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. EC Lab 2 / Aryabhatta Hostel A-304"
                required
                className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
                MAX BORROW WINDOW (DAYS)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={maxDays}
                onChange={(e) => setMaxDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono-tech text-white/50 mb-1">
              DESCRIPTION / CONDITION NOTES
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Includes power adapter, USB-C cable. Please return with original box."
              className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsLendFormOpen(false)}
              className="px-4 py-2 bg-[#050505] border border-white/10 text-white/60 text-xs font-mono-tech rounded-sm cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00f2ff] hover:bg-[#00f2ff]/80 text-black font-bold text-xs font-mono-tech uppercase tracking-[1px] rounded-sm cursor-pointer"
            >
              PUBLISH TO CAMPUS INVENTORY
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 bg-[#121212] border border-white/[0.08] rounded-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, locations, hardware..."
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
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isSelected = selectedItemId === item.id;

          return (
            <div
              key={item.id}
              id={`borrow-item-${item.id}`}
              className={`p-5 rounded-sm bg-[#121212] border transition-all duration-200 flex flex-col justify-between ${
                item.available
                  ? 'border-white/[0.08] hover:border-[#00f2ff]'
                  : 'border-white/5 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.06]">
                  <span className="text-[10px] font-mono-tech text-white/50 uppercase tracking-[1px]">
                    {item.category}
                  </span>
                  {item.available ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[9px] font-mono-tech text-[#00f2ff] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-ping" />
                      AVAILABLE NOW
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-sm bg-[#050505] text-[9px] font-mono-tech text-white/40">
                      CHECKED OUT
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white font-heading mb-1.5">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-white/60 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}

                <div className="space-y-1.5 text-xs font-mono-tech text-white/60 mt-3 pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00f2ff]" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#bc13fe]" />
                    <span>Max {item.maxDays} days borrow limit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00f2ff]" />
                    <span>Deposit: {item.depositRequired || 'Campus ID'}</span>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                {item.available ? (
                  isSelected ? (
                    <div className="space-y-3 bg-[#050505] p-3 rounded-sm border border-[#00f2ff]/30">
                      <div className="flex items-center justify-between text-xs font-mono-tech text-white">
                        <span>Duration: {borrowDays} days</span>
                        <input
                          type="range"
                          min="1"
                          max={item.maxDays}
                          value={borrowDays}
                          onChange={(e) => setBorrowDays(Number(e.target.value))}
                          className="w-24 accent-[#00f2ff]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedItemId(null)}
                          className="flex-1 py-1.5 bg-[#121212] text-white/60 text-xs font-mono-tech rounded-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleBorrowSubmit(item.id)}
                          className="flex-1 py-1.5 bg-[#00f2ff] text-black font-bold text-xs font-mono-tech rounded-sm uppercase cursor-pointer"
                        >
                          Confirm Request
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSelectedItemId(item.id); setBorrowDays(Math.min(3, item.maxDays)); }}
                      className="w-full py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono-tech tracking-[2px] uppercase rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>REQUEST TO BORROW</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full py-2 bg-[#050505] text-white/40 text-xs font-mono-tech uppercase rounded-sm cursor-not-allowed text-center"
                  >
                    RETURN DUE IN 2 DAYS
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
