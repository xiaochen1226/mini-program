// components/ranking-item/ranking-item.js
Component({
    properties: {
        itemData: {
            type: Object,
            value: {}
        },
        key: {
            type: String,
            value: "newRanking"
        }
    },
    methods: {
        onRankingItem() {
            wx.navigateTo({
              url: `/pages/detail-song/detail-song?type=ranking&key=${this.properties.key}`,
            })
        }
    }
})
