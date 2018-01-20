import _ from 'lodash'

const _createProgram = function (gl, vs, fs) {
  if (vs == null || fs == null) { return }
  let program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.useProgram(program)
    return program
  } else {
    alert(gl.getProgramInfoLog(program))
    return null
  }
}

export class GLSL {
  constructor (canvas) {
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  }
  createShader (source, type) {
    let shader = this.gl.createShader(type)
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      return shader
    } else {
      alert(this.gl.getShaderInfoLog(shader))
      return null
    }
  }
  async createTextures (datas) {
    let result = []
    for (let data of datas) {
      result.push(await this.createTexture(data))
    }
    return result
  }
  getImg (src) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.addEventListener('load', (e) => resolve(image))
      image.src = src
    })
  }
  async createTexture (data) {
    let img = await this.getImg(data)
    let tex = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, tex)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img)
    this.gl.generateMipmap(this.gl.TEXTURE_2D)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    return tex
  }
  createFramebuffer (width, height) {
    let frameBuffer = this.gl.createFramebuffer()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer)
    let depthRenderBuffer = this.gl.createRenderbuffer()
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthRenderBuffer)
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height)
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthRenderBuffer)
    let fTexture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, fTexture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, fTexture, 0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    return {framebuffer: frameBuffer, renderbuffer: depthRenderBuffer, texture: fTexture}
  }
  buildProgram (vertString, flagString) {
    let srcFlag = this.getShader(flagString)
    let srcVert = this.getShader(vertString)
    let vs = this.createShader(srcVert, this.gl.VERTEX_SHADER)
    let fs = this.createShader(srcFlag, this.gl.FRAGMENT_SHADER)
    // console.log('pgm', vs, fs)
    return _createProgram(this.gl, vs, fs)
  }
  createVbo (data) {
    let vbo = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    return vbo
  }
  createVbos (datas) {
    let vbos = []
    datas.forEach((data, index) => {
      vbos.push(this.createVbo(data))
    })
    return vbos
  }
  createIbo (data) {
    let ibo = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    return ibo
  }
  setAttribute (vbo, attL, attS, ibo) {
    for (let i in vbo) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i])
      this.gl.enableVertexAttribArray(attL[i])
      this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0)
    }
    if (ibo === null) return
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo)
  }
  getWebGLExtensions () {
    return {
      elementIndexUint: this.gl.getExtension('OES_element_index_uint'),
      textureFloat: this.gl.getExtension('OES_texture_float'),
      textureHalfFloat: this.gl.getExtension('OES_texture_half_float')
    }
  }
  getShader (data) {
    let src = data.split(',')
    // let decodedData = window.atob(src[1]) // 文字列のデコード
    let decodedData = decodeURIComponent(escape(window.atob(src[1]))) // 文字列のデコード
    return decodedData
  }
  setTextures (textures) {
    textures.forEach((val, index) => {
      this.setTexture(val, index)
    })
  }
  setTexture (texture, index) {
    // this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.activeTexture(this.gl[`TEXTURE${index}`])
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
  }
}

export class ProgramParameter {
  constructor (program, glsl) {
    this.program = program
    this.gl = glsl.gl
    this.glsl = glsl
    this.attLocation = []
    this.attStride = []
    this.uniLocation = []
    this.uniType = []
    this.params = {
      att: [
        // {location: 'position', stride: 3},
        // {location: 'texCoord', stride: 2}
      ],
      uni: [
        // {location: 'mouse', type: 'uniform2fv'},
        // {location: 'colorTexture', type: 'uniform1i'},
        // {location: 'heightTexture', type: 'uniform1i'}
      ]
    }
    this.uniIndex = {
      // mouse: 0,
      // colorTexture: 1,
      // heightTexture: 2,
    }
  }
  setParams (params) {
    this.params = _.cloneDeep(params)
    params.att.forEach((at, index) => {
      this.attLocation[index] = this.gl.getAttribLocation(this.program, at.location)
      this.attStride[index] = at.stride
    })
    this.uniIndex = {}
    params.uni.forEach((un, index) => {
      this.uniIndex[un.location] = index
      this.uniLocation[index] = this.gl.getUniformLocation(this.program, un.location)
      this.uniType[index] = un.type
    })
  }
  setUniLocation (location, val, val2 = null) {
    if (val2) {
      this.gl[this.uniType[this.uniIndex[location]]](this.uniLocation[this.uniIndex[location]], val, val2)
    } else {
      this.gl[this.uniType[this.uniIndex[location]]](this.uniLocation[this.uniIndex[location]], val)
    }
  }
  setAttribute (VBO, IBO = null) {
    if (IBO) {
      this.glsl.setAttribute(VBO, this.attLocation, this.attStride, IBO)
    } else {
      this.glsl.setAttribute(VBO, this.attLocation, this.attStride)
    }
  }
}

export class InteractionCamera {
  constructor (qtn) {
    this.qtn = qtn.identity(qtn.create())
    this.dragging = false
    this.prevMouse = [0, 0]
    this.rotationScale = Math.min(window.innerWidth, window.innerHeight)
    this.rotation = 0.0
    this.rotateAxis = [0.0, 0.0, 0.0]
    this.rotatePower = 1.5
    this.rotateAttenuation = 0.9
    this.scale = 1.0
    this.scalePower = 0.0
    this.scaleAttenuation = 0.8
    this.scaleMin = 0.5
    this.scaleMax = 1.5
    this.startEvent = this.startEvent.bind(this)
    this.moveEvent = this.moveEvent.bind(this)
    this.endEvent = this.endEvent.bind(this)
    this.wheelEvent = this.wheelEvent.bind(this)
  }
  startEvent (eve) {
    this.dragging = true
    this.prevMouse = [eve.clientX, eve.clientY]
  }
  moveEvent (eve) {
    if (this.dragging !== true) { return }
    let x = this.prevMouse[0] - eve.clientX
    let y = this.prevMouse[1] - eve.clientY
    this.rotation = Math.sqrt(x * x + y * y) / this.rotationScale * this.rotatePower
    this.rotateAxis[0] = y
    this.rotateAxis[1] = x
    this.prevMouse = [eve.clientX, eve.clientY]
  }
  endEvent () {
    this.dragging = false
  }
  wheelEvent (eve) {
    let w = eve.wheelDelta
    if (w > 0) {
      this.scalePower = -0.05
    } else if (w < 0) {
      this.scalePower = 0.05
    }
  }
  update () {
    this.scalePower *= this.scaleAttenuation
    this.scale = Math.max(this.scaleMin, Math.min(this.scaleMax, this.scale + this.scalePower))
    if (this.rotation === 0.0) { return }
    this.rotation *= this.rotateAttenuation
    let q = this.qtn.identity(this.qtn.create())
    this.qtn.rotate(this.rotation, this.rotateAxis, q)
    this.qtn.multiply(this.qtn, q, this.qtn)
  }
}
// export default {
//   install (Vue, options) {
//     Vue.prototype.glsl = glsl
//   }
// }
// export { GLSL }
