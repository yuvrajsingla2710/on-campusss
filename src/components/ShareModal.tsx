import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  ExternalLink, 
  Globe, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export interface ShareData {
  title: string;
  text: string;
  url: string;
  category?: string;
  image?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shareData) return null;

  const fullUrl = shareData.url.startsWith('http') 
    ? shareData.url 
    : typeof window !== 'undefined' 
      ? `${window.location.origin}${shareData.url.startsWith('/') ? '' : '/'}${shareData.url}`
      : `https://oncampus.edu/${shareData.url}`;

  const shareText = `${shareData.title}\n${shareData.text}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(shareData.title);

  // Direct Social / Messaging Share Links
  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      description: 'Send to contacts or study groups',
      color: '#25D366',
      bgColor: 'rgba(37, 211, 102, 0.12)',
      borderColor: 'rgba(37, 211, 102, 0.3)',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.54 2.02.827 3.031.827 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.77-5.768-5.772zm3.397 8.243c-.145.407-.843.766-1.18.81-.334.043-.768.061-2.451-.637-1.684-.699-2.756-2.443-2.84-2.553-.083-.11-.676-.902-.676-1.721 0-.819.428-1.222.581-1.39.153-.169.333-.211.444-.211.11 0 .222.001.32.005.102.005.24-.039.375.286.14.337.478 1.164.52 1.25.042.086.07.188.014.3-.056.113-.084.183-.167.282-.083.099-.176.221-.252.298-.083.084-.17.175-.073.342.097.167.433.715.93 1.157.639.57 1.177.747 1.344.831.167.084.264.07.362-.042.097-.113.417-.486.528-.653.111-.167.222-.139.375-.083.153.056.972.458 1.139.542.167.083.278.125.32.194.041.07.041.403-.104.81zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.957-1.399C8.389 21.492 10.134 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.636 0-3.155-.494-4.425-1.343l-.317-.213-2.946.83.829-2.909-.232-.338C4.015 14.887 3.5 13.488 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Broadcast to channels or groups',
      color: '#229ED9',
      bgColor: 'rgba(34, 158, 217, 0.12)',
      borderColor: 'rgba(34, 158, 217, 0.3)',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      description: 'Post to your campus followers',
      color: '#FFFFFF',
      bgColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Share academic and project builds',
      color: '#0A66C2',
      bgColor: 'rgba(10, 102, 194, 0.12)',
      borderColor: 'rgba(10, 102, 194, 0.3)',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v7.6H9.2v-7.6H6.46M7.83 6.54a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: 'reddit',
      name: 'Reddit',
      description: 'Post to campus & student subreddits',
      color: '#FF4500',
      bgColor: 'rgba(255, 69, 0, 0.12)',
      borderColor: 'rgba(255, 69, 0, 0.3)',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm5.748-12.875a1.498 1.498 0 0 0-1.437.989 7.747 7.747 0 0 0-4.14-1.2l.745-3.504 2.433.518a1.2 1.2 0 1 0 .265-.773l-2.784-.593a.405.405 0 0 0-.48.312l-.84 3.95a7.78 7.78 0 0 0-4.223 1.2 1.5 1.5 0 0 0-1.439-.99 1.503 1.503 0 0 0-.66 2.85 3.327 3.327 0 0 0-.044.526c0 2.658 3.09 4.813 6.9 4.813s6.9-2.155 6.9-4.813c0-.18-.016-.356-.046-.528a1.503 1.503 0 0 0 .77-1.957 1.498 1.498 0 0 0-1.469-.899zM8.9 13.5a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2zm6.2 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2zm-5.467 2.378a.4.4 0 0 1 .562-.057c.725.56 1.637.842 2.505.842.868 0 1.78-.282 2.505-.842a.4.4 0 1 1 .496.626c-.886.685-1.996 1.026-3.001 1.026s-2.115-.341-3.001-1.026a.4.4 0 0 1-.066-.569z"/>
        </svg>
      ),
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      id: 'email',
      name: 'Email / Outlook',
      description: 'Direct dispatch to faculty or peers',
      color: '#00f2ff',
      bgColor: 'rgba(0, 242, 255, 0.12)',
      borderColor: 'rgba(0, 242, 255, 0.3)',
      icon: <Send className="w-5 h-5 text-[#00f2ff]" />,
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: fullUrl,
        });
      } catch (err) {
        // User cancelled or share failed; modal remains open
      }
    } else {
      handleCopy();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="campus-share-dialog"
        className="relative w-full max-w-lg bg-[#090b10] border border-white/20 rounded-3xl shadow-[0_0_60px_rgba(0,242,255,0.2)] flex flex-col max-h-[90vh] overflow-hidden text-white"
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 bg-[#0d0f17] border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                Share with Campus Network
              </h3>
              <p className="text-[11px] font-mono-tech text-white/50">
                DISPATCH INSTANTLY TO ANY PLATFORM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Card Preview of what is being shared */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#00f2ff]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {shareData.category ? shareData.category.toUpperCase() : 'CAMPUS OS RESOURCE'}
              </span>
              <span className="text-white/40">READY TO SEND</span>
            </div>
            <div className="text-sm font-semibold text-white font-heading line-clamp-1">
              {shareData.title}
            </div>
            <div className="text-xs text-white/60 line-clamp-2 leading-relaxed">
              {shareData.text}
            </div>
          </div>

          {/* Native Device Share Action (Instant sheet for iOS / Android / Mac / Windows) */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#00f2ff]/20 via-[#3b82f6]/20 to-[#a855f7]/20 hover:from-[#00f2ff]/30 hover:to-[#a855f7]/30 border border-[#00f2ff]/40 flex items-center justify-between text-left transition-all duration-200 group cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.15)] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff] group-hover:scale-105 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono-tech text-[#00f2ff] font-semibold">DEVICE SHARE SHEET</div>
                  <div className="text-sm font-bold text-white font-heading">Open Installed Phone / Desktop Apps</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#00f2ff] group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Platform Grid */}
          <div>
            <div className="text-xs font-mono-tech text-white/50 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Send directly to platform:</span>
              <span className="text-[10px] text-white/40">Opens in new tab/app</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {platforms.map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setTimeout(onClose, 800);
                  }}
                  className="p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                  style={{
                    backgroundColor: p.bgColor,
                    borderColor: p.borderColor,
                    color: p.color,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="p-1.5 rounded-lg bg-black/30 text-current">{p.icon}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-heading text-white">{p.name}</div>
                    <div className="text-[10px] text-white/50 truncate font-mono-tech">{p.description}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Direct Copy Link Bar */}
          <div>
            <div className="text-xs font-mono-tech text-white/50 uppercase tracking-wider mb-1.5">
              Or copy direct link:
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl">
              <div className="flex-1 px-3 text-xs font-mono-tech text-white/70 truncate">
                {fullUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-xs font-mono-tech font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-[#22c55e] text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'bg-white/10 hover:bg-white/20 text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY LINK</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
