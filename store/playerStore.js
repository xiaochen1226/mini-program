import { HYEventStore } from "hy-event-store";

const playerStore = new HYEventStore({
    state: {
        playerSongList: [],
        playerSongIndex: 0
    }
})

export default playerStore