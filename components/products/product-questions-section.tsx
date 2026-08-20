import { Question } from "@/types/api/question.types";
import { QuestionList } from "./question-list";
import { AskQuestionForm } from "./ask-question-form";

interface ProductQuestionsSectionProps {
  productId: string;
  productSlug: string;
  questions: Question[];
}

export function ProductQuestionsSection({
  productId,
  productSlug,
  questions,
}: ProductQuestionsSectionProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-lg font-medium text-neutral-900">
        Questions {questions.length > 0 && `(${questions.length})`}
      </h2>

      <QuestionList questions={questions} />

      <div className="mt-8 border-t border-neutral-200 pt-8">
        <AskQuestionForm productId={productId} productSlug={productSlug} />
      </div>
    </section>
  );
}