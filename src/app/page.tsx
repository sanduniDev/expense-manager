import { Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Expense Manager",
  description: "Track your income and expenses with ease",
  generator: "v0.dev",
};
export default async function Home() {
  redirect("/dashboard"); // Redirects immediately
  return null; // This is required since Next.js expects a return
}
