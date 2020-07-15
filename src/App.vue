<template>
  <div id="app">
    <m-header></m-header>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'

  export default {
    components: {
      MHeader
    }
  }
</script>

<style lang="stylus" >
  @import "~common/stylus/variable"

  #app
    color $color-theme
</style>
