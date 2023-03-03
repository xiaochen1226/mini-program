import { jxRequset } from "./index";

export function getSongDetail(ids) {
    return jxRequset.get({
        url: '/song/detail',
        data: {ids}
    })
}

export function getSongLyric(id) {
    return jxRequset.get({
        url: '/lyric',
        data: {id}
    })
}
