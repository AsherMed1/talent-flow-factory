
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KeyTopicsCardProps {
  topics: string[];
}

export const KeyTopicsCard = ({ topics }: KeyTopicsCardProps) => {
  if (topics.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Discussion Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
