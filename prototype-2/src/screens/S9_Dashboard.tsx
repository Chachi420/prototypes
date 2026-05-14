

import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Star } from 'lucide-react';

const kpis = [
  { label: 'Active Issues', value: '7', color: 'text-[#D4820A]' },
  { label: 'Resolved Today', value: '23', color: 'text-[#2E7D52]' },
  { label: 'Avg Resolution', value: '18 min', color: 'text-[#C1272D]' },
  { label: 'Guest Satisfaction', value: '4.6 / 5', color: 'text-[#4A6FA5]', stars: true },
];

const issues = [
  { id: '#CM-2024-0047', cabin: '14B', issue: 'AC not working', severity: 'Medium', severityColor: 'text-[#D4820A] bg-[#D4820A]/10 border-[#D4820A]/20', assignee: 'Raj Kumar', status: 'In Progress', statusColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', eta: '18 min' },
  { id: '#CM-2024-0051', cabin: '22A', issue: 'No hot water', severity: 'High', severityColor: 'text-[#C1272D] bg-[#C1272D]/10 border-[#C1272D]/20', assignee: 'Priya Nair', status: 'Assigned', statusColor: 'text-[#D4820A] bg-[#D4820A]/10 border-[#D4820A]/20', eta: '12 min' },
  { id: '#CM-2024-0048', cabin: '8C', issue: 'Flickering lights', severity: 'Low', severityColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', assignee: 'Amir Shah', status: 'In Progress', statusColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', eta: '5 min' },
  { id: '#CM-2024-0052', cabin: '31B', issue: 'Noisy AC unit', severity: 'Medium', severityColor: 'text-[#D4820A] bg-[#D4820A]/10 border-[#D4820A]/20', assignee: 'Raj Kumar', status: 'Pending', statusColor: 'text-[#6B6B6B] bg-[#6B6B6B]/10 border-[#6B6B6B]/20', eta: '35 min' },
  { id: '#CM-2024-0044', cabin: '17D', issue: 'Wardrobe door broken', severity: 'Low', severityColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', assignee: 'Tom Chen', status: 'Resolved', statusColor: 'text-[#2E7D52] bg-[#2E7D52]/10 border-[#2E7D52]/20', eta: 'Done' },
  { id: '#CM-2024-0046', cabin: '5A', issue: 'Bathroom tile loose', severity: 'Medium', severityColor: 'text-[#D4820A] bg-[#D4820A]/10 border-[#D4820A]/20', assignee: 'Priya Nair', status: 'In Progress', statusColor: 'text-[#4A6FA5] bg-[#4A6FA5]/10 border-[#4A6FA5]/20', eta: '25 min' },
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

  return (
    <div className="min-h-screen bg-[#F7F4F1]">

      {/* Header */}
      <div className="bg-white border-b border-[#E8E2DC] shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl shadow-sm border border-[#E8E2DC] p-5"
          >
            <p className="text-[#6B6B6B] text-xs font-medium mb-2">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            {kpi.stars && (
              <div className="flex items-center gap-0.5 mt-1">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${s <= 4 ? 'fill-[#B8963E] text-[#B8963E]' : 'text-[#E8E2DC]'}`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Issues Table */}
      <div className="mx-6 rounded-xl overflow-hidden shadow-sm border border-[#E8E2DC] bg-white mb-6">
        <div className="px-5 py-4 border-b border-[#E8E2DC]">
          <h2 className="text-[#1A1A1A] font-semibold text-base">Active Issues</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[#F7F4F1] border-b border-[#E8E2DC]">
              <tr>
                {['Request ID', 'Cabin', 'Issue', 'Severity', 'Assigned To', 'Status', 'ETA'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[#6B6B6B] text-xs font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((row, idx) => (
                <tr
                  key={row.id}
                  onClick={() => navigate('/workorder')}
                  className={`cursor-pointer hover:bg-[#F7F4F1] transition-colors border-b border-[#E8E2DC] last:border-0 ${idx % 2 === 0 ? '' : 'bg-white'}`}
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
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B6B6B] text-xs font-medium">{row.eta}</td>
                </tr>
              ))}
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
        <div className="border border-[#C1272D]/30 bg-red-50 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-[#C1272D]" />
                <p className="text-[#1A1A1A] font-semibold text-sm">Cabin 22A — AC fault reported 3 times this week</p>
              </div>
              <p className="text-[#6B6B6B] text-xs mt-1">→ Flagged for preventive maintenance inspection</p>
              <p className="text-[#6B6B6B] text-xs mt-0.5">Last reported: Today, 1:15 PM</p>
            </div>
            <button className="flex-shrink-0 border-2 border-[#C1272D] text-[#C1272D] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#C1272D]/5 transition-colors whitespace-nowrap">
              Schedule Inspection
            </button>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mx-6 mb-8">
        <h2 className="text-[#1A1A1A] font-semibold text-base mb-4">Resolutions — Last 7 Days</h2>
        <div className="bg-white rounded-xl border border-[#E8E2DC] shadow-sm p-5">
          <div className="flex items-end justify-between gap-2 h-36">
            {chartData.map((d) => {
              const heightPct = (d.value / maxVal) * 100;
              return (
                <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[#1A1A1A] text-xs font-bold">{d.value}</span>
                  <div
                    className={`w-full rounded-t-md transition-all ${d.isToday ? 'bg-[#B8963E]' : 'bg-[#C1272D]'}`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className={`text-xs font-medium ${d.isToday ? 'text-[#B8963E] font-bold' : 'text-[#6B6B6B]'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
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

    </div>
  );
}
