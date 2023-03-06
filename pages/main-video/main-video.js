// pages/main-video/main-video.js
import { getTopMV } from '../../services/video'
import playerStore from '../../store/playerStore'

Page({
    data: {
        videoList: [],
        hasMore: true
    },
    onLoad() {
        // 发送网络请求
        this.fetchTopMV()
    },

    // 发送网络请求的方法
    async fetchTopMV() {
        const res = await getTopMV(this.data.videoList.length)
        const newVideoList = [...this.data.videoList,...res.data]
        this.setData({ videoList: newVideoList })
        this.data.hasMore = res.hasMore
    },

    onReachBottom() {
        if(!this.data.hasMore) return
        this.fetchTopMV()
    },
    async onPullDownRefresh() {
        this.setData({ videoList: [] })
        this.data.hasMore = true
        await this.fetchTopMV()
        wx.stopPullDownRefresh()
    },

    onVideoItemTap(event) {
        const item = event.currentTarget.dataset.item
        playerStore.dispatch("playMusicStatusAction")
        wx.navigateTo({
          url: `/packageVideo/pages/detail-vedio/detail-vedio?id=${item.id}`,
        })
    }
})