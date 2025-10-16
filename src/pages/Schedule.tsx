import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Trophy, Play, AlertCircle } from "lucide-react";
import ComingSoonOverlay from "@/components/ComingSoonOverlay";
import { useState } from "react";

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState("day1");

  const scheduleData = {
    day1: {
      date: "Nov 10, 2025",
      title: "Qualifier Rounds & Semi-Finals",
      events: [
        {
          id: 1,
          time: "9:00 AM - 9:30 AM",
          event: "Registration & Setup",
          description: "Team check-in and LAN setup verification",
          status: "completed",
          venue: "Main Hall"
        },
        {
          id: 2,
          time: "9:30 AM - 10:00 AM",
          event: "Opening Ceremony",
          description: "Tournament introduction and rules briefing",
          status: "completed",
          venue: "Main Stage"
        },
        {
          id: 3,
          time: "10:00 AM - 10:30 AM",
          event: "Quarter-Final 1",
          description: "Thunder Squad vs Eagle Warriors",
          status: "completed",
          venue: "Gaming Zone A",
          result: "Thunder Squad Wins"
        },
        {
          id: 4,
          time: "10:30 AM - 11:00 AM",
          event: "Quarter-Final 2",
          description: "Fire Hawks vs Phoenix Rising",
          status: "completed",
          venue: "Gaming Zone B",
          result: "Fire Hawks Wins"
        },
        {
          id: 5,
          time: "11:00 AM - 11:30 AM",
          event: "Quarter-Final 3",
          description: "Storm Breakers vs Lightning Force",
          status: "completed",
          venue: "Gaming Zone A",
          result: "Storm Breakers Wins"
        },
        {
          id: 6,
          time: "11:30 AM - 12:00 PM",
          event: "Quarter-Final 4",
          description: "Wildcard Match",
          status: "completed",
          venue: "Gaming Zone B",
          result: "Lightning Force Wins"
        },
        {
          id: 7,
          time: "12:00 PM - 1:00 PM",
          event: "Lunch Break",
          description: "Refreshments and networking",
          status: "completed",
          venue: "Cafeteria"
        },
        {
          id: 8,
          time: "1:00 PM - 1:30 PM",
          event: "Semi-Final 1",
          description: "Thunder Squad vs Fire Hawks",
          status: "live",
          venue: "Main Stage",
          stream: true
        },
        {
          id: 9,
          time: "1:30 PM - 2:00 PM",
          event: "Semi-Final 2",
          description: "Storm Breakers vs Lightning Force",
          status: "upcoming",
          venue: "Main Stage",
          stream: true
        }
      ]
    },
    day2: {
      date: "March 16, 2025",
      title: "Grand Finale & Awards",
      events: [
        {
          id: 10,
          time: "10:00 AM - 10:30 AM",
          event: "Final Setup",
          description: "Technical setup for grand finale",
          status: "upcoming",
          venue: "Main Stage"
        },
        {
          id: 11,
          time: "10:30 AM - 11:30 AM",
          event: "Grand Finale",
          description: "Championship Match",
          status: "upcoming",
          venue: "Main Stage",
          stream: true
        },
        {
          id: 12,
          time: "11:30 AM - 12:00 PM",
          event: "Awards Ceremony",
          description: "Prize distribution and closing ceremony",
          status: "upcoming",
          venue: "Main Stage"
        }
      ]
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "live":
        return <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500 text-white">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const currentDay = scheduleData[selectedDay as keyof typeof scheduleData];

  return (
    <div className="min-h-screen pt-24 pb-12 relative">
      <ComingSoonOverlay
        title="Coming Soon!"
        description="The complete tournament schedule will be available soon. Stay tuned for updates on match timings, venues, and live streaming details."
        icon="calendar"
        primaryLabel="Get Notified"
        secondaryLabel="Follow Updates"
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-0">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full mb-6">
            <Badge className="bg-primary text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Tournament Schedule
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Tournament Schedule
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Complete timeline of matches, events, and activities
          </p>
          
          {/* Live Status */}
          <div className="inline-flex items-center space-x-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">SEMI-FINALS LIVE NOW</span>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-muted p-1 rounded-lg">
            <Button
              variant={selectedDay === "day1" ? "default" : "ghost"}
              onClick={() => setSelectedDay("day1")}
              className="px-6"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Day 1 - Qualifiers
            </Button>
            <Button
              variant={selectedDay === "day2" ? "default" : "ghost"}
              onClick={() => setSelectedDay("day2")}
              className="px-6"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Day 2 - Finals
            </Button>
          </div>
        </div>

        {/* Schedule Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{currentDay.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{currentDay.date}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Events</div>
                <div className="text-2xl font-bold text-primary">{currentDay.events.length}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentDay.events.map((event, index) => (
                <div
                  key={event.id}
                  className={`p-6 border rounded-lg transition-all duration-300 hover:shadow-md ${
                    event.status === "live" 
                      ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200" 
                      : event.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : "bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{event.time}</span>
                        </div>
                        {event.stream && (
                          <Badge className="bg-purple-500 text-white">
                            <Play className="h-3 w-3 mr-1" />
                            Live Stream
                          </Badge>
                        )}
                        {getStatusBadge(event.status)}
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2">{event.event}</h3>
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.venue}
                        </div>
                        {event.result && (
                          <div className="flex items-center text-green-600 font-medium">
                            <Trophy className="h-4 w-4 mr-1" />
                            {event.result}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {event.status === "live" && (
                      <div className="ml-4">
                        <Button className="bg-red-500 hover:bg-red-600 text-white">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Live
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-800 mb-4">Coming Soon!</h3>
            <p className="text-lg text-orange-700 mb-6 max-w-2xl mx-auto">
              The complete tournament schedule will be available soon. Stay tuned for updates on match timings, venues, and live streaming details.
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Get Notified
              </Button>
              <Button variant="outline" className="border-orange-300 text-orange-700">
                <AlertCircle className="h-4 w-4 mr-2" />
                Follow Updates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Important Notes</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All times are in IST (Indian Standard Time)</li>
                  <li>• Teams must arrive 30 minutes before their scheduled match</li>
                  <li>• Live streaming available for semi-finals and grand finale</li>
                  <li>• Prize distribution will happen immediately after the final match</li>
                  <li>• Free refreshments available during lunch break</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Stream Info */}
        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-purple-800">Watch Live Stream</h3>
              <div className="flex justify-center space-x-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  YouTube Live
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Twitch
                </Button>
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Venue Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
