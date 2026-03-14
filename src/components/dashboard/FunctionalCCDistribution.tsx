import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useAppStore } from "../../store/appStore";
import { ProjectType, PipelineStatus } from "../../types/project";
import { CompetencyCenter, CompetencyCenterLabels } from "../../types/person";
import { formatCurrency } from "../../utils/format";

const FUNCTIONAL_CC_LABELS: Record<ProjectType, string> = {
  [ProjectType.STRATEGY]: "Sales & Strategy",
  [ProjectType.OPERATIONS]: "O&O",
  [ProjectType.IT_DIGITAL]: "Digital & Tech",
  [ProjectType.FINANCE]: "CFO Advisory",
  [ProjectType.HR_CHANGE]: "People & Change",
  [ProjectType.DATA_AI]: "BI & Analytics",
};

const FUNC_COLORS: Record<string, string> = {
  "Sales & Strategy": "#8B5CF6",
  "O&O": "#F59E0B",
  "Digital & Tech": "#3B82F6",
  "CFO Advisory": "#10B981",
  "People & Change": "#EC4899",
  "BI & Analytics": "#06B6D4",
};

export function FunctionalCCDistribution() {
  const { projects, assignments, persons } = useAppStore();

  const activeProjects = projects.filter((p) =>
    ![PipelineStatus.LOST, PipelineStatus.COMPLETED].includes(p.status)
  );

  // Count how many people from each CompetencyCenter work on each functional CC (ProjectType)
  const matrix: Record<string, { funcCC: string; people: Set<string>; projectCount: number; revenue: number }> = {};

  activeProjects.forEach((p) => {
    const funcCC = FUNCTIONAL_CC_LABELS[p.projectType];
    if (!matrix[funcCC]) matrix[funcCC] = { funcCC, people: new Set(), projectCount: 0, revenue: 0 };
    matrix[funcCC].projectCount++;
    matrix[funcCC].revenue += p.weightedRevenue;

    const projectAssignments = assignments.filter((a) => a.projectId === p.id);
    projectAssignments.forEach((a) => {
      matrix[funcCC].people.add(a.personId);
    });
  });

  const data = Object.values(matrix)
    .map((d) => ({
      name: d.funcCC,
      projects: d.projectCount,
      people: d.people.size,
      revenue: d.revenue,
    }))
    .sort((a, b) => b.projects - a.projects);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Funkcionális CC eloszlás</h3>
      <p className="text-[10px] text-gray-400 mb-3">CC tagok milyen funkcionális területekre dolgoznak</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: 0, right: 20 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            formatter={(_: any, name: any, entry: any) => {
              const { projects, people, revenue } = entry.payload;
              if (name === "projects") return [`${projects} projekt`, "Projektek"];
              return [`${people} fő`, "Tanácsadók"];
            }}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Bar dataKey="projects" name="projects" radius={[4, 4, 0, 0]} barSize={32}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={FUNC_COLORS[entry.name] ?? "#94A3B8"} />
            ))}
          </Bar>
          <Bar dataKey="people" name="people" radius={[4, 4, 0, 0]} barSize={32} fillOpacity={0.4}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={FUNC_COLORS[entry.name] ?? "#94A3B8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-blue-500 rounded-sm inline-block" /> Projektek</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-blue-500/40 rounded-sm inline-block" /> Tanácsadók</span>
      </div>
    </div>
  );
}
