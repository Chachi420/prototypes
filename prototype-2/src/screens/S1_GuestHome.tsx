import { useNavigate } from 'react-router-dom';
import { Wrench, ChevronRight, Home, List, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

export default function S1_GuestHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F4F1] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen bg-white shadow-xl flex flex-col relative">

        {/* Header */}
        <div className="bg-[#C1272D] px-5 pt-12 pb-6">
          {/* Overview link */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-white/50 hover:text-white/80 text-[11px] mb-3 transition-colors"
          >
            <span>←</span>
            <span>Flow Overview</span>
          </button>
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-white/70 text-xs font-medium tracking-widest uppercase">HSC Horizon</p>
              <p className="text-white/60 text-xs mt-0.5">Cabin 14B</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="border border-white/50 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Manager View
            </button>
          </div>
          <h1 className="text-white text-2xl font-bold mt-3">Welcome, Aryan 👋</h1>
          <p className="text-white/70 text-sm mt-1">Hope you're enjoying your voyage</p>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto pb-24">

          {/* Report Issue Button */}
          <button
            onClick={() => navigate('/category')}
            className="w-full bg-[#B8963E] rounded-2xl p-5 flex items-center gap-4 shadow-md hover:bg-[#a07e32] transition-colors active:scale-[0.98]"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-base">Report an Issue</p>
              <p className="text-white/80 text-sm mt-0.5">Something not right? Let us know</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/70 flex-shrink-0" />
          </button>

          {/* Quick Info Chips */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7F4F1] border border-[#E8E2DC] rounded-xl p-3.5">
              <p className="text-[#6B6B6B] text-xs font-medium">Voyage Progress</p>
              <p className="text-[#1A1A1A] font-semibold text-sm mt-1">Day 3 of 7</p>
            </div>
            <div className="bg-[#F7F4F1] border border-[#E8E2DC] rounded-xl p-3.5">
              <p className="text-[#6B6B6B] text-xs font-medium">Location</p>
              <p className="text-[#1A1A1A] font-semibold text-sm mt-1">Deck 5 — Aft</p>
            </div>
          </div>

          {/* My Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[#1A1A1A] font-semibold text-base">My Requests</h2>
              <button
                onClick={() => navigate('/tracking')}
                className="text-[#C1272D] text-sm font-medium hover:underline"
              >
                View all
              </button>
            </div>

            {/* Resolved Request Card */}
            <div className="border border-[#E8E2DC] rounded-xl p-4 bg-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#2E7D52]/10 text-[#2E7D52] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#2E7D52]/20">
                    ✓ Resolved
                  </span>
                  <span className="text-[#6B6B6B] text-xs">Plumbing</span>
                </div>
                <span className="text-[#6B6B6B] text-xs">Yesterday, 3:42 PM</span>
              </div>
              <p className="text-[#1A1A1A] font-medium text-sm">Cold water in shower</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[#6B6B6B] text-xs">#CM-2024-0031</span>
                <span className="text-[#2E7D52] text-xs font-medium">Resolved in 18 min</span>
              </div>
            </div>
          </div>

          {/* Active Request Banner */}
          <div className="bg-[#D4820A]/10 border border-[#D4820A]/30 rounded-xl p-4 flex items-center gap-3">
            <div className="flex-shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4820A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4820A]"></span>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#1A1A1A] text-xs font-semibold">Active Request</p>
              <p className="text-[#6B6B6B] text-xs mt-0.5 truncate">#CM-2024-0047 — AC Issue · In Progress</p>
            </div>
            <button
              onClick={() => navigate('/tracking')}
              className="flex-shrink-0 text-[#D4820A] text-sm font-semibold flex items-center gap-1 hover:opacity-80"
            >
              Track <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E2DC] px-4 py-3">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1">
              <Home className="w-5 h-5 text-[#C1272D]" />
              <span className="text-[#C1272D] text-xs font-semibold">Home</span>
            </button>
            <button
              onClick={() => navigate('/tracking')}
              className="flex flex-col items-center gap-1"
            >
              <List className="w-5 h-5 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B] text-xs">Requests</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Sparkles className="w-5 h-5 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B] text-xs">Services</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <HelpCircle className="w-5 h-5 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B] text-xs">Help</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
