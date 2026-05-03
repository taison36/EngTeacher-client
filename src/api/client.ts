import axios from 'axios';
import type {
    User,
    UserSettings,
    Session,
    Exercise,
    ChatMessage,
    ChatMessageRequest,
    ChatMessageResponse
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

    getUser: (userId: string) =>
        api.get<User>(`/user/${userId}`),

    getUserByName: (name: string) =>
        api.get<User>(`/user/by-name/${name}`),

    addPhrases: (userId: string, phrases: { content: string }[]) =>
        api.post<User>(`/user/${userId}/phrases`, phrases),

    updateSettings: (userId: string, settings: UserSettings) =>
        api.put<UserSettings>(`/user/${userId}/settings`, settings)
};

export const sessionApi = {
    createSession: (userId: string) =>
        api.post<Session>(`/user/${userId}/session/`),

    getSession: (userId: string, sessionId: string) =>
        api.get<Session>(`/user/${userId}/session/${sessionId}`),

    getMessages: (userId: string, sessionId: string) =>
        api.get<ChatMessage[]>(`/user/${userId}/session/${sessionId}/messages`),

    createExercises: (userId: string, sessionId: string) =>
        api.post<Exercise[]>(`/user/${userId}/session/${sessionId}/exercise`)
};

export const chatApi = {
    sendMessage: (request: ChatMessageRequest) =>
        api.post<ChatMessageResponse>('/chat/message', request)
};