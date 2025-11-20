import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, MessageCircle, Video } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Dance For Change
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A community-driven platform promoting mental health and well-being through dance.
          Join us in making a positive change, one step at a time.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/join">
            <Button size="lg">Join D4C</Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg">Learn More</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Heart className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Mental Health Support</CardTitle>
            <CardDescription>
              Access our MindTalk room for anonymous sharing and support
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Community</CardTitle>
            <CardDescription>
              Connect with dancers who share your passion and values
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>MindTalk Room</CardTitle>
            <CardDescription>
              Share your thoughts anonymously in a safe space
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Video className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Dance Videos</CardTitle>
            <CardDescription>
              Watch and share inspiring dance performances
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-muted rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Change?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join our community of dancers committed to mental health awareness and positive change.
        </p>
        <Link to="/join">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>
    </div>
  );
}

