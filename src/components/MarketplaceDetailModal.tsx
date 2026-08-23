import React, { useState } from 'react';
import { MarketplaceItem } from '../types';
import { ShareData } from './ShareModal';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  ShoppingBag,
  Clock,
  Sparkles,
  Tag,
  Share2,
  Check
} from 'lucide-react';

interface MarketplaceDetailModalProps {
  item: MarketplaceItem | null;
  onClose: () => void;
  onContactSeller: (itemId: string, message: string) => void;
  onOpenShare?: (data: ShareData) => void;
}

export const MarketplaceDetailModal: React.FC<MarketplaceDetailModalProps> = ({
  item,
  onClose,
  onContactSeller,
  onOpenShare,
}) => {
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleShare = () => {
    const itemUrl = `${window.location.origin}/marketplace/${item.id}`;
    const sharePayload: ShareData = {
      title: `${item.title} — ₹${item.price} on Campus Marketplace`,
      text: `${item.description} (Seller: ${item.sellerName}, Condition: ${item.condition})`,
      url: itemUrl,
      category: item.category,
      image: item.imageUrl,
    };

    if (onOpenShare) {
      onOpenShare(sharePayload);
    } else if (navigator.share) {
      navigator.share({
        title: sharePayload.title,
        text: sharePayload.text,
        url: sharePayload.url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(itemUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onContactSeller(item.id, message.trim());
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="marketplace-detail-modal-card"
        className="relative w-full max-w-2xl bg-[#090b10] border border-white/20 rounded-3xl shadow-[0_0_60px_rgba(0,242,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden text-white"
      >
        {/* Dedicated Fixed Header Bar - Guarantees Close Button NEVER Overlaps Content */}
        <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-white/[0.08] bg-[#0d0f17] flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="px-2.5 py-1 rounded-md bg-[#00f2ff]/20 border border-[#00f2ff]/40 text-[#00f2ff] text-[11px] font-mono-tech font-bold uppercase tracking-wider shrink-0">
              {item.category}
            </span>
            <span className="text-white/40 text-xs hidden sm:inline">•</span>
            <span className="text-xs font-mono-tech text-white/60 truncate hidden sm:inline">
              Verified Campus Listing
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-[#00f2ff]/20 text-white hover:text-[#00f2ff] transition-all cursor-pointer border border-white/10 hover:border-[#00f2ff]/30 text-xs font-mono-tech"
              title="Share listing to WhatsApp, Telegram, X, etc."
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              id="marketplace-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-white/80 hover:text-white transition-all cursor-pointer border border-white/10 text-xs font-mono-tech"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto custom-scrollbar relative z-10 flex-1">
          {/* Image Container with Dedicated Spacing */}
          {item.imageUrl && (
            <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-black border border-white/10 relative group">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono-tech text-white flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#00f2ff]" />
                <span>Condition: {item.condition}</span>
              </div>
            </div>
          )}

          {/* Title & Price Row */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                {item.title}
              </h2>
              <div className="text-2xl sm:text-3xl font-black text-[#00f2ff] font-mono-tech shrink-0">
                ₹{item.price.toLocaleString()}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tech text-zinc-400">
              <span className="flex items-center gap-1 text-white/80">
                <MapPin className="w-3.5 h-3.5 text-[#00f2ff]" />
                {item.location}
              </span>
              <span className="text-white/30">•</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                {item.condition}
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1 text-white/60">
                <Clock className="w-3.5 h-3.5" />
                {item.createdAt || 'Listed Recently'}
              </span>
            </div>
          </div>

          {/* Description Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#12141f] border border-white/[0.08]">
            <div className="text-[11px] font-mono-tech text-[#00f2ff] uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ITEM DETAILS & SPECIFICATIONS</span>
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line font-normal">
              {item.description}
            </p>
          </div>

          {/* Seller Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#12141f] to-[#161928] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f2ff]/20 to-[#c084fc]/20 border border-[#00f2ff]/40 flex items-center justify-center font-bold text-white text-base font-mono-tech shadow-md shrink-0">
                {item.sellerName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>{item.sellerName}</span>
                  {item.sellerVerified !== false && (
                    <ShieldCheck className="w-4 h-4 text-[#00f2ff]" />
                  )}
                </div>
                <div className="text-xs font-mono-tech text-white/60">
                  {item.sellerDepartment || 'Verified Campus Student'}
                </div>
                <div className="text-[10px] font-mono-tech text-[#00f2ff] mt-0.5">
                  ⭐ 4.9 Rating (Verified Peer)
                </div>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/40 text-[10px] font-mono-tech text-emerald-300 font-bold self-start sm:self-center">
              ✓ CAMPUS ID VERIFIED
            </span>
          </div>

          {/* Contact & Instant Reserve Form */}
          {isSent ? (
            <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-mono-tech flex items-center gap-3 shadow-lg">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>Direct notification sent to {item.sellerName}! They will coordinate pickup at {item.location}.</span>
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-white/[0.08]">
              {/* 1-Click Instant Reserve Action */}
              <button
                type="button"
                onClick={() => {
                  onContactSeller(item.id, `Reserved item "${item.title}" for ₹${item.price}. Ready for campus handover.`);
                  setIsSent(true);
                  setTimeout(() => {
                    setIsSent(false);
                    onClose();
                  }, 2200);
                }}
                className="w-full py-3.5 px-4 bg-[#00f2ff] hover:bg-[#38f6ff] text-black font-bold text-xs sm:text-sm font-mono-tech tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-[0_0_25px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Instant Reserve (₹{item.price.toLocaleString()})</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#090b10] px-3 text-[10px] font-mono-tech text-zinc-500 uppercase">OR SEND CUSTOM INQUIRY</span>
              </div>

              <form onSubmit={handleSend} className="space-y-3">
                <label className="block text-xs font-mono-tech text-zinc-300 font-medium">
                  MESSAGE SELLER DIRECTLY
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi ${item.sellerName.split(' ')[0]}, is this still available? Can we meet at ${item.location} today?`}
                  rows={2}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono-tech tracking-wider uppercase rounded-xl transition-all cursor-pointer border border-white/20 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#00f2ff]" />
                  <span>Send Peer Message</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
