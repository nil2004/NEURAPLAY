import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Instagram, Youtube, Twitter, Clock, Users, Calendar, AlertCircle } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full mb-6">
            <Badge className="bg-primary text-white">
              <Mail className="h-4 w-4 mr-2" />
              Contact Us
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Have questions or partnership queries? We'd love to hear from you.
          </p>
          
          {/* Important Notice */}
          <Alert className="max-w-3xl mx-auto mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Response:</strong> We typically respond within 24 hours | 
              <strong> Tournament Support:</strong> Available 9 AM - 9 PM | 
              <strong> Emergency:</strong> Call +91 9875257849
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                    className="bg-background/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="shadow-lg">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:tournament@collegeclashhub.in"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      tournament@collegeclashhub.in
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      General inquiries & support
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone & WhatsApp</h3>
                    <p className="text-muted-foreground">+91 9875257849</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available 9 AM - 9 PM IST
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Tournament Venue</h3>
                    <p className="text-muted-foreground">
                      Roorkee
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Nov 10, 2025 | 10:00 AM onwards
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tournament Organizers */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-primary" />
                  Tournament Organizers
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">NG</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Nilesh Gupta</h3>
                      <p className="text-sm text-muted-foreground">Event Coordinator</p>
                      <p className="text-xs text-muted-foreground">+91 9875257849</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-accent">AS</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Ansh Singh Rathore</h3>
                      <p className="text-sm text-muted-foreground">Technical Head</p>
                      <p className="text-xs text-muted-foreground">+91 8477846000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
                <div className="flex space-x-4 mb-4">
                  <a
                    href="https://instagram.com/collegeclashhub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-pink-500/20 to-pink-500/10 hover:from-pink-500/30 hover:to-pink-500/20 p-4 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <Instagram className="h-6 w-6 text-pink-600" />
                  </a>
                  <a
                    href="https://youtube.com/@collegeclashhub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-red-500/20 to-red-500/10 hover:from-red-500/30 hover:to-red-500/20 p-4 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <Youtube className="h-6 w-6 text-red-600" />
                  </a>
                  <a
                    href="https://twitter.com/collegeclashhub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 hover:from-blue-500/30 hover:to-blue-500/20 p-4 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <Twitter className="h-6 w-6 text-blue-600" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stay updated with tournament announcements, highlights, and behind-the-scenes
                  content. Follow us for live updates during the tournament!
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
