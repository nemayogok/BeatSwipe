import React, { useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, PanInfo } from 'motion/react';
import {
  Menu,
  Library,
  X,
  Play,
  Heart,
  Search,
  Folder,
  Upload,
  CloudUpload,
  AudioLines,
  ListMusic,
  Download
} from 'lucide-react';

const DriveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 20h20L12 2z" />
    <path d="M12 10v6" />
    <path d="M9 13h6" />
  </svg>
);

const MainWaveform = () => {
  const heights = [40, 60, 80, 50, 90, 60, 40, 70, 90, 60, 40, 80, 50, 70, 50, 30];
  return (
    <div className="flex items-center justify-center gap-2 h-32 relative">
      <div className="absolute left-[30%] top-[-20px] bottom-[-20px] w-px bg-[#00E56A] shadow-[0_0_12px_2px_#00E56A] z-10" />
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-2.5 rounded-full bg-[#b2a3b8]"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

const MiniWaveform = ({ active }: { active?: boolean }) => {
  const heights = [20, 35, 25, 40, 30, 60, 80, 45, 30, 50, 70, 40, 25, 55, 35, 65, 40, 20, 35, 25, 40, 30, 50, 20];
  return (
    <div className="flex items-end h-12 justify-between w-full border-b border-[#282A29] pb-1">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-t-sm ${active && i === 7 ? 'bg-[#00E56A] shadow-[0_0_8px_#00E56A]' : 'bg-[#383a39]'}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

const DestButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="bg-[#181A19] border border-[#282A29] rounded-xl py-6 flex flex-col items-center gap-3 hover:border-zinc-600 transition-colors">
    <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-300">
      {icon}
    </div>
    <span className="text-sm font-medium text-zinc-300">{label}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'swipe' | 'library'>('swipe');
  const [exportOpen, setExportOpen] = useState(false);
  const [beatIdx, setBeatIdx] = useState(0);
  const [activeTracks, setActiveTracks] = useState<Record<string, boolean>>({
    KICK: true,
    SNARE: true,
    HATS: true,
    '808': true
  });

  const toggleTrack = (track: string) => {
    setActiveTracks(prev => ({ ...prev, [track]: !prev[track] }));
  };

  const beats = [
    { genre: 'DRILL', bpm: 140, tags: ['#dark', '#gritty'] },
    { genre: 'TRAP', bpm: 155, tags: ['#energetic', '#bouncy'] },
    { genre: 'BOOMBAP', bpm: 92, tags: ['#chill', '#vintage'] },
    { genre: 'HOUSE', bpm: 124, tags: ['#groove', '#upbeat'] },
    { genre: 'JERSEY', bpm: 160, tags: ['#fast', '#club'] },
  ];
  const currentBeat = beats[beatIdx % beats.length];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [0, -100], [0, 1]);
  const controls = useAnimation();

  const handleDragEnd = async (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset > 100 || velocity > 500) {
      await controls.start({ x: 300, opacity: 0, transition: { duration: 0.2 } });
      nextBeat();
    } else if (offset < -100 || velocity < -500) {
      await controls.start({ x: -300, opacity: 0, transition: { duration: 0.2 } });
      nextBeat();
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  const nextBeat = () => {
    setBeatIdx(prev => prev + 1);
    controls.set({ x: 0, opacity: 0, scale: 0.95 });
    controls.start({ opacity: 1, scale: 1, transition: { duration: 0.2 } });
    x.set(0);
  };

  const handleSkip = async () => {
    if (activeTab !== 'swipe') return;
    await controls.start({ x: -300, opacity: 0, transition: { duration: 0.2 } });
    nextBeat();
  };

  const handleSave = async () => {
    if (activeTab !== 'swipe') return;
    await controls.start({ x: 300, opacity: 0, transition: { duration: 0.2 } });
    nextBeat();
  };

  return (
    <div className="min-h-screen bg-black flex justify-center text-zinc-100 font-sans selection:bg-[#00E56A]/30">
      <div className="w-full max-w-md bg-[#111211] h-[100dvh] relative overflow-hidden flex flex-col shadow-2xl">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center p-6 pt-8 z-10 bg-[#111211]">
          <button className="text-[#00E56A]">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-mono text-2xl font-bold tracking-widest text-[#00E56A]">
              {activeTab === 'swipe' ? 'BEATSWIPE' : 'MY BEATS'}
            </h1>
            {activeTab === 'swipe' && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#00E56A] shadow-[0_0_8px_#00E56A]" />
                <span className="text-xs font-mono tracking-widest text-zinc-300 font-bold">{currentBeat.bpm} BPM</span>
              </div>
            )}
          </div>
          <button className="text-[#00E56A]" onClick={() => setActiveTab('library')}>
            <Library className="w-6 h-6" />
          </button>
        </div>

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
          {activeTab === 'swipe' ? (
            <div className="p-4 pt-0">
              <motion.div 
                drag="x"
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x, rotate }}
                className="bg-[#181A19] border border-[#282A29] rounded-2xl p-5 flex flex-col gap-6 relative overflow-hidden cursor-grab active:cursor-grabbing w-full touch-pan-y"
              >
                {/* Overlay Indicators */}
                <motion.div style={{ opacity: likeOpacity }} className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-[#00E56A]/10 backdrop-blur-[2px]">
                  <div className="border-4 border-[#00E56A] text-[#00E56A] font-bold text-4xl tracking-widest px-6 py-2 rounded-xl rotate-[-15deg] shadow-[0_0_20px_rgba(0,229,106,0.3)]">
                    SAVE
                  </div>
                </motion.div>
                <motion.div style={{ opacity: skipOpacity }} className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-red-500/10 backdrop-blur-[2px]">
                  <div className="border-4 border-red-500 text-red-500 font-bold text-4xl tracking-widest px-6 py-2 rounded-xl rotate-[15deg] shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                    SKIP
                  </div>
                </motion.div>

                {/* Scanlines */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20" 
                  style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', 
                    backgroundSize: '100% 4px' 
                  }} 
                />

                {/* Top Label & Tags */}
                <div className="relative z-10 flex flex-col gap-2 items-start">
                  <div className="px-3 py-1.5 border border-[#282A29] rounded-md text-xs font-mono font-bold tracking-widest bg-[#111211]/90">
                    {currentBeat.genre} / {currentBeat.bpm} BPM
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentBeat.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#1A1D1B] text-zinc-400 border border-[#282A29] rounded text-[10px] font-mono font-bold tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Waveform */}
                <div className="relative z-10 my-8">
                  <MainWaveform />
                </div>

                {/* Tracks */}
                <div className="relative z-10 flex flex-col gap-3">
                  {['KICK', 'SNARE', 'HATS', '808'].map((track) => {
                    const isActive = activeTracks[track];
                    return (
                      <button 
                        key={track}
                        onPointerDownCapture={(e) => e.stopPropagation()}
                        onClick={() => toggleTrack(track)}
                        className={`flex items-center justify-between rounded-xl p-4 transition-all ${
                          isActive ? 'bg-[#111211] border border-[#282A29]' : 'bg-black/40 border border-transparent'
                        }`}
                      >
                        <div className={`flex items-center gap-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                          <AudioLines className="w-5 h-5 text-zinc-500" />
                          <span className="font-mono text-sm tracking-widest font-bold text-zinc-100">{track}</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative flex items-center transition-colors ${isActive ? 'bg-[#00E56A]/20' : 'bg-[#1A1D1B]'}`}>
                          <div className={`w-4 h-4 rounded-full absolute transition-all ${
                            isActive 
                              ? 'right-1 bg-[#00E56A] shadow-[0_0_8px_rgba(0,229,106,0.6)]' 
                              : 'left-1 bg-zinc-600'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="p-4 pt-0 flex flex-col gap-5">
              {/* Search */}
              <div className="bg-[#181A19] border border-[#282A29] rounded-xl p-3.5 flex items-center gap-3">
                <Search className="w-5 h-5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="QUERY BEATS..." 
                  className="bg-transparent border-none outline-none text-sm font-mono flex-1 text-zinc-300 placeholder-zinc-600 tracking-wider" 
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {['ALL', 'TRAP', 'BOOMBAP', 'HOUSE'].map((filter, i) => (
                  <button 
                    key={filter} 
                    className={`whitespace-nowrap px-5 py-2 rounded-full border font-mono text-xs font-bold tracking-wider ${
                      i === 0 
                        ? 'border-[#00E56A] text-[#00E56A]' 
                        : 'border-[#282A29] text-zinc-400'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Beat Cards */}
              <div className="flex flex-col gap-4">
                {/* Card 1 */}
                <div className="bg-[#181A19] border border-[#282A29] rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2.5">
                      <h3 className="font-bold text-xl tracking-wider">NEON SKYLINE</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#2B0B57] text-[#A15DFF] text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded">
                          140 BPM
                        </span>
                        <span className="bg-[#111211] border border-[#282A29] text-zinc-400 text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded">
                          TRAP
                        </span>
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-full flex items-center justify-center bg-[#00E56A] text-black shadow-[0_0_15px_rgba(0,229,106,0.3)]">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <MiniWaveform active={true} />
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-mono text-zinc-500 font-bold tracking-widest">DURATION 02:45</span>
                    <button 
                      onClick={() => setExportOpen(true)}
                      className="px-6 py-2.5 rounded font-mono text-xs font-bold tracking-widest bg-[#00E56A] text-black"
                    >
                      EXPORT
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#181A19] border border-[#282A29] rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2.5">
                      <h3 className="font-bold text-xl tracking-wider text-zinc-300">GRITTY ALLEY</h3>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#2B0B57] text-[#A15DFF] text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded">
                          92 BPM
                        </span>
                        <span className="bg-[#111211] border border-[#282A29] text-zinc-400 text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded">
                          BOOMBAP
                        </span>
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-full flex items-center justify-center border border-[#282A29] text-zinc-400">
                      <Play className="w-6 h-6 fill-current ml-1 opacity-50" />
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    <MiniWaveform active={false} />
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-mono text-zinc-500 font-bold tracking-widest">DURATION 01:15</span>
                    <button 
                      onClick={() => setExportOpen(true)}
                      className="px-6 py-2.5 rounded font-mono text-xs font-bold tracking-widest border border-[#282A29] text-[#00E56A]"
                    >
                      EXPORT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 w-full p-6 pb-8 flex justify-between items-center bg-gradient-to-t from-[#111211] via-[#111211] to-transparent z-20 pointer-events-none">
          <div className="w-full grid grid-cols-3 items-center pointer-events-auto">
            <div className="flex justify-start">
              <button 
                onClick={handleSkip}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'swipe' 
                    ? 'border border-red-500/30 text-red-500 bg-[#1A1D1B] hover:bg-red-500/10' 
                    : 'text-zinc-500'
                }`}
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => setActiveTab('swipe')}
                className={`rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'swipe'
                    ? 'w-24 h-24 bg-[#00E56A] text-black shadow-[0_0_40px_rgba(0,229,106,0.3)] hover:scale-105'
                    : 'w-16 h-16 text-zinc-500'
                }`}
              >
                <Play className={`${activeTab === 'swipe' ? 'w-10 h-10' : 'w-7 h-7'} fill-current ml-1`} />
              </button>
            </div>
            
            <div className="flex justify-end items-center gap-3">
              {activeTab === 'swipe' && (
                <button 
                  onClick={() => setExportOpen(true)}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all border border-[#282A29] text-zinc-400 bg-[#1A1D1B] hover:bg-zinc-800"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={activeTab === 'swipe' ? handleSave : () => setActiveTab('library')}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'library'
                    ? 'bg-[#00E56A] text-black shadow-[0_0_30px_rgba(0,229,106,0.3)]'
                    : 'border border-[#00E56A]/30 text-[#00E56A] bg-[#1A1D1B] hover:bg-[#00E56A]/10'
                }`}
              >
                <Heart className={`w-7 h-7 ${activeTab === 'library' ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {exportOpen && (
          <div 
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setExportOpen(false)}
          >
            <div 
              className="w-full bg-[#181A19] border-t border-[#282A29] rounded-t-3xl p-6 pb-12 flex flex-col gap-8 animate-in slide-in-from-bottom-full duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center -mt-2">
                <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
              </div>
              
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl tracking-widest">EXPORT</h2>
                <button onClick={() => setExportOpen(false)} className="text-zinc-400 p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 mb-4 tracking-widest font-bold">FORMAT</h4>
                <div className="flex flex-col gap-3">
                  {/* WAV */}
                  <div className="bg-[#111211] border border-[#282A29] rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-[#00E56A] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#00E56A]" />
                      </div>
                      <div>
                        <div className="font-bold text-base tracking-wide">WAV Audio Loop</div>
                        <div className="text-xs text-zinc-400 mt-1">24-bit / 44.1kHz</div>
                      </div>
                    </div>
                    <AudioLines className="w-6 h-6 text-zinc-400" />
                  </div>
                  {/* MIDI */}
                  <div className="bg-[#111211] border border-[#282A29] rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-zinc-600" />
                      <div>
                        <div className="font-bold text-base tracking-wide text-zinc-300">Standard MIDI File</div>
                        <div className="text-xs text-zinc-500 mt-1">Note & Velocity Data</div>
                      </div>
                    </div>
                    <ListMusic className="w-6 h-6 text-zinc-600" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-zinc-500 mb-4 tracking-widest font-bold">DESTINATION</h4>
                <div className="grid grid-cols-2 gap-4">
                  <DestButton icon={<Folder className="w-6 h-6" />} label="Files" />
                  <DestButton icon={<Upload className="w-6 h-6" />} label="Share" />
                  <DestButton icon={<DriveIcon />} label="Drive" />
                  <DestButton icon={<CloudUpload className="w-6 h-6" />} label="Cloud" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
