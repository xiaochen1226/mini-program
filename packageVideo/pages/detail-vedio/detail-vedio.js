// pages/detail-vedio/detail-vedio.js
import { getMVUrl, getMVInfo, getMVRelated } from "../../../services/video";

Page({
    data: {
        id: 0,
        mvUrl: '',
        mvInfo: {},
        relatedVideo: [],
        danmuList: [
            {text: "好听",color: '#ff0000',time:3},
            {text: "仙乐",color: '#ffff00',time:10}
        ]
    },
    onLoad(options) {
        const id = options.id
        this.setData({ id })

        this.fetchMVUrl()
        this.fetchMVInfo()
        this.fetchMVrelated()
    },
    async fetchMVUrl() {
        const res = await getMVUrl(this.data.id)
        this.setData({ mvUrl: res.data.url })
    },
    async fetchMVInfo() {
        const res = await getMVInfo(this.data.id)
        this.setData({ mvInfo: res.data })
    },
    async fetchMVrelated() {
        const res = await getMVRelated(this.data.id)
        this.setData({ relatedVideo: res.data })
    },
})