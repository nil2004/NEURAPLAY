import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Users, Mail, Phone, AlertCircle, CheckCircle, Upload, Calendar, Shield, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(6);
  const [formData, setFormData] = useState({
    teamName: "",
    collegeName: "",
    captainName: "",
    captainUID: "",
    players: Array(4).fill({ name: "", uid: "" }),
    email: "",
    whatsapp: "",
    collegeId: null as File | null,
    terms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.teamName.trim()) newErrors.teamName = "Team name is required";
    if (!formData.collegeName.trim()) newErrors.collegeName = "College name is required";
    if (!formData.captainName.trim()) newErrors.captainName = "Captain name is required";
    if (!formData.captainUID.trim()) newErrors.captainUID = "Captain UID is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
    if (!formData.collegeId) newErrors.collegeId = "College ID is required";
    if (!formData.terms) newErrors.terms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePlayerChange = (index: number, field: string, value: string) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setFormData(prev => ({ ...prev, players: newPlayers }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1) Upload College ID to storage
      const file = formData.collegeId as File
      const fileExt = file.name.split('.').pop()
      const filePath = `college-ids/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('college-ids')
        .upload(filePath, file, { upsert: false })

      if (uploadError) throw uploadError

      // 2) Insert registration row
      const { error: insertError } = await supabase.from('registrations').insert({
        team_name: formData.teamName,
        college: formData.collegeName,
        captain_name: formData.captainName,
        captain_email: formData.email,
        captain_phone: formData.whatsapp,
        team_members: formData.players.filter(p => p.name || p.uid).map(p => `${p.name} (${p.uid})`),
        status: 'pending',
        notes: null,
        college_id_url: filePath,
      })

      if (insertError) throw insertError

      toast({
        title: "Registration Successful!",
        description: "Your team has been registered. We'll verify your details shortly.",
      })
      setShowSuccess(true)
      setRedirectSeconds(6)
      const interval = setInterval(() => {
        setRedirectSeconds((s) => (s > 0 ? s - 1 : 0))
      }, 1000)
      setTimeout(() => {
        clearInterval(interval)
        navigate('/')
      }, 6000)

      // Reset form
      setFormData({
        teamName: "",
        collegeName: "",
        captainName: "",
        captainUID: "",
        players: Array(4).fill({ name: "", uid: "" }),
        email: "",
        whatsapp: "",
        collegeId: null,
        terms: false
      })
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Team Registration
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Register your team for the Free Fire LAN Tournament 2025
          </p>
          
          {/* Important Notice */}
          <Alert className="max-w-3xl mx-auto mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Registration Deadline:</strong> Oct 20, 2025 | 
              <strong> Tournament Date:</strong> Nov 10, 2025 | 
              <strong> Venue:</strong> Roorkee
            </AlertDescription>
          </Alert>
        </div>

        {/* Registration Card */}
        <Card className="shadow-xl border-2 border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="text-2xl flex items-center">
              <Trophy className="h-6 w-6 mr-3 text-primary" />
              Tournament Registration Form
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Fill out all required information to register your team
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Information */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-primary" />
                  Team Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName" className="text-sm font-medium">Team Name *</Label>
                    <Input
                      id="teamName"
                      placeholder="Enter team name"
                      value={formData.teamName}
                      onChange={(e) => handleInputChange('teamName', e.target.value)}
                      className={`bg-white border-2 ${errors.teamName ? 'border-destructive' : 'border-blue-200 focus:border-primary'}`}
                    />
                    {errors.teamName && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.teamName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collegeName" className="text-sm font-medium">College Name *</Label>
                    <Input
                      id="collegeName"
                      placeholder="Enter college name"
                      value={formData.collegeName}
                      onChange={(e) => handleInputChange('collegeName', e.target.value)}
                      className={`bg-white border-2 ${errors.collegeName ? 'border-destructive' : 'border-blue-200 focus:border-primary'}`}
                    />
                    {errors.collegeName && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.collegeName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Captain Details */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Team Captain Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="captainName" className="text-sm font-medium">Captain Name *</Label>
                    <Input
                      id="captainName"
                      placeholder="Enter captain name"
                      value={formData.captainName}
                      onChange={(e) => handleInputChange('captainName', e.target.value)}
                      className={`bg-white border-2 ${errors.captainName ? 'border-destructive' : 'border-green-200 focus:border-primary'}`}
                    />
                    {errors.captainName && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.captainName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="captainUID" className="text-sm font-medium">Captain Game UID *</Label>
                    <Input
                      id="captainUID"
                      placeholder="Enter game UID (e.g., 1234567890)"
                      value={formData.captainUID}
                      onChange={(e) => handleInputChange('captainUID', e.target.value)}
                      className={`bg-white border-2 ${errors.captainUID ? 'border-destructive' : 'border-green-200 focus:border-primary'}`}
                    />
                    {errors.captainUID && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.captainUID}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Player UIDs */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Team Players (2-4)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add 2-4 additional players. At least 2 players are required to complete registration.
                </p>
                <div className="grid gap-4">
                  {[2, 3, 4, 5].map((num) => (
                    <div key={num} className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`player${num}Name`}>Player {num} Name</Label>
                        <Input
                          id={`player${num}Name`}
                          placeholder={`Player ${num} name`}
                          value={formData.players[num-2]?.name || ""}
                          onChange={(e) => handlePlayerChange(num-2, 'name', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`player${num}UID`}>Player {num} Game UID</Label>
                        <Input
                          id={`player${num}UID`}
                          placeholder={`Player ${num} UID`}
                          value={formData.players[num-2]?.uid || ""}
                          onChange={(e) => handlePlayerChange(num-2, 'uid', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="team@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`bg-white border-2 ${errors.email ? 'border-destructive' : 'border-purple-200 focus:border-primary'}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp Number *</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      className={`bg-white border-2 ${errors.whatsapp ? 'border-destructive' : 'border-purple-200 focus:border-primary'}`}
                    />
                    {errors.whatsapp && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* College ID Upload */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <h3 className="text-xl font-semibold flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-primary" />
                  College ID Verification
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="collegeId" className="text-sm font-medium">College ID (Upload) *</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                    <Input
                      id="collegeId"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleInputChange('collegeId', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="collegeId" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload college ID or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, PDF up to 10MB
                      </p>
                      {formData.collegeId && (
                        <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {formData.collegeId.name}
                        </p>
                      )}
                    </label>
                  </div>
                  {errors.collegeId && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.collegeId}
                    </p>
                  )}
                </div>
              </div>

              {/* Declaration */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                <h3 className="text-xl font-semibold flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Declaration & Terms
                </h3>
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={formData.terms}
                    onCheckedChange={(checked) => handleInputChange('terms', checked)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-relaxed cursor-pointer"
                    >
                      I declare that all information provided is accurate and I agree to abide by the
                      tournament rules and regulations. I understand that false information may lead to
                      disqualification.
                    </label>
                    {errors.terms && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.terms}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting Registration...
                    </>
                  ) : (
                    <>
                      <Trophy className="h-5 w-5 mr-2" />
                      Submit Registration
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Success Message Info */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-green-800">After Registration</h3>
            <p className="text-muted-foreground mb-4">
              ✅ Your registration has been received. You'll be contacted by our team for further details.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>Confirmation within 24 hours</span>
              </div>
              <div className="flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>Email updates sent</span>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>WhatsApp notifications</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={(o) => !o && setShowSuccess(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-green-100 grid place-items-center shadow-inner">
              <CheckCircle className="h-10 w-10 text-green-600 animate-scale-in" />
            </div>
            <DialogTitle className="text-center text-2xl">Registration Successful</DialogTitle>
            <DialogDescription className="text-center">
              Your team has been submitted. We’ll verify the details and inform you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${((6 - redirectSeconds) / 6) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-center text-muted-foreground">
              Redirecting to home in {redirectSeconds}s
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/')}>Go to Home now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
