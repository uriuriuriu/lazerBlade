<template lang="pug">
  canvas#glsl(ref="canvas")
</template>

<script>
import testFlag from 'src/shaders/glsl/test_flag.glsl'
import testVert from 'src/shaders/glsl/test_vert.glsl'
import postFlag from 'src/shaders/glsl/post_flag.glsl'
import postVert from 'src/shaders/glsl/post_vert.glsl'
// import img from 'src/shaders/textures/lenna.jpg'
import img from 'src/assets/lenna.jpg'
import { GLSL, ProgramParameter } from 'src/shaders/index'
import { mapGetters } from 'vuex'

const PARAMS_CONFIG1 = {
  att: [
    {location: 'position', stride: 3},
    {location: 'texCoord', stride: 2}
  ],
  uni: [
    {location: 'mouse', type: 'uniform2fv'},
    {location: 'colorTexture', type: 'uniform1i'},
    {location: 'heightTexture', type: 'uniform1i'}
  ]
}
const PARAMS_CONFIG2 = {
  att: [
    {location: 'position', stride: 3}
  ],
  uni: [
    {location: 'texture', type: 'uniform1i'},
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
      scenePrg: null,
      scenePrg2: null,
      canvasWidth: 0,
      canvasHeight: 0,
      run: false,
      startTime: null,
      nowTime: null,
      VBO: null,
      VBO2: null,
      IBO: null,
      position: null,
      texCoord: null,
      texSrcs: [img, img],
      textures: [],
      index: [0, 2, 1, 1, 2, 3],
      fBuffer: null
    }
  },
  async mounted () {
    this.cvs = this.$refs.canvas
    // this.gl = this.cvs.getContext('experimental-webgl')
    this.gl = this.cvs.getContext('webgl')
    if (!this.gl) return
    this.glsl = new GLSL(this.gl)
    this.ext = this.glsl.getWebGLExtensions()
    // window.addEventListener('mousemove', this.mouseMove, false)
    // console.log(this.cvs, this.gl)
    this.textures = await this.glsl.createTextures(this.texSrcs)
    this.glsl.setTextures(this.textures)
    let prg1 = this.glsl.buildProgram(testVert, testFlag)
    let prg2 = this.glsl.buildProgram(postVert, postFlag)
    this.scenePrg = new ProgramParameter(prg1, this.glsl)
    this.scenePrg2 = new ProgramParameter(prg2, this.glsl)
    if (!this.scenePrg && !this.scenePrg2) return
    this.init()
  },
  methods: {
    // 頂点の情報などあらゆる初期化処理を行い描画開始の準備をする
    init (texture) {
      // プログラムオブジェクトから attribute location を取得しストライドを設定する
      this.scenePrg.setParams(PARAMS_CONFIG1)
      this.scenePrg2.setParams(PARAMS_CONFIG2)
      // 頂点座標を定義する
      this.position = [
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
      ]
      this.texCoord = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
      ]
      // 頂点座標の配列から VBO（Vertex Buffer Object）を生成する
      this.VBO = [
        this.glsl.createVbo(this.position),
        this.glsl.createVbo(this.texCoord)
      ]
      this.VBO2 = [
        this.glsl.createVbo(this.position)
      ]
      this.IBO = this.glsl.createIbo(this.index)
      // フレームバッファの生成
      this.fBuffer = this.glsl.createFramebuffer(this.canvasWidth, this.canvasHeight)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.fBuffer.texture)
      // this.scenePrg.setAtt(this.VBO, this.IBO)

      // this.gl.clearColor(0.7, 0.7, 1.0, 1.0)
      this.gl.clearColor(0.804950, 0.851518, 0.907907, 1.0)
      this.gl.clearDepth(1.0) // クリアする深度
      this.gl.enable(this.gl.DEPTH_TEST) // 深度テストを有効化
      // this.scenePrg.setUniLocation('colorTexture', 0)
      // this.scenePrg.setUniLocation('heightTexture', 1)
      this.startTime = Date.now()
      this.nowTime = 0
      this.run = true // ループフラグ
      // レンダリングを開始
      this.render()
    },
    render () {
      // setting
      this.nowTime = (Date.now() - this.startTime) / 1000
      this.refreshCanvas()

      // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fBuffer.framebuffer)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      // 1
      this.gl.useProgram(this.scenePrg.program)
      this.scenePrg.setAtt(this.VBO, this.IBO)
      this.scenePrg.setUniLocation('mouse', this.mouse)
      this.gl.drawElements(this.gl.TRIANGLES, this.index.length, this.gl.UNSIGNED_SHORT, 0)

      // // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
      // this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
      //
      // // 2
      // this.gl.useProgram(this.scenePrg2.program)
      // this.scenePrg2.setAtt(this.VBO2, this.IBO)
      // this.scenePrg2.setUniLocation('texture', 0)
      // this.scenePrg2.setUniLocation('time', this.nowTime)
      // this.scenePrg2.setUniLocation('resolution', [this.canvasWidth, this.canvasHeight])
      // this.gl.drawElements(this.gl.TRIANGLES, this.index.length, this.gl.UNSIGNED_SHORT, 0)

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
    // mouseMove (eve) {
    //   // client 座標を正規化して -1.0 ～ 1.0 の範囲に変換する
    //   let x = (eve.clientX / this.canvasWidth) * 2.0 - 1.0
    //   let y = (eve.clientY / this.canvasHeight) * 2.0 - 1.0
    //   this.mouse = [x, -y]
    // }
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

<style lang="sass" scoped>
#glsl
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: -1
</style>
