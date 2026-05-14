import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Star, TrendingUp, TrendingDown, X } from 'lucide-react';

type Filter = 'all' | 'critical' | 'inProgress' | 'unacknowledged';

interface Issue {
  id: string;
  cabin: string;
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  severityColor: string;
  assignee: string;
  status: string;
  statusColor: string;
  etaLabel: string;
  etaSecs: number;
  isPending: boolean;
}

const initialIssues: Issue[] = [
  { id: '#CM-2024-0047', cabin: '14B', issue: 'AC not working', severity: 'High', severityColor: 'text-[#C1272D] bg-[#C1272D]/10 border-[#C1272D]/20', assignee: 'Raj Kumar', status: 'In Progress', statusColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', etaLabel: '18 min', etaSecs: 18 * 60, isPending: false },
  { id: '#CM-2024-0051', cabin: '22A', issue: 'No hot water', severity: 'High', severityColor: 'text-[#C1272D] bg-[#C1272D]/10 border-[#C1272D]/20', assignee: 'Priya Nair', status: 'Assigned', statusColor: 'text-[#D4820A] bg-[#D4820A]/10 border-[#D4820A]/20', etaLabel: '12 min', etaSecs: 12 * 60, isPending: false },
  { id: '#CM-2024-0048', cabin: '8C', issue: 'Flickering lights', severity: 'Low', severityColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', assignee: 'Amir Shah', status: 'In Progress', statusColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', etaLabel: '5 min', etaSecs: 5 * 60, isPending: false },
  { id: '#CM-2024-0052', cabin: '31B', issue: 'Noisy AC unit', severity: 'Medium', severityColor: 'text-[#D4820A] bg-[#D4820A]/10 border-[#D4820A]/20', assignee: 'Raj Kumar', status: 'Pending Ack', statusColor: 'text-[#6B6B6B] bg-[#6B6B6B]/10 border-[#6B6B6B]/20', etaLabel: '35 min', etaSecs: 35 * 60, isPending: true },
  { id: '#CM-2024-0044', cabin: '17D', issue: 'Wardrobe door broken', severity: 'Low', severityColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', assignee: 'Tom Chen', status: 'Resolved', statusColor: 'text-[#2E7D52] bg-[#2E7D52]/10 border-[#2E7D52]/20', etaLabel: 'Done', etaSecs: 0, isPending: false },
  { id: '#CM-2024-0046', cabin: '5A', issue: 'Bathroom tile loose', severity: 'Medium', severityColor: 'text-[#D4820A] bg-[#D4820A]/10 border-[#D4820A]/20', assignee: 'Priya Nair', status: 'In Progress', statusColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', etaLabel: '25 min', etaSecs: 25 * 60, isPending: false },
];

const availableTechs = [
  { name: 'Tom Chen', role: 'General Maintenance', proximity: 'Deck 5 — 2 min away', skills: ['Electrical', 'Fixtures', 'HVAC'], initials: 'TC' },
  { name: 'Amir Shah', role: 'Electrical Specialist', proximity: 'Deck 4 — 5 min away', skills: ['Electrical', 'AC Systems'], initials: 'AS' },
  { name: 'Diana Perez', role: 'Comfort Specialist', proximity: 'Deck 6 — 8 min away', skills: ['HVAC', 'Plumbing', 'AC Systems'], initials: 'DP' },
];

const chartData = [
  { day: 'Mon', value: 15 },
  { day: 'Tue', value: 22 },
  { day: 'Wed', value: 18 },
  { day: 'Thu', value: 27 },
  { day: 'Fri', value: 20 },
  { day: 'Sat', value: 25 },
  { day: 'Sun', value: 23, isToday: true },
];
const maxVal = Math.max(...chartData.map((d) => d.value));

export default function S9_Dashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [breached, setBreached] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [reassignedTo, setReassignedTo] = useState<string | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionDone, setInspectionDone] = useState(false);
  const [toast, setToast] = useState('');
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulate acknowledgement breach after 8s
  useEffect(() => {
    const t = setTimeout(() => {
      setBreached(true);
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  // Show toast helper
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  };

  const handleReassign = () => {
    if (!selectedTech) return;
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === '#CM-2024-0052'
          ? { ...iss, assignee: selectedTech, status: 'Reassigned', statusColor: 'text-[#2E7D52] bg-[#2E7D52]/10 border-[#2E7D52]/20', isPending: false }
          : iss
      )
    );
    setReassignedTo(selectedTech);
    setShowReassignModal(false);
    setBreached(false);
    showToast(`✓ Job #CM-2024-0052 reassigned to ${selectedTech}`);
  };

  const handleScheduleInspection = () => {
    setInspectionDone(true);
    setShowInspectionModal(false);
    showToast('✓ Preventive maintenance inspection scheduled for Cabin 22A');
  };

  const filteredIssues = issues.filter((iss) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return iss.severity === 'High';
    if (filter === 'inProgress') return iss.status === 'In Progress';
    if (filter === 'unacknowledged') return iss.isPending || iss.status === 'Pending Ack';
    return true;
  });

  const breachedIssue = issues.find((i) => i.id === '#CM-2024-0052' && i.isPending);

  return (
    <div className="min-h-screen bg-[#F7F4F1]">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 fade-in bg-[#2E7D52] text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-[#E8E2DC] shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-[#6B6B6B]/50 hover:text-[#6B6B6B] text-[11px] mb-1 transition-colors"
            >
              <span>←</span>
              <span>Flow Overview</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg">🏨</span>
              <span className="text-[#C1272D] font-bold text-lg">HSC Horizon</span>
            </div>
            <p className="text-[#6B6B6B] text-xs mt-0.5">Maintenance Dashboard</p>
          </div>
          <div className="hidden md:block text-center">
            <p className="text-[#1A1A1A] font-semibold text-sm">Thursday, 14 May 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="border-2 border-[#C1272D] text-[#C1272D] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#C1272D]/5 transition-colors"
            >
              Guest View
            </button>
            <select className="border border-[#E8E2DC] text-[#6B6B6B] text-sm px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-[#C1272D]/50">
              <option>HSC Horizon</option>
              <option>HSC Aurora</option>
              <option>HSC Pacific</option>
            </select>
          </div>
        </div>
      </div>

      {/* Breach Alert Banner */}
      {breached && breachedIssue && (
        <div className="mx-6 mt-5 fade-in bg-[#C1272D] rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <div>
              <p className="text-white font-bold text-sm">Acknowledgement Breach — #CM-2024-0052</p>
              <p className="text-white/80 text-xs">Raj Kumar has not accepted job in Cabin 31B within the 5-minute window</p>
            </div>
          </div>
          <button
            onClick={() => setShowReassignModal(true)}
            className="flex-shrink-0 bg-white text-[#C1272D] font-bold text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Reassign Now
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {[
          { label: 'Active Issues', value: '7', color: 'text-[#D4820A]', trend: 'up', delta: '+2 vs yesterday' },
          { label: 'Resolved Today', value: '23', color: 'text-[#2E7D52]', trend: 'up', delta: '+5 vs yesterday' },
          { label: 'Avg Resolution', value: '18 min', color: 'text-[#C1272D]', trend: 'down', delta: '−3 min vs yesterday' },
          { label: 'Guest Satisfaction', value: '4.6 / 5', color: 'text-[#4A6FA5]', trend: 'up', delta: '+0.2 vs yesterday', stars: true },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl shadow-sm border border-[#E8E2DC] p-5">
            <p className="text-[#6B6B6B] text-xs font-medium mb-2">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            {kpi.stars && (
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'fill-[#B8963E] text-[#B8963E]' : 'text-[#E8E2DC]'}`} />
                ))}
              </div>
            )}
            <div className={`flex items-center gap-1 mt-1.5 ${kpi.trend === 'up' ? (kpi.label === 'Avg Resolution' ? 'text-[#2E7D52]' : 'text-[#2E7D52]') : 'text-[#2E7D52]'}`}>
              {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3 text-[#2E7D52]" />}
              <span className="text-[10px] text-[#6B6B6B]">{kpi.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Issues Table */}
      <div className="mx-6 rounded-xl overflow-hidden shadow-sm border border-[#E8E2DC] bg-white mb-6">
        <div className="px-5 py-4 border-b border-[#E8E2DC] flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-[#1A1A1A] font-semibold text-base">Active Issues</h2>
          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'critical', 'inProgress', 'unacknowledged'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
                  filter === f
                    ? 'bg-[#C1272D] text-white border-[#C1272D]'
                    : 'bg-white text-[#6B6B6B] border-[#E8E2DC] hover:border-[#C1272D]/40'
                }`}
              >
                {f === 'all' ? 'All' : f === 'critical' ? '🔴 Critical' : f === 'inProgress' ? '🔵 In Progress' : '⚠ Unacknowledged'}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[#F7F4F1] border-b border-[#E8E2DC]">
              <tr>
                {['Request ID', 'Cabin', 'Issue', 'Severity', 'Assigned To', 'Status', 'ETA / Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[#6B6B6B] text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((row) => {
                const isBreach = breached && row.id === '#CM-2024-0052' && row.isPending;
                return (
                  <tr
                    key={row.id}
                    onClick={() => navigate('/workorder')}
                    className={`cursor-pointer hover:bg-[#F7F4F1] transition-colors border-b border-[#E8E2DC] last:border-0 ${
                      isBreach ? 'bg-[#C1272D]/5 animate-pulse' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-[#C1272D] text-xs font-mono font-semibold">{row.id}</td>
                    <td className="px-4 py-3 text-[#1A1A1A] text-xs font-bold">{row.cabin}</td>
                    <td className="px-4 py-3 text-[#1A1A1A] text-xs">{row.issue}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${row.severityColor}`}>
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1A1A1A] text-xs">{row.assignee}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        isBreach ? 'text-[#C1272D] bg-[#C1272D]/10 border-[#C1272D]/30' : row.statusColor
                      }`}>
                        {isBreach ? '⚠ Breached' : row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isBreach ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowReassignModal(true); }}
                          className="bg-[#C1272D] text-white text-xs font-bold px-3 py-1 rounded-lg hover:bg-[#a82025] transition-colors"
                        >
                          Reassign
                        </button>
                      ) : (
                        <span className="text-[#6B6B6B] text-xs font-medium">
                          {row.etaLabel}
                          {row.id === '#CM-2024-0052' && reassignedTo ? ` · ${reassignedTo}` : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recurring Issues */}
      <div className="mx-6 mb-6">
        <h2 className="text-[#1A1A1A] font-semibold text-base mb-3">
          <span className="mr-1">⚠</span>
          Recurring Issues — Flagged for Preventive Maintenance
        </h2>
        <div className={`border rounded-xl p-5 transition-all ${inspectionDone ? 'border-[#2E7D52]/30 bg-[#2E7D52]/5' : 'border-[#C1272D]/30 bg-red-50'}`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={`w-4 h-4 ${inspectionDone ? 'text-[#2E7D52]' : 'text-[#C1272D]'}`} />
                <p className="text-[#1A1A1A] font-semibold text-sm">Cabin 22A — AC fault reported 3 times this week</p>
              </div>
              <p className="text-[#6B6B6B] text-xs mt-1">→ Flagged for preventive maintenance inspection</p>
              <p className="text-[#6B6B6B] text-xs mt-0.5">Last reported: Today, 1:15 PM</p>
              {inspectionDone && (
                <p className="text-[#2E7D52] text-xs font-semibold mt-1.5 fade-in">✓ Inspection scheduled</p>
              )}
            </div>
            {!inspectionDone ? (
              <button
                onClick={() => setShowInspectionModal(true)}
                className="flex-shrink-0 border-2 border-[#C1272D] text-[#C1272D] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#C1272D]/5 transition-colors whitespace-nowrap"
              >
                Schedule Inspection
              </button>
            ) : (
              <span className="text-[#2E7D52] text-sm font-semibold px-4 py-2 rounded-lg bg-[#2E7D52]/10 border border-[#2E7D52]/20">
                ✓ Scheduled
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mx-6 mb-8">
        <h2 className="text-[#1A1A1A] font-semibold text-base mb-4">Resolutions — Last 7 Days</h2>
        <div className="bg-white rounded-xl border border-[#E8E2DC] shadow-sm p-5">
          <div className="flex items-end justify-between gap-2 h-36">
            {chartData.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[#1A1A1A] text-xs font-bold">{d.value}</span>
                <div
                  className={`w-full rounded-t-md transition-all ${d.isToday ? 'bg-[#B8963E]' : 'bg-[#C1272D]'}`}
                  style={{ height: `${(d.value / maxVal) * 100}%` }}
                />
                <span className={`text-xs font-medium ${d.isToday ? 'text-[#B8963E] font-bold' : 'text-[#6B6B6B]'}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E8E2DC]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#C1272D] rounded-sm"></div>
              <span className="text-[#6B6B6B] text-xs">Previous days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#B8963E] rounded-sm"></div>
              <span className="text-[#6B6B6B] text-xs">Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Reassign Modal ── */}
      {showReassignModal && (
        <div className="fixed inset-0 z-40 flex items-end justify-center" onClick={() => setShowReassignModal(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-2xl p-6 slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1A1A1A] font-bold text-base">Reassign Job #CM-2024-0052</h3>
              <button onClick={() => setShowReassignModal(false)} className="text-[#6B6B6B] hover:text-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#6B6B6B] text-sm mb-4">Select an available technician for <strong>Noisy AC unit — Cabin 31B</strong></p>
            <div className="space-y-3 mb-5">
              {availableTechs.map((tech) => (
                <button
                  key={tech.name}
                  onClick={() => setSelectedTech(tech.name)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedTech === tech.name
                      ? 'border-[#2E7D52] bg-[#2E7D52]/5'
                      : 'border-[#E8E2DC] hover:border-[#B8963E]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">{tech.initials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[#1A1A1A] font-semibold text-sm">{tech.name}</p>
                      <p className="text-[#6B6B6B] text-xs">{tech.role}</p>
                      <p className="text-[#C1272D] text-xs mt-0.5">📍 {tech.proximity}</p>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {tech.skills.map((s) => (
                          <span key={s} className="bg-[#F7F4F1] border border-[#E8E2DC] text-[#6B6B6B] text-[10px] px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedTech === tech.name && (
                      <div className="w-5 h-5 bg-[#2E7D52] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleReassign}
              disabled={!selectedTech}
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                selectedTech ? 'bg-[#2E7D52] text-white hover:bg-[#256641]' : 'bg-[#E8E2DC] text-[#6B6B6B] cursor-not-allowed'
              }`}
            >
              Confirm Reassignment
            </button>
          </div>
        </div>
      )}

      {/* ── Schedule Inspection Modal ── */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" onClick={() => setShowInspectionModal(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl p-6 fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#1A1A1A] font-bold text-base">Schedule Preventive Inspection</h3>
              <button onClick={() => setShowInspectionModal(false)}>
                <X className="w-5 h-5 text-[#6B6B6B]" />
              </button>
            </div>
            <div className="bg-[#F7F4F1] rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Cabin</span><span className="font-semibold">22A</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Issue</span><span className="font-semibold">AC — 3 faults this week</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Suggested Date</span><span className="font-semibold text-[#C1272D]">Tomorrow, 09:00 AM</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Assigned To</span><span className="font-semibold">Priya Nair</span></div>
            </div>
            <button
              onClick={handleScheduleInspection}
              className="w-full py-3.5 bg-[#C1272D] text-white rounded-xl font-bold text-sm hover:bg-[#a82025] transition-colors"
            >
              Confirm Inspection
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
