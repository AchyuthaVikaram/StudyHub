
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, Eye, FileText, User } from "lucide-react";

const PopularNotes = () => {
  // Sample data - this will be replaced with real data from the backend
  const popularNotes = [
    {
      id: 1,
      title: "Calculus II - Integration Techniques",
      description: "Comprehensive notes covering all integration methods including substitution, integration by parts, and partial fractions.",
      subject: "Mathematics",
      semester: "2nd",
      university: "MIT",
      rating: 4.8,
      downloads: 1250,
      views: 3420,
      fileType: "PDF",
      uploader: "Sarah Chen",
      uploadDate: "2 days ago",
      tags: ["calculus", "integration", "mathematics"]
    },
    {
      id: 2,
      title: "Organic Chemistry Reaction Mechanisms",
      description: "Detailed mechanisms for key organic reactions with step-by-step explanations and practice problems.",
      subject: "Chemistry",
      semester: "3rd",
      university: "Stanford",
      rating: 4.9,
      downloads: 980,
      views: 2156,
      fileType: "PDF",
      uploader: "Alex Johnson",
      uploadDate: "1 week ago",
      tags: ["organic", "chemistry", "reactions"]
    },
    {
      id: 3,
      title: "Data Structures and Algorithms",
      description: "Complete guide to DSA with implementation examples in Python and Java. Includes complexity analysis.",
      subject: "Computer Science",
      semester: "4th",
      university: "UC Berkeley",
      rating: 4.7,
      downloads: 1580,
      views: 4230,
      fileType: "PDF",
      uploader: "Mike Rodriguez",
      uploadDate: "3 days ago",
      tags: ["programming", "algorithms", "data-structures"]
    },
    {
      id: 4,
      title: "Microeconomics - Market Structures",
      description: "Analysis of different market structures including perfect competition, monopoly, and oligopoly.",
      subject: "Economics",
      semester: "2nd",
      university: "Harvard",
      rating: 4.6,
      downloads: 750,
      views: 1890,
      fileType: "PDF",
      uploader: "Emma Davis",
      uploadDate: "5 days ago",
      tags: ["economics", "markets", "competition"]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Popular Study Materials
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover the most downloaded and highest-rated study materials from top universities worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {popularNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {note.subject}
                  </Badge>
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-slate-700">{note.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {note.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 line-clamp-3">
                  {note.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="py-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{note.university}</span>
                    <span>Sem {note.semester}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{note.downloads}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{note.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{note.fileType}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-slate-500 pt-2 border-t border-slate-100">
                    <User className="w-4 h-4" />
                    <span>{note.uploader}</span>
                    <span>•</span>
                    <span>{note.uploadDate}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3">
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Download
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8">
            View All Materials
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularNotes;
