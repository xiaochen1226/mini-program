// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music";

Page({
    data: {
        songMenus: []
    },
    onLoad() {
        this.fetchAllMenuList()
    },
    async fetchAllMenuList() {
        const res = await getSongMenuTag()
        const tags = res.tags

        const allPromises = []
        for(const tag of tags) {
            const promise = getSongMenuList(tag.name)
            allPromises.push(promise)
        }

        Promise.all(allPromises).then(res => {
            this.setData({ songMenus: res })
        })
    }
})