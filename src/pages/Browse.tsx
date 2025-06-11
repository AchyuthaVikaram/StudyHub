
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Star, Calendar, User } from "lucide-react";
import Header from "@/components/Header";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Mock data for now - will be replaced with API calls
  const mockNotes = [
    {
      id: 1,
      title: "Advanced Calculus Notes",
      description: "Comprehensive notes covering limits, derivatives, and integrals",
      subject: "Mathematics",
      university: "MIT",
      semester: "3rd",
      rating: 4.8,
      downloads: 1250,
      uploadDate: "2024-01-15",
      uploader: "John Doe",
      fileType: "PDF",
      pages: 45
    },
    {
      id: 2,
      title: "Organic Chemistry Lab Manual",
      description: "Complete lab procedures and experiments for organic chemistry",
      subject: "Chemistry",
      university: "Stanford",
      semester: "4th",
      rating: 4.6,
      downloads: 890,
      uploadDate: "2024-01-10",
      uploader: "Jane Smith",
      fileType: "PDF",
      pages: 78
    },
    {
      id: 3,
      title: "Data Structures and Algorithms",
      description: "Implementation guide with examples in Python and Java",
      subject: "Computer Science",
      university: "Harvard",
      semester: "2nd",
      rating: 4.9,
      downloads: 2100,
      uploadDate: "2024-01-08",
      uploader: "Mike Johnson",
      fileType: "PDF",
      pages: 120
    }
  ];

  const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Computer Science", "Biology", "Engineering"];

  const handlePreview = (noteId: number) => {
    console.log("Preview note:", noteId);
    // Will connect to backend API
  };

  const handleDownload = (noteId: number) => {
    console.log("Download note:", noteId);
    // Will connect to backend API
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Browse Study Materials</h1>
          <p className="text-lg text-slate-600">Discover and download quality notes from students worldwide</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search notes, subjects, or universities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg bg-white"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject.toLowerCase()}>{subject}</option>
                ))}
              </select>
              <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{note.subject}</Badge>
                  <div className="flex items-center text-sm text-slate-500">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {note.rating}
                  </div>
                </div>
                <CardTitle className="text-lg">{note.title}</CardTitle>
                <CardDescription>{note.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{note.university}</span>
                  <span>{note.semester} Semester</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {note.uploader}
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {note.downloads}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handlePreview(note.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDownload(note.id)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
