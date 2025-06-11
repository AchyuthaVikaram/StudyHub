import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Register = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		university: "",
		course: "",
		semester: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Validate required fields
		if (
			!formData.firstName ||
			!formData.lastName ||
			!formData.email ||
			!formData.password ||
			!formData.confirmPassword ||
			!formData.university ||
			!formData.course
		) {
			toast({
				title: "Error",
				description: "Please fill in all required fields.",
				variant: "destructive",
			});
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			toast({
				title: "Error",
				description: "Passwords do not match",
				variant: "destructive",
			});
			return;
		}
		setIsLoading(true);
		try {
			const result = await api.auth.register({
				email: formData.email,
				password: formData.password,
				firstName: formData.firstName,
				lastName: formData.lastName,
				university: formData.university,
				course: formData.course,
				semester: formData.semester ? parseInt(formData.semester) : null,
			});
			if (result.user) {
				toast({
					title: "Registration Successful",
					description: "Welcome to StudyShare! Please verify your email.",
				});
				setIsLoading(false);
				navigate("/login");
			} else {
				throw new Error(result.error || "Registration failed");
			}
		} catch (err: any) {
			toast({
				title: "Registration Failed",
				description: err.message || "Could not register user",
				variant: "destructive",
			});
			console.log(err);
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="w-full max-w-2xl">
				<div className="text-center mb-8">
					<Link to="/" className="inline-flex items-center space-x-2 mb-6">
						<GraduationCap className="h-10 w-10 text-blue-600" />
						<span className="text-2xl font-bold text-slate-900">
							StudyShare
						</span>
					</Link>
					<h1 className="text-3xl font-bold text-slate-900 mb-2">
						Join StudyShare
					</h1>
					<p className="text-slate-600">
						Create your account and start sharing knowledge
					</p>
				</div>

				<Card className="shadow-xl border-0">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Create Account
						</CardTitle>
						<CardDescription className="text-center">
							Fill in your details to get started
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input
										id="firstName"
										placeholder="John"
										value={formData.firstName}
										onChange={(e) =>
											handleInputChange("firstName", e.target.value)
										}
										required
										className="h-11"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input
										id="lastName"
										placeholder="Doe"
										value={formData.lastName}
										onChange={(e) =>
											handleInputChange("lastName", e.target.value)
										}
										required
										className="h-11"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="john.doe@university.edu"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									required
									className="h-11"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Create a strong password"
											value={formData.password}
											onChange={(e) =>
												handleInputChange("password", e.target.value)
											}
											required
											className="h-11 pr-10"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<div className="relative">
										<Input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											placeholder="Confirm your password"
											value={formData.confirmPassword}
											onChange={(e) =>
												handleInputChange("confirmPassword", e.target.value)
											}
											required
											className="h-11 pr-10"
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
										>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="university">University</Label>
								<Input
									id="university"
									placeholder="Enter your university name"
									value={formData.university}
									onChange={(e) =>
										handleInputChange("university", e.target.value)
									}
									required
									className="h-11"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="course">Course/Major</Label>
									<Input
										id="course"
										placeholder="Computer Science"
										value={formData.course}
										onChange={(e) =>
											handleInputChange("course", e.target.value)
										}
										required
										className="h-11"
									/>
								</div>

								<div className="space-y-2">
									<Label>Current Semester</Label>
									<Select
										onValueChange={(value) =>
											handleInputChange("semester", value)
										}
									>
										<SelectTrigger className="h-11">
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

							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="terms"
									required
									className="rounded"
								/>
								<Label htmlFor="terms" className="text-sm">
									I agree to the{" "}
									<Link
										to="/terms"
										className="text-blue-600 hover:text-blue-700"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										to="/privacy"
										className="text-blue-600 hover:text-blue-700"
									>
										Privacy Policy
									</Link>
								</Label>
							</div>
						</CardContent>

						<CardFooter className="space-y-4">
							<Button
								type="submit"
								className="w-full h-11 bg-blue-600 hover:bg-blue-700"
								disabled={isLoading}
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</Button>
						</CardFooter>
					</form>
				</Card>

				<p className="text-center text-sm text-slate-600 mt-6">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-blue-600 hover:text-blue-700 font-medium"
					>
						Sign in here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
