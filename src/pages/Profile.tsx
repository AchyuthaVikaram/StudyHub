import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { profile: initialProfile, loading: authLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>(initialProfile ? {
    firstName: initialProfile.first_name,
    lastName: initialProfile.last_name,
    university: initialProfile.university,
    course: initialProfile.course,
    semester: initialProfile.semester?.toString() || ""
  } : {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form when profile changes (e.g., after login)
  useEffect(() => {
    if (initialProfile) {
      setForm({
        firstName: initialProfile.first_name,
        lastName: initialProfile.last_name,
        university: initialProfile.university,
        course: initialProfile.course,
        semester: initialProfile.semester?.toString() || ""
      });
    }
  }, [initialProfile]);

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.users.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        university: form.university,
        course: form.course,
        semester: form.semester
      });
      toast({ title: "Profile updated" });
      setEditMode(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!initialProfile) return <div className="min-h-screen flex items-center justify-center text-red-500">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <div className="space-y-4">
                <Input value={form.firstName} onChange={e => handleChange("firstName", e.target.value)} placeholder="First Name" />
                <Input value={form.lastName} onChange={e => handleChange("lastName", e.target.value)} placeholder="Last Name" />
                <Input value={form.university} onChange={e => handleChange("university", e.target.value)} placeholder="University" />
                <Input value={form.course} onChange={e => handleChange("course", e.target.value)} placeholder="Course" />
                <Input value={form.semester} onChange={e => handleChange("semester", e.target.value)} placeholder="Semester" />
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                <Button variant="outline" onClick={() => setEditMode(false)} disabled={saving}>Cancel</Button>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </div>
            ) : (
              <div className="space-y-2">
                <div><b>Name:</b> {initialProfile.first_name} {initialProfile.last_name}</div>
                <div><b>Email:</b> {initialProfile.email}</div>
                <div><b>University:</b> {initialProfile.university}</div>
                <div><b>Course:</b> {initialProfile.course}</div>
                <div><b>Semester:</b> {initialProfile.semester}</div>
                <Button className="mt-2" onClick={() => setEditMode(true)}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 