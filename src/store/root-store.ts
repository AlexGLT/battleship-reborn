import { Online } from "./stores/online";
import { ShipsController } from "./stores/ships";
import { DragAndDropController } from "./stores/drag-and-drop";
import { ProponentField } from "./stores/proponent-field";
import { OpponentField } from "./stores/opponent-field";

export class RootStore {
    public shipsController = new ShipsController(this);
    public dndController = new DragAndDropController(this);
    public onlineController = new Online(this);
    public proponentField = new ProponentField(this);
    public opponentField = new OpponentField(this);
}
