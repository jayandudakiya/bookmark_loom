import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  BookmarkIcon,
  Search,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Palette,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BookmarksIcon } from '@/assets/icons/bookmarks/bookmarks.svg';
import { ReactComponent as AddBookmarkIcon } from '@/assets/icons/bookmarks/bookmark-add.svg';

function WelcomePage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();

  const onGetStarted = () => {
    navigate('/register');
  };

  const features = [
    {
      icon: <BookmarkIcon className="h-6 w-6" />,
      title: 'Smart Organization',
      description: 'Organize bookmarks with categories and smart search',
      color: 'bg-blue-500',
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Instant Search',
      description: 'Find any bookmark in seconds with powerful search',
      color: 'bg-green-500',
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: 'Beautiful Design',
      description: 'Enjoy a clean, modern interface with dark mode',
      color: 'bg-purple-500',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure Storage',
      description: 'Your bookmarks are safely stored locally',
      color: 'bg-orange-500',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary/3 rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-primary/4 rounded-full animate-pulse-slow delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-primary/2 rounded-full animate-pulse-slow delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-primary rounded-2xl shadow-2xl transition-transform hover:scale-110 hover:rotate-3">
                <BookmarksIcon className="h-12 w-12 text-primary-foreground stroke-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold  mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-slide-in-up">
            Bookmark Loom
          </h1>

          <p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Your personal bookmark manager that makes organizing and accessing
            your favorite websites a{' '}
            <span className="text-primary font-semibold">breeze</span>
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-slide-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm">
              <Star className="h-3 w-3 mr-1" />
              Free Forever
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1 text-sm">
              <Zap className="h-3 w-3 mr-1" />
              Lightning Fast
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-3 py-1 text-sm">
              <Shield className="h-3 w-3 mr-1" />
              Privacy First
            </Badge>
          </div>

          <Button onClick={onGetStarted} size="lg">
            <span className="mr-2">Get Started</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group transition-all duration-500 hover:scale-105 hover:shadow-2xl border-2 hover:border-primary/30 animate-slide-in-up ${
                currentFeature === index
                  ? 'ring-2 ring-primary/50 shadow-xl scale-105'
                  : ''
              }`}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-white mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Preview */}
        <div
          className="max-w-4xl mx-auto animate-slide-in-up"
          style={{ animationDelay: '0.9s' }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              See It In Action
            </h2>
            <p className="text-muted-foreground">
              A glimpse of what awaits you
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      Bookmark Loom
                    </span>
                  </div>
                  <div className="flex-1 bg-background/50 rounded-lg px-3 py-2 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Search bookmarks...
                    </span>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <AddBookmarkIcon className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'GitHub',
                      category: 'Development',
                      color: 'bg-blue-500',
                    },
                    {
                      name: 'Dribbble',
                      category: 'Design',
                      color: 'bg-purple-500',
                    },
                    { name: 'Medium', category: 'News', color: 'bg-green-500' },
                    {
                      name: 'YouTube',
                      category: 'Entertainment',
                      color: 'bg-red-500',
                    },
                  ].map((bookmark, index) => (
                    <div
                      key={index}
                      className="bg-background/50 rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-all hover:scale-105"
                      style={{ animationDelay: `${1 + index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-foreground">
                          {bookmark.name}
                        </h4>
                        <Badge
                          className={`text-white text-xs ${bookmark.color}`}
                        >
                          {bookmark.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        https://{bookmark.name.toLowerCase()}.com
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs bg-transparent"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </Button>
                        <Button size="sm" variant="ghost" className="px-2">
                          <BookmarkIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div
          className="text-center mt-12 animate-slide-in-up"
          style={{ animationDelay: '1.2s' }}
        >
          <p className="text-muted-foreground mb-4">
            Ready to organize your digital life?
          </p>
          <Button
            onClick={onGetStarted}
            variant="outline"
            size="lg"
            className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105 group bg-transparent"
          >
            <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
