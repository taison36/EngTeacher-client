import axios from 'axios';
import type {
    User,
    UserSettings,
    Phrase,
    Session,
    Exercise,
    ChatMessage,
    ChatMessageRequest,
    ChatMessageResponse
} from '@/types';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface AuthRequest {
    name: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: { id: string; name: string };
}

export const authApi = {
    register: (req: AuthRequest) =>
        api.post<AuthResponse>('/auth/register', req),

    login: (req: AuthRequest) =>
        api.post<AuthResponse>('/auth/login', req),
};

export const userApi = {
    getUser: () =>
        api.get<User>('/user'),

    getPhrases: () =>
        api.get<Phrase[]>('/user/phrases'),

    addPhrases: (phrases: { content: string }[]) =>
        api.post<User>('/user/phrases', phrases),

    updateSettings: (settings: UserSettings) =>
        api.put<UserSettings>('/user/settings', settings),
};

export const sessionApi = {
    createSession: () =>
        api.post<Session>('/session'),

    getSession: (sessionId: string) =>
        api.get<Session>(`/session/${sessionId}`),

    getMessages: (sessionId: string) =>
        api.get<ChatMessage[]>(`/session/${sessionId}/messages`),

    createExercises: (sessionId: string) =>
        api.post<Exercise[]>(`/session/${sessionId}/exercise`),
};

export const chatApi = {
    sendMessage: (request: ChatMessageRequest) =>
        api.post<ChatMessageResponse>('/chat/message', request),
};
