import { Budget } from "@prisma/client";
import { formatDistance } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { AlertCircle, Edit2, Trash2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";

export const BudgetCard = ({
  budget,
  onEdit,
  onDelete,
}: {
  budget: Budget;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const percentage = (budget.spent / budget.amount) * 100;
  const isOver = percentage > 100;
  const isWarning = percentage > 80 && !isOver;
  const remainingDays = formatDistance(new Date(budget.currentEnd), new Date());

  return (
    <Card
      className={
        isOver ? "border-red-500" : isWarning ? "border-amber-500" : ""
      }
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{budget.category}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}{" "}
          budget
          <br />
          Resets in {remainingDays}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm">Budget: ${budget.amount.toFixed(2)}</p>
            <p className="text-sm">Spent: ${budget.spent.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">Remaining</p>
            <p className={`text-sm font-bold ${isOver ? "text-red-500" : ""}`}>
              ${(budget.amount - budget.spent).toFixed(2)}
            </p>
          </div>
        </div>
        <Progress
          value={Math.min(percentage, 100)}
          className={`${
            isOver ? "bg-red-200" : isWarning ? "bg-amber-200" : ""
          } ${isOver ? "indicator-red" : isWarning ? "indicator-amber" : ""}`}
        />
        {isOver && (
          <Alert variant="destructive" className="mt-4 p-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Exceeded by ${(budget.spent - budget.amount).toFixed(2)}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
