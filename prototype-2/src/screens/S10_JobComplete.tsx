import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft, Star } from 'lucide-react';

export default function S10_JobComplete() {
  const navigate = useNavigate();
  const [acknowledged, setAcknowledged] = useState(false);

  const issue = localStorage.getItem('cabin_issue') || 'AC not working';
  const notes = localStorage.getItem('cabin_resolution_notes') || 'Replaced faulty capacitor in AC unit. Cleaned filters. System tested and running at normal temperature.';

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setTimeout(() => navigate('/resolved'), 1800);
  };

  return (
    <div className="min-h-screen bg-[#F7F4F1] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen bg-white shadow-xl flex flex-col">

        {/* Header */}
        <div className="bg-white border-b border-[#E8E2DC] px-5 pt-12 pb-5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-[#6B6B6B]/50 hover:text-[#6B6B6B] text-[11px] mb-2 transition-colors"
          >
            <span>←</span>
            <span>Flow Overview</span>
          </button>
          <button
            onClick={() => navigate('/technician')}
            className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-[#2E7D52]" />
            <h1 className="text-[#2E7D52] font-bold text-base">Job Completed by Technician</h1>
          </div>
          <p className="text-[#6B6B6B] text-xs font-mono">Work Order: #WO-2024-0047</p>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto">

          {/* Completion Banner */}
          <div className="bg-[#2E7D52]/10 border border-[#2E7D52]/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2E7D52]/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-[#2E7D52]" />
            </div>
            <div>
              <p className="text-[#2E7D52] font-bold text-sm">Raj Kumar marked job complete</p>
              <p className="text-[#6B6B6B] text-xs mt-0.5">Today, 3:02 PM · HVAC Certified</p>
            </div>
          </div>

          {/* Job Summary */}
          <div className="border border-[#E8E2DC] rounded-xl p-4 bg-[#F7F4F1]">
            <h3 className="text-[#1A1A1A] font-semibold text-sm mb-3">Job Summary</h3>
            <div className="space-y-2">
              {[
                ['Guest', 'Aryan Mehta'],
                ['Cabin', '14B — Deck 5'],
                ['Issue', issue],
                ['Assigned To', 'Raj Kumar'],
                ['Time to Resolve', '22 minutes'],
                ['SLA Target', '25 minutes'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-[#6B6B6B] text-xs flex-shrink-0">{label}</span>
                  <span className="text-[#1A1A1A] text-xs font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#E8E2DC]">
              <span className="bg-[#2E7D52]/10 border border-[#2E7D52]/20 text-[#2E7D52] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                ✓ Completed Within SLA
              </span>
            </div>
          </div>

          {/* SLA Performance Bar */}
          <div className="border border-[#E8E2DC] rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#1A1A1A] font-semibold text-sm">SLA Performance</p>
              <span className="text-[#2E7D52] font-bold text-sm">88%</span>
            </div>
            <div className="w-full bg-[#E8E2DC] rounded-full h-2 mb-1.5">
              <div className="bg-[#2E7D52] h-2 rounded-full transition-all" style={{ width: '88%' }} />
            </div>
            <p className="text-[#6B6B6B] text-xs">22 of 25 minutes used · 3 minutes to spare</p>
          </div>

          {/* Resolution Notes */}
          <div className="border border-[#E8E2DC] rounded-xl p-4 bg-white">
            <h3 className="text-[#1A1A1A] font-semibold text-sm mb-2">Technician's Resolution Notes</h3>
            <p className="text-[#6B6B6B] text-sm leading-relaxed italic">"{notes}"</p>
            <p className="text-[#6B6B6B] text-xs mt-2 font-medium">— Raj Kumar, HVAC Certified</p>
          </div>

          {/* Manager Acknowledgement Card */}
          <div className="border-2 border-[#B8963E]/40 rounded-xl p-4 bg-[#B8963E]/5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[#B8963E]" />
              <h3 className="text-[#1A1A1A] font-semibold text-sm">Manager Acknowledgement Required</h3>
            </div>
            <p className="text-[#6B6B6B] text-xs mb-3 leading-relaxed">
              Verify the resolution is satisfactory, then close this work order. The guest will be notified and a loyalty reward will be issued.
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">SM</span>
              </div>
              <div>
                <p className="text-[#1A1A1A] font-semibold text-xs">Suresh Mehta</p>
                <p className="text-[#6B6B6B] text-xs">Maintenance Manager · HSC Horizon</p>
              </div>
            </div>
          </div>

        </div>

        {/* Acknowledge Button */}
        <div className="px-5 pb-8 pt-4 border-t border-[#E8E2DC]">
          {acknowledged ? (
            <div className="fade-in flex items-center justify-center gap-2 py-4">
              <CheckCircle className="w-5 h-5 text-[#2E7D52]" />
              <span className="text-[#2E7D52] font-semibold text-sm">Acknowledged — Notifying guest...</span>
            </div>
          ) : (
            <button
              onClick={handleAcknowledge}
              className="w-full py-4 bg-[#2E7D52] text-white rounded-2xl font-semibold text-base shadow-md hover:bg-[#256641] transition-colors active:scale-[0.98]"
            >
              Acknowledge & Close Work Order
            </button>
          )}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Clock className="w-3 h-3 text-[#6B6B6B]" />
            <p className="text-center text-[#6B6B6B] text-xs">Guest receives resolution confirmation + 500 loyalty points</p>
          </div>
        </div>

      </div>
    </div>
  );
}
