export interface UserSettings {
    maxNumberExercises: number;
    minUnderstandingRate: number;
    maxUnderstandingRate: number;
}

export interface User {
    id: string;
    name: string;
    phrases: Phrase[];
    sessions: Session[];
    settings: UserSettings;
}

export interface Phrase {
    id: string;
    content: string;
    understandingRate: number;
    completedExercises: number;
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