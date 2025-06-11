import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, Eye, FileText, User } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import NotePreviewModal from "./NotePreviewModal";

const PopularNotes = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewNote, setPreviewNote] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.notes.getAll({ sortBy: "downloads", limit: 4 });
        setNotes(res.notes || []);
      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePreview = async (note: any) => {
    try {
      const res = await api.notes.getById(note.id);
      setPreviewNote(res.note);
      setPreviewOpen(true);
    } catch {
      setPreviewNote(null);
      setPreviewOpen(false);
    }
  };

  const handleDownload = async (note: any) => {
    try {
      await api.notes.download(note.id);
      const res = await api.notes.getById(note.id);
      if (res.note && res.note.file_url) {
        window.open(res.note.file_url, "_blank");
      }
    } catch {
      toast({ title: "Download failed", description: "Could not download note.", variant: "destructive" });
    }
  };

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
          {loading ? (
            <div className="col-span-full text-center py-12 text-lg text-slate-500">Loading...</div>
          ) : notes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">No notes found.</div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/notes/${note.id}`)}>
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
                      <span>{note.semester ? `Sem ${note.semester}` : null}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{note.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{note.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{note.file_type}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(note.tags || []).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 pt-2 border-t border-slate-100">
                      <User className="w-4 h-4" />
                      <span>{note.user_profiles ? `${note.user_profiles.first_name} ${note.user_profiles.last_name}` : ""}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <div className="flex space-x-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1" onClick={e => { e.stopPropagation(); handlePreview(note); }}>
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={e => { e.stopPropagation(); handleDownload(note); }}>
                      Download
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8" onClick={() => navigate("/browse")}>View All Materials</Button>
        </div>
        <NotePreviewModal open={previewOpen} note={previewNote} onOpenChange={setPreviewOpen} />
      </div>
    </section>
  );
};

export default PopularNotes;
