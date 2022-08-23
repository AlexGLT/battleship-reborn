import { makeAutoObservable } from "mobx";

import { RootStore } from "../root-store";
import { SocketController } from "/api";
import { SocketMessage, SubscribeResponseMessage, RequestMessage } from "/constants";

class ProponentState {
    public isConnected: boolean = false;
    public isJoined: boolean | null = null;
    public isReady: boolean | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    public setIsJoined = (isJoined: boolean | null): void => {
        this.isJoined = isJoined;
    };

    public onConnect = (): void => {
        this.isConnected = true;
    };

    public onError = (): void => {
        this.isConnected = false;
    };
}

class OpponentState {
    public isJoined: boolean = false;
    public isReady: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    public onJoin = (): void => {
        this.isJoined = true;
    };

    public onLeave = (): void => {
        this.isJoined = false;
    };

    public onReady = (): void => {
        this.isReady = true;
    };
}

export class Online {
    private rootStore: RootStore;

    public socket: SocketController;

    public isHost: boolean = false;
    public gameId: string | null = null;
    public isShipsLoaded: boolean = false;
    public isGameStarted: boolean = false;

    public proponentState: ProponentState = new ProponentState();
    public opponentState: OpponentState = new OpponentState();

    public createGameLoading: boolean = false;

    * createGame(sideEffects: (gameId: string) => void) {
        this.createGameLoading = true;
        this.isHost = true;

        try {
            const { gameId } = yield this.socket.send(RequestMessage.GAME_CREATE);

            this.createGameLoading = false;

            this.gameId = gameId;
            this.proponentState.isJoined = true;

            sideEffects(gameId);
        } catch (e) {
            console.log(e);
        }
    }

    public joinGameLoading: boolean = false;

    * joinGame(gameId: string) {
        this.proponentState.isJoined = false;
        this.joinGameLoading = true;

        try {
            yield this.socket.send(RequestMessage.GAME_JOIN, { gameId });

            this.proponentState.setIsJoined(true);
            this.joinGameLoading = false;
        } catch (e) {
            console.log(e);
        }

        this.joinGameLoading = false;
    }

    public shipsAreLoading: boolean = false;

    * loadShips() {
        this.shipsAreLoading = true;

        const ships = Array.from(this.rootStore.shipsController.ships.keys())
            .map((shipId) => this.rootStore.proponentField.getShipCoords(shipId))
            .map((ship) => (
                ship.map(([x, y]) => ({ x, y }))
            ));

        try {
            yield this.socket.send(RequestMessage.GAME_LOAD_SHIPS, { ships });

            this.isShipsLoaded = true;
        } catch (e) {
            console.log(e);
        }

        this.shipsAreLoading = false;
    }

    * changeReadiness() {
        yield this.loadShips();

        try {
            yield this.socket.send(RequestMessage.GAME_READY);

            this.proponentState.isReady = true;
        } catch (e) {
            console.log(e);
        }
    }

    onGameStarted = () => {
        this.isGameStarted = true;
    };

    * startGame() {
        yield this.loadShips();

        try {
            yield this.socket.send(RequestMessage.GAME_START);

            this.onGameStarted();
        } catch (e) {
            console.log(e);
        }
    }

    * shoot(cellX: number, cellY: number) {
        try {
            const { result } = yield this.socket.send(
                RequestMessage.GAME_SHOOT,
                { target: { x: cellX, y: cellY } },
            );

            this.rootStore.opponentField.shot(cellX, cellY, result);
        } catch (e) {
            console.log(e);
        }
    }

    public onShoot = ({ target: { x, y } }: any) => {
        this.rootStore.proponentField.setShot(x, y);
    };

    constructor(store: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });

        this.rootStore = store;
        this.socket = new SocketController({
            socketMessagesHandlers: {
                [SocketMessage.SOCKET_CONNECTED]: this.proponentState.onConnect,
                [SocketMessage.SOCKET_ERRORED]: this.proponentState.onError,
            },
            subscribeResponseMessagesHandlers: {
                [SubscribeResponseMessage.GAME_OPPONENT_JOINED]: this.opponentState.onJoin,
                [SubscribeResponseMessage.GAME_OPPONENT_READY]: this.opponentState.onReady,
                [SubscribeResponseMessage.GAME_OPPONENT_LEFT]: this.opponentState.onLeave,
                [SubscribeResponseMessage.GAME_STARTED]: this.onGameStarted,
                [SubscribeResponseMessage.GAME_SHOOT]: this.onShoot,
            },
        });
    }
}
