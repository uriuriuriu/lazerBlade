<template lang="pug">
  canvas#glsl(ref="canvas", @mousemove="mouseMove")
</template>

<script>
import testFlag from 'src/shaders/test_flag.glsl'
import testVert from 'src/shaders/test_vert.glsl'
// import img from 'src/shaders/textures/lenna.jpg'
import img from 'src/assets/lenna.jpg'
import { glsl, ProgramParameter } from 'src/shaders/index'
import { mapGetters } from 'vuex'

export default {
  name: 'glsl',
  props: {
    mouse: { type: Array, default: () => ([0.0, 0.0]) }
  },
  data () {
    return {
      srcFlag: '',
      srcVert: '',
      gl: null,
      cvs: null,
      ext: null,
      scenePrg: null,
      canvasWidth: 0,
      canvasHeight: 0,
      run: false,
      startTime: null,
      nowTime: null,
      VBO: null,
      position: null,
      texCoord: null,
      texSrcs: [img, img],
      textures: [],
      index: [0, 2, 1, 1, 2, 3]
    }
  },
  async mounted () {
    this.cvs = this.$refs.canvas
    // this.gl = this.cvs.getContext('experimental-webgl')
    this.gl = this.cvs.getContext('webgl')
    if (this.gl === null) return
    // 拡張機能を有効化
    this.ext = glsl.getWebGLExtensions(this.gl)
    // window.addEventListener('mousemove', this.mouseMove, false)
    console.log(this.cvs, this.gl)
    this.srcFlag = glsl.getShader(testFlag)
    this.srcVert = glsl.getShader(testVert)
    this.textures = await glsl.createTextures(this.gl, this.texSrcs)
    glsl.setTextures(this.gl, this.textures)
    // console.log('shader is', this.srcFlag, this.srcVert)
    let shader = {vs: this.srcVert, fs: this.srcFlag}
    let vs = glsl.createShader(this.gl, shader.vs, this.gl.VERTEX_SHADER)
    let fs = glsl.createShader(this.gl, shader.fs, this.gl.FRAGMENT_SHADER)
    console.log('pgm', vs, fs)
    // シェーダオブジェクトをプログラムオブジェクトにアタッチ
    let prg = glsl.createProgram(this.gl, vs, fs)
    if (prg == null) { return }
    // プログラムオブジェクトを管理しやすいようにクラスでラップする
    this.scenePrg = new ProgramParameter(prg)
    // 初期化処理を呼び出す
    this.init()
  },
  methods: {
    // 頂点の情報などあらゆる初期化処理を行い描画開始の準備をする
    init (texture) {
      // プログラムオブジェクトから attribute location を取得しストライドを設定する
      this.scenePrg.attLocation[0] = this.gl.getAttribLocation(this.scenePrg.program, 'position')
      this.scenePrg.attLocation[1] = this.gl.getAttribLocation(this.scenePrg.program, 'texCoord')
      this.scenePrg.attStride[0] = 3
      this.scenePrg.attStride[1] = 2
      this.scenePrg.uniLocation[0] = this.gl.getUniformLocation(this.scenePrg.program, 'mouse')
      this.scenePrg.uniLocation[1] = this.gl.getUniformLocation(this.scenePrg.program, 'colorTexture')
      this.scenePrg.uniLocation[2] = this.gl.getUniformLocation(this.scenePrg.program, 'heightTexture')
      this.scenePrg.uniType[0] = 'uniform2fv'
      this.scenePrg.uniType[1] = 'uniform1i'
      this.scenePrg.uniType[2] = 'uniform1i'
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
        glsl.createVbo(this.gl, this.position),
        glsl.createVbo(this.gl, this.texCoord)
      ]
      let IBO = glsl.createIbo(this.gl, this.index)
      // VBO を有効化する
      glsl.setAttribute(this.gl, this.VBO, this.scenePrg.attLocation, this.scenePrg.attStride, IBO)
      // WebGL で canvas をクリアする色の設定
      this.gl.clearColor(0.804950, 0.851518, 0.907907, 1.0)
      this.gl.clearDepth(1.0) // クリアする深度
      this.gl.enable(this.gl.DEPTH_TEST) // 深度テストを有効化
      this.gl[this.scenePrg.uniType[1]](this.scenePrg.uniLocation[1], 0)
      this.gl[this.scenePrg.uniType[2]](this.scenePrg.uniLocation[2], 1)
      // 未初期化の変数を初期化する
      this.startTime = Date.now()
      this.nowTime = 0
      this.run = true // ループフラグ
      // レンダリングを開始
      this.render()
    },
    render () {
      // 描画開始からの経過時間（秒単位）
      this.nowTime = (Date.now() - this.startTime) / 1000
      // ウィンドウサイズの変更に対応するため canvas のサイズを更新
      this.canvasWidth = window.innerWidth
      this.canvasHeight = window.innerHeight
      this.cvs.width = this.canvasWidth
      this.cvs.height = this.canvasHeight
      // canvas のサイズとビューポートの大きさを揃える
      this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight)
      // どのプログラムオブジェクトを利用するか設定
      // this.gl.useProgram(this.scenePrg.program)
      // unigorm変数をリアルタイムにpush
      this.gl[this.scenePrg.uniType[0]](this.scenePrg.uniLocation[0], this.mouse)
      // 事前に設定済みの色でクリアする
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
      this.gl.drawElements(this.gl.TRIANGLES, this.index.length, this.gl.UNSIGNED_SHORT, 0)
      // バインドした VBO にもとづき頂点を描画する
      // this.gl.drawArrays(this.gl.POINTS, 0, this.position.length / 3)
      // GPU 上のコマンドバッファを確実に実行させる
      this.gl.flush()
      // render を再帰呼出しして描画処理をループさせる
      if (this.run) { requestAnimationFrame(this.render) }
    },
    mouseMove (eve) {
      // client 座標を正規化して -1.0 ～ 1.0 の範囲に変換する
      let x = (eve.clientX / this.canvasWidth) * 2.0 - 1.0
      let y = (eve.clientY / this.canvasHeight) * 2.0 - 1.0
      this.mouse = [x, -y]
    }
  },
  computed: {
    ...mapGetters([ 'pageTitle', 'loadingCount', 'loadingSets' ])
  },
  beforeDestroy () {
    this.clear()
    window.removeEventListener('mousemove', this.mouseMove)
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
