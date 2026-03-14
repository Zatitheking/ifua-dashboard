import { TopBar } from "../components/layout/TopBar";
import { KpiCards } from "../components/dashboard/KpiCards";
import { PipelineFunnel } from "../components/dashboard/PipelineFunnel";
import { RevenueForecast } from "../components/dashboard/RevenueForecast";
import { TeamUtilizationBar } from "../components/dashboard/TeamUtilizationBar";
import { CCUtilizationDonut } from "../components/dashboard/CCUtilizationDonut";
import { IndustryDistribution } from "../components/dashboard/IndustryDistribution";
import { FunctionalCCDistribution } from "../components/dashboard/FunctionalCCDistribution";

export function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Pipeline és kapacitás áttekintés" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <KpiCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <PipelineFunnel />
          <RevenueForecast />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <IndustryDistribution />
          <FunctionalCCDistribution />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <TeamUtilizationBar />
          <CCUtilizationDonut />
        </div>
      </div>
    </>
  );
}
