import { Job } from "../types";

export interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600 font-medium">{job.company}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {job.paymentMethod}
        </span>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm border-t pt-4">
        <div className="flex gap-4">
          <span className="font-semibold text-green-600">{job.rate}</span>
          <span className="text-gray-500">{job.duration}</span>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
}
