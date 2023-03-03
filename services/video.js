import { jxRequset } from './index'

export function getTopMV(offset = 0,limit = 20) {
    return jxRequset.get({
        url: '/top/mv',
        data: {
            limit,
            offset
        }
    })
}

export function getMVUrl(id){
    return jxRequset.get({
        url: '/mv/url',
        data: { id }
    })
}

export function getMVInfo(mvid) {
    return jxRequset.get({
        url: '/mv/detail',
        data: { mvid }
    })
}

export function getMVRelated(id){
    return jxRequset.get({
        url: '/related/allvideo',
        data: { id }
    })
}