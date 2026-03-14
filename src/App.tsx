import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { PipelinePage } from "./pages/PipelinePage";
import { TeamPage } from "./pages/TeamPage";
import { CapacityPage } from "./pages/CapacityPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SponsorView } from "./pages/SponsorView";
import { ProjectManagerView } from "./pages/ProjectManagerView";
import { TeamMemberView } from "./pages/TeamMemberView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/capacity" element={<CapacityPage />} />
          <Route path="/views/sponsor" element={<SponsorView />} />
          <Route path="/views/pm" element={<ProjectManagerView />} />
          <Route path="/views/member" element={<TeamMemberView />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
