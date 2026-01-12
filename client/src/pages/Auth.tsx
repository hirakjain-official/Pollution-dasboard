import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        
        setTimeout(() => {
            if (username === "gov" && password === "gov") {
                localStorage.setItem("authToken", "mock-token-gov");
                toast({
                    title: "Login Successful",
                    description: "Welcome to the Government Dashboard.",
                });
                setLocation("/gov-dashboard");
            } else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Invalid credentials. Please try again.",
                });
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-primary">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-sky-600 flex items-center justify-center shadow-md">
                            <Droplets className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Government Portal</CardTitle>
                    <CardDescription>Enter your credentials to access the Mission Planner</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pr-10"
                                />
                                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Authenticating..." : "Login"}
                        </Button>
                        <div className="text-center text-xs text-muted-foreground mt-4">
                            <p>For authorized personnel only.</p>
                            <p className="mt-1 opacity-50">Demo Credentials: gov / gov</p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
