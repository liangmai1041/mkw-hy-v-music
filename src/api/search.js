import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getHotKey(){
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    const data = Object.assign({}, commonParams, {
        uin: 0,
        needNewCode: 1,
        platform: 'h5'
    })

    return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
    const url = '/api/search'

    const data = Object.assign({}, commonParams, {
        w: query,
        p: page,
        perpage,
        n: perpage,
        catZhida: zhida ? 1 : 0,
        zhidaqu: 1,
        is_xml: 0,
        sem: 1,
        flag: 1,
        t: 0,
        cr: 1,
        ie: 'utf-8',
        g_tk: 5381,
        loginUin: 0,
        remoteplace: 'txt.mqq.all',
        platform: 'yqq.json',
        needNewCode: 0,
        format: 'json'
    })

    return axios.get(url, {
        params: data
    }).then(res => {
        return res.data
    })
}