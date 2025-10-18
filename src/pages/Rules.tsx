import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Shield, Users, Clock, Trophy } from "lucide-react";

const Rules = () => {
  const generalRules = [
    {
      title: "Eligibility",
      description: "All participants must be currently enrolled college students",
      icon: Users,
      type: "required"
    },
    {
      title: "Team Composition",
      description: "Each team must consist of exactly 4 players",
      icon: Users,
      type: "required"
    },
    {
      title: "College ID Verification",
      description: "Valid college ID card must be presented at registration",
      icon: Shield,
      type: "required"
    },
    {
      title: "Device Requirements",
      description: "Players must bring their own mobile devices",
      icon: Shield,
      type: "required"
    },
    {
      title: "Punctuality",
      description: "Teams must arrive 30 minutes before match time",
      icon: Clock,
      type: "required"
    }
  ];

  const gameRules = [
    {
      title: "Game Mode",
      description: "Battle Royale Squad Mode (4 players per team)",
      allowed: true
    },
    {
      title: "Map Selection",
      description: "Bermuda Map - Random spawn locations",
      allowed: true
    },
    {
      title: "Character Selection",
      description: "Any character allowed, no restrictions",
      allowed: true
    },
    {
      title: "Third-party Apps",
      description: "No mods, hacks, or third-party applications",
      allowed: false
    },
    {
      title: "Screen Recording",
      description: "Screen recording during matches is prohibited",
      allowed: false
    },
    {
      title: "Communication",
      description: "In-game voice chat only, no external communication",
      allowed: true
    }
  ];

  const penalties = [
    {
      offense: "Late Arrival",
      penalty: "Match forfeit",
      severity: "high"
    },
    {
      offense: "Using Third-party Apps",
      penalty: "Immediate disqualification",
      severity: "critical"
    },
    {
      offense: "Unsportsmanlike Conduct",
      penalty: "Warning or disqualification",
      severity: "high"
    },
    {
      offense: "Fake College ID",
      penalty: "Team disqualification",
      severity: "critical"
    },
    {
      offense: "Technical Issues",
      penalty: "Match restart (if possible)",
      severity: "medium"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full mb-6">
            <Badge className="bg-primary text-white">
              <Shield className="h-4 w-4 mr-2" />
              Tournament Rules
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Tournament Rules & Regulations
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Please read and understand all rules before participating
          </p>
          
          {/* Important Notice */}
          <Alert className="max-w-3xl mx-auto mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> All rules are strictly enforced. Violations may result in immediate disqualification. 
              When in doubt, ask the tournament organizers.
            </AlertDescription>
          </Alert>
        </div>

        {/* General Rules */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">General Rules</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {generalRules.map((rule, index) => {
              const IconComponent = rule.icon;
              return (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{rule.title}</h3>
                        <p className="text-muted-foreground">{rule.description}</p>
                        <Badge className="mt-2 bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Required
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Game Rules */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Game Rules</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Free Fire Tournament Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gameRules.map((rule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{rule.title}</h4>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="ml-4">
                      {rule.allowed ? (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Allowed
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500 text-white">
                          <XCircle className="h-3 w-3 mr-1" />
                          Prohibited
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Penalties */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Penalties & Consequences</h2>
          <Card>
            <CardHeader>
              <CardTitle>Rule Violations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {penalties.map((penalty, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{penalty.offense}</h4>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground">{penalty.penalty}</span>
                      <Badge className={getSeverityColor(penalty.severity)}>
                        {penalty.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tournament Format */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Tournament Format</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Qualification Rounds (College Qualifier)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Format:</strong> Single elimination</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Match Type:</strong> Match per round (The specific number of games/matches is now open)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Advancement:</strong> The top 1 girls team and the top 1 boys team will advance to the Final</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Pairings:</strong> Random team pairings</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Final Rounds</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Semi-finals:</strong> (The specific number of games/matches is now open)</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    <span className="text-sm"><strong>Note:</strong> The structure still includes semi-finals, but the format (e.g., Best of 3, Single Match) needs to be defined</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Grand Final:</strong> (The specific number of games/matches is now open)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Prize Distribution:</strong> Prizes will be given to the Winner, Runner-up, and MVP (Most Valuable Player)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Visibility:</strong> Live streaming for finals</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span><strong>Prize Timing:</strong> Immediate prize distribution</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact for Questions */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About Rules?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about the rules or need clarification, 
              please contact our tournament organizers before the event.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-primary text-white px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                Contact Organizers
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                Available 9 AM - 9 PM
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rules;
