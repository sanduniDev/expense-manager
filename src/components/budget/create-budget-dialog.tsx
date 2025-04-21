import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const EXPENSE_CATEGORIES = [
  "Food",
  "Housing",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Other Expense",
];

const budgetSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES as [string, ...string[]], {
    required_error: "Please select a category",
  }),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0")
    .min(0.01, "Amount must be at least 0.01"),
  period: z.enum(["weekly", "monthly", "yearly"], {
    required_error: "Please select a period",
  }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;
export default function CreateBudgetDialog({
  isOpen,
  onClose,
  onCreateBudget,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateBudget: (values: BudgetFormValues) => void;
  isPending: boolean;
}) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: undefined,
      amount: 0,
      period: undefined,
    },
    mode: "onSubmit",
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Budget</DialogTitle>
          <DialogDescription>
            Set a new budget for an expense category
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreateBudget)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Category</FormLabel>
                  <div className="col-span-3">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Amount</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Period</FormLabel>
                  <div className="col-span-3">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* <SelectItem value="weekly">Weekly</SelectItem> */}
                        <SelectItem value="monthly">Monthly</SelectItem>
                        {/* <SelectItem value="yearly">Yearly</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Save Budget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
