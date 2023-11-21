import {makeAutoObservable} from "mobx";
import {getAuth} from "firebase/auth";
import {v4 as uuidv4} from "uuid";
import {IAnswerType} from "../../Types/AnswerType";
import {collection, deleteDoc, doc, getDocs, query, setDoc, Timestamp, where} from "firebase/firestore";
import {IGifType} from "../../Types/GifType";
import {ISituationType} from "../../Types/SituationType";
import authStore from "../AuthStore";
import gameStore from "./GameStore";

class AnswerStore {
    currentGifs: IGifType[] = [];
    canChooseGif: boolean = false;
    userSelectedGif: IGifType | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    setUserSelectedGif(gif: IGifType | null) {
        this.userSelectedGif = gif
    }

    setCanChooseGif(canChooseGif: boolean) {
        this.canChooseGif = canChooseGif;
    }

    setCurrentGifs(gifs: IGifType[]) {
        this.currentGifs = gifs
    }

    async sendAnswer(currentRoundSituation: ISituationType | null) {
        if (authStore.dataBase && currentRoundSituation && gameStore.currentUserLobby) {
            const auth = getAuth()
            const answerId = uuidv4()
            const answer: IAnswerType = {
                answerId: answerId,
                lobbyId: gameStore.currentUserLobby.uid,
                situationId: currentRoundSituation.situationId,
                answeredUserId: auth.currentUser?.uid,
                answerGif: this.userSelectedGif,
                answerPoints: 0,
                createdAt: Timestamp.now(),
            }

            await setDoc(doc(authStore.dataBase, "answers", answer.answerId), {...answer})
                .then(() => gameStore.setCurrentUserStage("WaitingAfterAnswer"))
        }
    }

    async deleteAllAnswers() {
        if (authStore.dataBase && gameStore.currentUserLobby) {
            const q = query(collection(authStore.dataBase, "answers"),
                where("lobbyId", "==", gameStore.currentUserLobby.uid))

            await getDocs(q)
                .then((snap) =>
                    snap.docs.forEach(document => {
                        if (authStore.dataBase)
                            deleteDoc(doc(authStore.dataBase, "answers", document.data().answerId))
                    })
                )
        }
    }
}

export default new AnswerStore()
