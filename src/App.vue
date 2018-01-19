<template lang="pug">
  el-container#app
    GLSL2(:mouse="mouse")
    el-header
      HeaderNav
    el-main
      transition(name="slide-fade", mode="out-in")
        router-view
</template>

<script>
import store from 'src/vuex/store'
import HeaderNav from 'src/components/HeaderNav'
import GLSL2 from 'src/components/shaders/GLSL2'
import { mapActions } from 'vuex'

export default {
  name: 'app',
  store,
  data () {
    return {
      mouse: [0.0, 0.0]
    }
  },
  components: {
    HeaderNav, GLSL2
  },
  watch: {
    '$route': 'routeChange'
  },
  mounted () {
    this.$nextTick(function () {
      console.log('%c:::::::::::::::::: App mounted ::::::::::::::::::::::::::::::::::::', 'color:green; font-weight: bold')
      console.log(`%c${this.$route.fullPath}`, 'color:green; font-weight:bold', this.$route)
      window.addEventListener('resize', this.getWindowWidth)
      this.getWindowWidth()
      document.onmousemove = this.getMousePoint
    })
  },
  methods: {
    routeChange () {
      console.log('%c:::::::::::::::::: change $route ::::::::::::::::::::::::::::::::::::', 'color:green; font-weight: bold')
      console.log(`%c${this.$route.fullPath}`, 'color:green; font-weight:bold', this.$route)
      // more setting..
    },
    getWindowWidth (e) {
      this.setWindowWidth(document.documentElement.clientWidth)
    },
    getMousePoint (e) {
      let x = (e.clientX / window.innerWidth) * 2.0 - 1.0
      let y = (e.clientY / window.innerHeight) * 2.0 - 1.0
      this.mouse = [x, -y]
    },
    ...mapActions(['setWindowWidth'])
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowWidth)
  }
}
</script>

<style lang="sass">
  @import global
</style>
