import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const SummaryCard = ({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${value.toFixed(2)}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);
