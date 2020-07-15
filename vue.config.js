module.exports = {
    chainWebpack(config) {
        config.resolve.alias
            .set('src', `${__dirname}/src`)
            .set('common', `${__dirname}/src/common`)
    }
}