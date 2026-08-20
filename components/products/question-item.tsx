import { Question } from "@/types/api/question.types";
import { formatDate } from "@/lib/format";

interface QuestionItemProps {
  question: Question;
}

export function QuestionItem({ question }: QuestionItemProps) {
  return (
    <div className="py-6 first:pt-0">
      <div className="flex items-start gap-2">
        <span className="text-sm font-medium text-neutral-900">Q:</span>
        <div className="flex-1">
          <p className="text-sm text-neutral-900">{question.question}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
            <span>{question.user.name ?? "Anonymous"}</span>
            <span>·</span>
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>
      </div>

      {question.answer ? (
        <div className="mt-3 flex items-start gap-2 pl-6">
          <span className="text-sm font-medium text-neutral-900">A:</span>
          <div className="flex-1">
            <p className="text-sm text-neutral-600">{question.answer}</p>
            {question.answeredAt && (
              <p className="mt-1 text-xs text-neutral-400">
                Answered {formatDate(question.answeredAt)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-3 pl-6 text-xs italic text-neutral-400">Awaiting answer</p>
      )}
    </div>
  );
}