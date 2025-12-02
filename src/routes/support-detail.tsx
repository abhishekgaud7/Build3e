import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { SupportTicket, SupportMessage } from "@/types/support";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Send, User, MessageSquare } from "lucide-react";

export function SupportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock ticket data
    const mockTicket: SupportTicket = {
      id: id!,
      userId: user?.id || "1",
      title: "Order Delivery Issue",
      description: "My cement order was delayed and I need assistance tracking the delivery.",
      category: "delivery",
      status: "open",
      priority: "medium",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };

    const mockMessages: SupportMessage[] = [
      {
        id: "1",
        ticketId: id!,
        sender: "user",
        message: "My cement order was supposed to arrive yesterday but I haven't received it yet. The tracking shows it's still in transit.",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        ticketId: id!,
        sender: "support",
        message: "Thank you for contacting BUILD-SETU support. I can see your order is delayed due to weather conditions. Let me check with our logistics team and get back to you shortly.",
        createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setTimeout(() => {
      setTicket(mockTicket);
      setMessages(mockMessages);
      setIsLoading(false);
    }, 1000);
  }, [id, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticket) return;

    const message: SupportMessage = {
      id: Date.now().toString(),
      ticketId: ticket.id,
      sender: "user",
      message: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: { variant: "default", className: "bg-blue-100 text-blue-800" },
      in_progress: { variant: "secondary", className: "bg-yellow-100 text-yellow-800" },
      resolved: { variant: "default", className: "bg-green-100 text-green-800" },
      closed: { variant: "outline", className: "bg-gray-100 text-gray-800" },
    } as any;

    return variants[status] || variants.open;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: { variant: "default", className: "bg-gray-100 text-gray-800" },
      medium: { variant: "default", className: "bg-orange-100 text-orange-800" },
      high: { variant: "default", className: "bg-red-100 text-red-800" },
    } as any;

    return variants[priority] || variants.medium;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/support")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{ticket.title}</h3>
                <p className="text-gray-600 text-sm">{ticket.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={getStatusBadge(ticket.status).className}>
                    {ticket.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Priority:</span>
                  <Badge className={getPriorityBadge(ticket.priority).className}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="text-sm capitalize">{ticket.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === "user" ? (
                          <User className="w-3 h-3 mr-1" />
                        ) : (
                          <div className="w-3 h-3 mr-1 bg-orange-500 rounded-full" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.sender === "user" ? "You" : "Support"}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={3}
                  disabled={ticket.status === "closed"}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || ticket.status === "closed"}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
