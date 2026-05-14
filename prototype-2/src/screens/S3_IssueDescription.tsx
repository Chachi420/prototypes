import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, AlertTriangle } from 'lucide-react';

const issueChips = ['AC not working', 'Too cold', 'Too loud', 'No airflow'];

export default function S3_IssueDescription() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [details, setDetails] = useState('');

  return (
    <div className="min-h-screen bg-[#F7F4F1] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen bg-white shadow-xl flex flex-col">

        {/* Header */}
        <div className="bg-white border-b border-[#E8E2DC] px-5 pt-12 pb-5">
          <button
            onClick={() => navigate('/category')}
            className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          {/* Breadcrumb chip */}
          <div className="inline-flex items-center gap-1.5 bg-[#B8963E]/10 border border-[#B8963E]/30 rounded-full px-3 py-1 mb-3">
            <span className="text-sm">❄️</span>
            <span className="text-[#B8963E] text-xs font-semibold">Comfort — AC / Temperature</span>
          </div>
          <h1 className="text-[#1A1A1A] text-xl font-bold">Describe the issue</h1>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto">

          {/* Issue Chips */}
          <div>
            <p className="text-[#1A1A1A] font-semibold text-sm mb-3">Select specific issue</p>
            <div className="flex flex-wrap gap-2">
              {issueChips.map((chip) => {
                const isSelected = selectedIssue === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setSelectedIssue(isSelected ? null : chip)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
                      isSelected
                        ? 'bg-[#C1272D] text-white border-[#C1272D] shadow-sm'
                        : 'bg-white text-[#1A1A1A] border-[#E8E2DC] hover:border-[#C1272D]/40'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity Badge */}
          {selectedIssue && (
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 bg-[#D4820A]/10 border border-[#D4820A]/20 rounded-full px-3 py-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D4820A]" />
                <span className="text-[#D4820A] text-xs font-semibold">Comfort Issue — Standard Priority</span>
              </div>
            </div>
          )}

          {/* Free Text Field */}
          <div>
            <p className="text-[#1A1A1A] font-semibold text-sm mb-2">Additional details</p>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add more details (optional)"
              className="w-full border border-[#E8E2DC] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B] resize-none h-24 focus:outline-none focus:border-[#C1272D]/50 focus:ring-2 focus:ring-[#C1272D]/10 transition-all"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <button className="w-full border-2 border-dashed border-[#E8E2DC] rounded-xl px-4 py-5 flex flex-col items-center gap-2 hover:border-[#B8963E]/50 hover:bg-[#F7F4F1] transition-all">
              <Camera className="w-6 h-6 text-[#6B6B6B]" />
              <span className="text-[#6B6B6B] text-sm font-medium">Attach a photo (optional)</span>
              <span className="text-[#6B6B6B]/60 text-xs">Tap to upload from gallery</span>
            </button>
          </div>

        </div>

        {/* Submit Button */}
        <div className="px-5 pb-8 pt-4 border-t border-[#E8E2DC]">
          <button
            onClick={() => selectedIssue && navigate('/tracking')}
            disabled={!selectedIssue}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
              selectedIssue
                ? 'bg-[#B8963E] text-white shadow-md hover:bg-[#a07e32] active:scale-[0.98]'
                : 'bg-[#E8E2DC] text-[#6B6B6B] cursor-not-allowed'
            }`}
          >
            Submit Request
          </button>
          <p className="text-center text-[#6B6B6B] text-xs mt-2">Our team will respond within 30 minutes</p>
        </div>

      </div>
    </div>
  );
}
