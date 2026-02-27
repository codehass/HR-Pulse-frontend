"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, DollarSign, Briefcase } from "lucide-react";

const REVENUE_MAP: Record<string, number> = {
  'Unknown / Non-Applicable': 0,
  'Less than $1 million (USD)': 1,
  '$1 to $5 million (USD)': 2,
  '$5 to $10 million (USD)': 3,
  '$10 to $25 million (USD)': 4,
  '$25 to $50 million (USD)': 5,
  '$50 to $100 million (USD)': 6,
  '$100 to $500 million (USD)': 7,
  '$500 million to $1 billion (USD)': 8,
  '$1 to $2 billion (USD)': 9,
  '$2 to $5 billion (USD)': 10,
  '$5 to $10 billion (USD)': 11,
  '$10+ billion (USD)': 12
};

export default function Predict() {
  const { loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    revenue: 'Unknown / Non-Applicable',
    years_exp: 3,
    location: "NY",
    ownership: "Company - Private",
    sector: "Information Technology",
    job_description_text: "",
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "number" ? Number(value) : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    // Transform revenue to integer based on the map
    const payload = {
      ...formData,
      revenue: REVENUE_MAP[formData.revenue] ?? 0
    };

    try {
      const res = await fetchApi("/api/v1/jobs/salary_prediction", {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setPrediction(data.predicted_salary);
      } else {
        const data = await res.json();
        console.error("Backend Error Response:", data);
        
        if (data.detail && typeof data.detail === "object") {
          if (Array.isArray(data.detail)) {
            const messages = data.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(' | ');
            setError(messages);
          } else {
            setError(JSON.stringify(data.detail));
          }
        } else {
          setError(data.detail || `Server returned ${res.status}: ${res.statusText}`);
        }
      }
    } catch {
      setError("An error occurred during prediction");
    } finally {
      setLoading(false);
    }
  };

  const renderError = () => {
    if (!error) return null;
    let errorMessage = "";
    if (typeof error === "string") {
      errorMessage = error;
    } else if (typeof error === "object") {
      try {
        errorMessage = JSON.stringify(error);
      } catch {
        errorMessage = "An unexpected error occurred.";
      }
    }
    return (
      <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md overflow-hidden">
        <p className="text-sm text-red-700 font-medium break-words">{errorMessage}</p>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="bg-gradient-to-r from-primary to-green-400 px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 bg-white/10 w-40 h-40 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 bg-black/10 w-40 h-40 rounded-full blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <Briefcase className="text-white" size={36} />
                Salary Predictor
              </h2>
              <p className="mt-2 text-green-50 max-w-xl text-lg opacity-90">
                Provide job details to get an AI-driven salary estimate based on current backend requirements.
              </p>
            </div>
            {prediction !== null && (
              <div className="bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-lg border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Estimated Salary</div>
                <div className="text-3xl font-black text-primary flex items-center">
                  <DollarSign size={24} className="mr-[-2px]" />
                  {prediction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-xl ml-1 text-gray-400">K</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {renderError()}

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description <span className="text-red-500">*</span></label>
              <textarea
                name="job_description_text"
                rows={5}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm resize-none shadow-sm"
                placeholder="Paste the full job description here..."
                onChange={handleChange}
                value={formData.job_description_text}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sector</label>
                <select name="sector" className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" onChange={handleChange} value={formData.sector}>
                  <option>Information Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Manufacturing</option>
                  <option>Education</option>
                  <option>Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                <input type="number" name="years_exp" className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" value={formData.years_exp} onChange={handleChange} min="0" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Revenue</label>
                <select name="revenue" className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" onChange={handleChange} value={formData.revenue}>
                  {Object.keys(REVENUE_MAP).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location (State/Region)</label>
                <input type="text" name="location" className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm placeholder-gray-400" placeholder="e.g. CA, NY, London" value={formData.location} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ownership Type</label>
                <select name="ownership" className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" onChange={handleChange} value={formData.ownership}>
                  <option>Company - Private</option>
                  <option>Company - Public</option>
                  <option>Nonprofit Organization</option>
                  <option>Government</option>
                  <option>Subsidiary or Business Segment</option>
                  <option>College / University</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="animate-spin mr-3" size={24} /> Analyzing Requirements...</>
              ) : (
                <><DollarSign size={24} className="mr-2" /> Predict Salary Now</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
