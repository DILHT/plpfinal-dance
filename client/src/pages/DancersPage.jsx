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
        <div className="text-center">Loading dancers...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Our Dancers</h1>
        <p className="text-muted-foreground">
          Meet the amazing members of our Dance For Change community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dancers && dancers.length > 0 ? (
          dancers.map((dancer) => (
            <Card key={dancer._id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={dancer.profilePic} />
                    <AvatarFallback>{dancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{dancer.name}</CardTitle>
                    {dancer.danceStyle && (
                      <Badge variant="outline" className="mt-1">
                        {dancer.danceStyle}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {dancer.bio && (
                  <p className="text-sm text-muted-foreground">{dancer.bio}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No dancers to display yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
