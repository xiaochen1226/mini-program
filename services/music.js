import { jxRequset } from "./index";

export function getMusicBanner(type = 0) {
    return jxRequset.get({
        url: '/banner',
        data: { type }
    })
}

export function getPlayListDetail(id) {
    return jxRequset.get({
        url: '/playlist/detail',
        data: { id }
    })
}

export function getSongMenuList(cat="全部",limit = 6,offset = 0) {
    return jxRequset.get({
        url: '/top/playlist',
        data: { cat, limit, offset }
    })
}

export function getSongMenuTag() {
    return jxRequset.get({
        url: '/playlist/hot'
    })
}