import type { PublishResponseMessage, SocketMessage, SubscribeResponseMessage } from "/constants";

export type MessageHandler = (payload?: unknown) => void;

export type SocketMessageHandlers = Record<SocketMessage, MessageHandler>;
export type SubscribeResponseMessageHandlers = Record<SubscribeResponseMessage, MessageHandler>;
export type PublishResponseMessagesHandlers = {
    [id: string]: {
        type: PublishResponseMessage,
        resolve: MessageHandler,
        reject: MessageHandler,
    }
};
