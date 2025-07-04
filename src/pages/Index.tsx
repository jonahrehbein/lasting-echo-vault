import { MobileHeader } from "@/components/MobileHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users, Library, Shield, Heart, MessageCircle, Clock, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const features = [
  {
    icon: Video,
    title: "Record Messages",
    description: "Create heartfelt video messages with guided prompts",
    href: "/record"
  },
  {
    icon: Users,
    title: "Trusted Contacts",
    description: "Choose who will receive your messages",
    href: "/contacts"
  },
  {
    icon: Library,
    title: "Your Library",
    description: "Manage and organize your recorded messages",
    href: "/library"
  },
  {
    icon: Shield,
    title: "Secure Vault",
    description: "Encrypted storage for your precious memories",
    href: "/vault"
  }
];

const quickActions = [
  {
    icon: Heart,
    title: "Share Your Love",
    description: "Tell them what they mean to you",
    color: "text-primary"
  },
  {
    icon: MessageCircle,
    title: "Life Lessons",
    description: "Share wisdom and guidance",
    color: "text-accent-foreground"
  },
  {
    icon: Clock,
    title: "Memories",
    description: "Preserve special moments",
    color: "text-primary"
  }
];

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated users to the auth page
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      
      {/* Hero Section */}
      <div className="px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">
            Preserve Your Legacy
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Create meaningful video messages for your loved ones—delivered when it matters most
          </p>
          
          <div className="space-y-3">
            <Link to="/record">
              <Button size="lg" variant="legacy" className="w-full max-w-sm h-14 text-base font-medium">
                <Video className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <Card key={index} className="shadow-card hover:shadow-gentle transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Features</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Link key={index} to={feature.href}>
                <Card className="shadow-card hover:shadow-gentle transition-all duration-300 h-full">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1 text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <Card className="bg-primary/5 border-primary/20 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">Secure & Private</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your messages are encrypted and stored securely. Only your trusted contacts can access them when the time comes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
