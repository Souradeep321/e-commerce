// ==========================================
// QuestionUserSummary
// Same minimal pattern as ReviewUserSummary.
// ==========================================
export interface QuestionUserSummary {
  id: string;
  name: string | null;
}

// ==========================================
// Question
// answer/answeredAt are null until an admin responds —
// always check `answer !== null` before treating a
// question as answered, don't just check truthiness of
// the whole object.
// ==========================================
export interface Question {
  id: string;
  userId: string;
  productId: string;
  question: string;
  answer: string | null;
  createdAt: string;
  answeredAt: string | null;
  user: QuestionUserSummary;
}

// ==========================================
// GET /api/products/[slug]/questions
// Not paginated (unlike reviews) — returns everything at
// once, sorted answered-first then newest. Includes simple
// counts, not full stats like reviews' ratingCounts.
// ==========================================
export interface ProductQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    questions: Question[];
    totalQuestions: number;
    answeredCount: number;
    unansweredCount: number;
  };
}

// ==========================================
// POST /api/products/[slug]/questions
// Asking a question returns it with BOTH user and product
// summary attached (product summary not present on the
// GET list above, since that's already scoped to one product).
// ==========================================
export interface QuestionProductSummary {
  id: string;
  name: string;
  slug: string;
}

export interface AskQuestionResponse {
  success: boolean;
  message: string;
  question: Question & { product: QuestionProductSummary };
}
// ==========================================
// (admin routes presumably handle answering — answer/answeredAt
// get set here, but exact response shape unconfirmed)
// ==========================================

// ==========================================
// DELETE /api/questions/[id]
// Only unanswered questions can be deleted by their owner —
// route returns a 400 if answer already exists.
// ==========================================
export interface DeleteQuestionResponse {
  success: boolean;
  message: string;
}

// ==========================================
// GET /api/questions (user's own questions, unpaginated)
// Same summary-counts pattern as the product-scoped GET,
// but with a product summary attached per question instead
// of a user summary (redundant here — it's always you).
// ==========================================
export interface OwnQuestionProductSummary {
  id: string;
  name: string;
  slug: string;
  images: { url: string }[];
}

export interface OwnQuestion {
  id: string;
  userId: string;
  productId: string;
  question: string;
  answer: string | null;
  createdAt: string;
  answeredAt: string | null;
  product: OwnQuestionProductSummary;
}

export interface GetOwnQuestionsResponse {
  success: boolean;
  message: string;
  data: {
    questions: OwnQuestion[];
    totalQuestions: number;
    answeredCount: number;
    unansweredCount: number;
  };
}

// ==========================================
// GET /api/admin/questions
// Admin sees fuller user info (email included) and can
// filter by ?status=answered|unanswered|all. Paginated,
// unlike the customer-facing GET /api/questions.
// ==========================================
export interface AdminQuestionUserSummary {
  id: string;
  name: string | null;
  email: string;
}

export interface AdminQuestionProductSummary {
  id: string;
  name: string;
  slug: string;
  images: { url: string }[];
}

export interface AdminQuestion {
  id: string;
  userId: string;
  productId: string;
  question: string;
  answer: string | null;
  createdAt: string;
  answeredAt: string | null;
  user: AdminQuestionUserSummary;
  product: AdminQuestionProductSummary;
}

export interface AdminQuestionsResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  questions: AdminQuestion[];
}

// ==========================================
// PATCH /api/admin/questions/[id]
// Answering a question. Response's user summary includes
// email (unlike the list route's — wait, actually the list
// route ALSO includes email; both are consistent here) and
// product summary adds slug on top of what the list route has.
// ==========================================
export interface AnswerQuestionResponse {
  success: boolean;
  message: string;
  question: AdminQuestion;
}

// ==========================================
// DELETE /api/admin/questions/[id]
// ==========================================
export interface AdminDeleteQuestionResponse {
  success: boolean;
  message: string;
}

// ==========================================
// MISSING ROUTES — not implemented, not just untyped:
// There is no GET /api/questions/[id] (view single question)
// or PATCH /api/questions/[id] (edit own question). Only
// DELETE exists for a user's own question. Worth deciding
// whether these are actually needed for your app, or if
// "ask once, can only delete if unanswered" is the intended
// design — not a types problem, a product decision.
// ==========================================

// ==========================================
// GET /api/questions/[id]
// Single question detail, ownership-checked. Includes
// user + product summary (user summary is somewhat redundant
// here since it's always the current user, but included anyway).
// ==========================================
export interface QuestionDetail {
  id: string;
  userId: string;
  productId: string;
  question: string;
  answer: string | null;
  createdAt: string;
  answeredAt: string | null;
  user: QuestionUserSummary;
  product: QuestionProductSummary;
}

export interface GetQuestionResponse {
  success: boolean;
  message: string;
  question: QuestionDetail;
}

// ==========================================
// PATCH /api/questions/[id]
// Edits own question text (only the `question` field is
// updatable — partial schema, but only `question` is ever
// applied even if other fields were sent). Returns no body,
// just a success message — re-fetch via GET if you need the
// updated question object.
// ==========================================
export interface UpdateQuestionResponse {
  success: boolean;
  message: string;
}