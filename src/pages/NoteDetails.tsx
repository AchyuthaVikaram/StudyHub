import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, User, FileText, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

const NoteDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [note, setNote] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [userRating, setUserRating] = useState<number>(0);
	const [submittingRating, setSubmittingRating] = useState(false);

	const [aiSummary, setAiSummary] = useState("");
	const [aiTopics, setAiTopics] = useState<string[]>([]);
	const [aiCategory, setAiCategory] = useState("");
	const [aiLoading, setAiLoading] = useState(false);

	useEffect(() => {
		const fetchNote = async () => {
			setLoading(true);
			try {
				const res = await api.notes.getById(id as string);
				setNote(res.note);
			} catch {
				setNote(null);
			} finally {
				setLoading(false);
			}
		};
		fetchNote();
	}, [id]);

	useEffect(() => {
		const runAI = async () => {
			if (!note) return;
			setAiLoading(true);
			try {
				const result = await api.ai.process({
					noteId: note.id,
					actions: ["summarize", "recommend", "categorize"],
				});
				setAiSummary(result.summary || "No summary available");
				setAiTopics(result.relatedTopics || []);
				setAiCategory(result.category || "Uncategorized");
			} catch (error) {
				console.error("AI processing failed:", error);
			} finally {
				setAiLoading(false);
			}
		};
		runAI();
	}, [note]);

	const handleRate = async () => {
		if (!user) {
			window.location.href = "/login";
			return;
		}
		if (!note || !userRating) return;
		setSubmittingRating(true);
		try {
			await api.notes.rate(note.id, userRating);
			toast({
				title: "Thank you!",
				description: "Your rating has been submitted.",
			});
			// Refresh note
			const res = await api.notes.getById(note.id);
			setNote(res.note);
			setUserRating(0);
		} catch (err: any) {
			toast({
				title: "Rating Failed",
				description: err.message || "Could not submit rating.",
				variant: "destructive",
			});
		} finally {
			setSubmittingRating(false);
		}
	};

	const handleDownload = async () => {
		await api.notes.download(note.id);
		if (note.file_url) {
			window.open(note.file_url, "_blank");
		}
	};

	const handleDelete = async () => {
		if (!user || note.uploader_id !== user.id) return;
		if (!window.confirm("Are you sure you want to delete this note?")) return;
		try {
			const res = await fetch(`/api/notes/${note.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${
						JSON.parse(localStorage.getItem("supabase-session") || "{}")
							.access_token
					}`,
				},
			});
			if (res.ok) {
				toast({ title: "Note deleted" });
				navigate("/browse");
			} else {
				const data = await res.json();
				toast({
					title: "Delete failed",
					description: data.error,
					variant: "destructive",
				});
			}
		} catch (err: any) {
			toast({
				title: "Delete failed",
				description: err.message,
				variant: "destructive",
			});
		}
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	if (!note)
		return (
			<div className="min-h-screen flex items-center justify-center text-red-500">
				Note not found.
			</div>
		);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<Header />
			<div className="container mx-auto px-4 py-8 max-w-3xl">
				<button
					className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
					onClick={() => navigate("/browse")}
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back to Browse
				</button>
				<Card className="shadow-xl">
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
							<div className="flex items-center gap-2">
								<Badge variant="secondary">{note.subject}</Badge>
								<span className="text-slate-500 text-sm">
									{note.university}
								</span>
								{note.semester && (
									<span className="text-slate-500 text-sm">
										Sem {note.semester}
									</span>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Star className="w-5 h-5 text-amber-500" />
								<span className="font-bold text-lg">{note.rating || 0}</span>
								<span className="text-slate-500">
									({note.rating_count || 0} ratings)
								</span>
							</div>
						</div>
						<CardTitle className="text-2xl font-bold mb-1">
							{note.title}
						</CardTitle>
						<div className="text-slate-600 mb-2">{note.description}</div>
						<div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
							<User className="w-4 h-4 mr-1" />
							{note.user_profiles
								? `${note.user_profiles.first_name} ${note.user_profiles.last_name}`
								: "Uploader"}
						</div>
						<div className="flex gap-2 mt-2">
							<Button
								size="sm"
								className="bg-blue-600 hover:bg-blue-700"
								onClick={handleDownload}
							>
								<Download className="w-4 h-4 mr-1" /> Download
							</Button>
							{user && note.uploader_id === user.id && (
								<Button size="sm" variant="destructive" onClick={handleDelete}>
									Delete
								</Button>
							)}
						</div>
					</CardHeader>
					<CardContent>
						{/* File Preview */}
						<div className="mb-6">
							{note.file_type &&
								note.file_type.includes("pdf") &&
								note.file_url && (
									<iframe
										src={note.file_url}
										title="Preview PDF"
										className="w-full h-96 border rounded"
									/>
								)}
							{note.file_type &&
								note.file_type.includes("image") &&
								note.file_url && (
									<img
										src={note.file_url}
										alt="Preview"
										className="w-full max-h-96 object-contain rounded"
									/>
								)}
						</div>
						{/* Tags */}
						{note.tags && note.tags.length > 0 && (
							<div className="mb-4 flex flex-wrap gap-2">
								{note.tags.map((tag: string, idx: number) => (
									<Badge key={idx} variant="outline">
										{tag}
									</Badge>
								))}
							</div>
						)}
						{/* Rating UI */}

						{/* AI Results */}
						<div className="mb-8 space-y-4">
							<h3 className="text-lg font-semibold text-blue-900">
								AI Insights
							</h3>
							{aiLoading ? (
								<p className="text-sm text-blue-500">Running AI analysis...</p>
							) : (
								<>
									{aiSummary && (
										<div>
											<h4 className="font-semibold text-slate-800 mb-1">
												Summary:
											</h4>
											<p className="text-sm text-slate-700 bg-slate-100 p-3 rounded">
												{aiSummary}
											</p>
										</div>
									)}
									{aiTopics.length > 0 && (
										<div>
											<h4 className="font-semibold text-slate-800 mb-1">
												Recommended Topics:
											</h4>
											<ul className="list-disc ml-6 text-sm text-slate-700">
												{aiTopics.map((topic, i) => (
													<li key={i}>{topic}</li>
												))}
											</ul>
										</div>
									)}
									{aiCategory && (
										<div>
											<h4 className="font-semibold text-slate-800 mb-1">
												Category:
											</h4>
											<Badge variant="default">{aiCategory}</Badge>
										</div>
									)}
								</>
							)}
						</div>
						<div className="mb-6">
							<div className="flex items-center gap-2 mb-2">
								<span className="font-medium">Your Rating:</span>
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										type="button"
										className="focus:outline-none"
										onClick={() => setUserRating(star)}
										aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
									>
										<Star
											className={`w-6 h-6 ${
												userRating >= star
													? "text-amber-500 fill-current"
													: "text-slate-300"
											}`}
										/>
									</button>
								))}
								<Button
									size="sm"
									className="ml-4 bg-blue-600 hover:bg-blue-700"
									disabled={!userRating || submittingRating}
									onClick={handleRate}
								>
									{submittingRating ? "Submitting..." : "Submit Rating"}
								</Button>
							</div>
						</div>
						{/* Reviews/All Ratings */}
						<div className="mt-8">
							<h3 className="text-lg font-bold mb-2">All Ratings</h3>

							{note.rating_count === 0 || !note.note_ratings?.length ? (
								<div className="text-slate-500">No ratings yet.</div>
							) : (
								<div className="space-y-2">
									{note.note_ratings.map((r: any, idx: number) => (
										<div
											key={idx}
											className="flex items-center gap-2 text-sm text-slate-700 border-b py-2"
										>
											<Star className="w-4 h-4 text-amber-500" />
											<span>{r.rating}</span>
											<span className="text-slate-500 ml-2">
												by {r.user_id === user?.id ? "You" : r.user_id}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default NoteDetails;
