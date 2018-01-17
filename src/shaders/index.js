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

const glsl = {
  createShader (gl, source, type) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader
    } else {
      alert(gl.getShaderInfoLog(shader))
      return null
    }
  },
  async createTextures (gl, datas) {
    let result = []
    for (let data of datas) {
      result.push(await this.createTexture(gl, data))
    }
    return result
  },
  getImg (src) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.addEventListener('load', (e) => resolve(image))
      image.src = src
    })
  },
  async createTexture (gl, data) {
    let img = await this.getImg(data)
    let tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return tex
  },
  createFramebuffer (gl, width, height) {
    let frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    let depthRenderBuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer)
    let fTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, fTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return {framebuffer: frameBuffer, renderbuffer: depthRenderBuffer, texture: fTexture}
  },
  buildProgram (gl, vertString, flagString) {
    let srcFlag = glsl.getShader(flagString)
    let srcVert = glsl.getShader(vertString)
    let vs = glsl.createShader(gl, srcVert, gl.VERTEX_SHADER)
    let fs = glsl.createShader(gl, srcFlag, gl.FRAGMENT_SHADER)
    // console.log('pgm', vs, fs)
    // シェーダオブジェクトをプログラムオブジェクトにアタッチ
    let prg = _createProgram(gl, vs, fs)
    if (prg === null) return
    // プログラムオブジェクトを管理しやすいようにクラスでラップする
    return new ProgramParameter(prg)
  },
  createVbo (gl, data) {
    let vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return vbo
  },
  createIbo (gl, data) {
    let ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    return ibo
  },
  setAttribute (gl, vbo, attL, attS, ibo) {
    for (let i in vbo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i])
      gl.enableVertexAttribArray(attL[i])
      gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0)
    }
    if (ibo != null) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    }
  },
  getWebGLExtensions (gl) {
    return {
      elementIndexUint: gl.getExtension('OES_element_index_uint'),
      textureFloat: gl.getExtension('OES_texture_float'),
      textureHalfFloat: gl.getExtension('OES_texture_half_float')
    }
  },
  getShader (data) {
    let src = data.split(',')
    // let decodedData = window.atob(src[1]) // 文字列のデコード
    let decodedData = decodeURIComponent(escape(window.atob(src[1]))) // 文字列のデコード
    return decodedData
  },
  setTextures (gl, textures) {
    textures.forEach((val, index) => {
      this.setTexture(gl, val, index)
    })
  },
  setTexture (gl, texture, index) {
    // gl.activeTexture(gl.TEXTURE0)
    gl.activeTexture(gl[`TEXTURE${index}`])
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }
}

export class ProgramParameter {
  constructor (program) {
    this.program = program
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
  setParams (gl, params) {
    this.params = _.cloneDeep(params)
    params.att.forEach((at, index) => {
      this.attLocation[index] = gl.getAttribLocation(this.program, at.location)
      this.attStride[index] = at.stride
    })
    this.uniIndex = {}
    params.uni.forEach((un, index) => {
      this.uniIndex[un.location] = index
      this.uniLocation[index] = gl.getUniformLocation(this.program, un.location)
      this.uniType[index] = un.type
    })
  }
  setUniLocation (gl, location, val) {
    gl[this.uniType[this.uniIndex[location]]](this.uniLocation[this.uniIndex[location]], val)
  }
  setAtt (gl, VBO, IBO) {
    glsl.setAttribute(gl, VBO, this.attLocation, this.attStride, IBO)
  }
}

// export default {
//   install (Vue, options) {
//     Vue.prototype.glsl = glsl
//   }
// }
export { glsl }
