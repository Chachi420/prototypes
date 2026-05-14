import { useNavigate } from 'react-router-dom';
import type { ComponentType } from 'react';
import S1_GuestHome from './screens/S1_GuestHome';
import S2_CategorySelection from './screens/S2_CategorySelection';
import S3_IssueDescription from './screens/S3_IssueDescription';
import S4_Tracking from './screens/S4_Tracking';
import S5_Resolution from './screens/S5_Resolution';
import S6_AgentTriage from './screens/S6_AgentTriage';
import S7_WorkOrder from './screens/S7_WorkOrder';
import S8_Technician from './screens/S8_Technician';
import S9_Dashboard from './screens/S9_Dashboard';

type ScreenType = 'mobile' | 'desktop' | 'medium';

interface ScreenConfig {
  Component: ComponentType;
  route: string;
  label: string;
  step: number;
  type: ScreenType;
  description: string;
}

const SCALE: Record<ScreenType, number> = {
  mobile: 0.40,
  desktop: 0.235,
  medium: 0.30,
};

const INNER_W: Record<ScreenType, number> = {
  mobile: 390,
  desktop: 1280,
  medium: 900,
};

const OUTER_H: Record<ScreenType, number> = {
  mobile: 320,
  desktop: 210,
  medium: 210,
};

function ScreenFrame({ config }: { config: ScreenConfig }) {
  const navigate = useNavigate();
  const { Component, route, label, step, type, description } = config;

  const scale = SCALE[type];
  const innerW = INNER_W[type];
  const outerW = Math.round(innerW * scale);
  const outerH = OUTER_H[type];

  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      {/* Step + label */}
      <div className="flex items-center gap-2 mb-0.5">
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
          style={{ fontSize: 9, background: '#B8963E' }}
        >
          {step}
        </span>
        <span className="text-white/80 text-xs font-semibold whitespace-nowrap">{label}</span>
      </div>

      {/* Frame */}
      <div
        onClick={() => navigate(route)}
        className="relative group cursor-pointer rounded-xl overflow-hidden shadow-2xl transition-all duration-200"
        style={{
          width: outerW,
          height: outerH,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Hover border glow */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
          style={{ boxShadow: 'inset 0 0 0 1.5px #B8963E' }}
        />

        {/* Scaled screen */}
        <div
          style={{
            width: innerW,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Component />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#0A1628]/0 group-hover:bg-[#0A1628]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
          <span
            className="text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl"
            style={{ background: '#B8963E' }}
          >
            Open →
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/30 text-[10px] text-center leading-tight" style={{ maxWidth: outerW }}>
        {description}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <div
      className="flex-shrink-0 flex items-center"
      style={{ marginTop: OUTER_H.mobile / 2 - 8 }}
    >
      <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
        <path
          d="M0 8H32M32 8L26 2M32 8L26 14"
          stroke="#B8963E"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function DesktopArrow() {
  return (
    <div
      className="flex-shrink-0 flex items-center"
      style={{ marginTop: OUTER_H.desktop / 2 - 8 }}
    >
      <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
        <path
          d="M0 8H32M32 8L26 2M32 8L26 14"
          stroke="#B8963E"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function FlowShowcase() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A1628] font-['Inter',sans-serif] overflow-x-auto">

      {/* Header */}
      <div
        className="px-8 py-5 flex items-center justify-between sticky top-0 z-30"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0A1628' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: 'rgba(184,150,62,0.15)',
                color: '#B8963E',
                border: '1px solid rgba(184,150,62,0.3)',
              }}
            >
              Agentic AI · Travel & Hospitality
            </span>
            <span className="text-white/30 text-[11px]">Prototype · 9 Screens</span>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight">
            Cabin Maintenance AI Agent — HSC Horizon
          </h1>
          <p className="text-white/35 text-sm mt-0.5">
            Click any screen to open · All flows are fully interactive
          </p>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          style={{ background: '#B8963E' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#a07e32')}
          onMouseLeave={e => (e.currentTarget.style.background = '#B8963E')}
        >
          Enter Demo →
        </button>
      </div>

      <div className="px-8 py-8 space-y-10">

        {/* ── Section 1: Guest Journey ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-sm">👤</span>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Guest Experience</span>
            </div>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-white/25 text-xs">Screens 1 – 5</span>
          </div>

          <div className="flex items-start gap-3 min-w-max pb-2">
            <ScreenFrame config={{ Component: S1_GuestHome, route: '/home', label: 'Guest Home', step: 1, type: 'mobile', description: 'Report issue or track requests' }} />
            <Arrow />
            <ScreenFrame config={{ Component: S2_CategorySelection, route: '/category', label: 'Category', step: 2, type: 'mobile', description: 'Select issue type' }} />
            <Arrow />
            <ScreenFrame config={{ Component: S3_IssueDescription, route: '/describe', label: 'Describe Issue', step: 3, type: 'mobile', description: 'Describe & submit' }} />
            <Arrow />
            <ScreenFrame config={{ Component: S4_Tracking, route: '/tracking', label: 'Live Tracking', step: 4, type: 'mobile', description: 'Real-time status · links to Screen 6' }} />
            <Arrow />
            <ScreenFrame config={{ Component: S5_Resolution, route: '/resolved', label: 'Resolved', step: 5, type: 'mobile', description: 'Resolution + star rating' }} />
          </div>
        </section>

        {/* Cross-flow note */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
          style={{ border: '1px dashed rgba(184,150,62,0.25)', background: 'rgba(184,150,62,0.05)' }}
        >
          <span className="text-[#B8963E] text-sm flex-shrink-0">↕</span>
          <p className="text-[#B8963E]/60 text-xs">
            <strong className="text-[#B8963E]/80">Cross-flow links:</strong>
            {' '}Screen 4 → "View Agent Activity" jumps to Screen 6 &nbsp;·&nbsp; Screen 8 → "Mark Resolved" jumps to Screen 5
          </p>
        </div>

        {/* ── Section 2: Agent + Tech ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-sm">🤖</span>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Agent & Technician Flow</span>
            </div>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-white/25 text-xs">Screens 6 – 8</span>
          </div>

          <div className="flex items-start gap-3 min-w-max pb-2">
            <ScreenFrame config={{ Component: S6_AgentTriage, route: '/agent', label: 'Agent Console', step: 6, type: 'desktop', description: 'AI triages & auto-assigns' }} />
            <DesktopArrow />
            <ScreenFrame config={{ Component: S7_WorkOrder, route: '/workorder', label: 'Work Order', step: 7, type: 'medium', description: 'Auto-generated work order' }} />
            <DesktopArrow />
            <ScreenFrame config={{ Component: S8_Technician, route: '/technician', label: 'Technician App', step: 8, type: 'mobile', description: 'Accept · progress · resolve' }} />
          </div>
        </section>

        {/* ── Section 3: Manager ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-sm">📊</span>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Manager Dashboard</span>
            </div>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-white/25 text-xs">Screen 9</span>
          </div>

          <div className="min-w-max pb-2">
            <ScreenFrame config={{ Component: S9_Dashboard, route: '/dashboard', label: 'Fleet Overview', step: 9, type: 'desktop', description: 'KPIs, issues table, recurring flags, trend chart' }} />
          </div>
        </section>

      </div>
    </div>
  );
}
