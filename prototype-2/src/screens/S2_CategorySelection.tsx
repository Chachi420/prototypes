import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const categories = [
  { id: 'electrical', icon: '⚡', label: 'Electrical' },
  { id: 'comfort', icon: '❄️', label: 'Comfort — AC / Temperature' },
  { id: 'plumbing', icon: '💧', label: 'Plumbing' },
  { id: 'furniture', icon: '🪑', label: 'Furniture & Fixtures' },
  { id: 'hygiene', icon: '✨', label: 'Hygiene / Cleanliness' },
  { id: 'other', icon: '⋯', label: 'Other' },
];

export default function S2_CategorySelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    const cat = categories.find((c) => c.id === selected)!;
    localStorage.setItem('cabin_category', JSON.stringify(cat));
    navigate('/describe');
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
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#1A1A1A] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-[#1A1A1A] text-xl font-bold">What needs attention?</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Select the category that best describes your issue</p>
        </div>

        {/* Category Grid */}
        <div className="flex-1 px-5 py-6">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const isSelected = selected === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className={`rounded-2xl p-5 flex flex-col items-center gap-3 text-center transition-all duration-150 active:scale-[0.97] ${
                    isSelected
                      ? 'border-2 border-[#B8963E] bg-[#B8963E]/5 shadow-md'
                      : 'border border-[#E8E2DC] bg-white hover:border-[#B8963E]/40 hover:bg-[#F7F4F1]'
                  }`}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className={`text-sm font-medium leading-tight ${isSelected ? 'text-[#B8963E]' : 'text-[#1A1A1A]'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Button */}
        <div className="px-5 pb-8 pt-4 border-t border-[#E8E2DC]">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
              selected
                ? 'bg-[#C1272D] text-white shadow-md hover:bg-[#a82025] active:scale-[0.98]'
                : 'bg-[#E8E2DC] text-[#6B6B6B] cursor-not-allowed'
            }`}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
