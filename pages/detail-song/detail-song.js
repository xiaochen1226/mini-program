// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStroe";
import rankingStore from "../../store/rankingStore";
import { getPlayListDetail } from "../../services/music";
import playerStore from "../../store/playerStore";

Page({
    data: {
        type:"ranking",
        key: 'newRanking',
        songInfo: {},
        id: 0
    },
    onLoad(options) {
        const type = options.type
        this.setData({type})

        if(type === "ranking"){
            const key = options.key
            this.data.key = key
            rankingStore.onState(key,this.handleRanking)
        } else if(type === "recommend") {
            recommendStore.onState("recommendSonginfo",this.handleRanking)
        }else if(type === 'menu'){
            const id = options.id
            this.data.id = id
            this.fetchMenuSongInfo()
        }
    },
    async fetchMenuSongInfo() {
        const res = await getPlayListDetail(this.data.id)
        this.setData({ songInfo: res.playlist })
    },
    onSongItemTap(event) {
        playerStore.setState("playerSongList",this.data.songInfo.tracks)
        playerStore.setState("playerSongIndex",event.currentTarget.dataset.index)
    },
    handleRanking(value) {
        if(this.data.type === "recommend") {
            value.name = "推荐歌曲"
        }
        this.setData({ songInfo: value })
        wx.setNavigationBarTitle({
          title: value.name,
        })
    },
    onUnload() {
        if(this.data.type === "ranking"){
            rankingStore.offState(this.data.key,this.handleRanking)
        } else if(this.data.type === "recommend") {
            recommendStore.offState("recommendSonginfo",this.handleRanking)
        }
    }
})