import { Routes, Route } from 'react-router-dom';
import FlowShowcase from './FlowShowcase';
import S1_GuestHome from './screens/S1_GuestHome';
import S2_CategorySelection from './screens/S2_CategorySelection';
import S3_IssueDescription from './screens/S3_IssueDescription';
import S4_Tracking from './screens/S4_Tracking';
import S5_Resolution from './screens/S5_Resolution';
import S6_AgentTriage from './screens/S6_AgentTriage';
import S7_WorkOrder from './screens/S7_WorkOrder';
import S8_Technician from './screens/S8_Technician';
import S9_Dashboard from './screens/S9_Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FlowShowcase />} />
      <Route path="/home" element={<S1_GuestHome />} />
      <Route path="/category" element={<S2_CategorySelection />} />
      <Route path="/describe" element={<S3_IssueDescription />} />
      <Route path="/tracking" element={<S4_Tracking />} />
      <Route path="/resolved" element={<S5_Resolution />} />
      <Route path="/agent" element={<S6_AgentTriage />} />
      <Route path="/workorder" element={<S7_WorkOrder />} />
      <Route path="/technician" element={<S8_Technician />} />
      <Route path="/dashboard" element={<S9_Dashboard />} />
    </Routes>
  );
}
