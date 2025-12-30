import { ApiResponse, Message } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated auto-responses for demo
const AUTO_RESPONSES = [
  "Hi! Nice to meet you 😊",
  "That's interesting! Tell me more about yourself.",
  "I love that! We seem to have similar interests.",
  "What do you do for fun on weekends?",
  "That sounds wonderful! I'd love to know more.",
  "Haha, that's so true! 😄",
  "I completely agree with you.",
  "What are your thoughts on family values?",
  "That's a great perspective!",
  "I'm really enjoying our conversation.",
];

let messageIdCounter = 0;

const generateMessageId = (): string => {
  messageIdCounter += 1;
  return `msg_${Date.now()}_${messageIdCounter}`;
};

const getRandomResponse = (): string => {
  return AUTO_RESPONSES[Math.floor(Math.random() * AUTO_RESPONSES.length)];
};

export const chatApi = {
  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    await delay(500 + Math.random() * 500);
    
    // Return empty array for new conversations
    // In production, this would fetch from backend
    return {
      success: true,
      data: [],
    };
  },

  async sendMessage(
    conversationId: string,
    text: string,
    senderId: string
  ): Promise<ApiResponse<Message>> {
    await delay(300 + Math.random() * 200);

    const message: Message = {
      id: generateMessageId(),
      text,
      senderId,
      timestamp: new Date(),
      status: 'sent',
    };

    return {
      success: true,
      data: message,
    };
  },

  async getAutoResponse(conversationId: string, participantId: string): Promise<ApiResponse<Message>> {
    // Simulate typing delay (1-3 seconds)
    await delay(1000 + Math.random() * 2000);

    const message: Message = {
      id: generateMessageId(),
      text: getRandomResponse(),
      senderId: participantId,
      timestamp: new Date(),
      status: 'delivered',
    };

    return {
      success: true,
      data: message,
    };
  },

  async markAsRead(conversationId: string, messageIds: string[]): Promise<ApiResponse<void>> {
    await delay(100);
    return {
      success: true,
      data: undefined,
    };
  },
};
