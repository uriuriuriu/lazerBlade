<template lang="pug">
  canvas#glsl(ref="canvas")
</template>

<script>
import testFlag from 'src/shaders/glsl/test_flag.glsl'
import testVert from 'src/shaders/glsl/test_vert.glsl'
import { GLSL, ProgramParameter } from 'src/shaders/index'
import { mapGetters } from 'vuex'

const PARAMS_CONFIG1 = {
  att: [
    {location: 'position', stride: 3}
  ],
  uni: [
    {location: 'mouse', type: 'uniform2fv'}
  ]
}
export default {
  name: 'glsl',
  props: {
    mouse: { type: Array, default: () => ([0.0, 0.0]) }
  },
  data () {
    return {
      gl: null,
      glsl: null,
      cvs: null,
      ext: null,
      scenePrg: null,
      canvasWidth: 0,
      canvasHeight: 0,
      run: false,
      startTime: null,
      nowTime: null,
      VBO: null,
      position: null
    }
  },
  mounted () {
    this.cvs = this.$refs.canvas
    this.glsl = new GLSL(this.cvs)
    if (!this.glsl.gl) return
    this.gl = this.glsl.gl
    this.ext = this.glsl.getWebGLExtensions()
    // window.addEventListener('mousemove', this.mouseMove, false)
    let prg1 = this.glsl.buildProgram(testVert, testFlag)
    this.scenePrg = new ProgramParameter(prg1, this.glsl)
    if (!this.scenePrg) return
    this.init()
  },
  methods: {
    // 頂点の情報などあらゆる初期化処理を行い描画開始の準備をする
    init (texture) {
      this.refreshCanvas()
      this.scenePrg.setParams(PARAMS_CONFIG1)
      this.position = [
        0.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
      ]
      this.VBO = this.glsl.createVbos([this.position])
      this.gl.clearColor(0.804950, 0.851518, 0.907907, 1.0)
      this.startTime = Date.now()
      this.nowTime = 0
      this.run = true
      this.render()
    },
    render () {
      // setting
      this.nowTime = (Date.now() - this.startTime) / 1000
      this.refreshCanvas()
      // 1
      this.gl.useProgram(this.scenePrg.program)
      this.scenePrg.setUniLocation('mouse', this.mouse)
      this.scenePrg.setAttribute(this.VBO)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
      this.gl.drawArrays(this.gl.POINTS, 0, this.position.length / 3)
      // do
      this.gl.flush()
      // render を再帰呼出しして描画処理をループさせる
      if (this.run) { requestAnimationFrame(this.render) }
    },
    // mouseMove (eve) {
    //   // client 座標を正規化して -1.0 ～ 1.0 の範囲に変換する
    //   let x = (eve.clientX / this.canvasWidth) * 2.0 - 1.0
    //   let y = (eve.clientY / this.canvasHeight) * 2.0 - 1.0
    //   this.mouse = [x, -y]
    // },
    refreshCanvas () {
      // ウィンドウサイズの変更に対応するため canvas のサイズを更新
      this.canvasWidth = window.innerWidth
      this.canvasHeight = window.innerHeight
      this.cvs.width = this.canvasWidth
      this.cvs.height = this.canvasHeight
      // canvas のサイズとビューポートの大きさを揃える
      this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight)
    }

  },
  computed: {
    ...mapGetters([ 'pageTitle', 'loadingCount', 'loadingSets' ])
  },
  beforeDestroy () {
    this.clear()
    // window.removeEventListener('mousemove', this.mouseMove)
    this.stage = null
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
#glsl
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: -1
</style>
