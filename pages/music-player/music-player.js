// pages/music-player/music-player.js
import { getSongDetail,getSongLyric } from "../../services/player";
import { throttle } from "underscore";
import { parseLyric } from "../../utils/parse-lyric";
import playerStore from "../../store/playerStore";

const app = getApp()
const audioContext = wx.createInnerAudioContext()
const modeNames = ["order","repeat","random"]

Page({
    data: {
        pageTitles: ["歌曲","歌词"],
        currentPage: 0,
        contentHeight:0,
        id: 0,
        currentSong: {},
        lyricInfos: [],
        currentLyricText: '',
        currentLyricIndex: -1,

        currentTime: 0,
        durationTime: 0,
        sliderValue: 0,
        isSliderChanging: false,
        isWating: false,
        isPlaying: true,
        lyricScrollTop: 0,

        playerSongIndex: 0,
        playerSongList: [],
        isFirstPlay: true,
        playModeIndex: 0,
        palyModeName: 'order'
    },
    onLoad(options){
        this.setData({contentHeight: app.globalData.contentHeight})

        const id = options.id
        this.setupPlayerSong(id)

        playerStore.onStates(["playerSongList","playerSongIndex"],this.getPlaySongInfosHandle)
    },
    setupPlayerSong(id) {
        this.setData({ id }) 
        getSongDetail(id).then(res => {
            this.setData({
                currentSong: res.songs[0],
                durationTime: res.songs[0].dt

            })
        })

        getSongLyric(id).then(res => {
            const lrcString = res.lrc.lyric
            const lyricInfos = parseLyric(lrcString)
            this.setData({lyricInfos})
        })

        audioContext.stop()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.autoplay = true
        // audioContext.play()

        // 监听播放
        if(this.data.isFirstPlay){
            this.data.isFirstPlay = false
            const throttleUpdateProgress = throttle(this.updateProgress, 800,{ leading: false, trailing: false })
            audioContext.onTimeUpdate((event) => {
                if(!this.data.isSliderChanging && !this.data.isWating){
                    throttleUpdateProgress()
                }
                
                if(!this.data.lyricInfos.length) return
                let index = this.data.lyricInfos.length - 1
                for(let i = 0; i < this.data.lyricInfos.length;i++){
                    const info = this.data.lyricInfos[i]
                    if( info.time > audioContext.currentTime * 1000){
                        index = i -1
                        break;
                    }
                }
                if(index === this.data.currentLyricIndex) return

                const currentLyricText = this.data.lyricInfos[index].text
                this.setData({ currentLyricText, currentLyricIndex:index,lyricScrollTop: 35 * index })
            })

            audioContext.onWaiting(()=>{
                audioContext.pause()
            })
            audioContext.onCanplay(() => {
                audioContext.play()
            })
            audioContext.onEnded(() => {
                this.changeNewSong()
            })
        }
    },

    updateProgress(){
        const sliderValue = this.data.currentTime / this.data.durationTime * 100
        this.setData({currentTime: audioContext.currentTime * 1000, sliderValue})
    },
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
    }),
    onPlayOrPauseTap() {
        if(this.data.isPlaying){
            audioContext.pause()
            this.setData({ isPlaying: false })
        }else {
            audioContext.play()
            this.setData({ isPlaying: true })
        }
    },
    onPrevBtnTap(){
        this.changeNewSong(false)
    },
    onNextBtnTap(){
        this.changeNewSong()
    },
    changeNewSong(isNext = true){
        const length = this.data.playerSongList.length
        let index = this.data.playerSongIndex

        switch(this.data.playModeIndex){
            case 0:
                index = isNext ? index + 1 : index - 1
                if(index === length) index = 0
                if(index === -1) index = length - 1
                break;
            case 1:
                break;
            case 2:
                index = Math.floor(Math.random() * length)
                break;
        }

        const newSong = this.data.playerSongList[index]
        this.setData({currentSong: {}, sliderValue: 0,currentTime: 0,durationTime: 0})
        this.setupPlayerSong(newSong.id)
        
        playerStore.setState("playerSongIndex", index)
    },
    onModeBtnTap() {
        let modeIndex = this.data.playModeIndex
        modeIndex = modeIndex + 1
        if(modeIndex === 3) modeIndex = 0
        this.setData({playModeIndex: modeIndex,palyModeName: modeNames[modeIndex]})
    },
    getPlaySongInfosHandle({playerSongList, playerSongIndex}) {
        if(playerSongList){
            this.setData({playerSongList})
        }
        if(playerSongIndex !== undefined){
            this.setData({playerSongIndex})
        }
    },
    onUnload(){
        playerStore.offStates(["playerSongList","playerSongIndex"],this.getPlaySongInfosHandle)
    }
})