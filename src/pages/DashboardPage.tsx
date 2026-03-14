import { TopBar } from "../components/layout/TopBar";
import { KpiCards } from "../components/dashboard/KpiCards";
import { PipelineFunnel } from "../components/dashboard/PipelineFunnel";
import { RevenueForecast } from "../components/dashboard/RevenueForecast";
import { TeamUtilizationBar } from "../components/dashboard/TeamUtilizationBar";
import { CCUtilizationDonut } from "../components/dashboard/CCUtilizationDonut";

export function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Pipeline és kapacitás áttekintés" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <KpiCards />
        <div className="grid grid-cols-2 gap-6">
          <PipelineFunnel />
          <RevenueForecast />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <TeamUtilizationBar />
          <CCUtilizationDonut />
        </div>
      </div>
    </>
  );
}
