import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function DashboardCard({
  title,
  value,
  change,
  icon,
  isPercentage = false,
  isLoading,
}: {
  title: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  isPercentage?: boolean;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-[120px] mb-1" />
            <Skeleton className="h-4 w-[80px]" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {isPercentage
                ? `${Math.round(value)}%`
                : `$${Math.abs(value).toLocaleString()}`}
            </div>
            {change !== undefined && (
              <p className="text-xs text-muted-foreground">
                {change >= 0 ? "+" : ""}
                {Math.round(change)}% from last month
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
