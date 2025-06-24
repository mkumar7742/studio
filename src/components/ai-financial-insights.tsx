"use client";

import { useEffect, useState } from "react";
import { generateFinancialInsights, type GenerateFinancialInsightsOutput } from "@/ai/flows/generate-financial-insights";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

export function AIFinancialInsights() {
  const [result, setResult] = useState<GenerateFinancialInsightsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const mockData = {
          income: 5500,
          expenses: [
            { category: "Rent", amount: 1650 },
            { category: "Food", amount: 203.10 },
            { category: "Transport", amount: 55.20 },
            { category: "Entertainment", amount: 32.00 },
            { category: "Shopping", amount: 89.99 },
            { category: "Health", amount: 25.10 },
            { category: "Phone Bill", amount: 150 },
          ],
          savingsGoal: 1200,
          pastFinancialSummary: "User has been consistently saving around $1000 per month but struggles with impulse shopping.",
        };
        const response = await generateFinancialInsights(mockData);
        setResult(response);
      } catch (e) {
        console.error(e);
        setError("Failed to generate AI insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="size-5 text-chart-5" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Smart advice to help you reach your financial goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          renderLoadingState()
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : result ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{result.summary}</p>
            <Accordion type="single" collapsible className="w-full">
              {result.insights.map((insight, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{insight.title}</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2 text-sm">{insight.description}</p>
                    <p className="rounded-md bg-primary/10 p-3 text-sm font-medium text-primary border border-primary/20">
                      {insight.recommendation}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
