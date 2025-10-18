import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Users, Heart, Calendar, MapPin, Clock, Award, Star, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const committee = [
    { 
      name: "Rahul Sharma", 
      role: "Event Coordinator",
      college: "Roorkee",
      experience: "3+ years",
      avatar: "RS",
      color: "bg-blue-500"
    },
    { 
      name: "Priya Singh", 
      role: "Technical Head",
      college: "IIT Delhi",
      experience: "2+ years",
      avatar: "PS",
      color: "bg-purple-500"
    },
    { 
      name: "Arjun Patel", 
      role: "Management & PR",
      college: "JNU",
      experience: "4+ years",
      avatar: "AP",
      color: "bg-green-500"
    },
    { 
      name: "Neha Gupta", 
      role: "Sponsorship Lead",
      college: "Amity University",
      experience: "2+ years",
      avatar: "NG",
      color: "bg-pink-500"
    },
  ];

  const stats = [
    { icon: Users, label: "Participants", value: "200+", color: "text-blue-600" },
    { icon: Trophy, label: "Teams", value: "50+", color: "text-yellow-600" },
    { icon: Calendar, label: "Tournament Days", value: "2", color: "text-green-600" },
    { icon: Award, label: "Prize Pool", value: "₹12K", color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full mb-6">
            <Badge className="bg-primary text-white">
              <Gamepad2 className="h-4 w-4 mr-2" />
              About NEURAPLAY
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            About the Event
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Promoting eSports at the campus level and creating opportunities for young gamers to showcase their talent
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center card-hover">
                  <CardContent className="p-6">
                    <IconComponent className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Event Overview */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Tournament Overview
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Mission</h3>
                    <p className="text-muted-foreground">
                      To promote eSports at the campus level and provide students a platform to showcase their talent 
                      in a professional and organized environment.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Vision</h3>
                    <p className="text-muted-foreground">
                      We believe in nurturing gaming talent and creating opportunities for young players to excel in 
                      competitive eSports while building a strong gaming community.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Achievement</h3>
                    <p className="text-muted-foreground">
                      The <strong>Intercollege Free Fire LAN Tournament 2025</strong> brings together top college teams 
                      from Uttarakhand and Delhi in an exciting offline competition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Tournament Date</div>
                    <div className="text-sm text-muted-foreground">March 15-16, 2025</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Venue</div>
                    <div className="text-sm text-muted-foreground">Roorkee</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Duration</div>
                    <div className="text-sm text-muted-foreground">2 Days Tournament</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Format</div>
                    <div className="text-sm text-muted-foreground">LAN Tournament</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Organizing Committee */}
        {/* <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate organizers behind NEURAPLAY 2025
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {committee.map((member, index) => (
              <Card key={index} className="text-center card-hover group">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="outline" className="mb-2">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground mb-2">{member.college}</p>
                  <div className="flex items-center justify-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                    {member.experience} experience
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section> */}

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary to-accent text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Join the Tournament?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Register your team now and be part of the biggest college eSports tournament in Delhi!
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

export default About;
