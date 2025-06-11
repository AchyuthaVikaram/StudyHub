import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const [profile, setProfile] = useState<any>(null);
	const [dashboard, setDashboard] = useState<any>(null);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const profRes = await api.users.getProfile();
				const dashRes = await api.users.getDashboard();
				setProfile(profRes.profile);
				setForm({
					firstName: profRes.profile.first_name,
					lastName: profRes.profile.last_name,
					university: profRes.profile.university,
					course: profRes.profile.course,
					semester: profRes.profile.semester?.toString() || "",
				});
				setDashboard(dashRes);
			} catch (err: any) {
				setError("Failed to load dashboard");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleChange = (field: string, value: string) => {
		setForm((prev: any) => ({ ...prev, [field]: value }));
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			await api.users.updateProfile({
				firstName: form.firstName,
				lastName: form.lastName,
				university: form.university,
				course: form.course,
				semester: form.semester,
			});
			toast({ title: "Profile updated" });
			setEditMode(false);
			setProfile((prev: any) => ({ ...prev, ...form }));
		} catch (err: any) {
			toast({
				title: "Update failed",
				description: err.message,
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center text-red-500">
				{error}
			</div>
		);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<Header />
			<div className="container mx-auto px-4 py-8 max-w-3xl">
				<h1 className="text-3xl font-bold mb-6">Dashboard</h1>
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Profile</CardTitle>
					</CardHeader>
					<CardContent>
						{editMode ? (
							<div className="space-y-4">
								<Input
									value={form.firstName}
									onChange={(e) => handleChange("firstName", e.target.value)}
									placeholder="First Name"
								/>
								<Input
									value={form.lastName}
									onChange={(e) => handleChange("lastName", e.target.value)}
									placeholder="Last Name"
								/>
								<Input
									value={form.university}
									onChange={(e) => handleChange("university", e.target.value)}
									placeholder="University"
								/>
								<Input
									value={form.course}
									onChange={(e) => handleChange("course", e.target.value)}
									placeholder="Course"
								/>
								<Input
									value={form.semester}
									onChange={(e) => handleChange("semester", e.target.value)}
									placeholder="Semester"
								/>
								<Button onClick={handleSave} disabled={saving}>
									{saving ? "Saving..." : "Save"}
								</Button>
								<Button
									variant="outline"
									onClick={() => setEditMode(false)}
									disabled={saving}
								>
									Cancel
								</Button>
							</div>
						) : (
							<div className="space-y-2">
								<div>
									<b>Name:</b> {profile.first_name} {profile.last_name}
								</div>
								<div>
									<b>Email:</b> {profile.email}
								</div>
								<div>
									<b>University:</b> {profile.university}
								</div>
								<div>
									<b>Course:</b> {profile.course}
								</div>
								<div>
									<b>Semester:</b> {profile.semester}
								</div>
								<Button className="mt-2" onClick={() => setEditMode(true)}>
									Edit Profile
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Stats</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-blue-100 rounded p-4 text-center">
								<div className="text-2xl font-bold">
									{dashboard?.stats.uploadedNotes}
								</div>
								<div>Notes Uploaded</div>
							</div>
							<div className="bg-purple-100 rounded p-4 text-center">
								<div className="text-2xl font-bold">
									{dashboard?.stats.totalDownloads}
								</div>
								<div>Total Downloads</div>
							</div>
							<div className="bg-yellow-100 rounded p-4 text-center">
								<div className="text-2xl font-bold">
									{dashboard?.stats.ratingsGiven}
								</div>
								<div>Ratings Given</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Recent Uploads</CardTitle>
					</CardHeader>
					<CardContent>
						{dashboard?.recentUploads?.length === 0 ? (
							<div>No uploads yet.</div>
						) : (
							<div className="space-y-2">
								{dashboard?.recentUploads?.map((note: any) => (
									<div
										key={note.id}
										onClick={() => navigate(`/notes/${note.id}`)}
										className="border rounded p-2 flex flex-col md:flex-row md:items-center md:justify-between"
									>
										<div>
											<b>{note.title}</b>{" "}
											<span className="text-slate-500">({note.subject})</span>
										</div>
										<div className="text-sm text-slate-500">
											{note.upload_date?.slice(0, 10)} | Downloads:{" "}
											{note.downloads} | Rating: {note.rating}
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;
