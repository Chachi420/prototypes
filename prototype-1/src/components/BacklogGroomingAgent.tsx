import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, ListTodo, Network, CheckCircle, Menu, X, Check, XCircle, Edit2,
  AlertTriangle, FileJson, RefreshCw, GitMerge, Trash2, ArrowUpRight, FileText,
  Activity, ShieldAlert, Zap, Database, Loader2, Sparkles, Search, RotateCcw
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_QUEUE = [
  {
    id: '1', category: 'Duplicates', confidence: 98,
    title: 'Merge: "OAuth Login Failing" & "Google Sign-in Broken"',
    current: { items: ['PROJ-102: OAuth Login Failing', 'PROJ-145: Google Sign-in Broken'], points: '8 pts total' },
    suggested: { action: 'Merge into PROJ-102 and close PROJ-145', rationale: 'Both tickets describe the exact same 500 error on the /auth/google callback endpoint submitted within 2 hours of each other.', newPoints: '5 pts' }
  },
  {
    id: '2', category: 'Stale/Zombie Tasks', confidence: 92,
    title: 'Archive: "Update Legacy CSS Variables"',
    current: { items: ['PROJ-44: Update Legacy CSS Variables'], status: 'In Backlog for 14 months' },
    suggested: { action: "Archive / Won't Do", rationale: 'Repository was migrated to Tailwind CSS 8 months ago. Legacy CSS files no longer exist in the main branch.' }
  },
  {
    id: '3', category: 'Requirement Rewrites', confidence: 85,
    title: 'Rewrite: "Make table faster"',
    current: { description: 'Make the users table load faster, it is too slow right now.', acceptanceCriteria: 'None' },
    suggested: { description: 'Implement server-side pagination and indexing for the Users Table to reduce load time.', acceptanceCriteria: '1. Table loads initial 50 rows in < 500ms.\n2. Pagination controls fetch next page dynamically.\n3. Search queries use database index.' }
  },
  {
    id: '4', category: 'Priority Updates', confidence: 89,
    title: 'Escalate: "Stripe Webhook Failing"',
    current: { priority: 'Low', sprint: 'Backlog' },
    suggested: { priority: 'Highest', sprint: 'Next Sprint (Action Required)', rationale: 'Customer feedback tool detected 15+ complaints today regarding failed payments. Revenue impacting.' }
  }
];

const DEPENDENCIES = [
  { id: 'd1', task: 'PROJ-201: Launch New Billing UI', status: 'Scheduled (Sprint 42)', blockedBy: 'PROJ-199: Update Stripe API Version', blockerStatus: 'Un-groomed Backlog', rescheduleSprint: 'Sprint 41' },
  { id: 'd2', task: 'PROJ-180: Email Notification System', status: 'Scheduled (Sprint 42)', blockedBy: 'PROJ-165: Setup SendGrid Webhooks', blockerStatus: 'Requires Rewrite (Vague)', rescheduleSprint: 'Sprint 41' }
];

const PIPELINE_STEPS = [
  'Connecting to Jira Cloud',
  'Fetching backlog tasks',
  'Embedding tickets for similarity search',
  'Running AI health analysis',
  'Generating grooming suggestions',
];

const FIX_STEPS = [
  'Analyzing dependency chain',
  'Rescheduling blocker to Sprint 41',
  'Updating sprint assignments',
  'Notifying team leads',
  'Sequencing fixed',
];

const JIRA_SYNC_OUT_STEPS = [
  'Authenticating with Jira Cloud',
  'Preparing approved changes',
  'Uploading changes to Project Nexus',
  'Verifying sync integrity',
  'Sync complete',
];

const EXPORT_STEPS = [
  'Compiling approved changes',
  'Formatting requirements',
  'Generating JSON package',
  'Package ready — download starting',
];

const ISSUE_BARS = [
  { label: 'Stale / Zombie Tasks', count: 8, color: 'bg-rose-500' },
  { label: 'Duplicates', count: 5, color: 'bg-amber-500' },
  { label: 'Priority Drift', count: 3, color: 'bg-purple-500' },
  { label: 'Vague Requirements', count: 2, color: 'bg-blue-500' },
];
const ISSUE_BAR_MAX = Math.max(...ISSUE_BARS.map(b => b.count));

const STEP_IDS = ['jira', 'dashboard', 'queue', 'dependencies', 'summary'] as const;
const STEP_LABELS = ['Jira Sync', 'Command Center', 'Queue', 'Dependencies', 'Handoff'];

function getElapsed(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return 'Just now';
  if (secs < 3600) return `${Math.floor(secs / 60)} min ago`;
  return `${Math.floor(secs / 3600)} hr ago`;
}

function PipelineSteps({ steps, completedCount, running }: { steps: string[]; completedCount: number; running: boolean }) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const done = i < completedCount;
        const active = i === completedCount && running;
        return (
          <div key={step} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
              ${done ? 'bg-emerald-100' : active ? 'bg-indigo-100' : 'bg-slate-100'}`}>
              {done
                ? <Check className="w-3.5 h-3.5 text-emerald-600" />
                : active
                  ? <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  : <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              }
            </div>
            <span className={`text-sm font-medium transition-colors duration-300
              ${done ? 'text-slate-900' : active ? 'text-indigo-700' : 'text-slate-400'}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function BacklogGroomingAgent() {
  const [currentScreen, setCurrentScreen] = useState('jira');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [queueItems, setQueueItems] = useState(INITIAL_QUEUE);
  const [activeTab, setActiveTab] = useState('All');
  const [actionMetrics, setActionMetrics] = useState({ accepted: 0, rejected: 0, edited: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [minConfidence, setMinConfidence] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'complete'>('idle');
  const [completedSteps, setCompletedSteps] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [, setTick] = useState(0);
  const syncTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [fixStates, setFixStates] = useState<Record<string, { state: 'idle' | 'running' | 'complete'; step: number }>>({
    d1: { state: 'idle', step: 0 },
    d2: { state: 'idle', step: 0 },
  });
  const fixTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [jiraSyncOutState, setJiraSyncOutState] = useState<'idle' | 'running' | 'complete'>('idle');
  const [jiraSyncOutStep, setJiraSyncOutStep] = useState(0);
  const [exportState, setExportState] = useState<'idle' | 'running' | 'complete'>('idle');
  const [exportStep, setExportStep] = useState(0);
  const jiraSyncOutTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const exportTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => {
    syncTimers.current.forEach(clearTimeout);
    fixTimers.current.forEach(clearTimeout);
    jiraSyncOutTimers.current.forEach(clearTimeout);
    exportTimers.current.forEach(clearTimeout);
  }, []);

  const handleSync = () => {
    if (syncState === 'syncing') return;
    setSyncState('syncing');
    setCompletedSteps(0);
    syncTimers.current.forEach(clearTimeout);
    syncTimers.current = PIPELINE_STEPS.map((_, i) =>
      setTimeout(() => {
        setCompletedSteps(i + 1);
        if (i === PIPELINE_STEPS.length - 1) {
          setSyncState('complete');
          setLastSyncedAt(new Date());
        }
      }, (i + 1) * 1000)
    );
  };

  const handleFixSequencing = (depId: string) => {
    if (fixStates[depId].state !== 'idle') return;
    setFixStates(prev => ({ ...prev, [depId]: { state: 'running', step: 0 } }));
    const timers = FIX_STEPS.map((_, i) =>
      setTimeout(() => {
        setFixStates(prev => ({
          ...prev,
          [depId]: { state: i === FIX_STEPS.length - 1 ? 'complete' : 'running', step: i + 1 }
        }));
      }, (i + 1) * 800)
    );
    fixTimers.current = [...fixTimers.current, ...timers];
  };

  const handleJiraSyncOut = () => {
    if (jiraSyncOutState !== 'idle') return;
    setJiraSyncOutState('running');
    setJiraSyncOutStep(0);
    jiraSyncOutTimers.current = JIRA_SYNC_OUT_STEPS.map((_, i) =>
      setTimeout(() => {
        setJiraSyncOutStep(i + 1);
        if (i === JIRA_SYNC_OUT_STEPS.length - 1) setJiraSyncOutState('complete');
      }, (i + 1) * 900)
    );
  };

  const handleExport = () => {
    if (exportState !== 'idle') return;
    setExportState('running');
    setExportStep(0);
    exportTimers.current = EXPORT_STEPS.map((_, i) =>
      setTimeout(() => {
        setExportStep(i + 1);
        if (i === EXPORT_STEPS.length - 1) setExportState('complete');
      }, (i + 1) * 700)
    );
  };

  const handleBulkAccept = () => {
    setActionMetrics(prev => ({ ...prev, accepted: prev.accepted + selectedItems.length }));
    setQueueItems(prev => prev.filter(i => !selectedItems.includes(i.id)));
    setSelectedItems([]);
  };

  const handleBulkReject = () => {
    setActionMetrics(prev => ({ ...prev, rejected: prev.rejected + selectedItems.length }));
    setQueueItems(prev => prev.filter(i => !selectedItems.includes(i.id)));
    setSelectedItems([]);
  };

  const handleNewSession = () => {
    syncTimers.current.forEach(clearTimeout);
    fixTimers.current.forEach(clearTimeout);
    jiraSyncOutTimers.current.forEach(clearTimeout);
    exportTimers.current.forEach(clearTimeout);
    setQueueItems(INITIAL_QUEUE);
    setActionMetrics({ accepted: 0, rejected: 0, edited: 0 });
    setSelectedItems([]);
    setActiveTab('All');
    setSearchQuery('');
    setMinConfidence(0);
    setSyncState('idle');
    setCompletedSteps(0);
    setLastSyncedAt(null);
    setFixStates({ d1: { state: 'idle', step: 0 }, d2: { state: 'idle', step: 0 } });
    setJiraSyncOutState('idle');
    setJiraSyncOutStep(0);
    setExportState('idle');
    setExportStep(0);
    setCurrentScreen('jira');
  };

  const handleAction = (id: string, actionType: 'accepted' | 'rejected' | 'edited') => {
    setQueueItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(s => s !== id));
    setActionMetrics(prev => ({ ...prev, [actionType]: prev[actionType] + 1 }));
  };

  const navItems = [
    { id: 'jira', label: 'Jira Sync', icon: RefreshCw },
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'queue', label: 'Grooming Queue', icon: ListTodo, badge: queueItems.length },
    { id: 'dependencies', label: 'Dependency Matrix', icon: Network },
    { id: 'summary', label: 'Handoff & Summary', icon: CheckCircle },
  ] as const;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Duplicates': return <GitMerge className="w-4 h-4" />;
      case 'Stale/Zombie Tasks': return <Trash2 className="w-4 h-4" />;
      case 'Priority Updates': return <ArrowUpRight className="w-4 h-4" />;
      case 'Requirement Rewrites': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // ─── PROGRESS STEPPER ────────────────────────────────────────────────────────
  const currentStepIndex = STEP_IDS.indexOf(currentScreen as typeof STEP_IDS[number]);

  const renderStepper = () => (
    <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-1 flex-shrink-0">
      {STEP_LABELS.map((label, i) => {
        const isActive = i === currentStepIndex;
        const isDone = i < currentStepIndex;
        return (
          <React.Fragment key={label}>
            <button
              onClick={() => setCurrentScreen(STEP_IDS[i])}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDone
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
              {isDone
                ? <Check className="w-3 h-3 flex-shrink-0" />
                : <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0
                    ${isActive ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</span>
              }
              {label}
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div className={`h-px w-5 flex-shrink-0 ${i < currentStepIndex ? 'bg-emerald-300' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ─── JIRA SYNC SCREEN ────────────────────────────────────────────────────────
  const renderJiraSync = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Jira Sync & AI Analysis</h2>
        <p className="text-slate-500 text-sm mt-1">Pull your latest backlog and let the agent detect health issues automatically.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">Jira Cloud — Project Nexus</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Connected
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              nexus.atlassian.net • {lastSyncedAt ? `Last synced: ${getElapsed(lastSyncedAt)}` : 'Never synced'}
            </p>
          </div>
        </div>
        <button onClick={handleSync} disabled={syncState === 'syncing'}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all flex-shrink-0
            ${syncState === 'syncing' ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
          {syncState === 'syncing'
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Syncing...</>
            : <><RefreshCw className="w-4 h-4" /> Pull Backlog from Jira</>}
        </button>
      </div>

      {syncState === 'idle' && (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-16 flex flex-col items-center justify-center text-center">
          <Database className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-sm text-slate-500">
            Click <span className="font-semibold text-slate-700">Pull Backlog from Jira</span> to start the AI analysis.
          </p>
        </div>
      )}

      {(syncState === 'syncing' || syncState === 'complete') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900">Agent Pipeline</h3>
          </div>
          <PipelineSteps steps={PIPELINE_STEPS} completedCount={completedSteps} running={syncState === 'syncing'} />
        </div>
      )}

      {syncState === 'complete' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold">AI Backlog Analysis Complete</h3>
            </div>
            <p className="text-indigo-100 text-sm">
              Scanned <span className="font-bold text-white">1,248</span> tickets. Found <span className="font-bold text-white">4</span> items needing your attention.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <GitMerge className="w-5 h-5 text-amber-500" />, count: 1, label: 'Duplicates', bg: 'bg-amber-50' },
              { icon: <Trash2 className="w-5 h-5 text-rose-500" />, count: 1, label: 'Stale Tasks', bg: 'bg-rose-50' },
              { icon: <FileText className="w-5 h-5 text-blue-500" />, count: 1, label: 'Vague Requirements', bg: 'bg-blue-50' },
              { icon: <ArrowUpRight className="w-5 h-5 text-purple-500" />, count: 1, label: 'Priority Drift', bg: 'bg-purple-50' },
            ].map(({ icon, count, label, bg }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>{icon}</div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setCurrentScreen('queue')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
            Review 4 Suggestions in Grooming Queue <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  // ─── COMMAND CENTER ───────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Backlog Health Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Total Backlog Items</p>
              <h3 className="text-4xl font-bold text-slate-900 mt-1">1248</h3>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg"><ListTodo className="w-6 h-6 text-slate-500" /></div>
          </div>
          <p className="text-sm text-emerald-600 mt-4 flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-1" /> -12% vs last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-indigo-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Items Needing Grooming</p>
              <h3 className="text-4xl font-bold text-slate-900 mt-1">{queueItems.length}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg"><Zap className="w-6 h-6 text-indigo-500" /></div>
          </div>
          <button onClick={() => setCurrentScreen('queue')}
            className="mt-4 w-full text-sm font-medium bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors">
            Review Suggestions →
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Last Jira Sync</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {lastSyncedAt ? getElapsed(lastSyncedAt) : 'Never'}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg"><RefreshCw className="w-6 h-6 text-emerald-500" /></div>
          </div>
          <button onClick={() => setCurrentScreen('jira')}
            className="mt-4 w-full text-sm font-medium bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors">
            Run Sync →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-6">Issues Detected by Category</h3>
        <div className="space-y-5">
          {ISSUE_BARS.map(({ label, count, color }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-700">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{count}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`${color} h-1.5 rounded-full transition-all duration-700`}
                  style={{ width: `${(count / ISSUE_BAR_MAX) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Recent Automated Runs</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { time: '10 mins ago', desc: 'Analyzed 45 new customer feedback tickets. Generated 2 priority escalation suggestions.' },
            { time: '2 hours ago', desc: 'Overnight duplicate detection run complete. Found 4 potential duplicates.' },
            { time: 'Yesterday', desc: 'Stale task sweep: flagged 12 tasks older than 6 months without updates.' }
          ].map((a, i) => (
            <div key={i} className="px-6 py-4 flex items-start gap-4">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">{a.desc}</p>
                <p className="text-xs text-slate-500 mt-1">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── GROOMING QUEUE ───────────────────────────────────────────────────────────
  const renderQueue = () => {
    const tabs = ['All', 'Duplicates', 'Stale/Zombie Tasks', 'Priority Updates', 'Requirement Rewrites'];
    const filteredItems = queueItems
      .filter(i => activeTab === 'All' || i.category === activeTab)
      .filter(i => i.confidence >= minConfidence)
      .filter(i => searchQuery === '' || i.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const allSelected = filteredItems.length > 0 && filteredItems.every(i => selectedItems.includes(i.id));
    const toggleSelectAll = () => setSelectedItems(allSelected ? [] : filteredItems.map(i => i.id));
    const toggleItem = (id: string) =>
      setSelectedItems(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

    return (
      <div className="space-y-5 h-full flex flex-col animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Grooming Queue</h2>
            <p className="text-slate-500 text-sm mt-1">Review AI suggestions. Nothing is committed until you approve.</p>
          </div>
          {queueItems.length === 0 && (
            <button onClick={() => setCurrentScreen('summary')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
              Complete Session
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text" placeholder="Search suggestions..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-sm text-slate-700 outline-none placeholder-slate-400 bg-transparent"
            />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <span className="text-sm text-slate-500 whitespace-nowrap">Min confidence:</span>
            <input type="range" min={0} max={100} value={minConfidence}
              onChange={e => setMinConfidence(Number(e.target.value))}
              className="w-32 accent-indigo-600" />
            <span className="text-sm font-semibold text-slate-700 w-8">{minConfidence}%</span>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-1">
          {tabs.map(tab => {
            const count = tab === 'All' ? queueItems.length : queueItems.filter(i => i.category === tab).length;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap border
                  ${activeTab === tab ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'}`}>
                {tab}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold
                  ${activeTab === tab ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-12">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-dashed border-slate-300">
              <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
              <p className="text-slate-500 mt-1 max-w-sm">No suggestions match your current filters.</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-900 rounded-xl px-4 py-3 flex items-center gap-3">
                <button onClick={toggleSelectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${allSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500 bg-transparent'}`}>
                  {allSelected && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className="text-sm font-medium text-white flex-1">Select all ({filteredItems.length})</span>
              </div>

              {selectedItems.length > 0 && (
                <div className="bg-indigo-600 rounded-xl px-4 py-3 flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
                  <span className="text-sm font-medium text-white">
                    {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex gap-2">
                    <button onClick={handleBulkReject}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors">
                      <X className="w-3.5 h-3.5" /> Reject All
                    </button>
                    <button onClick={handleBulkAccept}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white hover:bg-indigo-50 text-indigo-700 rounded-lg transition-colors">
                      <Check className="w-3.5 h-3.5" /> Accept All
                    </button>
                  </div>
                </div>
              )}

              {filteredItems.map(item => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <div key={item.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md
                    ${isSelected ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200'}`}>
                    <div className="px-5 py-4 flex items-center gap-4">
                      <button onClick={() => toggleItem(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                          ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 bg-white hover:border-indigo-400'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                          {getCategoryIcon(item.category)} {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5 truncate">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex-shrink-0">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">{item.confidence}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 border-t border-slate-100">
                      <div className="p-5">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Current State
                        </h5>
                        <div className="space-y-2">
                          {Object.entries(item.current).map(([key, val]) => (
                            <div key={key}>
                              <span className="text-xs font-medium text-slate-500 capitalize block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <div className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                {Array.isArray(val) ? val.map((v, i) => <div key={i}>• {v}</div>) : val}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 bg-indigo-50/10">
                        <h5 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> AI Suggestion
                        </h5>
                        <div className="space-y-2">
                          {Object.entries(item.suggested).map(([key, val]) => (
                            <div key={key}>
                              <span className="text-xs font-medium text-slate-500 capitalize block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <div className="text-sm text-slate-800 bg-white p-2.5 rounded-lg border border-indigo-100 shadow-sm">
                                {typeof val === 'string' && val.includes('\n')
                                  ? val.split('\n').map((line, i) => <div key={i}>{line}</div>) : val}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
                      <button onClick={() => handleAction(item.id, 'edited')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" /> Modify
                      </button>
                      <button onClick={() => handleAction(item.id, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors">
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button onClick={() => handleAction(item.id, 'accepted')}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors">
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── DEPENDENCY MATRIX ────────────────────────────────────────────────────────
  const renderDependencies = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dependency & Sequencing Matrix</h2>
        <p className="text-slate-500 text-sm mt-1">AI-detected warnings for upcoming sprints based on backlog state.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">Sprint Sequencing Risks Detected</h4>
            <p className="text-sm text-amber-700 mt-0.5">2 upcoming tasks are scheduled before their prerequisites have been properly groomed.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {DEPENDENCIES.map(dep => {
            const fix = fixStates[dep.id];
            const isDone = fix.state === 'complete';
            const isRunning = fix.state === 'running';
            return (
              <div key={dep.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="flex-1 flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex-1 border border-slate-200 rounded-lg p-4 bg-white">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scheduled Task</p>
                      <p className="text-sm font-bold text-slate-900">{dep.task}</p>
                      <p className="text-xs text-slate-500 mt-1">{dep.status}</p>
                    </div>
                    <div className="hidden md:flex flex-col items-center justify-center text-amber-500 px-2 flex-shrink-0">
                      <Network className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase mt-1">Blocked By</span>
                    </div>
                    <div className={`flex-1 border rounded-lg p-4 transition-colors ${isDone ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/40'}`}>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDone ? 'text-emerald-600' : 'text-amber-600'}`}>Prerequisite Risk</p>
                      <p className="text-sm font-bold text-slate-900">{dep.blockedBy}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {isDone
                          ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">Sequencing Fixed</span></>
                          : <><ShieldAlert className="w-3.5 h-3.5 text-rose-500" /><span className="text-xs text-rose-600 font-medium">{dep.blockerStatus}</span></>
                        }
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFixSequencing(dep.id)}
                    disabled={fix.state !== 'idle'}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all
                      ${isDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                        : isRunning
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 cursor-not-allowed'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}>
                    {isDone
                      ? <><Check className="w-4 h-4" /> Fixed</>
                      : isRunning
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Fixing...</>
                        : 'Fix Sequencing'
                    }
                  </button>
                </div>

                {(isRunning || isDone) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Agent Pipeline</span>
                    </div>
                    <PipelineSteps steps={FIX_STEPS} completedCount={fix.step} running={isRunning} />
                    {isDone && (
                      <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 animate-in fade-in duration-500">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <p className="text-sm font-medium text-emerald-800">
                          Sequencing fixed — {dep.blockedBy} rescheduled to {dep.rescheduleSprint}.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── HANDOFF & SUMMARY ────────────────────────────────────────────────────────
  const renderSummary = () => (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Grooming Session Complete</h2>
        <p className="text-slate-500 text-lg">Your backlog is cleaner, prioritized, and ready for development.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center p-4">
          <p className="text-4xl font-bold text-emerald-600">{actionMetrics.accepted}</p>
          <p className="text-sm font-medium text-slate-500 mt-2">Suggestions Accepted</p>
        </div>
        <div className="text-center p-4 border-l border-slate-100">
          <p className="text-4xl font-bold text-slate-900">{actionMetrics.edited}</p>
          <p className="text-sm font-medium text-slate-500 mt-2">Items Modified</p>
        </div>
        <div className="text-center p-4 border-l border-slate-100">
          <p className="text-4xl font-bold text-rose-500">{actionMetrics.rejected}</p>
          <p className="text-sm font-medium text-slate-500 mt-2">Suggestions Rejected</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-1">Next Steps</h3>
          <p className="text-slate-400 text-sm">Sync your approved changes back to your tracking tool or export the formal definitions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={handleJiraSyncOut} disabled={jiraSyncOutState !== 'idle'}
            className={`flex items-center justify-center gap-3 p-4 rounded-xl font-medium transition-colors
              ${jiraSyncOutState === 'complete'
                ? 'bg-emerald-600 cursor-default'
                : jiraSyncOutState === 'running'
                  ? 'bg-indigo-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500'}`}>
            {jiraSyncOutState === 'complete'
              ? <><Check className="w-5 h-5" /> Synced to Jira</>
              : jiraSyncOutState === 'running'
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Syncing...</>
                : <><RefreshCw className="w-5 h-5" /> Sync to Jira / ADO</>
            }
          </button>
          <button onClick={handleExport} disabled={exportState !== 'idle'}
            className={`flex items-center justify-center gap-3 p-4 rounded-xl font-medium border transition-colors
              ${exportState === 'complete'
                ? 'bg-emerald-600 border-emerald-600 cursor-default'
                : exportState === 'running'
                  ? 'bg-slate-700 border-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
            {exportState === 'complete'
              ? <><Check className="w-5 h-5" /> Package Downloaded</>
              : exportState === 'running'
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Exporting...</>
                : <><FileJson className="w-5 h-5" /> Export PRD Package (JSON)</>
            }
          </button>
        </div>

        {(jiraSyncOutState === 'running' || jiraSyncOutState === 'complete') && (
          <div className="bg-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sync Pipeline</span>
            </div>
            <PipelineSteps steps={JIRA_SYNC_OUT_STEPS} completedCount={jiraSyncOutStep} running={jiraSyncOutState === 'running'} />
            {jiraSyncOutState === 'complete' && (
              <div className="flex items-center gap-2 bg-emerald-900/40 border border-emerald-700 rounded-lg px-4 py-3 mt-2 animate-in fade-in duration-500">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-sm font-medium text-emerald-300">All changes synced to Jira — Project Nexus updated.</p>
              </div>
            )}
          </div>
        )}

        {(exportState === 'running' || exportState === 'complete') && (
          <div className="bg-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Export Pipeline</span>
            </div>
            <PipelineSteps steps={EXPORT_STEPS} completedCount={exportStep} running={exportState === 'running'} />
            {exportState === 'complete' && (
              <div className="flex items-center gap-2 bg-emerald-900/40 border border-emerald-700 rounded-lg px-4 py-3 mt-2 animate-in fade-in duration-500">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-sm font-medium text-emerald-300">PRD Package ready — <span className="font-bold">prd-package.json</span> download started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={handleNewSession}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-dashed border-slate-200">
        <RotateCcw className="w-4 h-4" /> Start New Session
      </button>
    </div>
  );

  // ─── SHELL ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out flex flex-col
        md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <ListTodo className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Grooming AI</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2 px-2">Menu</div>
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button key={item.id} onClick={() => { setCurrentScreen(item.id); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group border-l-2
                    ${isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                      : 'hover:bg-slate-800 hover:text-white border-transparent'}`}>
                  <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {'badge' in item && item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">PM</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Sarah Jenkins</p>
              <p className="text-xs text-slate-500 truncate">Senior Product Manager</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 flex-shrink-0">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-slate-500 hover:text-slate-700">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center text-sm text-slate-500 font-medium">
              <span>Project Nexus</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900">{navItems.find(i => i.id === currentScreen)?.label}</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-slate-600 font-medium">Agent Active</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            {renderStepper()}
            {currentScreen === 'jira' && renderJiraSync()}
            {currentScreen === 'dashboard' && renderDashboard()}
            {currentScreen === 'queue' && renderQueue()}
            {currentScreen === 'dependencies' && renderDependencies()}
            {currentScreen === 'summary' && renderSummary()}
          </div>
        </div>
      </main>
    </div>
  );
}
