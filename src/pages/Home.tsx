import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, MapPin, DollarSign, Calendar, Clock, Star } from "lucide-react";
import ComingSoonOverlay from "@/components/ComingSoonOverlay";
import heroBackground from "@/assets/hero-bg.jpg";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [heroTitle, setHeroTitle] = useState("Free Fire LAN Tournament");
  const [heroSubtitle, setHeroSubtitle] = useState("Uttarakhand & Delhi Edition");
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [countdownLabel, setCountdownLabel] = useState("Tournament starts in:");

  useEffect(() => {
    // Load site settings
    supabase
      .from('site_settings')
      .select('hero_title, hero_subtitle, event_date, countdown_label')
      .eq('id', 'main')
      .single()
      .then(({ data }) => {
        if (data) {
          setHeroTitle(data.hero_title);
          setHeroSubtitle(data.hero_subtitle);
          setEventDate(data.event_date);
          setCountdownLabel(data.countdown_label || "Tournament starts in:");
        }
      });

    const fallbackDate = new Date('2025-03-15T10:00:00').getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const ts = eventDate ? new Date(eventDate).getTime() : fallbackDate;
      const distance = ts - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden pt-16 sm:pt-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="inline-block bg-gradient-to-r from-primary/90 to-accent/90 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg">
              🎮 Intercollege Tournament 2025
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <p className="text-2xl md:text-3xl mb-4 font-semibold">
              {heroSubtitle}
            </p>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              <span className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold mr-3 shadow-lg border border-green-400 hover:shadow-green-400/50 transition-all duration-300 transform hover:scale-105">
                ✨ FREE ENTRY ✨
              </span>
              LAN Grand Finale | ₹12,000 Prize Pool | Nov 10, 2025
            </p>
            
            {/* Countdown Timer */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4 mb-6">
                <Clock className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{countdownLabel}</span>
              </div>
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">{value}</div>
                    <div className="text-sm text-white/80 capitalize">{unit}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-accent to-red-600 hover:from-accent/90 hover:to-red-600/90 text-white text-lg px-8 py-6 shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/register">Register Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 border-2 border-white text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/tournament" className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Tournament Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-20 bg-gradient-to-br from-secondary/30 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tournament Highlights</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about this exciting competition
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center card-hover group border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">Game</div>
                <div className="font-semibold text-lg">Free Fire Max</div>
              </CardContent>
            </Card>
            <Card className="text-center card-hover group border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">Format</div>
                <div className="font-semibold text-lg">Qualifiers + LAN</div>
              </CardContent>
            </Card>
            <Card className="text-center card-hover group border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">Prize Pool</div>
                <div className="font-semibold text-lg">₹12,000</div>
              </CardContent>
            </Card>
            <Card className="text-center card-hover group border-2 border-transparent hover:border-primary/20">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">Venue</div>
                <div className="font-semibold text-lg">Roorkee</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            About the Event
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            The <strong>Intercollege Free Fire LAN Tournament 2025</strong> brings together top
            college teams from Uttarakhand and Delhi in an exciting offline competition.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The goal is to promote eSports at the campus level and provide students a platform
            to showcase their talent in a professional and organized environment.
          </p>
        </div>
      </section>

      {/* Tournament Format */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Tournament Format
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">College Qualifiers</h3>
                <p className="text-muted-foreground">
                  Conducted in individual colleges — top 1 team from each college qualifies
                  for the final.
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Grand Finale (LAN)</h3>
                <p className="text-muted-foreground">
                  12 finalist teams (6 boys + 6 girls) compete together in one final battle
                  at the host venue.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="font-semibold mb-2">Mode</div>
                  <div className="text-muted-foreground">Battle Royale (Squad)</div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Entry Fee</div>
                  <div className="text-muted-foreground">Free</div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Eligibility</div>
                  <div className="text-muted-foreground">Registered college students only</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Prize Distribution
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center card-hover border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">🥇</div>
                <h3 className="text-xl font-bold mb-2">1st Place</h3>
                <div className="text-3xl font-bold text-primary mb-2">₹8,000</div>
                <p className="text-sm text-muted-foreground">Trophy + Certificates</p>
              </CardContent>
            </Card>
            <Card className="text-center card-hover border-2 border-muted">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">🥈</div>
                <h3 className="text-xl font-bold mb-2">2nd Place</h3>
                <div className="text-3xl font-bold text-primary mb-2">₹4,000</div>
                <p className="text-sm text-muted-foreground">Certificates</p>
              </CardContent>
            </Card>
            <Card className="text-center card-hover border-2 border-muted">
              <CardContent className="p-8">
                <div className="text-5xl mb-4">🏅</div>
                <h3 className="text-xl font-bold mb-2">MVP</h3>
                <div className="text-lg font-bold text-primary mb-2">Special Award</div>
                <p className="text-sm text-muted-foreground">Trophy + Certificate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Stream Section */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-purple-50 relative">
        <ComingSoonOverlay
          title="Coming Soon!"
          description="Live streaming will be available during the tournament. Stay tuned for exciting matches and real-time action!"
          icon="game"
          primaryLabel="Get Notified"
          secondaryLabel="Follow Updates"
        />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-0">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">LIVE NOW</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Watch Live Stream</h2>
            <p className="text-lg text-muted-foreground">
              Semi-Finals are happening now! Don't miss the action.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Live Stream Card */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <span className="text-2xl">▶</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Semi-Final 1</h3>
                    <p className="text-gray-300">Thunder Squad vs Fire Hawks</p>
                    <p className="text-sm text-gray-400 mt-2">Live on YouTube & Twitch</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    1,234 viewers
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <span className="mr-2">▶</span>
                    Watch on YouTube
                  </Button>
                  <Button variant="outline">
                    <span className="mr-2">📺</span>
                    Watch on Twitch
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Match Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-primary" />
                  Current Match Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold text-lg">Thunder Squad</div>
                    <div className="text-sm text-muted-foreground">Delhi University</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1</div>
                    <div className="text-xs text-muted-foreground">Round 1</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">Fire Hawks</div>
                    <div className="text-sm text-muted-foreground">IIT Delhi</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Match Status:</span>
                    <Badge className="bg-green-500 text-white">In Progress</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time Elapsed:</span>
                    <span className="font-medium">12:34</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next Match:</span>
                    <span className="font-medium">Storm Breakers vs Lightning Force</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Star className="h-5 w-5 text-primary mr-2" />
                  When is the registration deadline?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Registration closes on March 10, 2025. Late registrations will not be accepted.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  How many players per team?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Each team must have exactly 4 players. No substitutions allowed during the tournament.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  What are the tournament dates?
                </h3>
                <p className="text-muted-foreground text-sm">
                  College qualifiers: March 1-10, 2025. Grand finale: March 15, 2025 at Delhi University.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Trophy className="h-5 w-5 text-primary mr-2" />
                  Is there an entry fee?
                </h3>
                <p className="text-muted-foreground text-sm">
                  No! The tournament is completely free to enter. Just bring your college ID for verification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Compete?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join hundreds of college students in the ultimate Free Fire showdown. 
              Register your team now and showcase your skills!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white text-primary hover:bg-white/90 border-0 text-lg px-8 py-6 shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/register">Register Your Team</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white bg-white/10 text-white hover:bg-white/20 hover:border-white text-lg px-8 py-6 backdrop-blur-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
