import React, { useState } from 'react';
import { BorrowItem } from '../types';
import { 
  X, 
  HandCoins, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Plus, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BorrowItem[];
  onRequestBorrow: (itemId: string, durationDays: number) => void;
  onAddBorrowItem: (item: Omit<BorrowItem, 'id' | 'available'>) => void;
  onRequestCustomItem?: (itemTitle: string, category: string, neededBy: string, notes: string) => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  isOpen,
  onClose,
  items,
  onRequestBorrow,
  onAddBorrowItem,
  onRequestCustomItem,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'lend' | 'request'>('browse');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [borrowDays, setBorrowDays] = useState<number>(3);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Lend Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BorrowItem['category']>('Electronics');
  const [location, setLocation] = useState('');
  const [maxDays, setMaxDays] = useState(7);
  const [depositRequired, setDepositRequired] = useState('Campus ID');
  const [description, setDescription] = useState('');

  // Request an Item Form
  const [reqTitle, setReqTitle] = useState('');
  const [reqCategory, setReqCategory] = useState<BorrowItem['category']>('Calculators');
  const [reqNeededBy, setReqNeededBy] = useState('Today, by 5 PM');
  const [reqUrgency, setReqUrgency] = useState<'Standard' | 'Urgent (Exam/Lab)'>('Standard');
  const [reqNotes, setReqNotes] = useState('');

  // Community requested items state
  const [communityRequests, setCommunityRequests] = useState([
    { id: 'cr-1', title: 'Casio Scientific Calculator FX-991CW', category: 'Calculators', requester: 'Priya K. (3rd Year ECE)', neededBy: 'Tomorrow morning (Exam)', urgency: 'Urgent (Exam/Lab)', offersCount: 2 },
    { id: 'cr-2', title: 'Soldering Iron & Solder Wire (60W)', category: 'Tools', requester: 'Rohan D. (2nd Year Mechatronics)', neededBy: 'Friday 4 PM', urgency: 'Standard', offersCount: 1 },
    { id: 'cr-3', title: 'USB-C to HDMI Multi-Port Hub', category: 'Electronics', requester: 'Aman V. (4th Year CSE)', neededBy: 'Tonight 8 PM', urgency: 'Standard', offersCount: 3 },
  ]);

  if (!isOpen) return null;

  const handleBorrowSubmit = (id: string) => {
    onRequestBorrow(id, borrowDays);
    setSuccessMsg('Borrow request sent to peer! You will receive a pickup passcode once confirmed.');
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
      ownerName: 'You (Verified Student)',
      ownerVerified: true,
      maxDays,
      depositRequired,
      description,
    });

    setSuccessMsg('Your item was added to the ON CAMPUS Borrow Inventory! +40 Impact points awarded.');
    setTitle('');
    setLocation('');
    setDescription('');
    setTimeout(() => {
      setSuccessMsg(null);
      setActiveTab('browse');
    }, 2000);
  };

  const handleCustomRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    if (onRequestCustomItem) {
      onRequestCustomItem(reqTitle, reqCategory, reqNeededBy, reqNotes);
    }

    // Add to local community requests
    const newReq = {
      id: `cr-${Date.now()}`,
      title: reqTitle,
      category: reqCategory,
      requester: 'You (Verified Student)',
      neededBy: reqNeededBy,
      urgency: reqUrgency,
      offersCount: 0,
    };
    setCommunityRequests([newReq, ...communityRequests]);

    setSuccessMsg(`Your request for "${reqTitle}" was broadcast to all students nearby! Peers will be notified.`);
    setReqTitle('');
    setReqNotes('');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#090C12] border border-cyan-400/40 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <HandCoins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">
              01 // CAMPUS BORROW INVENTORY
            </h2>
            <p className="text-xs font-mono-tech text-cyan-400">
              Don't buy what you can borrow. Free peer-to-peer resource sharing & item requests.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4 mb-6">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AVAILABLE ITEMS ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'request'
                ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-400 text-cyan-200 font-bold shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            + REQUEST AN ITEM (BROADCAST)
          </button>
          <button
            onClick={() => setActiveTab('lend')}
            className={`px-4 py-2 text-xs font-mono-tech tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'lend'
                ? 'bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            + LEND AN ITEM (+40 IMPACT)
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-mono-tech flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1: Browse Items */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-zinc-950/80 border border-white/[0.08] hover:border-cyan-400/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-cyan-400 mb-2">
                    <span>{item.category}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-400/20 text-cyan-300">
                      MAX {item.maxDays} DAYS
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-heading mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="space-y-1 text-xs font-mono-tech text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Lender: {item.ownerName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] font-mono-tech text-zinc-400">
                    Deposit: {item.depositRequired}
                  </span>

                  <button
                    onClick={() => handleBorrowSubmit(item.id)}
                    className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono-tech font-semibold rounded transition-all cursor-pointer"
                  >
                    REQUEST BORROW
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Request an Item (Broadcast to Peers) */}
        {activeTab === 'request' && (
          <div className="space-y-6">
            <form onSubmit={handleCustomRequestSubmit} className="p-5 rounded-xl bg-zinc-950/90 border border-cyan-400/30 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono-tech text-cyan-300 font-bold uppercase tracking-wider">
                  Post a Request to the Campus Network
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  ITEM YOU NEED TO BORROW *
                </label>
                <input
                  type="text"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. Graphic Tablet, Lab Coat (Size L), TI-84 Plus, or Arduino Uno"
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                  >
                    <option value="Calculators">Calculators</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Lab Gear">Lab Gear</option>
                    <option value="Tools">Tools</option>
                    <option value="Project Parts">Project Parts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                    NEEDED BY
                  </label>
                  <input
                    type="text"
                    value={reqNeededBy}
                    onChange={(e) => setReqNeededBy(e.target.value)}
                    placeholder="e.g. Today by 4 PM"
                    required
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                    URGENCY
                  </label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                  >
                    <option value="Standard">Standard (Within 24h)</option>
                    <option value="Urgent (Exam/Lab)">🔥 Urgent (Exam/Lab)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  SPECIFIC REQUIREMENTS / NOTES (OPTIONAL)
                </label>
                <textarea
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="Need it for 3 hours for the Midterm Exam in Room 204. Will return immediately with Campus ID deposit."
                  rows={2}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs font-mono-tech tracking-wider uppercase rounded transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)]"
              >
                BROADCAST ITEM REQUEST TO CAMPUS
              </button>
            </form>

            {/* Active Community Requests Feed */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400 mb-3 font-bold uppercase">
                <span>RECENT STUDENT ITEM REQUESTS ({communityRequests.length})</span>
                <span className="text-zinc-400 text-[11px] font-normal">Can you lend any of these?</span>
              </div>

              <div className="space-y-3">
                {communityRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-zinc-950/60 border border-white/[0.08] hover:border-cyan-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-400/20 text-[10px] font-mono-tech text-cyan-300">
                          {req.category}
                        </span>
                        {req.urgency.includes('Urgent') && (
                          <span className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-400/30 text-[10px] font-mono-tech text-rose-300 font-bold">
                            {req.urgency}
                          </span>
                        )}
                        <span className="text-xs text-zinc-400 font-mono-tech">
                          Needed: <strong className="text-zinc-200">{req.neededBy}</strong>
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {req.title}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono-tech">
                        Requested by {req.requester}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSuccessMsg(`You offered to lend "${req.title}"! We notified ${req.requester}.`);
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className="px-3.5 py-1.5 bg-white/[0.08] hover:bg-cyan-400 hover:text-black text-cyan-300 border border-cyan-400/40 text-xs font-mono-tech font-semibold rounded transition-all cursor-pointer shrink-0"
                    >
                      I CAN LEND THIS (+35 IMPACT)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lend an Item Form */}
        {activeTab === 'lend' && (
          <form onSubmit={handleLendSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                ITEM NAME
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Texas Instruments TI-84 Plus or Arduino Uno Kit"
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
                  <option value="Electronics">Electronics</option>
                  <option value="Lab Gear">Lab Gear</option>
                  <option value="Calculators">Calculators</option>
                  <option value="Tools">Tools</option>
                  <option value="Project Parts">Project Parts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  PICKUP LOCATION ON CAMPUS
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hostel C, Room 304 or Makerspace"
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  MAX BORROW DURATION (DAYS)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={maxDays}
                  onChange={(e) => setMaxDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                  DEPOSIT / TRUST REQUIREMENT
                </label>
                <input
                  type="text"
                  value={depositRequired}
                  onChange={(e) => setDepositRequired(e.target.value)}
                  placeholder="e.g. Campus ID card or None"
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-tech text-zinc-300 mb-1">
                DESCRIPTION & USAGE RULES
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include cables/batteries provided, return conditions, or specific cautions."
                rows={3}
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-cyan-400 font-mono-tech"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-xs font-mono-tech tracking-wider uppercase rounded transition-all cursor-pointer shadow-lg"
              >
                PUBLISH TO BORROW INVENTORY (+40 IMPACT)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
