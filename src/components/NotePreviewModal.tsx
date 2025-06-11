import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotePreviewModalProps {
  open: boolean;
  note: any;
  onOpenChange: (open: boolean) => void;
}

const NotePreviewModal = ({ open, note, onOpenChange }: NotePreviewModalProps) => {
  if (!note) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose asChild>
          <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-3xl">&times;</button>
        </DialogClose>
        <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
        <div className="mb-2 text-slate-600">{note.description}</div>
        <div className="mb-4 text-sm text-slate-500">Subject: {note.subject} | Uploaded by: {note.user_profiles ? `${note.user_profiles.first_name} ${note.user_profiles.last_name}` : note.uploader || ""}</div>
        <div className="flex gap-2 flex-wrap mb-2">
          {(note.tags || []).map((tag: string, i: number) => (
            <Badge key={i} variant="outline">{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
          <span>Rating: {note.rating}</span>
          <span>Downloads: {note.downloads}</span>
        </div>
        {note.file_type && note.file_type.includes('pdf') && note.file_url && (
          <iframe src={note.file_url} title="Preview PDF" className="w-full h-96 border rounded" />
        )}
        {note.file_type && note.file_type.includes('image') && note.file_url && (
          <img src={note.file_url} alt="Preview" className="w-full max-h-96 object-contain rounded" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotePreviewModal; 