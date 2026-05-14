import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

const steps = ['Submitted', 'AI Processing', 'Assigned', 'In Progress', 'Resolved'];

export default function S4_Tracking() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTechCard, setShowTechCard] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const issue = localStorage.getItem('cabin_issue') || 'AC not working';

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCurrentStep(2);
      setShowTechCard(true);
    }, 3000);
    const t2 = setTimeout(() => {
      setCurrentStep(3);
      setInProgress(true);
    }, 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

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
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-[#2E7D52]" />
            <h1 className="text-[#2E7D52] font-bold text-base">Request Submitted ✓</h1>
          </div>
          <p className="text-[#6B6B6B] text-sm font-mono">Request ID: #CM-2024-0047</p>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto pb-6">

          {/* Issue Summary Card */}
          <div className="border border-[#E8E2DC] rounded-xl p-4 bg-[#F7F4F1]">
            <h3 className="text-[#1A1A1A] font-semibold text-sm mb-3">Issue Summary</h3>
            <div className="space-y-2">
              {[
                ['Category', localStorage.getItem('cabin_category') ? JSON.parse(localStorage.getItem('cabin_category')!).label : 'Comfort — AC / Temperature'],
                ['Issue', issue],
                ['Cabin', '14B'],
                ['Submitted', 'Today, 2:34 PM'],
                ['Estimated resolution', '~25 minutes'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-[#6B6B6B] text-xs flex-shrink-0">{label}</span>
                  <span className="text-[#1A1A1A] text-xs font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper */}
          <div>
            <h3 className="text-[#1A1A1A] font-semibold text-sm mb-4">Request Progress</h3>
            <div className="relative flex items-start justify-between overflow-x-auto pb-2">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                const isPending = idx > currentStep;
                return (
                  <div key={step} className="flex flex-col items-center relative flex-1 min-w-0">
                    {idx > 0 && (
                      <div
                        className={`absolute top-3.5 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                          idx <= currentStep ? 'bg-[#2E7D52]' : 'bg-[#E8E2DC]'
                        }`}
                        style={{ left: '-50%', right: '50%', width: '100%' }}
                      />
                    )}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isCompleted
                          ? 'bg-[#2E7D52] text-white'
                          : isActive
                          ? 'bg-[#D4820A]/20 text-[#D4820A] border-2 border-[#D4820A] animate-pulse'
                          : 'bg-[#F7F4F1] text-[#6B6B6B] border border-[#E8E2DC]'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <p
                      className={`text-center mt-1.5 text-[10px] leading-tight px-0.5 ${
                        isCompleted
                          ? 'text-[#2E7D52] font-semibold'
                          : isActive
                          ? 'text-[#D4820A] font-semibold'
                          : isPending
                          ? 'text-[#6B6B6B]'
                          : 'text-[#6B6B6B]'
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SLA Countdown */}
          <div className="flex items-center gap-2 text-[#6B6B6B]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">~22 min remaining for resolution</span>
          </div>

          {/* Technician Assigned Card */}
          {showTechCard && (
            <div className="fade-in border border-[#2E7D52]/30 bg-[#2E7D52]/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-[#2E7D52]" />
                <span className="text-[#2E7D52] font-semibold text-sm">Technician Assigned</span>
              </div>
              <div className="space-y-1">
                <p className="text-[#1A1A1A] font-medium text-sm">Raj Kumar — HVAC Certified</p>
                <p className="text-[#6B6B6B] text-xs">📍 Deck 5 — Currently nearby</p>
                {inProgress ? (
                  <p className="text-[#4A6FA5] text-xs font-semibold mt-1">🔧 Work in progress</p>
                ) : (
                  <p className="text-[#D4820A] text-xs font-semibold mt-1">ETA: 22 minutes</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/agent')}
              className="w-full py-3.5 rounded-xl font-semibold text-sm border-2 border-[#C1272D] text-[#C1272D] hover:bg-[#C1272D]/5 transition-colors"
            >
              View Agent Activity
            </button>
            <button
              onClick={() => navigate('/workorder')}
              className="w-full py-3.5 rounded-xl font-semibold text-sm border-2 border-[#B8963E] text-[#B8963E] hover:bg-[#B8963E]/5 transition-colors"
            >
              View Work Order
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
