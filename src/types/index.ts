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

export type ExerciseState = 'NOT_ATTEMPTED' | 'COMPLETED' | 'FAILED';

export interface Exercise {
    id: string;
    question: string;
    phrase: Phrase;
    state: ExerciseState;
}

export interface Session {
    id: string;
    exercises: Exercise[];
    createdAt: string;
}

export interface ChatMessage {
    content: string;
    type: 'USER' | 'ASSISTANT';
}

export interface ChatMessageRequest {
    sessionId: string;
    message: string;
}

export interface ChatMessageResponse {
    agentResponse: string;
    exercises: Exercise[];
}