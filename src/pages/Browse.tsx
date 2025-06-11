import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Star, Calendar, User } from "lucide-react";
import Header from "@/components/Header";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewNote, setPreviewNote] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Computer Science", "Biology", "Engineering"];

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedSubject && selectedSubject !== "all") params.subject = selectedSubject;
      const res = await api.notes.getAll(params);
      setNotes(res.notes || []);
    } catch (err: any) {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSubject]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handlePreview = async (noteId: string) => {
    try {
      const res = await api.notes.getById(noteId);
      setPreviewNote(res.note);
      setPreviewOpen(true);
    } catch {
      setPreviewNote(null);
      setPreviewOpen(false);
    }
  };

  const handleDownload = async (noteId: string) => {
    try {
      await api.notes.download(noteId);
      // Fetch note details to get file_url
      const res = await api.notes.getById(noteId);
      if (res.note && res.note.file_url) {
        window.open(res.note.file_url, "_blank");
      }
    } catch {
      // Optionally show error toast
    }
  };

  const handleRate = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!previewNote || !userRating) return;
    setSubmittingRating(true);
    try {
      await api.notes.rate(previewNote.id, userRating);
      toast({ title: "Thank you!", description: "Your rating has been submitted." });
      // Refresh note details
      const res = await api.notes.getById(previewNote.id);
      setPreviewNote(res.note);
      setUserRating(0);
    } catch (err: any) {
      toast({ title: "Rating Failed", description: err.message || "Could not submit rating.", variant: "destructive" });
    } finally {
      setSubmittingRating(false);
    }
  };

  // Add delete note handler
  const handleDeleteNote = async (noteId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('supabase-session') || '{}').access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Note deleted" });
        fetchNotes();
      } else {
        toast({ title: "Delete failed", description: data.error, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  // Add delete rating handler (for preview modal)
  const handleDeleteRating = async (noteId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!window.confirm("Are you sure you want to delete your rating?")) return;
    try {
      const res = await fetch(`/api/notes/${noteId}/rating`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('supabase-session') || '{}').access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Rating deleted" });
        // Refresh note details
        const res2 = await api.notes.getById(noteId);
        setPreviewNote(res2.note);
      } else {
        toast({ title: "Delete failed", description: data.error, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
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
          {loading ? (
            <div className="col-span-full text-center py-12 text-lg text-slate-500">Loading notes...</div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">{error}</div>
          ) : notes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">No notes found.</div>
          ) : (
            notes.map((note) => (
              <Card
                key={note.id}
                className="hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => navigate(`/notes/${note.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{note.subject}</Badge>
                    <div className="flex items-center text-sm text-slate-500">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      {note.rating}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-700 transition-colors">{note.title}</CardTitle>
                  <CardDescription>{note.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{note.university}</span>
                    <span>{note.semester ? `${note.semester} Semester` : null}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {note.user_profiles ? `${note.user_profiles.first_name} ${note.user_profiles.last_name}` : ""}
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
                      onClick={e => { e.stopPropagation(); handlePreview(note.id); }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={e => { e.stopPropagation(); handleDownload(note.id); }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    {/* Show delete button if user is uploader */}
                    {user && note.uploader_id === user.id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={e => { e.stopPropagation(); handleDeleteNote(note.id); }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          {previewNote && (
            <DialogContent>
              <DialogClose asChild>
                <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
              </DialogClose>
              <h2 className="text-2xl font-bold mb-2">{previewNote.title}</h2>
              <div className="mb-2 text-slate-600">{previewNote.description}</div>
              <div className="mb-4 text-sm text-slate-500">Subject: {previewNote.subject} | Uploaded by: {previewNote.user_profiles ? `${previewNote.user_profiles.first_name} ${previewNote.user_profiles.last_name}` : ""}</div>
              {previewNote.file_type && previewNote.file_type.includes('pdf') && previewNote.file_url && (
                <iframe src={previewNote.file_url} title="Preview PDF" className="w-full h-96 border rounded" />
              )}
              {previewNote.file_type && previewNote.file_type.includes('image') && previewNote.file_url && (
                <img src={previewNote.file_url} alt="Preview" className="w-full max-h-96 object-contain rounded" />
              )}
              {/* Rating Section */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Average Rating:</span>
                  <span className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {previewNote.rating || 0} ({previewNote.rating_count || 0})
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Your Rating:</span>
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setUserRating(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star className={`w-6 h-6 ${userRating >= star ? 'text-amber-500 fill-current' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <Button size="sm" className="ml-4 bg-blue-600 hover:bg-blue-700" disabled={!userRating || submittingRating} onClick={handleRate}>
                    {submittingRating ? "Submitting..." : "Submit Rating"}
                  </Button>
                  {/* Show delete rating button if user is the rater */}
                  {user && previewNote && previewNote.note_ratings && previewNote.note_ratings.some((r: any) => r.user_id === user.id) && (
                    <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDeleteRating(previewNote.id)}>
                      Delete Rating
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default Browse;
