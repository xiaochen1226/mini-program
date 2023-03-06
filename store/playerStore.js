import { HYEventStore } from "hy-event-store";
import { parseLyric } from "../utils/parse-lyric";
import { getSongDetail,getSongLyric } from "../services/player";

export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
    state: {
        playerSongList: [],
        playerSongIndex: 0,
        
        id: 0,
        currentSong: {},
        currentTime: 0,
        durationTime: 0,
        lyricInfos: [],
        currentLyricText: '',
        currentLyricIndex: -1,

        isFirstPlay: true,

        isPlaying: false,
        playModeIndex: 0
    },
    actions: {
        playMusicWithSongIdAction(ctx, id) {
            ctx.currentSong = {}
            ctx.sliderValue= 0
            ctx.currentTime= 0
            ctx.durationTime= 0
            ctx.currentLyricText = ""
            ctx.lyricInfos = []

            ctx.id = id
            ctx.isPlaying = true

            getSongDetail(id).then(res => {
                ctx.currentSong = res.songs[0],
                ctx.durationTime = res.songs[0].dt
            })

        getSongLyric(id).then(res => {
            const lrcString = res.lrc.lyric
            const lyricInfos = parseLyric(lrcString)
            ctx.lyricInfos = lyricInfos
        })

        audioContext.stop()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.autoplay = true
        // audioContext.play()

        // 监听播放
        if(ctx.isFirstPlay){
            ctx.isFirstPlay = false

            audioContext.onTimeUpdate((event) => {
                ctx.currentTime = audioContext.currentTime * 1000

                if(!ctx.lyricInfos.length) return
                let index = ctx.lyricInfos.length - 1
                for(let i = 0; i < ctx.lyricInfos.length;i++){
                    const info = ctx.lyricInfos[i]
                    if( info.time > audioContext.currentTime * 1000){
                        index = i -1
                        break;
                    }
                }
                if(index === ctx.currentLyricIndex || index === -1) return

                const currentLyricText = ctx.lyricInfos[index].text
                ctx.currentLyricText = currentLyricText
                ctx.currentLyricIndex = index
            })

            audioContext.onWaiting(()=>{
                audioContext.pause()
            })
            audioContext.onCanplay(() => {
                audioContext.play()
            })
            audioContext.onEnded(() => {
                this.dispatch("playNewMusicAction")
            })
        }
        },
        playMusicStatusAction(ctx) {
            if(ctx.isPlaying){
                audioContext.pause()
                ctx.isPlaying = false
            }else {
                audioContext.play()
                ctx.isPlaying = true
            }
        },
        changePlayModeAction(ctx) {
            let modeIndex = ctx.playModeIndex
            modeIndex = modeIndex + 1
            if(modeIndex === 3) modeIndex = 0
            ctx.playModeIndex = modeIndex
        },
        playNewMusicAction(ctx,isNext = true) {
            const length = ctx.playerSongList.length
            let index = ctx.playerSongIndex

            switch(ctx.playModeIndex){
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

            const newSong = ctx.playerSongList[index]
            
            this.dispatch("playMusicWithSongIdAction", newSong.id)
            
            ctx.playerSongIndex = index
        }
    }
})

export default playerStore