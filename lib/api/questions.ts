import { apiFetch } from "./client";
import {
  ProductQuestionsResponse,
  AskQuestionResponse,
  DeleteQuestionResponse,
  GetOwnQuestionsResponse,
  GetQuestionResponse,
  UpdateQuestionResponse,
  AdminQuestionsResponse,
  AnswerQuestionResponse,
  AdminDeleteQuestionResponse,
} from "@/types/api/question.types";

// ---------- Public / Customer ----------

// ==========================================
// GET /api/products/[slug]/questions
// Not paginated — returns everything, answered-first. Fine
// to cache briefly since Q&A doesn't change that fast.
// ==========================================
export function getProductQuestions(slug: string) {
  return apiFetch<ProductQuestionsResponse>(`/api/products/${slug}/questions`, {
    next: { revalidate: 300 },
  });
}

// ==========================================
// POST /api/products/[slug]/questions
// Rate-limited server-side (writeRateLimit, per user email).
// ==========================================
export function askQuestion(slug: string, question: string) {
  return apiFetch<AskQuestionResponse>(`/api/products/${slug}/questions`, {
    method: "POST",
    body: JSON.stringify({ question }),
    cache: "no-store",
  });
}

// ==========================================
// GET /api/questions
// Current user's own questions, unpaginated.
// ==========================================
export function getMyQuestions() {
  return apiFetch<GetOwnQuestionsResponse>("/api/questions", {
    cache: "no-store",
  });
}

// ==========================================
// GET /api/questions/[id]
// Single question detail, ownership-checked.
// ==========================================
export function getQuestion(id: string) {
  return apiFetch<GetQuestionResponse>(`/api/questions/${id}`, {
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/questions/[id]
// Edits own question text — blocked if already answered
// (route returns 400 in that case, surfaces as ApiError).
// ==========================================
export function updateQuestion(id: string, question: string) {
  return apiFetch<UpdateQuestionResponse>(`/api/questions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ question }),
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/questions/[id]
// Only unanswered questions can be deleted (400 otherwise).
// ==========================================
export function deleteQuestion(id: string) {
  return apiFetch<DeleteQuestionResponse>(`/api/questions/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

// ---------- Admin ----------

// ==========================================
// GET /api/admin/questions
// Filterable by ?status=answered|unanswered|all, paginated.
// ==========================================
export function getAdminQuestions(params?: {
  status?: "answered" | "unanswered" | "all";
  page?: number;
  limit?: number;
}) {
  return apiFetch<AdminQuestionsResponse>("/api/admin/questions", {
    params,
    cache: "no-store",
  });
}

// ==========================================
// PATCH /api/admin/questions/[id]
// Answers a question — sets answer + answeredAt, triggers a
// customer notification.
// ==========================================
export function answerQuestion(id: string, answer: string) {
  return apiFetch<AnswerQuestionResponse>(`/api/admin/questions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ answer }),
    cache: "no-store",
  });
}

// ==========================================
// DELETE /api/admin/questions/[id]
// Admin can delete any question, answered or not (unlike the
// customer's own DELETE, which only allows unanswered ones).
// ==========================================
export function deleteQuestionAsAdmin(id: string) {
  return apiFetch<AdminDeleteQuestionResponse>(`/api/admin/questions/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
}