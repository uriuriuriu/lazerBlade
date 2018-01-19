// ------------------------------------------------------------------------------------------------
// minMatrix.js
// version 0.0.3
// ------------------------------------------------------------------------------------------------

export class MatIV {
  create () {
    return new Float32Array(16)
  }
  identity (dest) {
    dest[0] = 1; dest[1] = 0; dest[2] = 0; dest[3] = 0
    dest[4] = 0; dest[5] = 1; dest[6] = 0; dest[7] = 0
    dest[8] = 0; dest[9] = 0; dest[10] = 1; dest[11] = 0
    dest[12] = 0; dest[13] = 0; dest[14] = 0; dest[15] = 1
    return dest
  }
  multiply (mat1, mat2, dest) {
    const a = mat1[0]
    const b = mat1[1]
    const c = mat1[2]
    const d = mat1[3]
    const e = mat1[4]
    const f = mat1[5]
    const g = mat1[6]
    const h = mat1[7]
    const i = mat1[8]
    const j = mat1[9]
    const k = mat1[10]
    const l = mat1[11]
    const m = mat1[12]
    const n = mat1[13]
    const o = mat1[14]
    const p = mat1[15]
    const A = mat2[0]
    const B = mat2[1]
    const C = mat2[2]
    const D = mat2[3]
    const E = mat2[4]
    const F = mat2[5]
    const G = mat2[6]
    const H = mat2[7]
    const I = mat2[8]
    const J = mat2[9]
    const K = mat2[10]
    const L = mat2[11]
    const M = mat2[12]
    const N = mat2[13]
    const O = mat2[14]
    const P = mat2[15]
    dest[0] = A * a + B * e + C * i + D * m
    dest[1] = A * b + B * f + C * j + D * n
    dest[2] = A * c + B * g + C * k + D * o
    dest[3] = A * d + B * h + C * l + D * p
    dest[4] = E * a + F * e + G * i + H * m
    dest[5] = E * b + F * f + G * j + H * n
    dest[6] = E * c + F * g + G * k + H * o
    dest[7] = E * d + F * h + G * l + H * p
    dest[8] = I * a + J * e + K * i + L * m
    dest[9] = I * b + J * f + K * j + L * n
    dest[10] = I * c + J * g + K * k + L * o
    dest[11] = I * d + J * h + K * l + L * p
    dest[12] = M * a + N * e + O * i + P * m
    dest[13] = M * b + N * f + O * j + P * n
    dest[14] = M * c + N * g + O * k + P * o
    dest[15] = M * d + N * h + O * l + P * p
    return dest
  }
  scale (mat, vec, dest) {
    dest[0] = mat[0] * vec[0]
    dest[1] = mat[1] * vec[0]
    dest[2] = mat[2] * vec[0]
    dest[3] = mat[3] * vec[0]
    dest[4] = mat[4] * vec[1]
    dest[5] = mat[5] * vec[1]
    dest[6] = mat[6] * vec[1]
    dest[7] = mat[7] * vec[1]
    dest[8] = mat[8] * vec[2]
    dest[9] = mat[9] * vec[2]
    dest[10] = mat[10] * vec[2]
    dest[11] = mat[11] * vec[2]
    dest[12] = mat[12]
    dest[13] = mat[13]
    dest[14] = mat[14]
    dest[15] = mat[15]
    return dest
  }
  translate (mat, vec, dest) {
    dest[0] = mat[0]; dest[1] = mat[1]; dest[2] = mat[2]; dest[3] = mat[3]
    dest[4] = mat[4]; dest[5] = mat[5]; dest[6] = mat[6]; dest[7] = mat[7]
    dest[8] = mat[8]; dest[9] = mat[9]; dest[10] = mat[10]; dest[11] = mat[11]
    dest[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12]
    dest[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13]
    dest[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14]
    dest[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15]
    return dest
  }
  rotate (mat, angle, axis, dest) {
    let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2])
    if (!sq) { return null }
    let a = axis[0]
    let b = axis[1]
    let c = axis[2]
    if (sq !== 1) { sq = 1 / sq; a *= sq; b *= sq; c *= sq }
    let d = Math.sin(angle)
    let e = Math.cos(angle)
    let f = 1 - e
    let g = mat[0]
    let h = mat[1]
    let i = mat[2]
    let j = mat[3]
    let k = mat[4]
    let l = mat[5]
    let m = mat[6]
    let n = mat[7]
    let o = mat[8]
    let p = mat[9]
    let q = mat[10]
    let r = mat[11]
    let s = a * a * f + e
    let t = b * a * f + c * d
    let u = c * a * f - b * d
    let v = a * b * f - c * d
    let w = b * b * f + e
    let x = c * b * f + a * d
    let y = a * c * f + b * d
    let z = b * c * f - a * d
    let A = c * c * f + e
    if (angle) {
      if (mat !== dest) {
        dest[12] = mat[12]; dest[13] = mat[13]
        dest[14] = mat[14]; dest[15] = mat[15]
      }
    } else {
      dest = mat
    }
    dest[0] = g * s + k * t + o * u
    dest[1] = h * s + l * t + p * u
    dest[2] = i * s + m * t + q * u
    dest[3] = j * s + n * t + r * u
    dest[4] = g * v + k * w + o * x
    dest[5] = h * v + l * w + p * x
    dest[6] = i * v + m * w + q * x
    dest[7] = j * v + n * w + r * x
    dest[8] = g * y + k * z + o * A
    dest[9] = h * y + l * z + p * A
    dest[10] = i * y + m * z + q * A
    dest[11] = j * y + n * z + r * A
    return dest
  }
  lookAt (eye, center, up, dest) {
    let eyeX = eye[0]
    let eyeY = eye[1]
    let eyeZ = eye[2]
    let upX = up[0]
    let upY = up[1]
    let upZ = up[2]
    let centerX = center[0]
    let centerY = center[1]
    let centerZ = center[2]
    if (eyeX === centerX && eyeY === centerY && eyeZ === centerZ) { return this.identity(dest) }
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, l
    z0 = eyeX - center[0]; z1 = eyeY - center[1]; z2 = eyeZ - center[2]
    l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2)
    z0 *= l; z1 *= l; z2 *= l
    x0 = upY * z2 - upZ * z1
    x1 = upZ * z0 - upX * z2
    x2 = upX * z1 - upY * z0
    l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)
    if (!l) {
      x0 = 0; x1 = 0; x2 = 0
    } else {
      l = 1 / l
      x0 *= l; x1 *= l; x2 *= l
    }
    y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0
    l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)
    if (!l) {
      y0 = 0; y1 = 0; y2 = 0
    } else {
      l = 1 / l
      y0 *= l; y1 *= l; y2 *= l
    }
    dest[0] = x0; dest[1] = y0; dest[2] = z0; dest[3] = 0
    dest[4] = x1; dest[5] = y1; dest[6] = z1; dest[7] = 0
    dest[8] = x2; dest[9] = y2; dest[10] = z2; dest[11] = 0
    dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ)
    dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ)
    dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ)
    dest[15] = 1
    return dest
  }
  perspective (fovy, aspect, near, far, dest) {
    let t = near * Math.tan(fovy * Math.PI / 360)
    let r = t * aspect
    let a = r * 2
    let b = t * 2
    let c = far - near
    dest[0] = near * 2 / a
    dest[1] = 0
    dest[2] = 0
    dest[3] = 0
    dest[4] = 0
    dest[5] = near * 2 / b
    dest[6] = 0
    dest[7] = 0
    dest[8] = 0
    dest[9] = 0
    dest[10] = -(far + near) / c
    dest[11] = -1
    dest[12] = 0
    dest[13] = 0
    dest[14] = -(far * near * 2) / c
    dest[15] = 0
    return dest
  }
  ortho (left, right, top, bottom, near, far, dest) {
    let h = (right - left)
    let v = (top - bottom)
    let d = (far - near)
    dest[0] = 2 / h
    dest[1] = 0
    dest[2] = 0
    dest[3] = 0
    dest[4] = 0
    dest[5] = 2 / v
    dest[6] = 0
    dest[7] = 0
    dest[8] = 0
    dest[9] = 0
    dest[10] = -2 / d
    dest[11] = 0
    dest[12] = -(left + right) / h
    dest[13] = -(top + bottom) / v
    dest[14] = -(far + near) / d
    dest[15] = 1
    return dest
  }
  transpose (mat, dest) {
    dest[0] = mat[0]; dest[1] = mat[4]
    dest[2] = mat[8]; dest[3] = mat[12]
    dest[4] = mat[1]; dest[5] = mat[5]
    dest[6] = mat[9]; dest[7] = mat[13]
    dest[8] = mat[2]; dest[9] = mat[6]
    dest[10] = mat[10]; dest[11] = mat[14]
    dest[12] = mat[3]; dest[13] = mat[7]
    dest[14] = mat[11]; dest[15] = mat[15]
    return dest
  }
  inverse (mat, dest) {
    const a = mat[0]
    const b = mat[1]
    const c = mat[2]
    const d = mat[3]
    const e = mat[4]
    const f = mat[5]
    const g = mat[6]
    const h = mat[7]
    const i = mat[8]
    const j = mat[9]
    const k = mat[10]
    const l = mat[11]
    const m = mat[12]
    const n = mat[13]
    const o = mat[14]
    const p = mat[15]
    const q = a * f - b * e
    const r = a * g - c * e
    const s = a * h - d * e
    const t = b * g - c * f
    const u = b * h - d * f
    const v = c * h - d * g
    const w = i * n - j * m
    const x = i * o - k * m
    const y = i * p - l * m
    const z = j * o - k * n
    const A = j * p - l * n
    const B = k * p - l * o
    const ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w)
    dest[0] = (f * B - g * A + h * z) * ivd
    dest[1] = (-b * B + c * A - d * z) * ivd
    dest[2] = (n * v - o * u + p * t) * ivd
    dest[3] = (-j * v + k * u - l * t) * ivd
    dest[4] = (-e * B + g * y - h * x) * ivd
    dest[5] = (a * B - c * y + d * x) * ivd
    dest[6] = (-m * v + o * s - p * r) * ivd
    dest[7] = (i * v - k * s + l * r) * ivd
    dest[8] = (e * A - f * y + h * w) * ivd
    dest[9] = (-a * A + b * y - d * w) * ivd
    dest[10] = (m * u - n * s + p * q) * ivd
    dest[11] = (-i * u + j * s - l * q) * ivd
    dest[12] = (-e * z + f * x - g * w) * ivd
    dest[13] = (a * z - b * x + c * w) * ivd
    dest[14] = (-m * t + n * r - o * q) * ivd
    dest[15] = (i * t - j * r + k * q) * ivd
    return dest
  }
}

export class QtnIV {
  create = function () {
    return new Float32Array(4)
  }
  identity = function (dest) {
    dest[0] = 0; dest[1] = 0; dest[2] = 0; dest[3] = 1
    return dest
  }
  inverse = function (qtn, dest) {
    dest[0] = -qtn[0]
    dest[1] = -qtn[1]
    dest[2] = -qtn[2]
    dest[3] = qtn[3]
    return dest
  }
  normalize = function (dest) {
    let x = dest[0]
    let y = dest[1]
    let z = dest[2]
    let w = dest[3]
    let l = Math.sqrt(x * x + y * y + z * z + w * w)
    if (l === 0) {
      dest[0] = 0
      dest[1] = 0
      dest[2] = 0
      dest[3] = 0
    } else {
      l = 1 / l
      dest[0] = x * l
      dest[1] = y * l
      dest[2] = z * l
      dest[3] = w * l
    }
    return dest
  }
  multiply = function (qtn1, qtn2, dest) {
    let ax = qtn1[0]
    let ay = qtn1[1]
    let az = qtn1[2]
    let aw = qtn1[3]
    let bx = qtn2[0]
    let by = qtn2[1]
    let bz = qtn2[2]
    let bw = qtn2[3]
    dest[0] = ax * bw + aw * bx + ay * bz - az * by
    dest[1] = ay * bw + aw * by + az * bx - ax * bz
    dest[2] = az * bw + aw * bz + ax * by - ay * bx
    dest[3] = aw * bw - ax * bx - ay * by - az * bz
    return dest
  }
  rotate = function (angle, axis, dest) {
    let sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2])
    if (!sq) { return null }
    let a = axis[0]
    let b = axis[1]
    let c = axis[2]
    if (sq !== 1) { sq = 1 / sq; a *= sq; b *= sq; c *= sq }
    let s = Math.sin(angle * 0.5)
    dest[0] = a * s
    dest[1] = b * s
    dest[2] = c * s
    dest[3] = Math.cos(angle * 0.5)
    return dest
  }
  toVecIII = function (vec, qtn, dest) {
    let qp = this.create()
    let qq = this.create()
    let qr = this.create()
    this.inverse(qtn, qr)
    qp[0] = vec[0]
    qp[1] = vec[1]
    qp[2] = vec[2]
    this.multiply(qr, qp, qq)
    this.multiply(qq, qtn, qr)
    dest[0] = qr[0]
    dest[1] = qr[1]
    dest[2] = qr[2]
    return dest
  }
  toMatIV = function (qtn, dest) {
    let x = qtn[0]
    let y = qtn[1]
    let z = qtn[2]
    let w = qtn[3]
    let x2 = x + x
    let y2 = y + y
    let z2 = z + z
    let xx = x * x2
    let xy = x * y2
    let xz = x * z2
    let yy = y * y2
    let yz = y * z2
    let zz = z * z2
    let wx = w * x2
    let wy = w * y2
    let wz = w * z2
    dest[0] = 1 - (yy + zz)
    dest[1] = xy - wz
    dest[2] = xz + wy
    dest[3] = 0
    dest[4] = xy + wz
    dest[5] = 1 - (xx + zz)
    dest[6] = yz - wx
    dest[7] = 0
    dest[8] = xz - wy
    dest[9] = yz + wx
    dest[10] = 1 - (xx + yy)
    dest[11] = 0
    dest[12] = 0
    dest[13] = 0
    dest[14] = 0
    dest[15] = 1
    return dest
  }
  slerp = function (qtn1, qtn2, time, dest) {
    let ht = qtn1[0] * qtn2[0] + qtn1[1] * qtn2[1] + qtn1[2] * qtn2[2] + qtn1[3] * qtn2[3]
    let hs = 1.0 - ht * ht
    if (hs <= 0.0) {
      dest[0] = qtn1[0]
      dest[1] = qtn1[1]
      dest[2] = qtn1[2]
      dest[3] = qtn1[3]
    } else {
      hs = Math.sqrt(hs)
      if (Math.abs(hs) < 0.0001) {
        dest[0] = (qtn1[0] * 0.5 + qtn2[0] * 0.5)
        dest[1] = (qtn1[1] * 0.5 + qtn2[1] * 0.5)
        dest[2] = (qtn1[2] * 0.5 + qtn2[2] * 0.5)
        dest[3] = (qtn1[3] * 0.5 + qtn2[3] * 0.5)
      } else {
        let ph = Math.acos(ht)
        let pt = ph * time
        let t0 = Math.sin(ph - pt) / hs
        let t1 = Math.sin(pt) / hs
        dest[0] = qtn1[0] * t0 + qtn2[0] * t1
        dest[1] = qtn1[1] * t0 + qtn2[1] * t1
        dest[2] = qtn1[2] * t0 + qtn2[2] * t1
        dest[3] = qtn1[3] * t0 + qtn2[3] * t1
      }
    }
    return dest
  }
}

export function torus (row, column, irad, orad, color) {
  let i, j, tc
  let pos = []
  let nor = []
  let col = []
  let st = []
  let idx = []
  for (i = 0; i <= row; i++) {
    let r = Math.PI * 2 / row * i
    let rr = Math.cos(r)
    let ry = Math.sin(r)
    for (j = 0; j <= column; j++) {
      let tr = Math.PI * 2 / column * j
      let tx = (rr * irad + orad) * Math.cos(tr)
      let ty = ry * irad
      let tz = (rr * irad + orad) * Math.sin(tr)
      let rx = rr * Math.cos(tr)
      let rz = rr * Math.sin(tr)
      if (color) {
        tc = color
      } else {
        tc = hsva(360 / column * j, 1, 1, 1)
      }
      let rs = 1 / column * j
      let rt = 1 / row * i + 0.5
      if (rt > 1.0) { rt -= 1.0 }
      rt = 1.0 - rt
      pos.push(tx, ty, tz)
      nor.push(rx, ry, rz)
      col.push(tc[0], tc[1], tc[2], tc[3])
      st.push(rs, rt)
    }
  }
  for (i = 0; i < row; i++) {
    for (j = 0; j < column; j++) {
      let r = (column + 1) * i + j
      idx.push(r, r + column + 1, r + 1)
      idx.push(r + column + 1, r + column + 2, r + 1)
    }
  }
  return {p: pos, n: nor, c: col, t: st, i: idx}
}

export function sphere (row, column, rad, color) {
  let i, j, tc
  let pos = []
  let nor = []
  let col = []
  let st = []
  let idx = []
  for (i = 0; i <= row; i++) {
    let r = Math.PI / row * i
    let ry = Math.cos(r)
    let rr = Math.sin(r)
    for (j = 0; j <= column; j++) {
      let tr = Math.PI * 2 / column * j
      let tx = rr * rad * Math.cos(tr)
      let ty = ry * rad
      let tz = rr * rad * Math.sin(tr)
      let rx = rr * Math.cos(tr)
      let rz = rr * Math.sin(tr)
      if (color) {
        tc = color
      } else {
        tc = hsva(360 / row * i, 1, 1, 1)
      }
      pos.push(tx, ty, tz)
      nor.push(rx, ry, rz)
      col.push(tc[0], tc[1], tc[2], tc[3])
      st.push(1 - 1 / column * j, 1 / row * i)
    }
  }
  let r = 0
  for (i = 0; i < row; i++) {
    for (j = 0; j < column; j++) {
      r = (column + 1) * i + j
      idx.push(r, r + 1, r + column + 2)
      idx.push(r, r + column + 2, r + column + 1)
    }
  }
  return {p: pos, n: nor, c: col, t: st, i: idx}
}

export function cube (side, color) {
  let tc
  let hs = side * 0.5
  let pos = [
    -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs,
    -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs,
    -hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs,
    -hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs,
    hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs,
    -hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs
  ]
  let nor = [
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
  ]
  let col = []
  for (let i = 0; i < pos.length / 3; i++) {
    if (color) {
      tc = color
    } else {
      tc = hsva(360 / pos.length / 3 * i, 1, 1, 1)
    }
    col.push(tc[0], tc[1], tc[2], tc[3])
  }
  let st = [
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
  ]
  let idx = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
  ]
  return {p: pos, n: nor, c: col, t: st, i: idx}
}

export function hsva (h, s, v, a) {
  if (s > 1 || v > 1 || a > 1) { return }
  let th = h % 360
  let i = Math.floor(th / 60)
  let f = th / 60 - i
  let m = v * (1 - s)
  let n = v * (1 - s * f)
  let k = v * (1 - s * (1 - f))
  let color = []
  if (!s > 0 && !s < 0) {
    color.push(v, v, v, a)
  } else {
    let r = [v, n, m, m, k, v]
    let g = [k, v, v, n, m, m]
    let b = [m, m, k, v, v, n]
    color.push(r[i], g[i], b[i], a)
  }
  return color
}
