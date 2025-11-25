import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, MessageCircle, Video } from 'lucide-react';

// Background images - using gradient placeholders (replace with actual images)
const backgroundImages = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Slider */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Animated Background Slider */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((gradient, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: gradient,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/85 via-purple-700/90 to-purple-800/95 dark:from-purple-900/90 dark:via-purple-800/95 dark:to-purple-900/95 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Dance For Change
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            A community-driven platform promoting mental health and well-being through dance.
            Join us in making a positive change, one step at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/join">
              <Button 
                size="lg" 
                className="bg-white text-purple-700 hover:bg-purple-50 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
              >
                Join D4C
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 dark:bg-white/5 dark:border-white/20 dark:hover:bg-white/10 text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
              <CardTitle className="text-gray-900 dark:text-slate-100">Mental Health Support</CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Access our MindTalk room for anonymous sharing and support
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-cyan-500 dark:text-cyan-400 mb-2" />
              <CardTitle className="text-gray-900 dark:text-slate-100">Community</CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Connect with dancers who share your passion and values
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-pink-500 dark:text-pink-400 mb-2" />
              <CardTitle className="text-gray-900 dark:text-slate-100">MindTalk Room</CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Share your thoughts anonymously in a safe space
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Video className="h-8 w-8 text-amber-500 dark:text-amber-400 mb-2" />
              <CardTitle className="text-gray-900 dark:text-slate-100">Dance Videos</CardTitle>
              <CardDescription className="text-gray-600 dark:text-slate-400">
                Watch and share inspiring dance performances
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-12 border border-purple-200 dark:border-slate-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-slate-100">
            Ready to Make a Change?
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-xl mx-auto text-lg">
            Join our community of dancers committed to mental health awareness and positive change.
          </p>
          <Link to="/join">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
            >
              Get Started
            </Button>
          </Link>
        </section>
      </section>
    </div>
  );
}

