export interface SupportTicket {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  sender: "user" | "support";
  message: string;
  createdAt: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}