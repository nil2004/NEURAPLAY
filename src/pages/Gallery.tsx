import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar, Users, Trophy, Camera, Play, Download } from "lucide-react";
import ComingSoonOverlay from "@/components/ComingSoonOverlay";
import tournamentImage from "@/assets/tournament-featured.jpg";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Enhanced gallery items with categories and descriptions
  const galleryItems = [
    { 
      id: 1, 
      image: tournamentImage, 
      title: "Tournament Setup", 
      category: "setup",
      date: "Nov 10, 2025",
      description: "LAN setup preparation at Delhi University"
    },
    { 
      id: 2, 
      image: tournamentImage, 
      title: "Team Registration", 
      category: "registration",
      date: "Oct 20, 2025",
      description: "Teams registering for the tournament"
    },
    { 
      id: 3, 
      image: tournamentImage, 
      title: "Opening Ceremony", 
      category: "ceremony",
      date: "Nov 10, 2025",
      description: "Tournament opening ceremony"
    },
    { 
      id: 4, 
      image: tournamentImage, 
      title: "Intense Gaming", 
      category: "gaming",
      date: "Nov 10, 2025",
      description: "Players in action during matches"
    },
    { 
      id: 5, 
      image: tournamentImage, 
      title: "Prize Distribution", 
      category: "awards",
      date: "Nov 10, 2025",
      description: "Winners receiving their prizes"
    },
    { 
      id: 6, 
      image: tournamentImage, 
      title: "Behind the Scenes", 
      category: "behind",
      date: "Nov 10, 2025",
      description: "Organizers managing the event"
    },
    { 
      id: 7, 
      image: tournamentImage, 
      title: "Audience Reactions", 
      category: "audience",
      date: "Nov 10, 2025",
      description: "Excited spectators watching the matches"
    },
    { 
      id: 8, 
      image: tournamentImage, 
      title: "Team Celebrations", 
      category: "celebration",
      date: "March 15, 2025",
      description: "Teams celebrating their victories"
    },
    { 
      id: 9, 
      image: tournamentImage, 
      title: "Closing Ceremony", 
      category: "ceremony",
      date: "March 15, 2025",
      description: "Tournament closing ceremony"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Photos', count: galleryItems.length },
    { id: 'setup', label: 'Setup', count: galleryItems.filter(item => item.category === 'setup').length },
    { id: 'gaming', label: 'Gaming', count: galleryItems.filter(item => item.category === 'gaming').length },
    { id: 'awards', label: 'Awards', count: galleryItems.filter(item => item.category === 'awards').length },
    { id: 'ceremony', label: 'Ceremony', count: galleryItems.filter(item => item.category === 'ceremony').length },
    { id: 'behind', label: 'Behind Scenes', count: galleryItems.filter(item => item.category === 'behind').length }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-12 relative">
      <ComingSoonOverlay
        title="Coming Soon!"
        description="The tournament gallery will be updated with photos from qualifiers and the grand finale. Follow us on social media for live updates during the tournament!"
        icon="camera"
        primaryLabel="Get Notified"
        secondaryLabel="Follow Updates"
      />

      <div className="container mx-auto px-4 relative z-0">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full mb-6">
            <Badge className="bg-primary text-white">
              <Camera className="h-4 w-4 mr-2" />
              Tournament Gallery
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">Tournament Gallery</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Relive the best moments from our Free Fire LAN Tournament 2025
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Camera className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold text-primary">50+</span>
              </div>
              <p className="text-sm text-muted-foreground">Photos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-accent mr-2" />
                <span className="text-2xl font-bold text-accent">200+</span>
              </div>
              <p className="text-sm text-muted-foreground">Participants</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-600">12</span>
              </div>
              <p className="text-sm text-muted-foreground">Teams</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="transition-all duration-300"
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden card-hover cursor-pointer group"
            >
              <div className="relative aspect-video">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-white/90 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-white/80">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.date}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    {item.category}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="text-center mt-16">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <div className="p-12">
              <div className="flex items-center justify-center mb-6">
                <Camera className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-orange-800 mb-4">Coming Soon!</h3>
              <p className="text-orange-700 mb-6 max-w-2xl mx-auto">
                The tournament gallery will be updated with photos from qualifiers and the grand finale.
                Follow us on social media for live updates during the tournament!
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Live
                </Button>
                <Button variant="outline" className="border-orange-300 text-orange-700 flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Follow Updates
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
