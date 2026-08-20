import { Question } from "@/types/api/question.types";
import { QuestionItem } from "./question-item";

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <p className="py-6 text-sm text-neutral-500">
        No questions yet — be the first to ask.
      </p>
    );
  }

  return (
    <div className="divide-y divide-neutral-200">
      {questions.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </div>
  );
}