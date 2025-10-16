import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy, Users, Clock, MapPin, Calendar, Award, Target, Shield, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const Tournament = () => {
  const tournamentInfo = [
    { icon: Gamepad2, label: "Game", value: "Free Fire Max", color: "text-blue-600" },
    { icon: Users, label: "Format", value: "Squad (full map)", color: "text-green-600" },
    { icon: MapPin, label: "Mode", value: "Battle Royale", color: "text-purple-600" },
    { icon: Clock, label: "Duration", value: "1 Day", color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full mb-6">
            <Badge className="bg-primary text-white">
              <Trophy className="h-4 w-4 mr-2" />
              Tournament Details
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Tournament Details
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to know about the Free Fire LAN Tournament 2025
          </p>
          
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {tournamentInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="text-center card-hover">
                  <CardContent className="p-6">
                    <IconComponent className={`h-8 w-8 mx-auto mb-3 ${info.color}`} />
                    <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                    <div className="font-semibold text-lg">{info.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tournament Format */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tournament Format</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Two-stage tournament with college qualifiers and grand finale
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stage 1 */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  College Qualifiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Date</div>
                      <div className="text-sm text-muted-foreground">Starting from Nov 10, 2025</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-sm text-muted-foreground">Individual Colleges</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Qualification</div>
                      <div className="text-sm text-muted-foreground">Top 1 team per college (1 girls team + 1 boys team)</div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4">
                  Each college conducts their own qualifier tournament. The winning team from each college 
                  advances to the grand finale.
                </p>
              </CardContent>
            </Card>

            {/* Stage 2 */}
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="bg-accent/20 p-3 rounded-full mr-4">
                    <span className="text-2xl font-bold text-accent">2</span>
                  </div>
                  Grand Finale (LAN)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Date</div>
                      <div className="text-sm text-muted-foreground">Coming soon, 2025</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Location</div>
                  <div className="text-sm text-muted-foreground">Roorkee</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Teams</div>
                      <div className="text-sm text-muted-foreground">12 finalist teams</div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4">
                All qualified teams compete in a LAN tournament at Roorkee.
                  Live streaming available for semi-finals and grand finale.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Prizes */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prize Distribution</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Exciting prizes await the champions of NEURAPLAY 2025
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center card-hover border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🥇</div>
                <h3 className="text-xl font-bold mb-2">1st Place</h3>
                <div className="text-4xl font-bold text-primary mb-2">₹8,000</div>
                <p className="text-sm text-muted-foreground mb-4">Trophy + Certificates</p>
                <Badge className="bg-yellow-500 text-white">Champions</Badge>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🥈</div>
                <h3 className="text-xl font-bold mb-2">2nd Place</h3>
                <div className="text-4xl font-bold text-primary mb-2">₹4,000</div>
                <p className="text-sm text-muted-foreground mb-4">Certificates</p>
                <Badge className="bg-gray-500 text-white">Runner-up</Badge>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-xl font-bold mb-2">MVP Award</h3>
                <div className="text-2xl font-bold text-primary mb-2">Special Prize</div>
                <p className="text-sm text-muted-foreground mb-4">Trophy + Certificate</p>
                <Badge className="bg-amber-500 text-white">Most Valuable Player</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Rules & Guidelines */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rules & Guidelines</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Important rules and guidelines for fair play and smooth tournament experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Eligibility Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "All participants must be currently enrolled college students",
                    "Each team must consist of exactly 4 players",
                    "College ID verification is mandatory",
                    "Teams must report 30 minutes before match time",
                    "Devices will be checked before matches"
                  ].map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-accent" />
                  Game Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Battle Royale Squad Mode (4 players per team)",
                    "Bermuda Map with random spawn locations",
                    "Any character allowed, no restrictions",
                    "No mods, hacks, or third-party applications",
                    "In-game voice chat only, no external communication"
                  ].map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary to-accent text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Compete?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Register your team now and showcase your skills in the biggest college eSports tournament!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary hover:bg-white/90 border-0 text-lg px-8 py-6"
                >
                  <Link to="/register">Register Your Team</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-white/10 text-white hover:bg-white/20 hover:border-white text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link to="/schedule">View Schedule</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Tournament;
