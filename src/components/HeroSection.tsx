import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Upload, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/browse");
    }
  };

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Join 100,000+ Students Worldwide
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Share & Access
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premium Study Materials
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload your notes, download quality study materials, and collaborate with fellow students. 
            Get AI-powered summaries and personalized recommendations.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for notes, subjects, or universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl">
                Search
              </Button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => navigate("/upload")}>
              <Upload className="w-5 h-5 mr-2" />
              Upload Your Notes
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-slate-300 hover:border-blue-500 px-8 py-4 rounded-xl" onClick={() => navigate("/browse")}>
              Browse All Materials
            </Button>
          </div>

          {/* Popular Searches */}
          <div className="mt-12">
            <p className="text-sm text-slate-500 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Calculus", "Physics", "Chemistry", "Computer Science", "Biology", "Engineering"].map((subject) => (
                <button
                  key={subject}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  onClick={() => setSearchQuery(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
