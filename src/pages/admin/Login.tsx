import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_ID = "Nilesh25@";
const DEFAULT_PASSWORD = "freefire25@";
const SESSION_KEY = 'adminAuthed';
const LOGIN_AT_KEY = 'adminLoginAt';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const authed = typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === "true";
  if (authed) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (id === DEFAULT_ID && password === DEFAULT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      sessionStorage.setItem(LOGIN_AT_KEY, String(Date.now()));
      // Give the browser a tick to persist sessionStorage before route change
      setTimeout(() => navigate("/admin", { replace: true }), 0);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="admin-id">Admin ID</Label>
              <Input id="admin-id" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter admin ID" />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;


