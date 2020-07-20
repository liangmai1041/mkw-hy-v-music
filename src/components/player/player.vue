<template>
    <div class="player" v-show="playList.length>0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen"> 
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title">{{currentSong.name}}</h1>
                    <h2 class="subtitle">{{currentSong.singer}}</h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd">
                                <img class="image" :src="currentSong.image">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="operators">
                        <div class="icon i-left">
                            <i class="icon-sequence"></i>
                        </div>
                        <div class="icon i-left">
                            <i class="icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i class="icon-play"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
                <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img width="40" height="40" :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="name">{{currentSong.name}}</h2>
                    <p class="desc">{{currentSong.singer}}</p>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
// 借助第三方插件库 js创建css动画
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')

export default{
    computed: {
        ...mapGetters([
            'fullScreen',
            'playList',
            'currentSong'
        ])
    },
    methods: {
        back() {
            this.setFullScreen(false)
        },
        open() {
            this.setFullScreen(true)
        },
        // 在vue的transition标签中设置js钩子来做动画效果
        // enter就是从哪来(一定不是当前位置)
        enter(el, done) {
            // 获取到位移的坐标和缩放比例
            const {x, y, scale} = this._getPosAndScale()
            // 用js 定义动画
            let animation = {
                0: {
                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                },
                // 到60%的时候就移动到指定位置然后放大1.1
                60: {
                    transform: `translate3d(0, 0, 0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0, 0, 0) scale(1)`
                }
            }
            // 必须要引用第三方插件来让js做动画效果 从而创建css的动画效果
            animations.registerAnimation({
                // 动画的名称
                name: 'move',
                // 定义的动画
                animation,
                // 设置动画的样式 间隔400毫秒 线性的
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })
            // 执行动画, 传入要执行动画的dom 动画名称,还有done
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        // 在afterEnter中删除动画
        afterEnter() {
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el, done) {
            // 获取到位移的坐标和缩放比例
            const {x, y, scale} = this._getPosAndScale()
            // 关闭播放器时 cd图片缩小 不做其他动画样式,那就可以直接用js来写
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave() {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        // 获取到x,y和scale三个数据
        _getPosAndScale() {
            const targetWidth = 40
            const paddingLeft = 40
            const paddingBottom = 30
            const paddingTop = 80
            const width = window.innerWidth * 0.8
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width/2 - paddingBottom
            return {
                x,
                y,
                scale
            }
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN'
        })
    }
}
</script>

<style lang="stylus">
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
    
    .player
        .normal-player
            position fixed
            left 0
            right 0
            top 0
            bottom 0
            z-index 150
            background $color-background
            .background
                position absolute
                left 0
                top 0
                width 100%
                height 100%
                z-index -1
                opacity 0.6
                filter blur(20px)
            .top
                position relative
                margin-bottom 25px
                .back
                    position absolute
                    top 0
                    left 6px
                    z-index 50

                    .icon-back
                        display block
                        padding 9px
                        font-size $font-size-large-x
                        color $color-theme
                        transform rotate(-90deg)
                .title
                    width 70%
                    margin 0 auto
                    line-height 40px
                    text-align center
                    no-wrap()
                    font-size $font-size-large
                    color $color-text
                .subtitle
                    line-height 20px
                    text-align center
                    font-size $font-size-medium
                    color $color-text
            .middle
                position fixed
                width 100%
                top 80px
                bottom 170px
                white-space nowrap
                font-size 0
                .middle-l
                    display inline-block
                    vertical-align top
                    position relative
                    width 100%
                    height 0
                    padding-top 80%
                    .cd-wrapper
                        position absolute
                        left 10%
                        top 0
                        width 80%
                        box-sizing border-box
                        height 100%
                        .cd
                            width 100%
                            height 100%
                            border-radius 50%
                            .image
                                position absolute
                                left 0
                                top 0
                                width 100%
                                height 100%
                                box-sizing border-box
                                border-radius 50%
                                border 10px solid rgba(255, 255, 255, 0.1)
                                &.play
                                    animation rotate 20s linear infinite both
                                &.pause
                                    animation-play-state paused
                    .playing-lyric-wrapper
                        width 80%
                        margin 30px auto 0 auto
                        overflow hidden
                        text-align center
                        .playing-lyric
                            height 20px
                            line-height 20px
                            font-size $font-size-medium
                            color $color-text-l
                .middle-r
                    display inline-block
                    vertical-align top
                    width 100%
                    height 100%
                    overflow hidden
                    .lyric-wrapper
                        width 80%
                        margin 0 auto
                        overflow hidden
                        text-align center

                        .text
                            line-height 32px
                            color $color-text-l
                            font-size $font-size-medium
                            &.current
                                color $color-text
                        .pure-music
                            padding-top 50%
                            line-height 32px
                            color $color-text-l
                            font-size $font-size-medium
            .bottom
                position absolute
                bottom 50px
                width 100%
                .dot-wrapper
                    text-align center
                    font-size 0
                    .dot
                        display inline-block
                        vertical-align middle
                        margin 0 4px
                        width 8px
                        height 8px
                        border-radius 50%
                        background $color-text-l
                        &.active
                            width 20px
                            border-radius 5px
                            background $color-text-ll
                .progress-wrapper
                    display flex
                    align-items center
                    width 80%
                    margin 0px auto
                    padding 10px 0
                    .time
                        color $color-text
                        font-size $font-size-small
                        flex 0 0 30px
                        line-height 30px
                        width 30px
                        &.time-l
                            text-align left
                         &.time-r
                            text-align right
                    .progress-bar-wrapper
                        flex 1
                .operators
                    display flex
                    align-items center
                    .icon
                        flex 1
                        color $color-theme
                        &.disable
                            color $color-theme-d
                        i
                            font-size 30px
                    .i-left
                        text-align right
                    .i-center
                        padding 0 20px
                        text-align center
                        i
                            font-size 40px
                    .i-right
                        text-align left
                        .icon-down
                            height 30px
                            width 30px
                    .icon-favorite
                        color $color-sub-theme
            &.normal-enter-active, &.normal-leave-active
                transition all 0.4s
                .top, .bottom
                    transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity 0
                .top
                    transform translate3d(0, -100px, 0)
                .bottom
                    transform translate3d(0, 100px, 0)
        .mini-player
            display flex
            align-items center
            position fixed
            left 0
            bottom 0
            z-index 180
            width 100%
            height 60px
            background $color-highlight-background
            &.mini-enter-active, &.mini-leave-active
                transition all 0.4s
            &.mini-enter, &.mini-leave-to
                opacity 0
            .icon
                flex 0 0 40px
                width 40px
                height 40px
                padding 0 10px 0 20px
                .imgWrapper
                    height 100%
                    width 100%
                    img
                        border-radius 50%
                        &.play
                            animation rotate 10s linear infinite
                        &.pause
                            animation-play-state paused
            .text
                display flex
                flex-direction column
                justify-content center
                flex 1
                line-height 20px
                overflow hidden
                .name
                    margin-bottom 2px
                    no-wrap()
                    font-size $font-size-medium
                    color $color-text
                .desc
                    no-wrap()
                    font-size $font-size-small
                    color $color-text-d
            .control
                flex 0 0 30px
                width 30px
                padding 0 10px
                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size 30px
                    color $color-theme-d
                .icon-mini
                    font-size 32px
                    position absolute
                    left 0
                    top 0
            .control2
                flex 0 0 26px
                width 26px
                .icon-prev, .icon-next
                    font-size 26px
                    color $color-theme

    @keyframes rotate {
        0% {
            transform: rotate(0);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>