import { Budget } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

export const BudgetDialog = ({
  open,
  onOpenChange,
  editingBudget,
  formData,
  setFormData,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBudget: Budget | null;
  formData: { category: string; amount: string; period: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ category: string; amount: string; period: string }>
  >;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>
            {editingBudget ? "Edit Budget" : "Add Budget"}
          </DialogTitle>
          <DialogDescription>
            {editingBudget
              ? "Update your budget settings"
              : "Create a new spending target"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="e.g., Groceries"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select
              value={formData.period}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, period: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {editingBudget ? "Save Changes" : "Create Budget"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);
