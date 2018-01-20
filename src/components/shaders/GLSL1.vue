<template lang="pug">
  canvas#glsl(ref="canvas")
</template>

<script>
  import testFlag from 'src/shaders/glsl/1/test_frag.glsl'
  import testVert from 'src/shaders/glsl/1/test_vert.glsl'
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
        index: [0, 2, 1, 1, 2, 3]
      }
    },
    async mounted () {
      this.cvs = this.$refs.canvas
      this.glsl = new GLSL(this.cvs)
      if (!this.glsl.gl) return
      this.gl = this.glsl.gl
      this.ext = this.glsl.getWebGLExtensions()
      this.textures = await this.glsl.createTextures(this.texSrcs)
      this.glsl.setTextures(this.textures)
      let prg1 = this.glsl.buildProgram(testVert, testFlag)
      this.scenePrg1 = new ProgramParameter(prg1, this.glsl)
      if (!this.scenePrg1) return
      this.init()
    },
    methods: {
      // 頂点の情報などあらゆる初期化処理を行い描画開始の準備をする
      init (texture) {
        // プログラムオブジェクトから attribute location を取得しストライドを設定する
        this.scenePrg1.setParams(PARAMS_CONFIG1)
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
        this.VBO = this.glsl.createVbos([this.position, this.texCoord])
        this.IBO = this.glsl.createIbo(this.index)
        // this.scenePrg1.setAtt(this.VBO, this.IBO)
        // this.gl.clearColor(0.7, 0.7, 1.0, 1.0)
        this.gl.clearColor(0.804950, 0.851518, 0.907907, 1.0)
        this.gl.clearDepth(1.0) // クリアする深度
        this.gl.enable(this.gl.DEPTH_TEST) // 深度テストを有効化
        this.scenePrg1.setUniLocation('colorTexture', 0)
        this.scenePrg1.setUniLocation('heightTexture', 1)
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
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
        // 1
        this.gl.useProgram(this.scenePrg1.program)
        this.scenePrg1.setAttribute(this.VBO, this.IBO)
        this.scenePrg1.setUniLocation('mouse', this.mouse)
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
