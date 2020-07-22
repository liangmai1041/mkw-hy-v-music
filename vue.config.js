const axios = require('axios')
const bodyParser = require('body-parser')

module.exports = {
    chainWebpack(config) {
        config.resolve.alias
            .set('src', `${__dirname}/src`)
            .set('common', `${__dirname}/src/common`)
            .set('components', `${__dirname}/src/components`)
            .set('api', `${__dirname}/src/api`)
            .set('base', `${__dirname}/src/base`)
    },
    lintOnSave: false,
    devServer: {
        port: 8081,
        before(app) {
            // 代理服务器   向qq音乐接口发送请求抓取轮播图数据
            app.get('/api/getTopBanner', function (req, res) {
                const url = "https://u.y.qq.com/cgi-bin/musicu.fcg"
                const jumpPrefix = 'https://y.qq.com/n/yqq/album/'
                axios.get(url, {
                    headers: {
                        referer: 'https://y.qq.com',
                        Origin: 'https://y.qq.com'
                    },
                    params: req.query
                }).then((response) => {
                    response = response.data
                    if (response.code === 0) {
                        const slider = []
                        content = response.focus.data && response.focus.data.content
                        if (content) {
                            content.forEach(item => {
                                const sliderItem = {}
                                sliderItem.id = item.id
                                sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
                                sliderItem.picUrl = item.pic_info.url
                                slider.push(sliderItem)
                            })
                        }
                        res.json({
                            code: 0,
                            data: {
                                slider
                            }
                        })
                    } else {
                        res.json(response)
                    }
                }).catch(e => {
                    console.log(e)
                })
            })

            // 向qq音乐官网抓取 歌单列表 将获取到的歌单数据返回
            app.get('/api/getDiscList', function (req, res) {
                const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
                axios.get(url, {
                    headers: {
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    },
                    params: req.query
                }).then(response => {
                    res.json(response.data)
                }).catch(e => {
                    console.log(e)
                })
            })

            // 代理服务器获取歌曲信息
            app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
                const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
                axios.post(url, req.body, {
                    headers: {
                        referer: 'https://u.y.qq.com',
                        origin: 'https://u.y.qq.com',
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                }).then((response) => {
                    res.json(response.data)
                }).catch(e => {
                    console.log(e)
                })
            })

            // 代理服务器获取歌词信息
            app.get('/api/lyric', function (req, res) {
                const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

                axios.get(url, {
                    headers: {
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    },
                    params: req.query
                }).then(response => {
                    const ret = response.data
                    // console.log(typeof ret);
                    // console.log(ret);
                    if (typeof ret === 'string') {
                        const reg = /^\w+\(({.+})\)$/
                        const matches = ret.match(reg)
                        if (matches) {
                            ret = JSON.parse(matches[1])
                        }
                    }
                    res.json(ret)
                }).catch(e => console.log(e))

            })

            // 抓取推荐列表歌曲
            app.get('/api/getCdInfo', function (req, res) {
                const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

                axios.get(url, {
                    headers: {
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    },
                    params: req.query
                }).then(response => {
                    res.json(response.data)
                }).catch(e => {
                    console.log(e)
                })
            })

            // 抓取搜索接口
            app.get('/api/search', function (req, res) {
                const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

                axios.get(url, {
                    headers: {
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    },
                    params: req.query
                }).then(response => {
                    res.json(response.data)
                }).catch(e => {
                    console.log(e)
                })
            })
        },
    }
}
