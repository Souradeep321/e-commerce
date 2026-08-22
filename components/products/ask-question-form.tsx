"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema, QuestionInput } from "@/schemas/question.schema";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
// import { askQuestion } from "@/lib/api/questions";
import { toast } from "sonner";

interface AskQuestionFormProps {
  productId: string;
  productSlug: string;
  onSuccess?: () => void;
}

export function AskQuestionForm({ productId, productSlug, onSuccess }: AskQuestionFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: { productId, question: "" },
  });

  async function onSubmit(values: QuestionInput) {
    setSubmitting(true);
    try {
      // TODO: swap for the real call once auth exists:
      // await askQuestion(productSlug, values.question);
      await new Promise((resolve) => setTimeout(resolve, 500)); // simulate network delay
      form.reset({ productId, question: "" });
      onSuccess?.();
      toast.success("Question submitted successfully!");
    } catch (err) {
      // TODO: surface real error via toast once toast system exists
      console.error(err);
      toast.error("Failed to submit question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="question"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor="ask-question"
              className="text-xs uppercase tracking-wide text-neutral-500"
            >
              Ask a question
            </FieldLabel>
            <Textarea
              {...field}
              id="ask-question"
              aria-invalid={fieldState.invalid}
              placeholder="What would you like to know about this product?"
              className="min-h-24 resize-none"
              rows={3}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Question"}
      </Button>
    </form>
  );
}