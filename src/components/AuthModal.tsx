import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Key, 
  Lock, 
  Globe,
  ArrowRight, 
  Edit3, 
  Check, 
  Sparkles, 
  Building2, 
  BookOpen, 
  GraduationCap, 
  Mail, 
  User, 
  Image as ImageIcon,
  LogIn,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUser: UserProfile;
  onSelectUser?: (user: UserProfile) => void;
  onSwitchUser?: (user: UserProfile) => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser,
  onSwitchUser,
  onUpdateUser,
}) => {
  const switchFn = onSelectUser || onSwitchUser || (() => {});
  const updateFn = onUpdateUser || switchFn;

  const [activeTab, setActiveTab] = useState<'switch' | 'login' | 'edit'>('switch');

  // Login / SSO form state
  const [studentId, setStudentId] = useState('');
  const [eduEmail, setEduEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & AI');
  const [academicYear, setAcademicYear] = useState('Year 3');

  // Edit Profile form state (initialized from currentUser)
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.contactEmail || currentUser?.email || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editDept, setEditDept] = useState(currentUser?.department || '');
  const [editYear, setEditYear] = useState(currentUser?.year || 'Year 3');
  const [editHostel, setEditHostel] = useState(currentUser?.hostelWing || 'North Block H4');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0]);
  const [editIsPrivate, setEditIsPrivate] = useState<boolean>(!!currentUser?.isPrivate);
  const [editSkillsOffered, setEditSkillsOffered] = useState(
    currentUser?.skillsOffered ? currentUser.skillsOffered.join(', ') : 'Python, UI/UX, OpenCV'
  );
  const [editSkillsWanted, setEditSkillsWanted] = useState(
    currentUser?.skillsWanted ? currentUser.skillsWanted.join(', ') : 'Rust, Embedded Systems'
  );

  const [feedback, setFeedback] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync edit form whenever currentUser changes or modal opens
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditEmail(currentUser.contactEmail || currentUser.email || '');
      setEditBio(currentUser.bio || '');
      setEditDept(currentUser.department || '');
      setEditYear(currentUser.year || 'Year 3');
      setEditHostel(currentUser.hostelWing || 'North Block H4');
      setEditAvatar(currentUser.avatar || AVATAR_PRESETS[0]);
      setEditIsPrivate(!!currentUser.isPrivate);
      setEditSkillsOffered(currentUser.skillsOffered ? currentUser.skillsOffered.join(', ') : '');
      setEditSkillsWanted(currentUser.skillsWanted ? currentUser.skillsWanted.join(', ') : '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleDemoSwitch = (u: UserProfile) => {
    switchFn(u);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 400);
  };

  const handleSSOLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduEmail.trim()) {
      setFeedback('Please enter a valid university student email.');
      return;
    }

    const userName = fullName.trim() || eduEmail.split('@')[0].toUpperCase();
    const existing = users.find(
      (u) => u.contactEmail?.toLowerCase() === eduEmail.toLowerCase() || u.name.toLowerCase() === userName.toLowerCase()
    );

    let loggedInUser: UserProfile;
    if (existing) {
      loggedInUser = {
        ...existing,
        verified: true,
      };
    } else {
      loggedInUser = {
        ...currentUser,
        id: `user-${Date.now()}`,
        name: userName,
        contactEmail: eduEmail,
        email: eduEmail,
        studentId: studentId.trim() || `2024CS${Math.floor(1000 + Math.random() * 9000)}`,
        department: department,
        year: academicYear,
        verified: true,
        isPrivate: false,
        verifiedHash: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
        bio: `Student at ${department}, passionate about campus building and peer collaboration.`,
      };
    }

    updateFn(loggedInUser);
    setFeedback(null);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const handleSaveProfileChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setFeedback('Name cannot be blank.');
      return;
    }

    const offeredArray = editSkillsOffered
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const wantedArray = editSkillsWanted
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedUser: UserProfile = {
      ...currentUser,
      name: editName.trim(),
      contactEmail: editEmail.trim() || currentUser.contactEmail,
      email: editEmail.trim() || currentUser.email,
      bio: editBio.trim() || currentUser.bio,
      department: editDept.trim() || currentUser.department,
      year: editYear.trim() || currentUser.year,
      hostelWing: editHostel.trim() || currentUser.hostelWing,
      avatar: editAvatar || currentUser.avatar,
      isPrivate: editIsPrivate,
      skillsOffered: offeredArray.length > 0 ? offeredArray : currentUser.skillsOffered,
      skillsWanted: wantedArray.length > 0 ? wantedArray : currentUser.skillsWanted,
      initials: editName.trim().slice(0, 2).toUpperCase(),
    };

    updateFn(updatedUser);
    setFeedback(null);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="auth-profile-modal-card"
        className="relative w-full max-w-xl bg-[#090b10] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_25px_rgba(0,242,255,0.08)] flex flex-col max-h-[92vh] overflow-hidden text-white"
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer border border-white/10 z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
              CAMPUS ID & PROFILE
            </h2>
            <p className="text-xs font-mono-tech text-[#00f2ff]">
              Verified university access • Edit details & switch personas
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex gap-1.5 border-b border-white/[0.08] pb-3 mb-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('switch');
              setFeedback(null);
            }}
            className={`px-3.5 py-2 text-xs font-mono-tech tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'switch'
                ? 'bg-[#00f2ff]/20 border border-[#00f2ff] text-[#00f2ff] font-bold shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>SWITCH PERSONA</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('edit');
              setFeedback(null);
            }}
            className={`px-3.5 py-2 text-xs font-mono-tech tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-[#00f2ff]/20 border border-[#00f2ff] text-[#00f2ff] font-bold shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>EDIT MY PROFILE</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('login');
              setFeedback(null);
            }}
            className={`px-3.5 py-2 text-xs font-mono-tech tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-[#00f2ff]/20 border border-[#00f2ff] text-[#00f2ff] font-bold shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>STUDENT SSO LOGIN</span>
          </button>
        </div>

        {/* Success Toast Banner */}
        {saveSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-mono-tech flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Profile & authentication state updated successfully!</span>
          </div>
        )}

        {/* Error Feedback */}
        {feedback && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-400/50 text-red-300 text-xs font-mono-tech">
            {feedback}
          </div>
        )}

        {/* Scrollable Tab Content Container */}
        <div className="overflow-y-auto custom-scrollbar flex-1 pr-1 space-y-4">
          
          {/* ========================================================================= */}
          {/* TAB 1: SWITCH DEMO PERSONA */}
          {/* ========================================================================= */}
          {activeTab === 'switch' && (
            <div className="space-y-3">
              <div className="text-xs font-mono-tech text-white/60">
                Select any verified student profile to experience their permissions, impact rank, and badges:
              </div>

              <div className="space-y-2">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleDemoSwitch(u)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                        isCurrent
                          ? 'bg-[#00f2ff]/10 border-[#00f2ff] text-white shadow-[0_0_20px_rgba(0,242,255,0.15)]'
                          : 'bg-[#12141f] border-white/[0.08] hover:border-white/25 hover:bg-[#181a28]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-11 h-11 rounded-xl object-cover border border-white/20"
                          />
                          {isCurrent && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00f2ff] border-2 border-black" />
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                            <span>{u.name}</span>
                            <span className="text-[10px] font-mono-tech text-[#00f2ff] px-1.5 py-0.5 rounded bg-[#00f2ff]/10 border border-[#00f2ff]/30">
                              {u.title}
                            </span>
                            {u.isPrivate ? (
                              <span className="text-[9px] font-mono-tech text-amber-300 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Private
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono-tech text-emerald-300 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                                <Globe className="w-2.5 h-2.5" /> Public
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono-tech text-white/50 mt-0.5">
                            {u.department} • <span className="text-white/70">Rank #{u.rank}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono-tech">
                        <div className="text-sm font-bold text-white">{u.impactScore}</div>
                        <div className="text-[9px] text-[#00f2ff] uppercase">IMPACT PTS</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EDIT PROFILE DETAILS */}
          {/* ========================================================================= */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfileChanges} className="space-y-4">
              <div className="text-xs font-mono-tech text-[#00f2ff] uppercase tracking-wider font-bold">
                EDIT YOUR ON-CAMPUS IDENTITY
              </div>

              {/* Public vs Private Profile Selection */}
              <div>
                <label className="block text-xs font-mono-tech text-white/70 mb-2">
                  PROFILE PRIVACY & MESSAGING PERMISSIONS *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setEditIsPrivate(false)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      !editIsPrivate
                        ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-[#12141f] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 font-mono-tech">
                        <Globe className="w-4 h-4" />
                        <span>Public Profile</span>
                      </div>
                      {!editIsPrivate && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                      Anyone on campus can send you direct messages right away without sending a friend request.
                    </p>
                  </div>

                  <div
                    onClick={() => setEditIsPrivate(true)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      editIsPrivate
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#12141f] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono-tech">
                        <Lock className="w-4 h-4" />
                        <span>Private Profile</span>
                      </div>
                      {editIsPrivate && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                      Requires students to send you a <strong>Friend Request</strong> and receive your approval before they can message you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-mono-tech text-white/70 mb-2">
                  CHOOSE AVATAR PRESET OR ENTER URL
                </label>
                <div className="flex items-center gap-2.5 mb-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((preset, i) => (
                    <img
                      key={i}
                      src={preset}
                      alt={`Avatar ${i}`}
                      onClick={() => setEditAvatar(preset)}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition-all shrink-0 ${
                        editAvatar === preset ? 'border-[#00f2ff] scale-105 shadow-[0_0_10px_rgba(0,242,255,0.4)]' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="Custom avatar image URL..."
                  className="w-full px-3.5 py-2 bg-[#12141f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                />
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    placeholder="e.g. Yuvraj Sen"
                    className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    CAMPUS / CONTACT EMAIL
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>
              </div>

              {/* Department, Year & Hostel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    DEPARTMENT
                  </label>
                  <input
                    type="text"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    placeholder="e.g. Mechanical Eng."
                    className="w-full px-3 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    ACADEMIC YEAR
                  </label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech cursor-pointer"
                  >
                    <option value="Year 1" className="bg-[#12141f]">Year 1 (Freshman)</option>
                    <option value="Year 2" className="bg-[#12141f]">Year 2 (Sophomore)</option>
                    <option value="Year 3" className="bg-[#12141f]">Year 3 (Junior)</option>
                    <option value="Year 4" className="bg-[#12141f]">Year 4 (Senior)</option>
                    <option value="Postgrad / PhD" className="bg-[#12141f]">Postgrad / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    HOSTEL WING
                  </label>
                  <input
                    type="text"
                    value={editHostel}
                    onChange={(e) => setEditHostel(e.target.value)}
                    placeholder="e.g. North Block H4"
                    className="w-full px-3 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-mono-tech text-white/70 mb-1">
                  BIO / STATUS PHRASE
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  placeholder="Tell peers what you are building or studying..."
                  className="w-full px-3.5 py-2 bg-[#12141f] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                />
              </div>

              {/* Skills Offered & Wanted */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    SKILLS I CAN TEACH (COMMA-SEPARATED)
                  </label>
                  <input
                    type="text"
                    value={editSkillsOffered}
                    onChange={(e) => setEditSkillsOffered(e.target.value)}
                    placeholder="e.g. Figma, React, Python"
                    className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    SKILLS I WANT TO LEARN
                  </label>
                  <input
                    type="text"
                    value={editSkillsWanted}
                    onChange={(e) => setEditSkillsWanted(e.target.value)}
                    placeholder="e.g. Rust, CAD, ROS 2"
                    className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="save-profile-btn"
                className="w-full py-3.5 bg-[#00f2ff] hover:bg-[#38f6ff] text-black font-bold text-xs sm:text-sm font-mono-tech tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: STUDENT SSO LOGIN */}
          {/* ========================================================================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleSSOLogin} className="space-y-4">
              <div className="text-xs font-mono-tech text-white/60">
                Log in with your official university credentials or student roll number:
              </div>

              <div>
                <label className="block text-xs font-mono-tech text-white/70 mb-1">
                  FULL NAME (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jyoti Singla"
                  className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    STUDENT ROLL / ID NO.
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="2024CS0891"
                    className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    CAMPUS EMAIL (.EDU) *
                  </label>
                  <input
                    type="email"
                    value={eduEmail}
                    onChange={(e) => setEduEmail(e.target.value)}
                    required
                    placeholder="student@campus.edu"
                    className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    DEPARTMENT
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech text-white/70 mb-1">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#12141f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2ff] font-mono-tech"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="sso-signin-btn"
                className="w-full py-3.5 bg-[#00f2ff] hover:bg-[#38f6ff] text-black font-bold text-xs sm:text-sm font-mono-tech tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Verify & Sign In</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
