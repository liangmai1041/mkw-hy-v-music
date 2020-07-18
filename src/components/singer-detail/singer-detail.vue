<template>
    <transition appear name="slide">
        <div class="singer-detail">1111</div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer.js'
import { ERR_OK } from 'api/config'
import { createSong, processSongsUrl } from 'common/js/song'

export default {
    data() {
        return {
            songs: []
        }
    },
    computed: {
        ...mapGetters([
            'singer'
        ])
    },
    created() {
        this._getSingerDetail()
    },
    methods: {
        _getSingerDetail() {
            if(!this.singer.id) {
                this.$router.push('/singer')
                return
            }
            getSingerDetail(this.singer.id).then(res => {
                if(res.code === ERR_OK) {
                    // 对拿到的歌手详情信息进行处理 拿到我们需要的数据
                    processSongsUrl(this._normalizeSongs(res.data.list)).then(res => {
                        this.songs = res
                        console.log(this.songs)
                    })
                }
            })
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach(item => {
                let { musicData } = item
                if(musicData.songid && musicData.albummid) {
                    ret.push(createSong(musicData))
                }
            })
            return ret
        }
    }
}
</script>

<style lang="stylus" scoped  rel="stylesheet/stylus">
    @import '~common/stylus/variable'

    .singer-detail
        position fixed
        z-index 100
        top 0
        left 0
        right 0
        bottom 0
        background $color-background

    .slide-enter-active, .slide-leave-active
        transition: all 0.5s
    .slide-enter, .slide-leave-to
        transform translate3d(100%, 0, 0)
</style>
