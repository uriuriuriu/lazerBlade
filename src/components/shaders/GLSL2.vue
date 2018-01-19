<template lang="pug">
  canvas#glsl(ref="canvas")
</template>

<script>
import testFlag from 'src/shaders/glsl/scene_frag.glsl'
import testVert from 'src/shaders/glsl/scene_vert.glsl'
import postFlag from 'src/shaders/glsl/post2_frag.glsl'
import postVert from 'src/shaders/glsl/post2_vert.glsl'
import { MatIV, QtnIV } from 'src/shaders/minMatrix'
// import { MatIV, QtnIV, torus, sphere, cube, hsva } from 'src/plugins/minMatrix'
// import img from 'src/assets/lenna.jpg'
import { GLSL, ProgramParameter, InteractionCamera } from 'src/shaders/index'
import { mapGetters } from 'vuex'

const PARAMS_CONFIG1 = {
  att: [
    {location: 'position', stride: 3},
    {location: 'color', stride: 4}
  ],
  uni: [
    {location: 'mvpMatrix', type: 'uniformMatrix4fv'}
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
      color: null,
      // texSrcs: [img, img],
      // textures: [],
      index: [0, 2, 1, 1, 2, 3],
      fBuffer: null,
      mat: null, // 行列処理系クラス
      qtn: null, // クォータニオン処理系クラス
      camera: null,
      mMatrix: null,
      vMatrix: null,
      pMatrix: null,
      vpMatrix: null,
      mvpMatrix: null,
      qtnMatrix: null
    }
  },
  async mounted () {
    this.cvs = this.$refs.canvas
    // this.gl = this.cvs.getContext('experimental-webgl')
    this.gl = this.cvs.getContext('webgl')
    if (!this.gl) return
    this.glsl = new GLSL(this.gl)
    this.ext = this.glsl.getWebGLExtensions()
    this.mat = new MatIV()
    this.qtn = new QtnIV()
    this.camera = new InteractionCamera(this.qtn)
    this.camera.update()
    // // マウス関連イベントの登録
    // console.log(this.cvs, this.gl)
    // this.textures = await this.glsl.createTextures(this.texSrcs)
    // this.glsl.setTextures(this.textures)
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
      this.refreshCanvas()
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
      this.color = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
      ]
      // 頂点座標の配列から VBO（Vertex Buffer Object）を生成する
      this.VBO = [
        this.glsl.createVbo(this.position),
        this.glsl.createVbo(this.color)
      ]
      this.VBO2 = [
        this.glsl.createVbo(this.position)
      ]
      this.IBO = this.glsl.createIbo(this.index)
      // フレームバッファの生成
      this.fBuffer = this.glsl.createFramebuffer(this.canvasWidth, this.canvasHeight)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.fBuffer.texture)
      // this.scenePrg.setAtt(this.VBO, this.IBO)

      // 行列関連変数の宣言と初期化
      this.mMatrix = this.mat.identity(this.mat.create())
      this.vMatrix = this.mat.identity(this.mat.create())
      this.pMatrix = this.mat.identity(this.mat.create())
      this.vpMatrix = this.mat.identity(this.mat.create())
      this.mvpMatrix = this.mat.identity(this.mat.create())
      this.qtnMatrix = this.mat.identity(this.mat.create())
      // this.gl.clearColor(0.7, 0.7, 1.0, 1.0)
      this.gl.clearColor(0.804950, 0.851518, 0.907907, 1.0)
      this.gl.clearDepth(1.0) // クリアする深度
      this.gl.enable(this.gl.DEPTH_TEST) // 深度テストを有効化
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

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fBuffer.framebuffer)
      // 1
      this.gl.useProgram(this.scenePrg.program)
      this.gl.viewport(0, 0, this.canvasWidth, this.canvasHeight)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      // cam
      let cameraPosition = [0.0, 0.0, 3.0]
      let centerPoint = [0.0, 0.0, 0.0]
      let cameraUpDirection = [0.0, 1.0, 0.0]
      let fovy = 60 * this.camera.scale
      let aspect = this.canvasWidth / this.canvasHeight
      let near = 0.1
      let far = 10.0

      // ビュー・プロジェクション座標変換行列
      this.mat.lookAt(cameraPosition, centerPoint, cameraUpDirection, this.vMatrix)
      this.mat.perspective(fovy, aspect, near, far, this.pMatrix)
      this.mat.multiply(this.pMatrix, this.vMatrix, this.vpMatrix)
      this.camera.update()
      this.mat.identity(this.qtnMatrix)
      this.qtn.toMatIV(this.camera.qtn, this.qtnMatrix)
      this.mat.multiply(this.vpMatrix, this.qtnMatrix, this.vpMatrix)

      this.scenePrg.setAtt(this.VBO, this.IBO)
      this.mat.identity(this.mMatrix)
      this.mat.rotate(this.mMatrix, this.nowTime * 0.1, [0.0, 1.0, 0.0], this.mMatrix)
      this.mat.multiply(this.vpMatrix, this.mMatrix, this.mvpMatrix)
      this.scenePrg.setUniLocation('mvpMatrix', false, this.mvpMatrix)
      this.gl.drawElements(this.gl.TRIANGLES, this.index.length, this.gl.UNSIGNED_SHORT, 0)

      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
      // 2
      this.gl.useProgram(this.scenePrg2.program)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

      this.scenePrg2.setAtt(this.VBO2, this.IBO)
      this.scenePrg2.setUniLocation('texture', 0)
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
