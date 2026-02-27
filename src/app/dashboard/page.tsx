"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Search, Loader2, Briefcase, DollarSign, Building } from "lucide-react";

type Job = {
  id: number;
  job_description_text: string;
  predicted_salary: number;
  sector: string;
  location: string;
  created_at: string; // If available
};

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetchApi("/api/v1/jobs/", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.data);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchJobs();
      return;
    }
    
    try {
      setIsSearching(true);
      const res = await fetchApi(`/api/v1/jobs/search?skill=${encodeURIComponent(searchQuery)}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.data);
      } else {
        setError("Search failed");
      }
    } catch {
      setError("An error occurred during search");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Predictions</h1>
          <p className="mt-2 text-lg text-gray-600">Review all your previous salary estimations.</p>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto md:min-w-[400px]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by skill (e.g., Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full leading-5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm hover:shadow-md"
            />
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {loading || isSearching ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <div className="mx-auto bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <Briefcase size={48} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No predictions found</h3>
          <p className="text-gray-500 text-lg">
            {searchQuery ? "Try a different search term." : "You haven't made any salary predictions yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm font-medium border border-gray-100 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <Building size={16} />
                  {job.sector || "Unknown Sector"}
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
                  Estimated
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-6 line-clamp-3 leading-snug flex-grow">
                {job.job_description_text}
              </h3>
              
              <div className="pt-6 border-t border-gray-100 flex justify-between items-end mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Predicted Value</span>
                  <span className="text-3xl font-black text-primary flex items-center">
                    <DollarSign size={28} className="mr-[-2px] tracking-tighter" />
                    {job.predicted_salary ? job.predicted_salary.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "N/A"}
                    <span className="text-xl ml-1 text-primary/80">K</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
