import { HYEventStore } from "hy-event-store";
import { getPlayListDetail } from "../services/music";

export const rankingsIds = {
    newRanking:3779629,
    originRanking: 2884035,
    upRanking: 19723756
}
const rankingStore = new HYEventStore({
    state: {
        newRanking: {},
        originRanking: {},
        upRanking: {}
    },
    actions: {
        fetchRankingDataAction(ctx) {
            // const allPromise
            for(const key in rankingsIds) {
                const id = rankingsIds[key]
                getPlayListDetail(id).then(res => {
                    ctx[key] = res.playlist
                })
            }
        }
    }
})

export default rankingStore