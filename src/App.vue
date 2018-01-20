<template lang="pug">
  el-container#app
    component(:is="compName", :mouse="mouse")
    <!--GLSL1(:mouse="mouse")-->
    el-header
      HeaderNav
    el-main
      transition(name="slide-fade", mode="out-in")
        router-view
    el-footer
      el-radio-group(v-model="compName", size="mini")
        el-radio-button(:label="comp.name" v-for="(comp, index) in compNameList")
      p._small_p
        a(href='https://github.com/uriuriuriu/lazerBlade', target="_balnk") this github
</template>

<script>
import store from 'src/vuex/store'
import HeaderNav from 'src/components/HeaderNav'
import GLSL from 'src/components/shaders/GLSL'
import GLSL1 from 'src/components/shaders/GLSL1'
import GLSL2 from 'src/components/shaders/GLSL2'
import GLSL3 from 'src/components/shaders/GLSL3'
import { mapActions } from 'vuex'

export default {
  name: 'app',
  store,
  data () {
    return {
      mouse: [0.0, 0.0],
      compName: 'GLSL1',
      compNameList: [
        {name: 'GLSL'}, {name: 'GLSL1'}, {name: 'GLSL2'}, {name: 'GLSL3'}]
    }
  },
  components: {
    HeaderNav, GLSL, GLSL1, GLSL2, GLSL3
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
  ._small_p
    height: 10px
    padding: 0
    margin: 3px 0 0 0
</style>
