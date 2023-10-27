import {IUserType} from "./UserType";
import {
    FieldValue
} from "firebase/firestore";

export interface ILobbyType {
    uid: string,
    lobbyName: string,
    playerCount: number;
    isLobbyPrivate: boolean,
    isAutoStart: boolean,
    players: IUserType[];
    createdAt: FieldValue;
}
