// pages/main-music/main-music.js
import { getMusicBanner, getSongMenuList } from "../../services/music";
import { querySelect } from "../../utils/query-select";
// import { throttle } from "../../utils/throttle";
import { throttle } from "underscore";
import recommendStore from "../../store/recommendStroe";
import rankingStore,{ rankingsIds } from "../../store/rankingStore";
import playerStore from "../../store/playerStore";

const querySelectThrottle = throttle(querySelect, 100)
const app = getApp()

Page({
    data: {
        searchValue: '',
        banners: [],
        bannerHeight: 0,
        screenWidth: 375,

        recommendSongs: [],
        hotMenuList: [],
        recMenuList: [],

        isRankingData: false,
        rankingInfos: {}
    },
    onLoad() {
        this.fetchMusicBanner()
        // this.fetchRecommendSongs()
        this.fetchSongMenuList()

        recommendStore.onState("recommendSonginfo", this.handleRecommendSongs)
        recommendStore.dispatch("fetchRecommendSongsAction")

        // rankingStore.onState("newRanking", this.handleNewRanking)
        // rankingStore.onState("originRanking",this.handleOriginRanking)
        // rankingStore.onState("upRanking",this.handleUpRanking)
        // for(const key in rankingsIds) {
        //     rankingStore.onState(key, this.getRankingHanlder(key))
        // }
        rankingStore.onState("newRanking", this.getRankingHanlder("newRanking"))
        rankingStore.onState("originRanking",this.getRankingHanlder("originRanking"))
        rankingStore.onState("upRanking",this.getRankingHanlder("upRanking"))
        rankingStore.dispatch("fetchRankingDataAction")

        this.setData({screenWidth: app.globalData.screenWidth})
    },
    onSearchClick() {
        wx.navigateTo({ url: '/pages/detail-search/detail-search' })
    },
    onBannerImageLoad(event) {
        // const query = wx.createSelectorQuery()
        // query.select(".banner-image").boundingClientRect()
        // query.exec((res) => {
        //     this.setData({ bannerHeight: res[0].height })
        // })
        querySelectThrottle('.banner-image').then(res => {
            this.setData({ bannerHeight: res[0].height })
        })
    },
    onRecommendMoreClick() {
        wx.navigateTo({
          url: '/pages/detail-song/detail-song?type=recommend',
        })
    },
    onSongItemTap(event) {
        playerStore.setState("playerSongList",this.data.recommendSongs)
        playerStore.setState("playerSongIndex",event.currentTarget.dataset.index)
    },
    async fetchMusicBanner() {
        const res = await getMusicBanner()
        this.setData({ banners: res.banners })
    },
    // async fetchRecommendSongs() {
    //     const res = await getPlayListDetail(3778678)
    //     const playlist = res.playlist
    //     const recommendSongs = playlist.tracks.slice(0,6)
    //     this.setData({ recommendSongs })
    // }
    async fetchSongMenuList() {
        getSongMenuList().then(res => {
            this.setData({ hotMenuList: res.playlists })
        })
        getSongMenuList("华语").then(res => {
            this.setData({ recMenuList: res.playlists })
        })
    },

    handleRecommendSongs(value) {
        if(!value.tracks) return
        this.setData({ recommendSongs: value.tracks.slice(0,6) })
    },
    // handleNewRanking(value) {
    //     const newRankingInfos = {...this.data.rankingInfos, newRanking: value}
    //     this.setData({
    //         rankingInfos: newRankingInfos
    //     })
    // },
    // handleOriginRanking(value) {
    //     const newRankingInfos = {...this.data.rankingInfos, originRanking: value }
    //     this.setData({
    //         rankingInfos: newRankingInfos
    //     })
    // },
    // handleUpRanking(value) {
    //     const newRankingInfos = {...this.data.rankingInfos, upRanking: value }
    //     this.setData({
    //         rankingInfos: newRankingInfos
    //     })
    // },
    getRankingHanlder(ranking) {
        return value => {
            if(!value.name) return
            this.setData({isRankingData: true})
            const newRankingInfos = {...this.data.rankingInfos, [ranking]: value }
            this.setData({
                rankingInfos: newRankingInfos
            })
        }
    },

    onUnload() {
        recommendStore.offState("recommendSonginfo", this.handleRecommendSongs)
        // rankingStore.offState("newRanking", this.handleNewRanking)
        // rankingStore.offState("originRanking", this.handleOriginRanking)
        // rankingStore.offState("upRanking", this.handleUpRanking)
        rankingStore.offState("newRanking", this.getRankingHanlder("newRanking"))
        rankingStore.offState("originRanking", this.getRankingHanlder("originRanking"))
        rankingStore.offState("upRanking", this.getRankingHanlder("upRanking"))
        // for(const key in rankingsIds) {
        //     rankingStore.offState(key, this.getRankingHanlder(key))
        // }
    }
})