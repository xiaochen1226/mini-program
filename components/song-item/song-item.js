// components/song-item/song-item.js
Component({
    properties: {
        itemData: {
            type: Object,
            value: {}
        }
    },
    methods: {
        onSongItemTap() {
            const id = this.properties.itemData.id
            wx.navigateTo({
              url: `/pages/music-player/music-player?id=${id}`,
            })
        }
    }
})
