import { HYEventStore } from "hy-event-store";
import { getPlayListDetail } from "../services/music";

const recommendStore = new HYEventStore({
    state: {
        recommendSonginfo: {}
    },
    actions: {
        fetchRecommendSongsAction(ctx) {
            getPlayListDetail(3778678).then(res => {
                ctx.recommendSonginfo = res.playlist
            })
        }
    }
})

export default recommendStore