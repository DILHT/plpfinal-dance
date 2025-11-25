import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getApprovedDancers } from '@/services/user.service';
import { Users } from 'lucide-react';

export default function DancersPage() {
  const { data: dancers, isLoading } = useQuery({
    queryKey: ['approved-dancers'],
    queryFn: getApprovedDancers,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-gray-600 dark:text-slate-400">Loading dancers...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-slate-100">Our Dancers</h1>
        <p className="text-gray-600 dark:text-slate-400">
          Meet the amazing members of our Dance For Change community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dancers && dancers.length > 0 ? (
          dancers.map((dancer) => (
            <Card key={dancer._id} className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={dancer.profilePic} />
                    <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      {dancer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-slate-100">{dancer.name}</CardTitle>
                    {dancer.danceStyle && (
                      <Badge variant="outline" className="mt-1 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300">
                        {dancer.danceStyle}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {dancer.bio && (
                  <p className="text-sm text-gray-600 dark:text-slate-400">{dancer.bio}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardContent className="py-12 text-center text-gray-600 dark:text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400 dark:text-slate-500" />
              <p>No dancers to display yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
