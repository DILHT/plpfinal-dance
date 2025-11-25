import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-slate-100">About Dance For Change</h1>

        <section className="mb-12">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-gray-900 dark:text-slate-100">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Dance For Change (D4C) is a community-driven platform dedicated to promoting mental health 
                and well-being through the transformative power of dance. We believe that movement and 
                expression can be powerful tools for healing, connection, and positive change.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-gray-900 dark:text-slate-100">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                We envision a world where young people have access to safe spaces for self-expression, 
                where mental health is openly discussed and supported, and where dance serves as a bridge 
                to healing and community connection. Our platform aligns with SDG 3 (Good Health & Well-being) 
                and SDG 8 (Decent Work) by creating opportunities for personal growth and community engagement.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-gray-900 dark:text-slate-100">Mental Health Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
                Dance has been proven to have numerous mental health benefits:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-slate-400">
                <li>Reduces stress and anxiety</li>
                <li>Improves mood and emotional well-being</li>
                <li>Enhances self-confidence and self-expression</li>
                <li>Creates a sense of community and belonging</li>
                <li>Provides a healthy outlet for emotions</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-gray-900 dark:text-slate-100">How D4C Supports Young People</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600 dark:text-slate-400">
                <p>
                  <strong className="text-gray-900 dark:text-slate-100">MindTalk Room:</strong> A safe, anonymous space where 
                  approved members can share their thoughts, struggles, and victories without fear of judgment.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-slate-100">Community Connection:</strong> Connect with other dancers 
                  who understand your journey and share your passion for dance and mental wellness.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-slate-100">Creative Expression:</strong> Share your dance videos and 
                  performances, inspiring others while expressing yourself.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-slate-100">Approval System:</strong> Our careful approval process ensures 
                  a safe, supportive community where everyone can thrive.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
