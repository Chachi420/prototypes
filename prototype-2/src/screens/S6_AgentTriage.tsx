import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const reasoningSteps = [
  'Parsing guest complaint...',
  'Classifying issue type: Comfort — AC Fault',
  'Assessing severity: Medium — Standard Priority',
  'Checking recurring faults for Cabin 14B... No prior reports',
  'Checking technician availability...',
  'Routing decision: Generate Work Order',
];

export default function S6_AgentTriage() {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    reasoningSteps.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setVisibleSteps((prev) => Math.max(prev, idx + 1));
      }, 600 + idx * 800);
      timersRef.current.push(timer);
    });
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1628]">

      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#B8963E]/20 border border-[#B8963E]/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-base">🤖</span>
            <span className="text-[#B8963E] font-semibold text-sm">Agent Console</span>
          </div>
          <span className="text-white/50 text-sm hidden sm:block">Processing Request #CM-2024-0047</span>
        </div>
        <button
          onClick={() => navigate('/tracking')}
          className="flex items-center gap-2 border border-white/20 text-white/80 text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5 lg:p-6">

        {/* Left Column — Incoming Request */}
        <div className="bg-[#0F2040] border border-white/10 rounded-2xl p-5">
          <p className="text-[#B8963E] font-semibold text-xs uppercase tracking-widest mb-4">Incoming Request</p>
          <div className="space-y-3">
            {[
              ['Guest', 'Aryan Mehta'],
              ['Cabin', '14B'],
              ['Issue', 'AC not working'],
              ['Category', 'Comfort — AC / Temperature'],
              ['Submitted', 'Today, 2:34 PM'],
              ['Guest Loyalty', 'Gold Member'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-white/40 text-xs">{label}</p>
                <p className="text-white text-sm font-medium mt-0.5">{value}</p>
              </div>
            ))}
            <div>
              <p className="text-white/40 text-xs">Priority</p>
              <span className="inline-flex items-center mt-0.5 bg-[#D4820A]/20 border border-[#D4820A]/30 text-[#D4820A] text-xs font-semibold px-2 py-0.5 rounded-full">
                Medium
              </span>
            </div>
          </div>
        </div>

        {/* Center Column — AI Reasoning */}
        <div className="bg-[#0F2040] border border-white/10 rounded-2xl p-5">
          <p className="text-[#B8963E] font-semibold text-xs uppercase tracking-widest mb-4">Reasoning Steps</p>
          <div className="space-y-3">
            {reasoningSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 transition-all duration-500 ${
                  idx < visibleSteps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <CheckCircle className="w-4 h-4 text-[#2E7D52] flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
            {visibleSteps < reasoningSteps.length && (
              <div className="flex items-center gap-2 pt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8963E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B8963E]"></span>
                </span>
                <p className="text-[#B8963E] text-sm animate-pulse">Analyzing...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Routing Outcome */}
        <div className="bg-[#0F2040] border border-white/10 rounded-2xl p-5 flex flex-col">
          <p className="text-[#B8963E] font-semibold text-xs uppercase tracking-widest mb-4">Decision</p>

          <div className="flex flex-col items-center py-4 mb-4">
            <div className="w-14 h-14 bg-[#2E7D52]/20 rounded-full flex items-center justify-center mb-3">
              <span className="text-[#2E7D52] text-2xl font-bold">✓</span>
            </div>
            <h2 className="text-white text-lg font-bold">Work Order Generated</h2>
            <span className="mt-2 bg-[#2E7D52]/20 border border-[#2E7D52]/30 text-[#2E7D52] text-xs font-semibold px-3 py-1 rounded-full">
              Auto-Assigned
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {[
              ['Assigned to', 'Raj Kumar'],
              ['Certification', 'HVAC Certified'],
              ['Location', 'Deck 5 (same deck)'],
              ['Est. Time', '25 minutes'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-white/40 text-xs">{label}</p>
                <p className="text-white text-sm font-medium mt-0.5">{value}</p>
              </div>
            ))}
            <div className="pt-2 border-t border-white/10">
              <p className="text-white/40 text-xs italic leading-relaxed">
                Selected based on: nearest location, HVAC certification, current availability
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/workorder')}
            className="mt-5 w-full bg-[#B8963E] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#a07e32] transition-colors flex items-center justify-center gap-2"
          >
            View Work Order →
          </button>
        </div>

      </div>
    </div>
  );
}
