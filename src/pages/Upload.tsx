
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload as UploadIcon, FileText, Image, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Upload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    semester: "",
    university: "",
    tags: "",
    file: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
    "Engineering", "Medicine", "Business", "Economics", "Psychology"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // TODO: Connect to backend API
      console.log("Uploading:", formData);
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Upload Successful",
        description: "Your notes have been uploaded and are being processed!",
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        subject: "",
        semester: "",
        university: "",
        tags: "",
        file: null
      });
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (file.type.includes('image')) return <Image className="w-8 h-8 text-blue-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Upload Your Notes</h1>
            <p className="text-lg text-slate-600">Share your knowledge and help fellow students succeed</p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Upload Study Material</CardTitle>
              <CardDescription>
                Fill in the details below to share your notes with the community
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {formData.file ? (
                    <div className="flex flex-col items-center space-y-2">
                      {getFileIcon(formData.file)}
                      <p className="text-sm font-medium">{formData.file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <UploadIcon className="w-12 h-12 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-slate-700">
                          Drag and drop your file here
                        </p>
                        <p className="text-sm text-slate-500">or click to browse</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Advanced Calculus Notes"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Select onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your notes cover..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      placeholder="e.g., Harvard University"
                      value={formData.university}
                      onChange={(e) => handleInputChange("university", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select onValueChange={(value) => handleInputChange("semester", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., calculus, derivatives, integrals"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Notes"}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
