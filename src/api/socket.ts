import { v4 as uuid } from "uuid";
import {
    SocketMessage,
    PublishResponseMessage,
    SubscribeResponseMessage,
    RequestMessage,
    requestResponseMap,
} from "/constants";

type SocketAndSubscribeResponseEventHandlers =
    Record<SocketMessage | SubscribeResponseMessage, (payload?: unknown) => void>;

type PublishResponseEventHandlers = Record<PublishResponseMessage, {
    [id: string]: {
        resolve: (response: any) => void,
        reject?: (error: unknown) => void,
    }
}>;

const isPublishResponseType = (
    type: PublishResponseMessage | SubscribeResponseMessage,
): type is PublishResponseMessage => (
    Object.values(PublishResponseMessage).includes(type as PublishResponseMessage)
);

const isSubscribeResponseType = (
    type: PublishResponseMessage | SubscribeResponseMessage,
): type is SubscribeResponseMessage => (
    Object.values(SubscribeResponseMessage).includes(type as SubscribeResponseMessage)
);

export class SocketController {
    private socket: WebSocket;
    private publishResponseEventsHandlers: PublishResponseEventHandlers = {
        [PublishResponseMessage.GAME_CREATED]: {},
        [PublishResponseMessage.GAME_JOINED]: {},
        [PublishResponseMessage.GAME_READY]: {},
        [PublishResponseMessage.GAME_SHIPS_LOADED]: {},
        [PublishResponseMessage.GAME_STARTED]: {},
        [PublishResponseMessage.GAME_SHOOT_RESULT]: {},
    } as const;

    private setResponseHandlers = (
        type: RequestMessage,
        callbacks: { resolve: (response: any) => void, reject: (error: unknown) => void },
    ) => {
        const id = uuid();
        this.publishResponseEventsHandlers[requestResponseMap[type]][id] = callbacks;

        return id;
    };

    private getResponseHandlers = (type: PublishResponseMessage, id?: string) => {
        // const { id, ...payload } = rest;
        // const callbacks = this.publishResponseEventsHandlers[type][id];

        const [entryId, callbacks] = Object.entries(this.publishResponseEventsHandlers[type])[0];
        delete this.publishResponseEventsHandlers[type][entryId];

        return callbacks;
    };

    constructor(nonPublishResponseMessagesHandlers: SocketAndSubscribeResponseEventHandlers) {
        this.socket = new WebSocket("wss://battleship-reborn.herokuapp.com/ws");

        this.socket.addEventListener("open", () => {
            console.log("Successfully connect!");
            nonPublishResponseMessagesHandlers[SocketMessage.SOCKET_CONNECTED]();
        });

        this.socket.addEventListener("error", () => {
            console.log("Error!");
            nonPublishResponseMessagesHandlers[SocketMessage.SOCKET_ERRORED]();
        });

        this.socket.addEventListener("message", (event: MessageEvent) => {
            const { type, ...payload } = JSON.parse(event.data);

            if (isPublishResponseType(type)) {
                this.getResponseHandlers(type).resolve({ payload });
            } else if (isSubscribeResponseType(type)) {
                nonPublishResponseMessagesHandlers[type](payload);
            }
        });
    }

    send = (
        body: { type: RequestMessage, payload?: object },
        resolve: (response: unknown) => void,
        reject: (error: unknown) => void,
    ) => {
        const id = this.setResponseHandlers(body.type, { resolve, reject });

        this.socket.send(JSON.stringify({
            id,
            type: body.type,
            ...("payload" in body ? body.payload : null),
        }));
    };
}
