import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, AlertTriangle } from 'lucide-react';

type JobStatus = 'pending' | 'accepted' | 'enRoute' | 'inProgress' | 'resolved';

const GRID_ROWS = 5;
const GRID_COLS = 4;
const HIGHLIGHTED_ROW = 1;
const HIGHLIGHTED_COL = 2;

const cabinLabels: Record<string, string> = {
  '0-0': '10A', '0-1': '10B', '0-2': '11A', '0-3': '11B',
  '1-0': '13A', '1-1': '13B', '1-2': '14B', '1-3': '14C',
  '2-0': '15A', '2-1': '15B', '2-2': '16A', '2-3': '16B',
  '3-0': '17A', '3-1': '17B', '3-2': '18A', '3-3': '18B',
  '4-0': '19A', '4-1': '19B', '4-2': '20A', '4-3': '20B',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const STATUS_LABELS: Record<JobStatus, string> = {
  pending: 'Awaiting Acceptance',
  accepted: 'Accepted',
  enRoute: 'En Route',
  inProgress: 'In Progress',
  resolved: 'Resolved',
};

export default function S8_Technician() {
  const navigate = useNavigate();
  const [jobStatus, setJobStatus] = useState<JobStatus>('pending');
  const [seconds, setSeconds] = useState(25 * 60);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const issue = localStorage.getItem('cabin_issue') || 'AC not working';

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isUrgent = seconds < 5 * 60;

  const handleAction = () => {
    if (jobStatus === 'pending') setJobStatus('accepted');
    else if (jobStatus === 'accepted') setJobStatus('enRoute');
    else if (jobStatus === 'enRoute') setJobStatus('inProgress');
    else if (jobStatus === 'inProgress') {
      localStorage.setItem('cabin_resolution_notes', resolutionNotes || 'Replaced faulty capacitor. System tested and running normally.');
      setJobStatus('resolved');
      navigate('/jobcomplete');
    }
  };

  const actionLabel: Record<JobStatus, string> = {
    pending: 'Accept Job',
    accepted: 'Mark En Route',
    enRoute: 'Arrived — Mark In Progress',
    inProgress: 'Mark Resolved',
    resolved: 'Done',
  };

  const actionColor: Record<JobStatus, string> = {
    pending: 'bg-[#2E7D52] hover:bg-[#256641]',
    accepted: 'bg-[#D4820A] hover:bg-[#b8700a]',
    enRoute: 'bg-[#4A6FA5] hover:bg-[#3d5d8f]',
    inProgress: 'bg-[#B8963E] hover:bg-[#a07e32]',
    resolved: 'bg-[#2E7D52] hover:bg-[#256641]',
  };

  return (
    <div className="min-h-screen bg-[#F7F4F1] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen bg-white shadow-xl flex flex-col">

        {/* Back Buttons */}
        <div className="px-5 pt-10 pb-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-[#6B6B6B]/50 hover:text-[#6B6B6B] text-[11px] mb-1.5 transition-colors"
          >
            <span>←</span>
            <span>Flow Overview</span>
          </button>
          <button
            onClick={() => navigate('/workorder')}
            className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-[#1A1A1A] px-5 py-5 mx-4 rounded-2xl">
          <p className="text-white/60 text-xs font-medium">HSC Horizon · Technician View</p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#B8963E]" />
              <h1 className="text-white font-bold text-base">New Job Assigned 🔔</h1>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#B8963E]/20 text-[#B8963E] border border-[#B8963E]/30">
              {STATUS_LABELS[jobStatus]}
            </span>
          </div>
        </div>

        {/* Job Card */}
        <div className="bg-white shadow-md rounded-2xl mx-4 mt-4 p-5 border border-[#E8E2DC]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#1A1A1A] font-bold text-sm font-mono">#WO-2024-0047</span>
            <span className="bg-[#C1272D]/15 border border-[#C1272D]/30 text-[#C1272D] text-xs font-semibold px-2.5 py-0.5 rounded-full">
              High Priority
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B] text-xs">Guest</span>
              <span className="text-[#1A1A1A] text-xs font-semibold">Aryan Mehta</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B] text-xs">Cabin</span>
              <span className="text-[#1A1A1A] text-xs font-semibold">14B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B] text-xs">Issue</span>
              <span className="text-[#1A1A1A] text-xs font-semibold">{issue}</span>
            </div>
          </div>
          <div className="bg-[#D4820A]/8 border border-[#D4820A]/20 rounded-xl px-3 py-2.5 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D4820A] flex-shrink-0 mt-0.5" />
            <p className="text-[#D4820A] text-xs font-medium leading-relaxed">
              Guest is in cabin — please knock before entering
            </p>
          </div>
        </div>

        {/* Floor Plan */}
        <div className="mx-4 mt-4">
          <p className="text-[#1A1A1A] font-semibold text-sm mb-2">Cabin Location — Deck 5</p>
          <div className="bg-[#F7F4F1] border border-[#E8E2DC] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#6B6B6B] text-xs">← Fore</span>
              <span className="text-[#1A1A1A] text-xs font-semibold">Deck 5</span>
              <span className="text-[#6B6B6B] text-xs">Aft →</span>
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
              {Array.from({ length: GRID_ROWS }).map((_, rowIdx) =>
                Array.from({ length: GRID_COLS }).map((_, colIdx) => {
                  const isHighlighted = rowIdx === HIGHLIGHTED_ROW && colIdx === HIGHLIGHTED_COL;
                  const key = `${rowIdx}-${colIdx}`;
                  return (
                    <div
                      key={key}
                      className={`h-9 rounded-md flex items-center justify-center text-xs font-bold border transition-all ${
                        isHighlighted
                          ? 'bg-[#C1272D] text-white border-[#C1272D] shadow-md scale-105'
                          : 'bg-white text-[#6B6B6B] border-[#E8E2DC]'
                      }`}
                    >
                      {cabinLabels[key] || ''}
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="w-3 h-3 bg-[#C1272D] rounded-sm"></div>
              <span className="text-[#6B6B6B] text-xs">Your destination: Cabin 14B</span>
            </div>
          </div>
        </div>

        {/* SLA Timer */}
        <div className="mx-4 mt-4 bg-[#F7F4F1] border border-[#E8E2DC] rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-[#6B6B6B] text-xs font-medium">Complete within</p>
          <p className={`text-2xl font-bold font-mono tabular-nums ${isUrgent ? 'text-[#C1272D]' : 'text-[#1A1A1A]'}`}>
            {formatTime(seconds)}
          </p>
        </div>

        {/* Status Cards */}
        <div className="mx-4 mt-3 space-y-2">
          {jobStatus === 'accepted' && (
            <div className="slide-down bg-[#2E7D52]/10 border border-[#2E7D52]/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-[#2E7D52] text-sm">✓</span>
              <p className="text-[#2E7D52] text-sm font-semibold">Job accepted — preparing to head out</p>
            </div>
          )}
          {jobStatus === 'enRoute' && (
            <div className="slide-down bg-[#D4820A]/10 border border-[#D4820A]/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-[#D4820A] text-sm">🚶</span>
              <p className="text-[#D4820A] text-sm font-semibold">En route to Cabin 14B, Deck 5</p>
            </div>
          )}
          {jobStatus === 'inProgress' && (
            <div className="slide-down bg-[#4A6FA5]/10 border border-[#4A6FA5]/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A6FA5] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4A6FA5]"></span>
              </span>
              <p className="text-[#4A6FA5] text-sm font-semibold">Work in progress...</p>
            </div>
          )}
        </div>

        {/* Resolution Notes (shown only in inProgress state) */}
        {jobStatus === 'inProgress' && (
          <div className="mx-4 mt-3 slide-down">
            <p className="text-[#1A1A1A] font-semibold text-sm mb-2">Resolution Notes</p>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Describe what was done to resolve the issue..."
              className="w-full border border-[#E8E2DC] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B] resize-none h-20 focus:outline-none focus:border-[#B8963E]/50 focus:ring-2 focus:ring-[#B8963E]/10 transition-all"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="px-4 py-4 mt-auto">
          <button
            onClick={handleAction}
            className={`w-full ${actionColor[jobStatus]} text-white py-4 rounded-2xl font-bold text-base shadow-md transition-colors active:scale-[0.98]`}
          >
            {actionLabel[jobStatus]}
          </button>
        </div>

      </div>
    </div>
  );
}
