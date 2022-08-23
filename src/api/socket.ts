import { v4 as uuid } from "uuid";
import {
    SocketMessage,
    PublishResponseMessage,
    SubscribeResponseMessage,
    RequestMessage,
    requestResponseMap,
} from "/constants";

import type {
    SocketMessageHandlers, PublishResponseMessagesHandlers, SubscribeResponseMessageHandlers,
} from "./typedef";

export class SocketController {
    private socket: WebSocket;
    private publishResponseMessagesHandlers: PublishResponseMessagesHandlers = {};

    constructor(messageHandlers: {
        socketMessagesHandlers: SocketMessageHandlers,
        subscribeResponseMessagesHandlers: SubscribeResponseMessageHandlers
    }) {
        const { socketMessagesHandlers, subscribeResponseMessagesHandlers } = messageHandlers;

        this.socket = new WebSocket("wss://battleship-reborn.herokuapp.com/ws");

        this.socket.addEventListener("open", () => {
            console.log("Successfully connect!");
            socketMessagesHandlers[SocketMessage.SOCKET_CONNECTED]();
        });

        this.socket.addEventListener("error", () => {
            console.log("Error!");
            socketMessagesHandlers[SocketMessage.SOCKET_ERRORED]();
        });

        this.socket.addEventListener("message", (event: MessageEvent) => {
            const { id, type, payload } = JSON.parse(event.data);

            if (Object.values(SubscribeResponseMessage).includes(type)) {
                subscribeResponseMessagesHandlers[type as SubscribeResponseMessage](payload);
            } else if (Object.values(PublishResponseMessage).includes(type)) {
                const handler = this.publishResponseMessagesHandlers[id];

                if (handler) {
                    if (type === PublishResponseMessage.GAME_ERROR) {
                        handler.reject(new Error("You break something!"));
                    } else {
                        handler.resolve(payload);
                    }
                }
            }
        });
    }

    send = async (type: RequestMessage, payload?: object) => {
        return await new Promise((resolve, reject) => {
            const id = uuid();
            this.publishResponseMessagesHandlers[id] = { resolve, reject, type: requestResponseMap[type] };

            this.socket.send(JSON.stringify({ id, type, ...(payload ? { payload } : null) }));
        });
    };
}
