import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@prisma/client";

export function RecentTransactions({
  transactions,
}: {
  transactions?: Transaction[];
}) {
  if (!transactions?.length) return <div>No recent transactions</div>;

  return (
    <div className="space-y-4">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-medium">
              {t.description || t.category}
              <Badge variant="outline" className="ml-2">
                {t.category}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(t.date), "MMM dd, yyyy")}
            </div>
          </div>
          <div
            className={`font-medium ${
              t.type === "income" ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {t.type === "income" ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
