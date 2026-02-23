import { Project } from "../types";

interface ProjectManagerProps {
  projects: Project[];
}

export default function ProjectManager({ projects }: ProjectManagerProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="p-1 bg-green-100 rounded text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
          Time Tracking & Projects
        </h3>
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
          Escrow Integrated
        </span>
      </div>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{project.title}</h4>
                  <p className="text-xs text-gray-500">Client: {project.client}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                  {project.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Logged: <strong className="text-gray-900">{project.hoursLogged}h</strong></span>
                  <span className="text-gray-600">Budget: <strong className="text-gray-900">{project.budget}</strong></span>
                </div>
                <button className="text-green-600 font-bold hover:underline">
                  Log Time
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
            <p className="text-sm text-gray-400">No active projects found.</p>
            <p className="text-[11px] text-gray-400 mt-1">Accept a job to start tracking time.</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full py-2 bg-gray-50 text-gray-600 text-sm font-semibold rounded-md hover:bg-gray-100 transition-colors border border-gray-200">
          View All Projects
        </button>
      </div>
    </div>
  );
}
