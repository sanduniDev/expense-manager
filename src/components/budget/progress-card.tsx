import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

export const ProgressCard = ({ percentage }: { percentage: number }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{percentage.toFixed(1)}%</div>
      <Progress value={percentage} className="mt-2" />
    </CardContent>
  </Card>
);
