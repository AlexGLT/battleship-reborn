export enum RequestMessage {
    GAME_CREATE = "game/create",
    GAME_JOIN = "game/join",
    GAME_READY = "game/ready",
    GAME_LOAD_SHIPS = "game/load-ships",
    GAME_START = "game/start",
    GAME_SHOOT = "game/shoot",
}

export enum SocketMessage {
    SOCKET_CONNECTED = "socket/connected",
    SOCKET_ERRORED = "socket/errored",
    // SOCKET_DISCONNECTED = "socket/disconnected",
}

export enum PublishResponseMessage {
    GAME_CREATED = "game/created",
    GAME_JOINED = "game/joined",
    GAME_READY = "game/ready-ok",
    GAME_SHIPS_LOADED = "game/ships-loaded",
    GAME_STARTED = "game/start-ok",
    GAME_SHOOT_RESULT = "game/shoot-result",
    GAME_ERROR = "game/error",
}

export enum SubscribeResponseMessage {
    GAME_OPPONENT_JOINED = "game/opponent-joined",
    GAME_OPPONENT_READY = "game/opponent-ready",
    GAME_STARTED = "game/started",
    GAME_SHOOT = "game/shoot",
    GAME_OPPONENT_LEFT = "game/opponent-left",
}

export const requestResponseMap: Record<RequestMessage, PublishResponseMessage> = {
    [RequestMessage.GAME_CREATE]: PublishResponseMessage.GAME_CREATED,
    [RequestMessage.GAME_JOIN]: PublishResponseMessage.GAME_JOINED,
    [RequestMessage.GAME_LOAD_SHIPS]: PublishResponseMessage.GAME_SHIPS_LOADED,
    [RequestMessage.GAME_READY]: PublishResponseMessage.GAME_READY,
    [RequestMessage.GAME_START]: PublishResponseMessage.GAME_STARTED,
    [RequestMessage.GAME_SHOOT]: PublishResponseMessage.GAME_SHOOT_RESULT,
} as const;
