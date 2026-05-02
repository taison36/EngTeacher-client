import axios from 'axios';
import type {
    User,
    Session,
    Exercise,
    ChatMessage,
    ChatMessageRequest,
    ChatMessageResponse,
    Phrase
} from '@/types';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const userApi = {
    createUser: (name: string) =>
        api.post<User>('/user/create', name, {
            headers: { 'Content-Type': 'text/plain' }
        }),

    addPhrases: (userId: string, phrases: Phrase[]) =>
        api.post<User>(`/user/${userId}/phrases`, phrases)
};

export const sessionApi = {
    createSession: (userId: string) =>
        api.post<Session>(`/user/${userId}/session/`),

    getSession: (userId: string, sessionId: string) =>
        api.get<Session>(`/user/${userId}/session/${sessionId}`),

    getMessages: (userId: string, sessionId: string) =>
        api.get<ChatMessage[]>(`/user/${userId}/session/${sessionId}`),

    createExercises: (userId: string, sessionId: string) =>
        api.post<Exercise[]>(`/user/${userId}/session/${sessionId}/exercise`)
};

export const chatApi = {
    sendMessage: (request: ChatMessageRequest) =>
        api.post<ChatMessageResponse>('/chat/message', request)
};