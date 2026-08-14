import z from "zod";

export const todayIsoString = new Date().toISOString().split("T")[0];

export const expenseSchema = z
  .object({
    amount: z.number().positive("Amount must be greater than 0"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(255, "Description must be less than 255 characters"),
    categoryId: z.string().uuid("Please select a category"),
    date: z.string().min(1, "Date is required"),
  })
  .refine((data) => data.date <= todayIsoString, {
    message: "Date cannot be in the future",
    path: ["date"],
  });

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
