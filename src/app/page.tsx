import Link from "next/link";
import { Search, Building2, Briefcase, ArrowRight, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-20 pb-12 w-full">
      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center px-4 space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold mb-4 mx-auto">
          <TrendingUp size={16} />
          <span>AI-Powered Salary Insights</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tight leading-tight">
          Find your next job with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">confidence</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Get real-time salary predictions based on job descriptions and your experience. Navigate your career path smarter.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/predict" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white font-bold text-lg py-4 px-8 rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:bg-green-600 hover:-translate-y-1 transition-all duration-300">
            <Search size={22} />
            Predict Salary
          </Link>
          <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-text-primary border-2 border-border font-bold text-lg py-4 px-8 rounded-full shadow-sm hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300">
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="w-full max-w-6xl mx-auto mt-32 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Search className="text-blue-500" size={32} />,
            bg: "bg-blue-50",
            title: "Analyze Descriptions",
            desc: "Paste any job description and let our AI model extract key requirements to estimate market value."
          },
          {
            icon: <Building2 className="text-purple-500" size={32} />,
            bg: "bg-purple-50",
            title: "Company Insights",
            desc: "Factor in company revenue, size, and sector to get a highly accurate salary band tailored to the employer."
          },
          {
            icon: <Briefcase className="text-orange-500" size={32} />,
            bg: "bg-orange-50",
            title: "Experience Matters",
            desc: "Adjust predictions based on your specific years of experience in the field to know exactly what you're worth."
          }
        ].map((feature, i) => (
          <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
            <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{feature.title}</h3>
            <p className="text-text-secondary leading-relaxed text-lg">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
