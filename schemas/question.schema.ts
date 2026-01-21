import * as z from "zod";

export const questionSchema = z.object({ 
  productId: z.string(),
  question: z.string().min(5, "Question must be at least 5 characters long").max(500),
});

export type QuestionInput = z.infer<typeof questionSchema>;

export const answerSchema = z.object({ 
  answer: z.string().min(5, "Answer must be at least 5 characters long").max(1000),
});

export type AnswerInput = z.infer<typeof answerSchema>;