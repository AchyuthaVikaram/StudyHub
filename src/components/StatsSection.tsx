
import { Users, FileText, Download, Star } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "100K+",
      label: "Active Students",
      description: "From top universities worldwide"
    },
    {
      icon: FileText,
      value: "500K+",
      label: "Study Materials",
      description: "Notes, papers, and guides"
    },
    {
      icon: Download,
      value: "2M+",
      label: "Downloads",
      description: "Materials accessed monthly"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Average Rating",
      description: "From verified students"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-slate-700 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-slate-500">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
