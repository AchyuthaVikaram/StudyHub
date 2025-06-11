
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calculator, Atom, Dna, Monitor, Wrench } from "lucide-react";
import Header from "@/components/Header";

const Subjects = () => {
  const subjects = [
    {
      name: "Mathematics",
      icon: Calculator,
      description: "Calculus, Algebra, Statistics, and more",
      notesCount: 1250,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Physics",
      icon: Atom,
      description: "Mechanics, Thermodynamics, Quantum Physics",
      notesCount: 890,
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Chemistry", 
      icon: Atom,
      description: "Organic, Inorganic, Physical Chemistry",
      notesCount: 750,
      color: "from-green-500 to-green-600"
    },
    {
      name: "Biology",
      icon: Dna,
      description: "Molecular Biology, Genetics, Ecology",
      notesCount: 650,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      name: "Computer Science",
      icon: Monitor,
      description: "Programming, Algorithms, Data Structures",
      notesCount: 1100,
      color: "from-orange-500 to-orange-600"
    },
    {
      name: "Engineering",
      icon: Wrench,
      description: "Mechanical, Electrical, Civil Engineering",
      notesCount: 980,
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Explore Subjects
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Browse study materials organized by subject. Find notes, past papers, and guides 
            for your courses from top universities worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <Link key={subject.name} to={`/browse?subject=${subject.name.toLowerCase()}`}>
              <Card className="hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${subject.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <subject.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {subject.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      {subject.notesCount} notes available
                    </Badge>
                    <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Popular Topics Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Popular Topics This Week
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Calculus", "Data Structures", "Organic Chemistry", "Quantum Physics",
              "Machine Learning", "Linear Algebra", "Thermodynamics", "Cell Biology",
              "Software Engineering", "Statistics", "Electromagnetics", "Biochemistry"
            ].map((topic) => (
              <Link
                key={topic}
                to={`/browse?search=${topic.toLowerCase()}`}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
