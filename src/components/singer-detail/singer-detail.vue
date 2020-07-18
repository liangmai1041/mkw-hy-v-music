<template>
    <transition appear name="slide">
        <div class="singer-detail">1111</div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer.js'
import { ERR_OK } from 'api/config'

export default {
    computed: {
        ...mapGetters([
            'singer'
        ])
    },
    created() {
        this._getSingerDetail()
        console.log(this.singer)
    },
    methods: {
        _getSingerDetail() {
            if(!this.singer.id) {
                this.$router.push('/singer')
                return
            }
            getSingerDetail(this.singer.id).then(res => {
                if(res.code === ERR_OK) {
                    console.log(res.data.list)
                }
            })
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
