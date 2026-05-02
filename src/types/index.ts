export interface User {
    id: string;
    name: string;
}

export interface Phrase {
    id: string;
    content: string;
}

export interface Exercise {
    id: string;
    question: string;
    phrase: Phrase;
    done: boolean;
}

export interface Session {
    id: string;
    exercises: Exercise[];
}

export interface ChatMessage {
    content: string;
    type: 'USER' | 'ASSISTANT';
}

export interface ChatMessageRequest {
    userId: string;
    sessionId: string;
    message: string;
}

export interface ChatMessageResponse {
    agentResponse: string;
    exercises: Exercise[];
}