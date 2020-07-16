const axios = require('axios')

module.exports = {
    chainWebpack(config) {
        config.resolve.alias
            .set('src', `${__dirname}/src`)
            .set('common', `${__dirname}/src/common`)
            .set('components', `${__dirname}/src/components`)
            .set('api', `${__dirname}/src/api`)
    },
    lintOnSave: false,
    devServer: {
        port: 8081,
        before(app) {
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
                    if (response.code === 0){
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
                }).catch( e => {
                    console.log(e)
                })
            })

        },
    }
}