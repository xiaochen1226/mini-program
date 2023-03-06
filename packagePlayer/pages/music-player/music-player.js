// pages/music-player/music-player.js
import { throttle } from "underscore";
import playerStore,{audioContext} from "../../../store/playerStore";

const app = getApp()
const modeNames = ["order","repeat","random"]

Page({
    data: {
        id: 0,
        stateKeys: ["id","currentSong","currentTime","durationTime","lyricInfos","currentLyricText","currentLyricIndex","isPlaying","playModeIndex"],
        currentSong: {},
        currentTime: 0,
        durationTime: 0,
        lyricInfos: [],
        currentLyricText: '',
        currentLyricIndex: -1,

        isPlaying: true,

        playerSongIndex: 0,
        playerSongList: [],
        isFirstPlay: true,

        palyModeName: 'order',

        pageTitles: ["歌曲","歌词"],
        currentPage: 0,
        contentHeight:0,
        sliderValue: 0,
        isSliderChanging: false,
        isWating: false,   
        lyricScrollTop: 0,
    },
    onLoad(options){
        this.setData({contentHeight: app.globalData.contentHeight})

        const id = options.id

        if(id){
            playerStore.dispatch("playMusicWithSongIdAction", id)
        }
        
        playerStore.onStates(["playerSongList","playerSongIndex"],this.getPlaySongInfosHandle)
        playerStore.onStates(this.data.stateKeys,this.getPlayInfoshandler)
    },
    updateProgress: throttle(function (currentTime){
        if(this.data.isSliderChanging) return
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({currentTime, sliderValue})
    },800,{leading: false, trailing: false}),

    onNavBackTap() {
        wx.navigateBack()
    },
    onSwiperChange(event) {
        this.setData({currentPage: event.detail.current})
    },
    onNavTabItemTap(event) {
        const index = event.currentTarget.dataset.index
        this.setData({currentPage: index})
    },
    onSliderChange(event) {
        this.data.isWating = true
        setTimeout(() => {
            this.data.isWating = false
        }, 1500);
        const value = event.detail.value
        const currentTime = value / 100 * this.data.durationTime
        audioContext.seek(currentTime / 1000)
        this.setData({currentTime, isSliderChanging: false, sliderValue: value})
    },
    onSliderChanging: throttle(function (event) {
        const value = event.detail.value
        const currentTime = value / 100 * this.data.durationTime
        this.setData({currentTime})
        
        this.data.isSliderChanging = true
    }, 100),
    onPlayOrPauseTap() {
        playerStore.dispatch("playMusicStatusAction")
    },
    onPrevBtnTap(){
        playerStore.dispatch("playNewMusicAction",false)
    },
    onNextBtnTap(){
        playerStore.dispatch("playNewMusicAction")
    },
    onModeBtnTap() {
        playerStore.dispatch("changePlayModeAction")
    },
    getPlaySongInfosHandle({playerSongList, playerSongIndex}) {
        if(playerSongList){
            this.setData({playerSongList})
        }
        if(playerSongIndex !== undefined){
            this.setData({playerSongIndex})
        }
    },
    getPlayInfoshandler({
        id,currentSong,currentTime,durationTime,lyricInfos,currentLyricText,currentLyricIndex,isPlaying,playModeIndex
    }){
        if(id !== undefined) {
            this.setData({id})
        }
        if(currentSong){
            this.setData({currentSong})
        }
        if(durationTime !== undefined) {
            this.setData({durationTime})
        }
        if(currentTime !== undefined) {
            this.updateProgress(currentTime)
        }
        if(lyricInfos) {
            this.setData({lyricInfos})
        }
        if(currentLyricText) {
            this.setData({currentLyricText})
        }
        if(currentLyricIndex !== undefined) {
            this.setData({currentLyricIndex, lyricScrollTop: currentLyricIndex * 35})
        }
        if(isPlaying !== undefined){
            this.setData({isPlaying})
        }
        if(playModeIndex!==undefined){
            this.setData({palyModeName:modeNames[playModeIndex]})
        }
    },
    onUnload(){
        playerStore.offStates(["playerSongList","playerSongIndex"],this.getPlaySongInfosHandle)
        playerStore.offStates(this.data.stateKeys,this.getPlayInfoshandler)
    }
})