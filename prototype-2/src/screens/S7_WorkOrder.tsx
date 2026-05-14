import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

const auditLog = [
  { time: 'Today, 2:34 PM', event: 'Submitted by Aryan Mehta', icon: '📋', color: 'text-[#6B6B6B]' },
  { time: 'Today, 2:34 PM', event: 'AI Triage completed — High Priority flagged', icon: '🤖', color: 'text-[#B8963E]' },
  { time: 'Today, 2:35 PM', event: 'Work order generated — Assigned to Raj Kumar', icon: '✅', color: 'text-[#2E7D52]' },
  { time: 'Today, 2:35 PM', event: 'Raj Kumar acknowledged job', icon: '🔔', color: 'text-[#4A6FA5]' },
  { time: 'Today, 2:37 PM', event: 'Technician marked En Route to Cabin 14B', icon: '🚶', color: 'text-[#D4820A]' },
  { time: 'Today, 2:41 PM', event: 'Work started — In Progress', icon: '🔧', color: 'text-[#C1272D]' },
];

export default function S7_WorkOrder() {
  const navigate = useNavigate();

  const issue = localStorage.getItem('cabin_issue') || 'AC not working';
  const rawCat = localStorage.getItem('cabin_category');
  const categoryLabel = rawCat ? JSON.parse(rawCat).label : 'Comfort — AC / Temperature';

  return (
    <div className="min-h-screen bg-[#F7F4F1]">

      {/* Header Bar */}
      <div className="bg-white border-b border-[#E8E2DC] shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-[#6B6B6B]/50 hover:text-[#6B6B6B] text-[11px] transition-colors"
            >
              <span>←</span>
              <span>Flow Overview</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[#1A1A1A] font-bold text-base">Work Order #WO-2024-0047</h1>
              <span className="bg-[#4A6FA5]/15 border border-[#4A6FA5]/30 text-[#4A6FA5] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                In Progress
              </span>
            </div>
            <p className="text-[#6B6B6B] text-xs mt-0.5">Today, 2:35 PM</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">

        {/* Work Order Card */}
        <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E8E2DC]">
            <h2 className="text-[#1A1A1A] font-semibold text-base">Issue Details</h2>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                ['Guest', 'Aryan Mehta'],
                ['Cabin', '14B'],
                ['Issue', issue],
                ['Category', categoryLabel],
                ['Reported', 'Today, 2:34 PM'],
                ['Parts Required', 'None'],
                ['Est. Completion', '25 minutes'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[#6B6B6B] text-xs font-medium mb-1">{label}</p>
                  <p className="text-[#1A1A1A] text-sm font-semibold">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-[#6B6B6B] text-xs font-medium mb-1">Severity</p>
                <span className="inline-flex items-center bg-[#C1272D]/15 border border-[#C1272D]/30 text-[#C1272D] text-xs font-semibold px-2.5 py-1 rounded-full">
                  High
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Section */}
        <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E8E2DC]">
            <h2 className="text-[#1A1A1A] font-semibold text-base">Assigned Technician</h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-base">RK</span>
              </div>
              <div className="flex-1">
                <p className="text-[#1A1A1A] font-bold text-base">Raj Kumar</p>
                <p className="text-[#6B6B6B] text-sm mt-0.5">HVAC Certified Technician</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C1272D]" />
                  <span className="text-[#6B6B6B] text-xs">Deck 5 — Currently nearby</span>
                </div>
                <p className="text-[#6B6B6B] text-xs italic mt-3 leading-relaxed">
                  "Selected based on: nearest location, HVAC certification, current availability"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SLA Bar */}
        <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#1A1A1A] font-semibold text-sm">SLA Target</p>
            <p className="text-[#D4820A] font-bold text-sm">Complete within 25:00</p>
          </div>
          <div className="w-full bg-[#E8E2DC] rounded-full h-2">
            <div className="bg-[#2E7D52] h-2 rounded-full transition-all" style={{ width: '28%' }} />
          </div>
          <p className="text-[#6B6B6B] text-xs mt-2">7 of 25 minutes elapsed — On track</p>
        </div>

        {/* Activity / Audit Log */}
        <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E8E2DC]">
            <h2 className="text-[#1A1A1A] font-semibold text-base">Activity Log</h2>
          </div>
          <div className="px-6 py-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#E8E2DC]" />
              <div className="space-y-4">
                {auditLog.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-[#E8E2DC] flex items-center justify-center flex-shrink-0 mt-0.5 z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#B8963E]" />
                    </div>
                    <div className="flex-1 pb-1">
                      <p className={`text-sm font-medium ${entry.color}`}>
                        <span className="mr-1.5">{entry.icon}</span>
                        {entry.event}
                      </p>
                      <p className="text-[#6B6B6B] text-xs mt-0.5">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <button
            onClick={() => navigate('/technician')}
            className="w-full bg-[#C1272D] text-white py-4 rounded-2xl font-semibold text-base shadow-md hover:bg-[#a82025] transition-colors flex items-center justify-center gap-2"
          >
            View Technician Screen →
          </button>
          <button
            onClick={() => navigate('/agent')}
            className="w-full border-2 border-[#C1272D] text-[#C1272D] py-4 rounded-2xl font-semibold text-base hover:bg-[#C1272D]/5 transition-colors"
          >
            View Agent Console
          </button>
        </div>

      </div>
    </div>
  );
}
