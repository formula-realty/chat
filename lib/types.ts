export type ChatRole = "bot" | "user" | "system";

export type FunnelStepId =
  | "need"
  | "purchase"
  | "budget"
  | "contact"
  | "phone";

export type ChatStepId = FunnelStepId | "done";

export type AnswerField =
  | "need"
  | "purchaseMethod"
  | "budget"
  | "contactMethod"
  | "name"
  | "phone";

export type InputType = "text" | "phone";

export type LeadAnswers = Record<AnswerField, string>;

export type CollectedAnswers = Partial<LeadAnswers>;

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
  quickReplies?: string[];
  inputType?: InputType;
  step?: ChatStepId;
};

export type ChatStepConfig = {
  id: FunnelStepId;
  field: AnswerField;
  question: string;
  quickReplies?: string[];
  inputType: InputType;
};

export type SessionMetadata = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  yclid?: string;
  referrer: string;
  path: string;
  timestamp: string;
  userAgent: string;
};

export type LeadPayload = {
  answers: LeadAnswers;
  metadata: SessionMetadata;
};
