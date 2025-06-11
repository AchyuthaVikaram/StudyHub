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
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const result = await api.auth.login({ email, password });
			if (result.session && result.user) {
				localStorage.setItem(
					"supabase-session",
					JSON.stringify(result.session)
				);
				toast({
					title: "Login Successful",
					description: "Welcome back to StudyShare!",
				});
				setIsLoading(false);
				window.location.href = "/dashboard"; // Force reload so AuthContext updates
			} else {
				throw new Error(result.error || "Login failed");
			}
		} catch (err: any) {
			toast({
				title: "Login Failed",
				description: err.message || "Invalid credentials",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Link to="/" className="inline-flex items-center space-x-2 mb-6">
						<GraduationCap className="h-10 w-10 text-blue-600" />
						<span className="text-2xl font-bold text-slate-900">
							StudyShare
						</span>
					</Link>
					<h1 className="text-3xl font-bold text-slate-900 mb-2">
						Welcome Back
					</h1>
					<p className="text-slate-600">
						Sign in to access your study materials
					</p>
				</div>

				<Card className="shadow-xl border-0">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Sign In
						</CardTitle>
						<CardDescription className="text-center">
							Enter your credentials to access your account
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="h-11"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
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

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<input type="checkbox" id="remember" className="rounded" />
									<Label htmlFor="remember" className="text-sm">
										Remember me
									</Label>
								</div>
								<Link
									to="/forgot-password"
									className="text-sm text-blue-600 hover:text-blue-700"
								>
									Forgot password?
								</Link>
							</div>
						</CardContent>

						<CardFooter className="space-y-4">
							<Button
								type="submit"
								className="w-full h-11 bg-blue-600 hover:bg-blue-700"
								disabled={isLoading}
							>
								{isLoading ? "Signing in..." : "Sign In"}
							</Button>
						</CardFooter>
					</form>
				</Card>

				<p className="text-center text-sm text-slate-600 mt-6">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="text-blue-600 hover:text-blue-700 font-medium"
					>
						Sign up here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
