<template lang="pug">
  canvas#glsl(ref="canvas")
</template>

<script>
import glslVert11 from 'src/shaders/glsl/3/vert11.glsl'
import glslFrag12 from 'src/shaders/glsl/3/frag12.glsl'
import glslVert21 from 'src/shaders/glsl/3/vert21.glsl'
import glslFrag22 from 'src/shaders/glsl/3/frag22.glsl'
// import img from 'src/assets/lenna.jpg'
import { GLSL, ProgramParameter } from 'src/shaders/index'

const PARAMS_CONFIG1 = {
  att: [
    {location: 'position', stride: 3},
    {location: 'color', stride: 4}
  ],
  uni: [
    {location: 'backbuffer', type: 'uniform1i'},
    {location: 'texture', type: 'uniform1i'},
    {location: 'mouse', type: 'uniform2fv'},
    {location: 'time', type: 'uniform1f'},
    {location: 'resolution', type: 'uniform2fv'}
  ]
}
const PARAMS_CONFIG2 = {
  att: [
    {location: 'position', stride: 3}
  ],
  uni: [
    {location: 'backbuffer', type: 'uniform1i'},
    {location: 'texture', type: 'uniform1i'},
    {location: 'mouse', type: 'uniform2fv'},
    {location: 'time', type: 'uniform1f'},
    {location: 'resolution', type: 'uniform2fv'}
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
      scenePrg1: null,
      scenePrg2: null,
      canvasWidth: 0,
      canvasHeight: 0,
      run: false,
      startTime: null,
      nowTime: null,
      VBO: null,
      VBO2: null,
      IBO: null,
      position1: null,
      position2: null,
      color1: null,
      // texSrcs: [img, img],
      // textures: [],
      index: [0, 2, 1, 1, 2, 3],
      fBuffers: [],
      loopCount: 0
    }
  },
  async mounted () {
    this.cvs = this.$refs.canvas
    this.glsl = new GLSL(this.cvs)
    if (!this.glsl.gl) return
    this.gl = this.glsl.gl
    this.ext = this.glsl.getWebGLExtensions()
    let prg1 = this.glsl.buildProgram(glslVert11, glslFrag12)
    let prg2 = this.glsl.buildProgram(glslVert21, glslFrag22)
    this.scenePrg1 = new ProgramParameter(prg1, this.glsl)
    this.scenePrg2 = new ProgramParameter(prg2, this.glsl)
    if (!this.scenePrg1 || !this.scenePrg2) return
    this.init()
  },
  methods: {
    // 頂点の情報などあらゆる初期化処理を行い描画開始の準備をする
    init (texture) {
      this.refreshCanvas()
      this.scenePrg1.setParams(PARAMS_CONFIG1)
      this.scenePrg2.setParams(PARAMS_CONFIG2)
      this.position1 = [
        0.0, 0.0, 0.0
      ]
      this.position2 = [
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
      ]
      this.color1 = [
        0.1, 0.1, 0.1, 1.0
      ]
      // 頂点座標の配列から VBO（Vertex Buffer Object）を生成する
      this.VBO = this.glsl.createVbos([this.position1, this.color1])
      this.VBO2 = this.glsl.createVbos([this.position2])
      this.IBO = this.glsl.createIbo(this.index)
      this.fBuffers = [
        this.glsl.createFramebuffer(this.canvasWidth, this.canvasHeight),
        // this.glsl.createFramebuffer(this.canvasWidth, this.canvasHeight),
        // this.glsl.createFramebuffer(this.canvasWidth, this.canvasHeight),
        this.glsl.createFramebuffer(this.canvasWidth, this.canvasHeight)
      ]
      // let imgTex = await this.glsl.createTexture(img)
      // this.gl.bindTexture(this.gl.TEXTURE_2D, this.fBuffer.texture)
      this.glsl.setTextures([
        // imgTex,
        this.fBuffers[0].texture,
        this.fBuffers[1].texture
        // this.fBuffers[2].texture,
        // this.fBuffers[3].texture
      ])
      // this.scenePrg1.setAtt(this.VBO, this.IBO)

      this.gl.clearColor(0.7, 0.7, 1.0, 1.0)
      // this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
      // this.gl.clearColor(0.804950, 0.851518, 0.907907, 1.0)
      this.gl.clearDepth(1.0) // クリアする深度
      this.gl.enable(this.gl.DEPTH_TEST) // 深度テストを有効化
      this.startTime = Date.now()
      this.nowTime = 0
      this.run = true
      this.loopCount = 0

      this.render()
    },
    render () {
      ++this.loopCount
      let targetBufferIndex = this.loopCount % 2
      let prevBufferIndex = 1 - targetBufferIndex

      // setting
      this.gl.disable(this.gl.BLEND)
      this.nowTime = (Date.now() - this.startTime) / 1000
      this.refreshCanvas()

      // save & clear
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fBuffers[targetBufferIndex].framebuffer)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      // 1
      this.gl.useProgram(this.scenePrg1.program)
      this.scenePrg1.setAttribute(this.VBO, this.IBO)
      // this.gl.activeTexture(this.gl.TEXTURE0)
      this.scenePrg1.setUniLocation('backbuffer', prevBufferIndex)
      this.scenePrg1.setUniLocation('texture', targetBufferIndex)
      this.scenePrg1.setUniLocation('mouse', this.mouse)
      this.scenePrg1.setUniLocation('time', this.nowTime)
      this.scenePrg1.setUniLocation('resolution', [this.canvasWidth, this.canvasHeight])
      // this.gl.drawElements(this.gl.TRIANGLES, this.index.length, this.gl.UNSIGNED_SHORT, 0)
      this.gl.drawArrays(this.gl.POINTS, 0, this.position1.length / 3)

      // save & clear
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      // 2
      this.gl.useProgram(this.scenePrg2.program)
      this.scenePrg2.setAttribute(this.VBO2, this.IBO)
      this.scenePrg2.setUniLocation('backbuffer', prevBufferIndex)
      this.scenePrg2.setUniLocation('texture', targetBufferIndex)
      // this.scenePrg2.setUniLocation('backbuffer', targetBufferIndex)
      // this.scenePrg2.setUniLocation('texture', prevBufferIndex)
      this.scenePrg2.setUniLocation('mouse', this.mouse)
      this.scenePrg2.setUniLocation('time', this.nowTime)
      this.scenePrg2.setUniLocation('resolution', [this.canvasWidth, this.canvasHeight])
      this.gl.drawElements(this.gl.TRIANGLES, this.index.length, this.gl.UNSIGNED_SHORT, 0)

      // show
      this.gl.flush()
      if (this.run) { requestAnimationFrame(this.render) }
    },
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
  beforeDestroy () {
    this.clear()
    this.stage = null
  }
}
</script>

<style lang="sass" scoped>
#glsl
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: -1
</style>
