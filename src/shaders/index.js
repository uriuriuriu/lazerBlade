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
    // await img.addEventListener('load', () => {
    //   console.log('img', img)
    //   let tex = gl.createTexture()
    //   gl.bindTexture(gl.TEXTURE_2D, tex)
    //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    //   gl.generateMipmap(gl.TEXTURE_2D)
    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    //   gl.bindTexture(gl.TEXTURE_2D, null)
    //   return tex
    // }, false)
    // img.src = data
  },
  createProgram (gl, vs, fs) {
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
      console.log(val)
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
  /**
   * @constructor
   * @param {WebGLProgram} program - プログラムオブジェクト
   */
  constructor (program) {
    /**
     * @type {WebGLProgram} プログラムオブジェクト
     */
    this.program = program
    /**
     * @type {Array} attribute location を格納する配列
     */
    this.attLocation = []
    /**
     * @type {Array} attribute stride を格納する配列
     */
    this.attStride = []
    /**
     * @type {Array} uniform location を格納する配列
     */
    this.uniLocation = []
    /**
     * @type {Array} uniform 変数のタイプを格納する配列
     */
    this.uniType = []
  }
}

// export default {
//   install (Vue, options) {
//     Vue.prototype.glsl = glsl
//   }
// }
export { glsl }
