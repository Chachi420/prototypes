import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Gift } from 'lucide-react';

export default function S5_Resolution() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="min-h-screen bg-[#F7F4F1] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen bg-white shadow-xl flex flex-col">

        {/* Top Section */}
        <div className="flex-1 px-5 py-10 flex flex-col items-center overflow-y-auto pb-6">

          {/* Animated Checkmark */}
          <div className="w-24 h-24 bg-[#2E7D52]/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <span className="text-[#2E7D52] text-5xl font-bold">✓</span>
          </div>

          {/* Title */}
          <h1 className="text-[#2E7D52] text-2xl font-bold text-center mb-3">Issue Resolved!</h1>
          <p className="text-[#6B6B6B] text-sm text-center leading-relaxed px-4 mb-3">
            Your AC issue in Cabin 14B has been resolved by Raj Kumar. We hope you're comfortable now.
          </p>
          <div className="flex items-center gap-2 text-[#6B6B6B] text-sm mb-8">
            <Clock className="w-4 h-4" />
            <span>Resolved in 22 minutes</span>
          </div>

          {/* Star Rating */}
          <div className="w-full mb-6">
            <p className="text-[#1A1A1A] font-semibold text-sm text-center mb-3">How was your experience?</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-3xl transition-transform hover:scale-110 active:scale-95"
                >
                  <span className={star <= rating ? 'text-[#B8963E]' : 'text-[#E8E2DC]'}>
                    {star <= rating ? '★' : '☆'}
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-[#6B6B6B] text-xs mt-2 fade-in">
                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Could be better' : 'We\'ll improve'}
              </p>
            )}
          </div>

          {/* Comment Box */}
          <div className="w-full mb-6">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share any additional feedback..."
              className="w-full border border-[#E8E2DC] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B] resize-none h-24 focus:outline-none focus:border-[#B8963E]/50 focus:ring-2 focus:ring-[#B8963E]/10 transition-all"
            />
          </div>

          {/* Loyalty Points Card */}
          <div className="w-full border border-[#B8963E]/40 bg-[#B8963E]/5 rounded-xl p-4 flex items-start gap-3 mb-2">
            <div className="w-10 h-10 bg-[#B8963E]/15 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-[#B8963E]" />
            </div>
            <div>
              <p className="text-[#1A1A1A] font-bold text-sm">500 Loyalty Points Added</p>
              <p className="text-[#6B6B6B] text-xs mt-0.5 leading-relaxed">
                As a token of apology for any inconvenience caused.
              </p>
            </div>
          </div>

        </div>

        {/* Back to Home Button */}
        <div className="px-5 pb-8 pt-4 border-t border-[#E8E2DC]">
          <button
            onClick={() => navigate('/home')}
            className="w-full py-4 bg-[#C1272D] text-white rounded-2xl font-semibold text-base shadow-md hover:bg-[#a82025] transition-colors active:scale-[0.98]"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}
