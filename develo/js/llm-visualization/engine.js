// features/llm-visualization/upstream/src/utils/assetBase.ts
var LLM_VIZ_ASSET_BASE = "/llm-viz/bycroft-9da9374";
async function fetchRequiredAsset(url, signal) {
  const response = await fetch(url, {
    signal,
    credentials: "same-origin"
  });
  if (!response.ok) {
    throw new Error(
      `[llm-viz] Failed to load ${url}: HTTP ${response.status}`
    );
  }
  return response;
}
async function fetchJsonAsset(url, signal) {
  const response = await fetchRequiredAsset(url, signal);
  return response.json();
}
async function instantiateLlmWasm(url, importObject, signal) {
  const response = await fetchRequiredAsset(url, signal);
  try {
    if ("instantiateStreaming" in WebAssembly) {
      return await WebAssembly.instantiateStreaming(
        response.clone(),
        importObject
      );
    }
  } catch {
  }
  const bytes = await response.arrayBuffer();
  return WebAssembly.instantiate(bytes, importObject);
}

// features/llm-visualization/upstream/src/utils/vector.ts
var _Vec2 = class _Vec2 {
  constructor(x = 0, y = 0) {
    this.x = +x;
    this.y = +y;
  }
  add(a) {
    return new _Vec2(this.x + a.x, this.y + a.y);
  }
  sub(a) {
    return new _Vec2(this.x - a.x, this.y - a.y);
  }
  dot(a) {
    return this.x * a.x + this.y * a.y;
  }
  mul(a) {
    return new _Vec2(this.x * a, this.y * a);
  }
  mulAdd(a, b) {
    return new _Vec2(this.x + a.x * b, this.y + a.y * b);
  }
  lenSq() {
    return this.x * this.x + this.y * this.y;
  }
  distSq(a) {
    let dx = this.x - a.x;
    let dy = this.y - a.y;
    return dx * dx + dy * dy;
  }
  len() {
    return Math.sqrt(this.lenSq());
  }
  dist(a) {
    return Math.sqrt(this.distSq(a));
  }
  normalize() {
    return this.mul(1 / Math.sqrt(this.lenSq()));
  }
  mid(a) {
    return new _Vec2((this.x + a.x) * 0.5, (this.y + a.y) * 0.5);
  }
  abs() {
    return new _Vec2(Math.abs(this.x), Math.abs(this.y));
  }
  clone() {
    return new _Vec2(this.x, this.y);
  }
  toVec3() {
    return new Vec3(this.x, this.y, 1);
  }
  round() {
    return new _Vec2(Math.round(this.x), Math.round(this.y));
  }
  floor() {
    return new _Vec2(Math.floor(this.x), Math.floor(this.y));
  }
  round_() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  copy_(a) {
    this.x = a.x;
    this.y = a.y;
  }
  writeToBuf(buf, offset) {
    buf[offset + 0] = this.x;
    buf[offset + 1] = this.y;
  }
  static fromArray(a, offset = 0) {
    return new _Vec2(a[offset + 0], a[offset + 1]);
  }
  setAt(i, v) {
    switch (i) {
      case 0:
        this.x = v;
        break;
      case 1:
        this.y = v;
        break;
    }
    return this;
  }
  addAt(i, v) {
    switch (i) {
      case 0:
        this.x += v;
        break;
      case 1:
        this.y += v;
        break;
    }
    return this;
  }
  getAt(i) {
    return i === 0 ? this.x : i === 1 ? this.y : 0;
  }
  withSetAt(i, v) {
    return this.clone().setAt(i, v);
  }
  withAddAt(i, v) {
    return this.clone().addAt(i, v);
  }
  toString(dp = 3) {
    return `Vec2(${numMaxDp(this.x, dp)}, ${numMaxDp(this.y, dp)})`;
  }
  rotate(thetaRad) {
    let c = Math.cos(thetaRad);
    let s = Math.sin(thetaRad);
    let kCrossV = new _Vec2(-this.y, this.x);
    return this.mul(c).add(kCrossV.mul(s));
  }
  lerp(a, t) {
    return new _Vec2(
      a.x * t + this.x * (1 - t),
      a.y * t + this.y * (1 - t)
    );
  }
};
_Vec2.zero = new _Vec2(0, 0);
_Vec2.one = new _Vec2(1, 1);
var Vec2 = _Vec2;
var _Vec3 = class _Vec3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = +x;
    this.y = +y;
    this.z = +z;
  }
  add(a) {
    return new _Vec3(this.x + a.x, this.y + a.y, this.z + a.z);
  }
  sub(a) {
    return new _Vec3(this.x - a.x, this.y - a.y, this.z - a.z);
  }
  dot(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }
  mul(a) {
    return new _Vec3(this.x * a, this.y * a, this.z * a);
  }
  mulAdd(a, b) {
    return new _Vec3(this.x + a.x * b, this.y + a.y * b, this.z + a.z * b);
  }
  lenSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  distSq(a) {
    let dx = this.x - a.x;
    let dy = this.y - a.y;
    let dz = this.z - a.z;
    return dx * dx + dy * dy + dz * dz;
  }
  len() {
    return Math.sqrt(this.lenSq());
  }
  dist(a) {
    return Math.sqrt(this.distSq(a));
  }
  normalize() {
    return this.mul(1 / Math.sqrt(this.lenSq()));
  }
  mid(a) {
    return new _Vec3((this.x + a.x) * 0.5, (this.y + a.y) * 0.5, (this.z + a.z) * 0.5);
  }
  abs() {
    return new _Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
  }
  clone() {
    return new _Vec3(this.x, this.y, this.z);
  }
  toVec4() {
    return new Vec4(this.x, this.y, this.z, 1);
  }
  round() {
    return new _Vec3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }
  floor() {
    return new _Vec3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }
  round_() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }
  copy_(a) {
    this.x = a.x;
    this.y = a.y;
    this.z = a.z;
  }
  static cross(a, b) {
    return new _Vec3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
  writeToBuf(buf, offset) {
    buf[offset + 0] = this.x;
    buf[offset + 1] = this.y;
    buf[offset + 2] = this.z;
  }
  static fromArray(a, offset = 0) {
    return new _Vec3(a[offset + 0], a[offset + 1], a[offset + 2]);
  }
  setAt(i, v) {
    switch (i) {
      case 0:
        this.x = v;
        break;
      case 1:
        this.y = v;
        break;
      case 2:
        this.z = v;
        break;
    }
    return this;
  }
  addAt(i, v) {
    switch (i) {
      case 0:
        this.x += v;
        break;
      case 1:
        this.y += v;
        break;
      case 2:
        this.z += v;
        break;
    }
    return this;
  }
  getAt(i) {
    switch (i) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
    }
    return 0;
  }
  withSetAt(i, v) {
    return this.clone().setAt(i, v);
  }
  withAddAt(i, v) {
    return this.clone().addAt(i, v);
  }
  toString(dp = 3) {
    return `Vec3(${numMaxDp(this.x, dp)}, ${numMaxDp(this.y, dp)}, ${numMaxDp(this.z, dp)})`;
  }
  rotateAbout(k, thetaRad) {
    let c = Math.cos(thetaRad);
    let s = Math.sin(thetaRad);
    let kCrossV = _Vec3.cross(k, this);
    let kDotV = k.dot(this);
    return this.mul(c).add(kCrossV.mul(s)).add(k.mul(kDotV * (1 - c)));
  }
  lerp(a, t) {
    return new _Vec3(
      a.x * t + this.x * (1 - t),
      a.y * t + this.y * (1 - t),
      a.z * t + this.z * (1 - t)
    );
  }
};
_Vec3.zero = new _Vec3(0, 0, 0);
_Vec3.one = new _Vec3(1, 1, 1);
var Vec3 = _Vec3;
var Vec4 = class _Vec4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = +x;
    this.y = +y;
    this.z = +z;
    this.w = +w;
  }
  getIdx(i) {
    switch (i) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error(`Invalid index ${i}`);
    }
  }
  add(a) {
    return new _Vec4(this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w);
  }
  sub(a) {
    return new _Vec4(this.x - a.x, this.y - a.y, this.z - a.z, this.w - a.w);
  }
  dot(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z + this.w + a.w;
  }
  mul(a) {
    return new _Vec4(this.x * a, this.y * a, this.z * a, this.w * a);
  }
  lenSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  distSq(a) {
    let dx = this.x - a.x;
    let dy = this.y - a.y;
    let dz = this.z - a.z;
    let dw = this.w - a.w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
  }
  len() {
    return Math.sqrt(this.lenSq());
  }
  dist(a) {
    return Math.sqrt(this.distSq(a));
  }
  normalize() {
    return this.mul(1 / Math.sqrt(this.lenSq()));
  }
  projToVec3() {
    return new Vec3(this.x / this.w, this.y / this.w, this.z / this.w);
  }
  static lerp(a, b, t) {
    return a.add(b.sub(a).mul(t));
  }
  writeToBuf(buf, offset) {
    buf[offset + 0] = this.x;
    buf[offset + 1] = this.y;
    buf[offset + 2] = this.z;
    buf[offset + 3] = this.w;
  }
  static fromArray(a, offset = 0) {
    return new _Vec4(a[offset + 0], a[offset + 1], a[offset + 2], a[offset + 3]);
  }
  static fromVec3(v, w = 1) {
    return new _Vec4(v.x, v.y, v.z, w);
  }
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  static fromHexColor(s, alpha = 1) {
    if (s.startsWith("#")) s = s.slice(1);
    let hexVal = parseInt(s, 16);
    let x = hexVal >> 16 & 255;
    let y = hexVal >> 8 & 255;
    let z = hexVal & 255;
    return new _Vec4(x / 255 * alpha, y / 255 * alpha, z / 255 * alpha, alpha);
  }
  static fromRgbaColor(s) {
    let isrgba = s.startsWith("rgba(");
    let isrgb = s.startsWith("rgb(");
    if (!isrgba && !isrgb || !s.endsWith(")")) throw new Error(`Invalid color string '${s}'. Should be of the form 'rgb(r, g, b)' or 'rgba(r, g, b, a)'`);
    s = s.slice(isrgba ? 5 : 4, -1);
    let vs = s.split(",").map((v) => parseFloat(v.trim()));
    let a = isrgba ? vs[3] : 1;
    let rgb = vs.slice(0, 3).map((v) => v / 255 * a);
    return new _Vec4(rgb[0], rgb[1], rgb[2], a);
  }
  toHexColor() {
    let toPair = (v) => Math.floor(v * 255).toString(16).padStart(2, "0");
    return `#${toPair(this.x)}${toPair(this.y)}${toPair(this.z)}${toPair(this.w)}`;
  }
  toString() {
    return `Vec4(${numMaxDp(this.x)}, ${numMaxDp(this.y)}, ${numMaxDp(this.z)}, ${numMaxDp(this.w)})`;
  }
};
function numMaxDp(x, dp = 3) {
  return parseFloat(x.toFixed(dp)).toString();
}
var BoundingBox3d = class _BoundingBox3d {
  constructor(...args) {
    this.min = new Vec3();
    this.max = new Vec3();
    this.empty = true;
    for (let v of args)
      this.addInPlace(v);
  }
  addInPlace(v) {
    if (this.empty) {
      this.min.x = v.x;
      this.min.y = v.y;
      this.min.z = v.z;
      this.max.x = v.x;
      this.max.y = v.y;
      this.max.z = v.z;
      this.empty = false;
    } else {
      this.min.x = Math.min(this.min.x, v.x);
      this.min.y = Math.min(this.min.y, v.y);
      this.min.z = Math.min(this.min.z, v.z);
      this.max.x = Math.max(this.max.x, v.x);
      this.max.y = Math.max(this.max.y, v.y);
      this.max.z = Math.max(this.max.z, v.z);
    }
    return this;
  }
  combineInPlace(v) {
    return v.empty ? this : this.addInPlace(v.min).addInPlace(v.max);
  }
  center() {
    let a = this.max;
    let b = this.min;
    return new Vec3(
      a.x + 0.5 * (b.x - a.x),
      a.y + 0.5 * (b.y - a.y),
      a.z + 0.5 * (b.z - a.z)
    );
  }
  size() {
    return this.max.sub(this.min);
  }
  contains(p) {
    return !this.empty && p.x >= this.min.x && p.x <= this.max.x && p.y >= this.min.y && p.y <= this.max.y && p.z >= this.min.z && p.z <= this.max.z;
  }
  intersects(b) {
    return !this.empty && !b.empty && this.max.x >= b.min.x && this.min.x <= b.max.x && this.max.y >= b.min.y && this.min.y <= b.max.y && this.max.z >= b.min.z && this.min.z <= b.max.z;
  }
  expandInPlace(border) {
    if (!this.empty) {
      this.min.x -= border;
      this.min.y -= border;
      this.min.z -= border;
      this.max.x += border;
      this.max.y += border;
      this.max.z += border;
    }
    return this;
  }
  shrinkInPlaceXY(inset) {
    if (!this.empty) {
      this.min.x += inset;
      this.min.y += inset;
      this.max.x -= inset;
      this.max.y -= inset;
      if (this.min.x > this.max.x || this.min.y > this.max.y) {
        this.empty = true;
        this.min = new Vec3();
        this.max = new Vec3();
      }
    }
    return this;
  }
  tl() {
    return new Vec3(this.min.x, this.min.y, this.min.z);
  }
  tr() {
    return new Vec3(this.max.x, this.min.y, this.min.z);
  }
  br() {
    return new Vec3(this.max.x, this.max.y, this.min.z);
  }
  bl() {
    return new Vec3(this.min.x, this.max.y, this.min.z);
  }
  clone() {
    let b = new _BoundingBox3d();
    b.min = this.min.clone();
    b.max = this.max.clone();
    b.empty = this.empty;
    return b;
  }
  toString() {
    return `BoundingBox3d(${this.min}, ${this.max})`;
  }
};
var Vec3Buf = class {
  static add_(a, aOff, b, bOff, out, outOff) {
    out[outOff + 0] = a[aOff + 0] + b[bOff + 0];
    out[outOff + 1] = a[aOff + 1] + b[bOff + 1];
    out[outOff + 2] = a[aOff + 2] + b[bOff + 2];
  }
  static sub_(a, aOff, b, bOff, out, outOff) {
    out[outOff + 0] = a[aOff + 0] - b[bOff + 0];
    out[outOff + 1] = a[aOff + 1] - b[bOff + 1];
    out[outOff + 2] = a[aOff + 2] - b[bOff + 2];
  }
  static copy_(a, aOff, out, outOff) {
    out[outOff + 0] = a[aOff + 0];
    out[outOff + 1] = a[aOff + 1];
    out[outOff + 2] = a[aOff + 2];
  }
  static normalize_(a, aOff, out, outOff) {
    let x = a[aOff + 0];
    let y = a[aOff + 1];
    let z = a[aOff + 2];
    let lenInv = 1 / Math.sqrt(x * x + y * y + z * z);
    out[outOff + 0] = x * lenInv;
    out[outOff + 1] = y * lenInv;
    out[outOff + 2] = z * lenInv;
  }
  static len_(a, aOff) {
    let x = a[aOff + 0];
    let y = a[aOff + 1];
    let z = a[aOff + 2];
    return Math.sqrt(x * x + y * y + z * z);
  }
};

// features/llm-visualization/upstream/src/utils/matrix.ts
var _Mat4f = class _Mat4f extends Float32Array {
  constructor() {
    super(16);
    this[0] = this[5] = this[10] = this[15] = 1;
  }
  g(r, c) {
    return this[c * 4 + r];
  }
  s(r, c, v) {
    this[c * 4 + r] = v;
  }
  add(a) {
    let res = new _Mat4f();
    for (let i = 0; i < 16; i++) {
      res[i] = this[i] + a[i];
    }
    return res;
  }
  sub(a) {
    let res = new _Mat4f();
    for (let i = 0; i < 16; i++) {
      res[i] = this[i] - a[i];
    }
    return res;
  }
  mul(a) {
    let res = new _Mat4f();
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        let v = 0;
        for (let k = 0; k < 4; k++) {
          v += this[k * 4 + y] * a[x * 4 + k];
        }
        res[x * 4 + y] = v;
      }
    }
    return res;
  }
  mulVec4(a) {
    let x = this[0] * a.x + this[4] * a.y + this[8] * a.z + this[12] * a.w;
    let y = this[1] * a.x + this[5] * a.y + this[9] * a.z + this[13] * a.w;
    let z = this[2] * a.x + this[6] * a.y + this[10] * a.z + this[14] * a.w;
    let w = this[3] * a.x + this[7] * a.y + this[11] * a.z + this[15] * a.w;
    return new Vec4(x, y, z, w);
  }
  mulVec3Proj(a) {
    let v4 = this.mulVec4(new Vec4(a.x, a.y, a.z, 1));
    let wInv = 1 / v4.w;
    return new Vec3(v4.x * wInv, v4.y * wInv, v4.z * wInv);
  }
  mulVec3ProjVec(a) {
    let v4 = this.mulVec4(new Vec4(a.x, a.y, a.z, 0));
    return new Vec3(v4.x, v4.y, v4.z);
  }
  mulVec3Affine(a) {
    let o = new Vec3();
    this.mulVec3Affine_(a, o);
    return o;
  }
  mulVec3Affine_(a, o) {
    let x = this[0] * a.x + this[4] * a.y + this[8] * a.z + this[12];
    let y = this[1] * a.x + this[5] * a.y + this[9] * a.z + this[13];
    let z = this[2] * a.x + this[6] * a.y + this[10] * a.z + this[14];
    o.x = x;
    o.y = y;
    o.z = z;
  }
  mulVec3AffineArr_(a, aOff, out, outOff) {
    let ax = a[aOff];
    let ay = a[aOff + 1];
    let az = a[aOff + 2];
    out[outOff + 0] = this[0] * ax + this[4] * ay + this[8] * az + this[12];
    out[outOff + 1] = this[1] * ax + this[5] * ay + this[9] * az + this[13];
    out[outOff + 2] = this[2] * ax + this[6] * ay + this[10] * az + this[14];
  }
  mulVec3AffineVec_(a, o) {
    let x = this[0] * a.x + this[4] * a.y + this[8] * a.z;
    let y = this[1] * a.x + this[5] * a.y + this[9] * a.z;
    let z = this[2] * a.x + this[6] * a.y + this[10] * a.z;
    o.x = x;
    o.y = y;
    o.z = z;
  }
  static fromRowMajor(a) {
    if (a.length > 0 && Array.isArray(a[0])) {
      a = a.flatMap((x) => x);
    }
    let flatArr = a;
    if (flatArr.length !== 16) {
      console.log("need 16 elements");
    }
    let res = new _Mat4f();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        res[i * 4 + j] = flatArr[j * 4 + i];
      }
    }
    return res;
  }
  static fromColMajor(flatArr, offset = 0) {
    if (flatArr.length - offset < 16) {
      console.log("need 16 elements");
    }
    let res = new _Mat4f();
    for (let i = 0; i < 16; i++) {
      res[i] = flatArr[offset + i];
    }
    return res;
  }
  static fromTranslation(a) {
    let res = new _Mat4f();
    res[12] = a.x;
    res[13] = a.y;
    res[14] = a.z;
    return res;
  }
  static fromScaleTranslation(s, t) {
    let res = new _Mat4f();
    res[0] = s.x;
    res[5] = s.y;
    res[10] = s.z;
    res[12] = t.x;
    res[13] = t.y;
    res[14] = t.z;
    return res;
  }
  static fromAxisAngle(axis, angleRad) {
    let res = new _Mat4f();
    fromAxisAngle(axis, angleRad, res, 4);
    return res;
  }
  static fromQuat(q) {
    let res = new _Mat4f();
    fromQuat(q, res, 4);
    return res;
  }
  static fromScale(s) {
    let res = new _Mat4f();
    res[0] = s.x;
    res[5] = s.y;
    res[10] = s.z;
    return res;
  }
  static fromLookAt(eye, center, up) {
    let f = eye.sub(center).normalize();
    let u = up.normalize();
    let r = Vec3.cross(u, f).normalize();
    u = Vec3.cross(f, r);
    let res = new _Mat4f();
    res[0] = r.x;
    res[1] = u.x;
    res[2] = f.x;
    res[4] = r.y;
    res[5] = u.y;
    res[6] = f.y;
    res[8] = r.z;
    res[9] = u.z;
    res[10] = f.z;
    res[12] = -eye.dot(r);
    res[13] = -eye.dot(u);
    res[14] = -eye.dot(f);
    return res;
  }
  static fromPersp(fovDeg, aspect, near, far) {
    let h = near * Math.tan(fovDeg / 2 * Math.PI / 180) * 2;
    let w = h * aspect;
    let res = new _Mat4f();
    res[0] = 2 * near / w;
    res[5] = 2 * near / h;
    res[10] = -far / (far - near);
    res[11] = -1;
    res[14] = -far * near / (far - near);
    res[15] = 0;
    return res;
  }
  static fromOrtho(left, right, bottom, top, near, far) {
    let res = new _Mat4f();
    res[0] = 2 / (right - left);
    res[5] = 2 / (top - bottom);
    res[10] = -2 / (far - near);
    res[12] = -(right + left) / (right - left);
    res[13] = -(top + bottom) / (top - bottom);
    res[14] = -(far + near) / (far - near);
    return res;
  }
  static zeros() {
    let res = new _Mat4f();
    res[0] = 0;
    res[5] = 0;
    res[10] = 0;
    res[15] = 0;
    return res;
  }
  // creates Translation, Rotation, Scale, such that this matrix is the result of multipling
  // the equivalent matrix forms, as in
  //
  // M = T * R * S
  //
  // Note that we assume that there is no skew or projective components.
  // The rotation is given as a quaternion
  decomposeToTRS() {
    let T = Vec3.fromArray(this, 12);
    let S = new Vec3(
      Vec3.fromArray(this, 0).len(),
      Vec3.fromArray(this, 4).len(),
      Vec3.fromArray(this, 8).len()
    );
    let tr = this[0] + this[5] + this[10];
    let R;
    if (tr > 0) {
      let r = Math.sqrt(1 + tr);
      let s = 0.5 / r;
      R = new Vec4(
        (this[6] - this[9]) * s,
        (this[8] - this[2]) * s,
        (this[1] - this[4]) * s,
        0.5 * r
      );
    } else if (this[0] > this[5] && this[0] > this[10]) {
      let r = Math.sqrt(1 + this[0] - this[5] - this[10]);
      let s = 0.5 / r;
      R = new Vec4(
        0.5 * r,
        (this[1] + this[4]) * s,
        (this[8] + this[2]) * s,
        (this[6] - this[9]) * s
      );
    } else if (this[5] > this[10]) {
      let r = Math.sqrt(1 + this[5] - this[0] - this[10]);
      let s = 0.5 / r;
      R = new Vec4(
        (this[4] + this[1]) * s,
        0.5 * r,
        (this[9] + this[6]) * s,
        (this[8] - this[2]) * s
      );
    } else {
      let r = Math.sqrt(1 + this[10] - this[0] - this[5]);
      let s = 0.5 / r;
      R = new Vec4(
        (this[8] + this[2]) * s,
        (this[9] + this[6]) * s,
        0.5 * r,
        (this[1] - this[4]) * s
      );
    }
    return [T, R, S];
  }
  invertTRS() {
    let res = new _Mat4f();
    let u = Vec3.fromArray(this, 0);
    let v = Vec3.fromArray(this, 4);
    let w = Vec3.fromArray(this, 8);
    let t = Vec3.fromArray(this, 12);
    res[0] = this[0];
    res[1] = this[4];
    res[2] = this[8];
    res[4] = this[1];
    res[5] = this[5];
    res[6] = this[9];
    res[8] = this[2];
    res[9] = this[6];
    res[10] = this[10];
    res[12] = -u.dot(t);
    res[13] = -v.dot(t);
    res[14] = -w.dot(t);
    return res;
  }
  determinant() {
    let A = new Float64Array(this);
    let P = new Int32Array(5);
    luDecomp(A, P, 4);
    return luDeterminant(A, P, 4);
  }
  invert() {
    let A = new Float64Array(this);
    let P = new Int32Array(5);
    luDecomp(A, P, 4);
    let res = new _Mat4f();
    luInvert(A, P, 4, res);
    return res;
  }
  toString() {
    let s = "\n";
    for (let i = 0; i < 4; i++) {
      s += i === 0 ? "[[" : " [";
      for (let j = 0; j < 4; j++) {
        let v = this.g(i, j);
        s += (v < 0 ? "" : " ") + v.toFixed(3) + (j === 3 ? "]" : ", ");
      }
      s += i === 3 ? "]" : "\n";
    }
    return s;
  }
};
_Mat4f.identity = new _Mat4f();
var Mat4f = _Mat4f;
function fromQuat(q, res, stride) {
  let n = q.lenSq();
  let s = n === 0 ? 0 : 2 / n;
  let x = q.x;
  let y = q.y;
  let z = q.z;
  let w = q.w;
  let o = 0;
  res[o + 0] = 1 - s * (y * y + z * z);
  res[o + 1] = s * (x * y + w * z);
  res[o + 2] = s * (x * z - w * y);
  o = stride;
  res[o + 0] = s * (x * y - w * z);
  res[o + 1] = 1 - s * (x * x + z * z);
  res[o + 2] = s * (y * z + w * x);
  o = stride * 2;
  res[o + 0] = s * (x * z + w * y);
  res[o + 1] = s * (y * z - w * x);
  res[o + 2] = 1 - s * (x * x + y * y);
}
function fromAxisAngle(axis, angleRad, res, stride) {
  let u = axis.normalize();
  let c = Math.cos(angleRad);
  let s = Math.sin(angleRad);
  let x = u.x;
  let y = u.y;
  let z = u.z;
  let c2 = 1 - c;
  let o = 0;
  res[o + 0] = x * x * c2 + c;
  res[o + 1] = y * x * c2 + z * s;
  res[o + 2] = z * x * c2 - y * s;
  o = stride;
  res[o + 0] = x * y * c2 - z * s;
  res[o + 1] = y * y * c2 + c;
  res[o + 2] = z * y * c2 + x * s;
  o = stride * 2;
  res[o + 0] = x * z * c2 + y * s;
  res[o + 1] = y * z * c2 - x * s;
  res[o + 2] = z * z * c2 + c;
}
function luDecomp(A, P, n) {
  for (let i = 0; i <= n; i++) {
    P[i] = i;
  }
  for (let i = 0; i < n; i++) {
    let maxA = 0;
    let imax = i;
    for (let k = i; k < n; k++) {
      let absA = Math.abs(A[k * n + i]);
      if (absA > maxA) {
        maxA = absA;
        imax = k;
      }
    }
    if (maxA < 1e-9) {
      return false;
    }
    if (imax !== i) {
      let j = P[i];
      P[i] = P[imax];
      P[imax] = j;
      for (let k = 0; k < n; k++) {
        let j2 = A[i * n + k];
        A[i * n + k] = A[imax * n + k];
        A[imax * n + k] = j2;
      }
      P[n] += 1;
    }
    for (let j = i + 1; j < n; j++) {
      A[j * n + i] /= A[i * n + i];
      for (let k = i + 1; k < n; k++) {
        A[j * n + k] -= A[j * n + i] * A[i * n + k];
      }
    }
  }
}
function luInvert(A, P, n, res) {
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      res[i * n + j] = P[i] === j ? 1 : 0;
      for (let k = 0; k < i; k++) {
        res[i * n + j] -= A[i * n + k] * res[k * n + j];
      }
    }
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i + 1; k < n; k++) {
        res[i * n + j] -= A[i * n + k] * res[k * n + j];
      }
      res[i * n + j] /= A[i * n + i];
    }
  }
}
function luDeterminant(A, P, n) {
  let det = A[0];
  for (let i = 1; i < n; i++) {
    det *= A[i * n + i];
  }
  if (P[n] - n & 1) {
    return -det;
  } else {
    return det;
  }
}

// features/llm-visualization/upstream/src/utils/data.ts
function makeArray(length, val) {
  return new Array(length).fill(val ?? 0);
}
function isNil(a) {
  return a === null || a === void 0;
}
function isNotNil(a) {
  return a !== null && a !== void 0;
}
function clamp(num, min, max) {
  if (num < min) {
    return min;
  } else if (num > max) {
    return max;
  }
  return num;
}
function base64ToArrayBuffer(base64) {
  let binaryString = window.atob(base64);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// features/llm-visualization/upstream/src/llm/Camera.ts
var BASE_VERTICAL_FOV_DEG = 40;
var REFERENCE_CAMERA_ASPECT = 1.6;
var MIN_NEAR_PLANE = 0.1;
var FAR_PLANE_FLOOR = 1e5;
function computeProjectionParams(cameraZoom, width, height, localDist) {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const aspect = safeWidth / safeHeight;
  const dist = Math.max(1e-3, 200 * cameraZoom);
  const near = Math.max(MIN_NEAR_PLANE, dist / 100);
  const far = localDist + Math.max(dist * 2, FAR_PLANE_FLOOR);
  const baseHalfFovRad = BASE_VERTICAL_FOV_DEG * Math.PI / 360;
  let fovDeg = BASE_VERTICAL_FOV_DEG;
  if (aspect < REFERENCE_CAMERA_ASPECT) {
    const adjustedHalfFov = Math.atan(
      Math.tan(baseHalfFovRad) * REFERENCE_CAMERA_ASPECT / aspect
    );
    fovDeg = adjustedHalfFov * 360 / Math.PI;
  }
  fovDeg = Math.min(90, Math.max(BASE_VERTICAL_FOV_DEG, fovDeg));
  return { fovDeg, aspect, near, far, dist };
}
function cameraToMatrixView(camera) {
  while (camera.angle.x < 0) camera.angle.x += 360;
  while (camera.angle.x > 360) camera.angle.x -= 360;
  let camZoom = camera.angle.z;
  let angleX = camera.angle.x * Math.PI / 180;
  let angleY = camera.angle.y * Math.PI / 180;
  let dist = 200 * camZoom;
  let camZ = dist * Math.sin(angleY);
  let camX = dist * Math.cos(angleY) * Math.cos(angleX);
  let camY = dist * Math.cos(angleY) * Math.sin(angleX);
  let camLookat = camera.center;
  let camPos = new Vec3(camX, camY, camZ).add(camLookat);
  return {
    lookAt: Mat4f.fromLookAt(camPos, camLookat, new Vec3(0, 0, 1)),
    camPos
  };
}
function genModelViewMatrices(state, layout, modelOffset = Vec3.zero) {
  let { camera } = state;
  let bb = new BoundingBox3d();
  for (let c of layout.cubes) {
    let tl = new Vec3(c.x, c.y, c.z).add(modelOffset);
    let br = new Vec3(c.x + c.dx, c.y + c.dy, c.z + c.dz).add(modelOffset);
    bb.addInPlace(tl);
    bb.addInPlace(br);
  }
  let localDist = bb.size().len();
  let { lookAt, camPos } = cameraToMatrixView(camera);
  const projection = computeProjectionParams(
    camera.angle.z,
    state.render.size.x,
    state.render.size.y,
    localDist
  );
  const persp = Mat4f.fromPersp(
    projection.fovDeg,
    projection.aspect,
    projection.near,
    projection.far
  );
  let viewMtx = persp.mul(lookAt);
  let modelMtx = new Mat4f();
  modelMtx[0] = 1;
  modelMtx[5] = 0;
  modelMtx[6] = -1;
  modelMtx[9] = -1;
  modelMtx[10] = 0;
  state.camera.modelMtx = modelMtx;
  state.camera.viewMtx = viewMtx;
  state.camera.camPos = camPos;
  state.camera.camPosModel = modelMtx.invert().mulVec3Affine(camPos);
  state.camera.lookAtMtx = lookAt;
}
function updateCamera(state, view) {
  let transition = state.camera.desiredCameraTransition;
  if (transition) {
    if (transition.t < 1) {
      transition.t = clamp(transition.t + view.dt / 600, 0, 1);
      let src = transition.initialPos;
      let dest = transition.targetPos;
      let eased = 1 - Math.pow(1 - transition.t, 3);
      state.camera.angle = src.angle.lerp(dest.angle, eased);
      state.camera.center = src.center.lerp(dest.center, eased);
      view.markDirty();
    } else {
      state.camera.desiredCameraTransition = void 0;
    }
  }
  if (state.camera.desiredCamera) {
    state.camera.desiredCameraTransition = {
      t: 0,
      initialPos: {
        center: state.camera.center,
        angle: state.camera.angle
      },
      targetPos: state.camera.desiredCamera
    };
    state.camera.desiredCamera = void 0;
    view.markDirty();
  }
}

// features/llm-visualization/upstream/src/utils/math.ts
function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}
function lerpSmoothstep(a, b, t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  return a + (b - a) * t * t * (3 - 2 * t);
}
function roundUpTo(a, b) {
  return Math.ceil(a / b) * b;
}

// features/llm-visualization/upstream/src/utils/shader.ts
function createShaderManager(gl) {
  return {
    gl,
    vertShaders: /* @__PURE__ */ new Map(),
    fragShaders: /* @__PURE__ */ new Map(),
    programs: [],
    unlinkedPrograms: []
  };
}
function createShaderProgram(manager, name, vert, frag, uniformNames, extra) {
  if ("shaderManager" in manager) {
    manager = manager.shaderManager;
  }
  let gl = manager.gl;
  let program = gl.createProgram();
  function compileAndAttachShader(type, source, typeStr, map) {
    let shader = map.get(source);
    if (!shader) {
      shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      map.set(source, shader);
    }
    gl.attachShader(program, shader);
    return shader;
  }
  let vertShader = compileAndAttachShader(gl.VERTEX_SHADER, vert, "vert", manager.vertShaders);
  let fragShader = compileAndAttachShader(gl.FRAGMENT_SHADER, frag, "frag", manager.fragShaders);
  let locs = {};
  if (uniformNames) {
    for (let name2 of uniformNames) {
      locs[name2] = -1;
    }
  }
  let prog = {
    name,
    program,
    vertSource: vert,
    fragSource: frag,
    vertShader,
    fragShader,
    locs,
    uboBindings: extra?.uboBindings ?? {},
    ready: false
  };
  manager.unlinkedPrograms.push(prog);
  return prog;
}
function ensureShadersReady(manager) {
  let gl = manager.gl;
  for (let prog of manager.unlinkedPrograms) {
    gl.linkProgram(prog.program);
  }
  for (let prog of manager.unlinkedPrograms) {
    let program = prog.program;
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      for (let name of Object.keys(prog.locs)) {
        let loc = gl.getUniformLocation(program, name);
        if (!loc) {
          console.log(`uniform of ${prog.name} not found: ${name} (may just be unused)`);
        }
        prog.locs[name] = loc;
      }
      prog.ready = true;
      for (let uboName of Object.keys(prog.uboBindings)) {
        let uboIndex = gl.getUniformBlockIndex(program, uboName);
        if (uboIndex < 0) {
          console.log(`ubo of ${prog.name} not found: ${uboName} (may just be unused)`);
        }
        gl.uniformBlockBinding(program, uboIndex, prog.uboBindings[uboName]);
      }
    } else {
      let progInfoLog = gl.getProgramInfoLog(program);
      if (progInfoLog) {
        let prefix = `---- '${prog.name}' program info log ----`;
        console.log(`${prefix}
` + gl.getProgramInfoLog(program)?.replace("\0", "").trimEnd());
      }
      logShader(prog.vertShader, prog.name, "vert");
      logShader(prog.fragShader, prog.name, "frag");
    }
  }
  manager.programs.push(...manager.unlinkedPrograms);
  manager.unlinkedPrograms = [];
  function logShader(shader, name, typeStr) {
    let infoLog = gl.getShaderInfoLog(shader);
    if (infoLog) {
      let prefix = `---- ${name} ${typeStr} shader info log ----`;
      console.log(`${prefix}
` + infoLog.replace("\0", "").trimEnd());
    }
  }
}
function bindFloatAttribs(gl, buf, opts, attribs) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  let locId = opts.locOffset || 0;
  let offset = opts.bufOffset || 0;
  let divisor = opts.divisor || 0;
  let byteStride = 0;
  for (let a of attribs) {
    byteStride += a.size * 4 * (a.nCols ?? 1);
  }
  for (let a of attribs) {
    for (let i = 0; i < (a.nCols ?? 1); i++) {
      gl.enableVertexAttribArray(locId);
      gl.vertexAttribPointer(locId, a.size, gl.FLOAT, false, byteStride, offset);
      gl.vertexAttribDivisor(locId, divisor);
      offset += a.size * 4;
      locId++;
    }
  }
  return byteStride;
}
function createFloatBuffer(gl, target, buf, capacityEls, strideBytes, sharedRender) {
  let numPhases = sharedRender?.numPhases || 1;
  if (target === gl.UNIFORM_BUFFER) {
    let uboBlockOffsetAlign = Math.max(gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT) ?? 0, 64);
    strideBytes = roundUpTo(strideBytes, uboBlockOffsetAlign);
  }
  let strideFloats = strideBytes / 4;
  gl.bindBuffer(target, buf);
  gl.bufferData(target, capacityEls * strideBytes, gl.DYNAMIC_DRAW);
  let localBufs = [];
  for (let i = 0; i < numPhases; i++) {
    localBufs.push({
      buf: new Float32Array(capacityEls * strideFloats),
      strideFloats,
      strideBytes,
      capacityEls,
      usedEls: 0,
      glOffsetEls: 0
    });
  }
  return { target, buf, strideFloats, strideBytes, glCapacityEls: capacityEls, localBufs };
}
function ensureFloatBufferSize(localBuf, countEls) {
  let newUsedEls = localBuf.usedEls + countEls;
  if (newUsedEls > localBuf.capacityEls) {
    while (newUsedEls > localBuf.capacityEls) {
      localBuf.capacityEls *= 2;
    }
    let newLocalBuf = new Float32Array(localBuf.capacityEls * localBuf.strideFloats);
    newLocalBuf.set(localBuf.buf);
    localBuf.buf = newLocalBuf;
  }
}
function uploadFloatBuffer(gl, bufMap) {
  gl.bindBuffer(bufMap.target, bufMap.buf);
  let totalUsed = 0;
  for (let i = 0; i < bufMap.localBufs.length; i++) {
    let localBuf = bufMap.localBufs[i];
    totalUsed += localBuf.usedEls;
  }
  if (totalUsed > bufMap.glCapacityEls) {
    while (totalUsed > bufMap.glCapacityEls) {
      bufMap.glCapacityEls *= 2;
    }
    gl.bufferData(bufMap.target, bufMap.glCapacityEls * bufMap.strideBytes, gl.DYNAMIC_DRAW);
  }
  let offsetEls = 0;
  for (let i = 0; i < bufMap.localBufs.length; i++) {
    let localBuf = bufMap.localBufs[i];
    localBuf.glOffsetEls = offsetEls;
    if (localBuf.usedEls > 0) {
      gl.bufferSubData(bufMap.target, offsetEls * bufMap.strideBytes, localBuf.buf.subarray(0, localBuf.usedEls * localBuf.strideFloats));
    }
    offsetEls += localBuf.usedEls;
  }
}
function resetFloatBufferMap(bufMap) {
  for (let i = 0; i < bufMap.localBufs.length; i++) {
    bufMap.localBufs[i].usedEls = 0;
  }
}
function createElementBuffer(gl, buf, capacityVerts, sharedRender) {
  let numPhases = sharedRender?.numPhases || 1;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, capacityVerts * 4, gl.DYNAMIC_DRAW);
  let localBufs = [];
  for (let i = 0; i < numPhases; i++) {
    localBufs.push({
      buf: new Uint32Array(capacityVerts),
      capacityVerts,
      usedVerts: 0,
      glOffsetBytes: 0
    });
  }
  return { buf, glCapacityVerts: capacityVerts, localBufs };
}
function ensureElementBufferSize(localBuf, countVerts) {
  let newUsedVerts = localBuf.usedVerts + countVerts;
  if (newUsedVerts > localBuf.capacityVerts) {
    let newCapacityVerts = localBuf.capacityVerts * 2;
    while (newUsedVerts > newCapacityVerts) {
      newCapacityVerts *= 2;
    }
    let newLocalBuf = new Uint32Array(newCapacityVerts);
    newLocalBuf.set(localBuf.buf);
    localBuf.capacityVerts = newCapacityVerts;
    localBuf.buf = newLocalBuf;
  }
}
function uploadElementBuffer(gl, bufMap) {
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufMap.buf);
  let totalUsed = 0;
  for (let i = 0; i < bufMap.localBufs.length; i++) {
    let localBuf = bufMap.localBufs[i];
    totalUsed += localBuf.usedVerts;
  }
  if (totalUsed > bufMap.glCapacityVerts) {
    while (totalUsed > bufMap.glCapacityVerts) {
      bufMap.glCapacityVerts *= 2;
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufMap.glCapacityVerts * 4, gl.DYNAMIC_DRAW);
  }
  let offsetIndex = 0;
  for (let i = 0; i < bufMap.localBufs.length; i++) {
    let localBuf = bufMap.localBufs[i];
    localBuf.glOffsetBytes = offsetIndex * 4;
    let srcBuf = localBuf.buf.subarray(0, localBuf.usedVerts);
    if (localBuf.usedVerts > 0) {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offsetIndex * 4, srcBuf);
    }
    offsetIndex += localBuf.usedVerts;
  }
}
function resetElementBufferMap(bufMap) {
  for (let i = 0; i < bufMap.localBufs.length; i++) {
    bufMap.localBufs[i].usedVerts = 0;
  }
}

// features/llm-visualization/upstream/src/llm/render/sharedRender.ts
var UboBindings = {
  ModelView: 0,
  Block: 1,
  BlockAccess: 2,
  blur: 3
};
var NumRenderPhases = 4;
function initSharedRender(ctx) {
  let gl = ctx.gl;
  let modelViewUbo = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, modelViewUbo);
  gl.bufferData(gl.UNIFORM_BUFFER, 2 * 16 * 4, gl.DYNAMIC_DRAW);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, UboBindings.ModelView, modelViewUbo);
  let modelViewBuf = new Float32Array(2 * 16);
  return { gl, modelViewUbo, modelViewBuf, activePhase: 0 /* Opaque */, numPhases: NumRenderPhases };
}
function writeModelViewUbo(sharedRender, modelMtx, viewMtx) {
  let { gl, modelViewUbo, modelViewBuf } = sharedRender;
  modelViewBuf.set(modelMtx, 0);
  modelViewBuf.set(viewMtx, 16);
  gl.bindBuffer(gl.UNIFORM_BUFFER, modelViewUbo);
  gl.bufferSubData(gl.UNIFORM_BUFFER, 0, modelViewBuf);
}
var modelViewUboText = (
  /*glsl*/
  `
    layout(std140) uniform ModelViewUbo {
        uniform mat4 u_model;
        uniform mat4 u_view;
    };`
);

// features/llm-visualization/upstream/src/llm/render/lineRender.ts
function createLineRender(ctx, sharedRender) {
  let gl = ctx.gl;
  let lineVao = gl.createVertexArray();
  gl.bindVertexArray(lineVao);
  let lineVbo = gl.createBuffer();
  let strideBytes = bindFloatAttribs(gl, lineVbo, {}, [
    { name: "a_position", size: 3 },
    { name: "a_lineDirA", size: 3 },
    { name: "a_lineDirB", size: 3 },
    { name: "a_color", size: 4 },
    { name: "a_thickness", size: 1 },
    { name: "a_firstPair", size: 1 },
    { name: "a_normal", size: 3 },
    { name: "a_dash", size: 1 },
    { name: "a_t", size: 1 }
  ]);
  let lineFloatBuf = createFloatBuffer(gl, gl.ARRAY_BUFFER, lineVbo, 1024, strideBytes, null);
  let lineIbo = gl.createBuffer();
  let lineIndexBuf = createElementBuffer(gl, lineIbo, 1024, sharedRender);
  let lineShader = createShaderProgram(
    ctx,
    "line",
    /*glsl*/
    `#version 300 es
        precision highp float;
        ${modelViewUboText}
        uniform vec2 u_viewSizeInv;
        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec3 a_lineDirA;
        layout(location = 2) in vec3 a_lineDirB;
        layout(location = 3) in vec4 a_color;
        layout(location = 4) in float a_thickness;
        layout(location = 5) in float a_firstPair;
        layout(location = 6) in vec3 a_normal;
        layout(location = 7) in float a_dash;
        layout(location = 8) in float a_t;
        out vec2 v_linePos;
        out vec4 v_color;
        out float v_thickness;
        out float v_dash;
        void main() {

            float mul = 1.0;
            if (gl_VertexID % 2 == 0) {
                mul = -1.0;
            }

            bool firstPair = a_firstPair > 0.0;

            float width;

            if (length(a_normal) == 0.0) {
                vec4 clipPos = u_view * u_model * vec4(a_position, 1);
                vec2 screenPos = clipPos.xy / clipPos.w;

                vec4 lineDirAClip = u_view * u_model * vec4(a_position + a_lineDirA, 1);
                vec2 lineDirA = normalize(lineDirAClip.xy / lineDirAClip.w - screenPos);
                vec4 lineDirBClip = u_view * u_model * vec4(a_position + a_lineDirB, 1);
                vec2 lineDirB = normalize(lineDirBClip.xy / lineDirBClip.w - screenPos);

                vec2 avgDir = normalize(lineDirA + lineDirB);
                vec2 activeDir = firstPair ? lineDirA : lineDirB;

                float scale = sqrt(2.0) / length(lineDirA + lineDirB);
                vec2 offset = vec2(-avgDir.y, avgDir.x);

                if (scale > 5.0) {
                    bool isOuter = cross(vec3(lineDirA, 0), vec3(lineDirB, 0)).z * mul < 0.0;
                    if (isOuter) {
                        offset = vec2(-activeDir.y, activeDir.x);
                        scale = 1.0 / sqrt(2.0);
                    } else {
                        offset = vec2(-activeDir.y, activeDir.x);
                        scale = 1.0 / sqrt(2.0);
                    }
                }

                width = a_thickness * 2.0;
                vec2 linePos = screenPos + offset * u_viewSizeInv * width * mul * scale;

                gl_Position = vec4(linePos.xy * clipPos.w, clipPos.z, clipPos.w);
                v_thickness = a_thickness;

            } else {

                width = a_thickness * 2.0;
                vec3 activeDir = firstPair ? a_lineDirA : a_lineDirB;

                vec3 avgDir = normalize(a_lineDirA + a_lineDirB);
                vec3 offset = normalize(cross(a_normal, avgDir));
                // need to scale by the amount of angle between the two line directions
                float scale = sqrt(2.0) / length(a_lineDirA + a_lineDirB);

                // if we exceed the miter limit (90 degrees), we need to clamp the line width, and draw a bevel instead.
                // the inner corner stays the same, but the outer corner is a bevel.

                if (scale > 2.0) {
                    bool isOuter = cross(a_lineDirA, a_lineDirB).z * mul < 0.0;

                    if (isOuter) {
                        offset = normalize(cross(a_normal, activeDir));
                        scale = 1.0 / sqrt(2.0);
                    }
                }

                vec3 linePos = a_position + offset * mul * width * scale;

                gl_Position = u_view * u_model * vec4(linePos, 1);
                v_thickness = 100.0;

            }

            v_dash = a_dash;
            v_color = a_color;
            v_linePos = vec2(mul * width, a_t);
        }
    `,
    /*glsl*/
    `#version 300 es
        precision highp float;
        in vec2 v_linePos;
        in vec4 v_color;
        in float v_thickness;
        in float v_dash;
        out vec4 o_color;

        void main() {
            float lineWidth = v_thickness - 1.0;
            float edge0 = lineWidth / 2.0;
            float edge1 = lineWidth / 2.0 + fwidth(v_linePos.x);
            float t = 1.0 - smoothstep(edge0, edge1, abs(v_linePos.x));

            if (v_dash > 0.0) {
                float dashPos = mod(v_linePos.y, v_dash);
                if (dashPos > v_dash / 2.0) {
                    t = 0.0;
                }
            }

            if (t == 0.0) {
                discard;
            }

            o_color = v_color * t;
        }
    `,
    [
      "u_viewSizeInv"
    ],
    { uboBindings: { "ModelViewUbo": UboBindings.ModelView } }
  );
  return {
    gl,
    vao: lineVao,
    floatBuf: lineFloatBuf,
    indexBuf: lineIndexBuf,
    lineShader,
    sharedRender
  };
}
function makeLineOpts(opts = {}) {
  return {
    thick: +(opts.thick || 1),
    color: opts.color || new Vec4(1, 1, 1, 1),
    mtx: opts.mtx || Mat4f.identity,
    n: opts.n || void 0,
    closed: opts.closed || false,
    dash: opts.dash ?? 0
  };
}
function addLine2(render, a, b, opts) {
  addLine(render, opts.thick, opts.color, a, b, opts.n, opts.mtx, opts.dash);
}
var _lineA = new Vec3();
var _lineB = new Vec3();
var _lineDir = new Vec3();
function addLine(render, thickness, color, a, b, n, mtx, dash, t) {
  let phase = render.sharedRender.activePhase;
  let floatLocalBuf = render.floatBuf.localBufs[0];
  let buf = floatLocalBuf.buf;
  let idxLocalBuf = render.indexBuf.localBufs[phase];
  let idxBuf = idxLocalBuf.buf;
  ensureFloatBufferSize(floatLocalBuf, 4);
  ensureElementBufferSize(idxLocalBuf, 5);
  if (mtx) {
    mtx.mulVec3Affine_(a, _lineA);
    mtx.mulVec3Affine_(b, _lineB);
  } else {
    _lineA.copy_(a);
    _lineB.copy_(b);
  }
  dash = dash ?? 0;
  _lineDir.x = _lineB.x - _lineA.x;
  _lineDir.y = _lineB.y - _lineA.y;
  _lineDir.z = _lineB.z - _lineA.z;
  let len = _lineDir.len();
  let dirLen = 1 / len;
  _lineDir.x *= dirLen;
  _lineDir.y *= dirLen;
  _lineDir.z *= dirLen;
  let pt = [_lineA, _lineA, _lineB, _lineB];
  n = n ?? Vec3.zero;
  let i = floatLocalBuf.usedEls * floatLocalBuf.strideFloats;
  let k = idxLocalBuf.usedVerts;
  for (let j = 0; j < 4; j++) {
    buf[i + 0] = pt[j].x;
    buf[i + 1] = pt[j].y;
    buf[i + 2] = pt[j].z;
    buf[i + 3] = _lineDir.x;
    buf[i + 4] = _lineDir.y;
    buf[i + 5] = _lineDir.z;
    buf[i + 6] = _lineDir.x;
    buf[i + 7] = _lineDir.y;
    buf[i + 8] = _lineDir.z;
    buf[i + 9] = color.x;
    buf[i + 10] = color.y;
    buf[i + 11] = color.z;
    buf[i + 12] = color.w;
    buf[i + 13] = thickness;
    buf[i + 14] = 1;
    buf[i + 15] = n.x;
    buf[i + 16] = n.y;
    buf[i + 17] = n.z;
    buf[i + 18] = dash;
    buf[i + 19] = j < 2 ? 0 : len;
    i += floatLocalBuf.strideFloats;
    idxBuf[k + j] = floatLocalBuf.usedEls + j;
  }
  idxBuf[k + 4] = 4294967295;
  floatLocalBuf.usedEls += 4;
  idxLocalBuf.usedVerts += 5;
}
var _lineSegBufs = new Float32Array(2 * 3);
var _dir = _lineSegBufs.subarray(0, 3);
var _prevDir = _lineSegBufs.subarray(3, 6);
var _ptsTransformed = new Float32Array(0);
function drawLineSegs(render, pts, opts) {
  let phase = render.sharedRender.activePhase;
  let floatLocalBuf = render.floatBuf.localBufs[0];
  let buf = floatLocalBuf.buf;
  let idxLocalBuf = render.indexBuf.localBufs[phase];
  let idxBuf = idxLocalBuf.buf;
  let ptsLen = pts.length;
  let n = (opts.n ?? Vec3.zero).clone();
  if (opts.mtx) {
    if (_ptsTransformed.length < pts.length) {
      _ptsTransformed = new Float32Array(pts.length);
    }
    for (let i = 0; i < pts.length; i += 3) {
      opts.mtx.mulVec3AffineArr_(pts, i, _ptsTransformed, i);
    }
    pts = _ptsTransformed;
    opts.mtx.mulVec3AffineVec_(n, n);
  }
  let nPts = ptsLen / 3 + (opts.closed ? 1 : 0);
  ensureFloatBufferSize(floatLocalBuf, nPts * 4);
  ensureElementBufferSize(idxLocalBuf, nPts * 4 + 1);
  if (opts.closed) {
    Vec3Buf.sub_(pts, 0, pts, ptsLen - 3, _prevDir, 0);
    Vec3Buf.normalize_(_prevDir, 0, _prevDir, 0);
  }
  let dash = opts.dash ?? 0;
  let cx = opts.color.x;
  let cy = opts.color.y;
  let cz = opts.color.z;
  let cw = opts.color.w;
  let thick = opts.thick;
  let nx = n.x;
  let ny = n.y;
  let nz = n.z;
  let linePos = 0;
  for (let i = 0; i < nPts; i++) {
    let pOff = i * 3;
    if (opts.closed && i === nPts - 1) {
      pOff = 0;
    }
    let segLen = 0;
    if (!opts.closed && i < nPts - 1 || opts.closed && i !== nPts - 2) {
      Vec3Buf.sub_(pts, pOff + 3, pts, pOff, _dir, 0);
      segLen = Vec3Buf.len_(_dir, 0);
      Vec3Buf.normalize_(_dir, 0, _dir, 0);
    } else if (opts.closed && i === nPts - 2) {
      Vec3Buf.sub_(pts, 0, pts, ptsLen - 3, _dir, 0);
      segLen = Vec3Buf.len_(_dir, 0);
      Vec3Buf.normalize_(_dir, 0, _dir, 0);
    }
    let bufOff = floatLocalBuf.usedEls * floatLocalBuf.strideFloats;
    let idxOff = idxLocalBuf.usedVerts;
    let dirA = i == 0 && !opts.closed ? _dir : _prevDir;
    let dirB = i == nPts - 1 && !opts.closed ? _prevDir : _dir;
    let idxCount = opts.closed && i === nPts - 1 ? 2 : 4;
    for (let j = 0; j < idxCount; j++) {
      Vec3Buf.copy_(pts, pOff, buf, bufOff);
      Vec3Buf.copy_(dirA, 0, buf, bufOff + 3);
      Vec3Buf.copy_(dirB, 0, buf, bufOff + 6);
      buf[bufOff + 9] = cx;
      buf[bufOff + 10] = cy;
      buf[bufOff + 11] = cz;
      buf[bufOff + 12] = cw;
      buf[bufOff + 13] = thick;
      buf[bufOff + 14] = j > 2 ? 0 : 1;
      buf[bufOff + 15] = nx;
      buf[bufOff + 16] = ny;
      buf[bufOff + 17] = nz;
      buf[bufOff + 18] = dash;
      buf[bufOff + 19] = linePos;
      bufOff += floatLocalBuf.strideFloats;
      idxBuf[idxOff + j] = floatLocalBuf.usedEls + j;
    }
    floatLocalBuf.usedEls += idxCount;
    idxLocalBuf.usedVerts += idxCount;
    linePos += segLen;
    Vec3Buf.copy_(_dir, 0, _prevDir, 0);
  }
  idxBuf[idxLocalBuf.usedVerts] = 4294967295;
  idxLocalBuf.usedVerts += 1;
}
function uploadAllLines(render) {
  let gl = render.gl;
  uploadFloatBuffer(gl, render.floatBuf);
  uploadElementBuffer(gl, render.indexBuf);
}
function renderAllLines(render, renderPhase) {
  let gl = render.gl;
  let localIdxBuf = render.indexBuf.localBufs[renderPhase];
  if (localIdxBuf.usedVerts === 0) {
    return;
  }
  gl.disable(gl.CULL_FACE);
  gl.depthMask(false);
  gl.useProgram(render.lineShader.program);
  gl.bindVertexArray(render.vao);
  let locs = render.lineShader.locs;
  gl.uniform2f(locs.u_viewSizeInv, 1 / gl.canvas.width, 1 / gl.canvas.height);
  gl.drawElements(gl.TRIANGLE_STRIP, localIdxBuf.usedVerts, gl.UNSIGNED_INT, localIdxBuf.glOffsetBytes);
  gl.depthMask(true);
}
function resetLineRender(render) {
  resetFloatBufferMap(render.floatBuf);
  resetElementBufferMap(render.indexBuf);
}

// features/llm-visualization/upstream/src/llm/render/triRender.ts
function initTriRender(ctx, sharedRender) {
  let gl = ctx.gl;
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  let triVbo = gl.createBuffer();
  let byteStride = bindFloatAttribs(gl, triVbo, {}, [
    { name: "a_pos", size: 3 },
    { name: "a_normal", size: 3 },
    { name: "a_color", size: 4 },
    { name: "a_uv", size: 2 }
  ]);
  let triFloatBuf = createFloatBuffer(gl, gl.ARRAY_BUFFER, triVbo, 1024, byteStride, null);
  let triIbo = gl.createBuffer();
  let triIndexBuf = createElementBuffer(gl, triIbo, 1024, sharedRender);
  let triShader = createShaderProgram(
    ctx,
    "triangles",
    /*glsl*/
    `#version 300 es
        precision highp float;
        ${modelViewUboText}
        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec3 a_normal;
        layout(location = 2) in vec4 a_color;
        layout(location = 3) in vec2 a_uv;
        out vec4 v_color;
        out vec2 v_uv;
        out vec3 v_normal;
        void main() {
            gl_Position = u_view * u_model * vec4(a_position, 1);
            v_color = a_color;
            v_normal = a_normal;
            v_uv = a_uv;
        }
    `,
    /*glsl*/
    `#version 300 es
        precision highp float;
        in vec2 v_uv;
        in vec3 v_normal;
        in vec4 v_color;
        out vec4 o_color;

        void main() {
            o_color = v_color;
        }
    `,
    [],
    { uboBindings: { "ModelViewUbo": UboBindings.ModelView } }
  );
  return {
    gl,
    vao,
    vbo: triFloatBuf,
    ibo: triIndexBuf,
    triShader,
    sharedRender
  };
}
var defaultN = new Vec3(0, 0, 1);
var _vertP = new Vec3();
var _vertN = new Vec3();
function addVert(render, p, color, n, mtx) {
  let phase = render.sharedRender.activePhase;
  let vbo = render.vbo.localBufs[0];
  let ibo = render.ibo.localBufs[phase];
  ensureFloatBufferSize(vbo, 1);
  ensureElementBufferSize(ibo, 1);
  let fBuf = vbo.buf;
  let iBuf = ibo.buf;
  let fIdx = vbo.usedEls * vbo.strideFloats;
  let iIdx = ibo.usedVerts;
  if (mtx) {
    mtx.mulVec3Affine_(p, _vertP);
    mtx.mulVec3AffineVec_(n || defaultN, _vertN);
  } else {
    _vertP.copy_(p);
    _vertN.copy_(n || defaultN);
  }
  fBuf[fIdx + 0] = _vertP.x;
  fBuf[fIdx + 1] = _vertP.y;
  fBuf[fIdx + 2] = _vertP.z;
  fBuf[fIdx + 3] = _vertN.x;
  fBuf[fIdx + 4] = _vertN.y;
  fBuf[fIdx + 5] = _vertN.z;
  fBuf[fIdx + 6] = color.x;
  fBuf[fIdx + 7] = color.y;
  fBuf[fIdx + 8] = color.z;
  fBuf[fIdx + 9] = color.w;
  fBuf[fIdx + 10] = 0;
  fBuf[fIdx + 11] = 0;
  iBuf[iIdx] = vbo.usedEls;
  vbo.usedEls += 1;
  ibo.usedVerts += 1;
}
var _quadTr = new Vec3();
var _quadBl = new Vec3();
function addQuad(render, tl, br, color, mtx, isEnd = true) {
  _quadTr.x = br.x;
  _quadTr.y = tl.y;
  _quadTr.z = tl.z;
  _quadBl.x = tl.x;
  _quadBl.y = br.y;
  _quadBl.z = br.z;
  addVert(render, tl, color, void 0, mtx);
  addVert(render, _quadBl, color, void 0, mtx);
  addVert(render, _quadTr, color, void 0, mtx);
  addVert(render, br, color, void 0, mtx);
  if (isEnd) {
    let phase = render.sharedRender.activePhase;
    let localBuf = render.ibo.localBufs[phase];
    ensureElementBufferSize(localBuf, 1);
    localBuf.buf[localBuf.usedVerts++] = 4294967295;
  }
}
function addPrimitiveRestart(render) {
  let phase = render.sharedRender.activePhase;
  let localBuf = render.ibo.localBufs[phase];
  ensureElementBufferSize(localBuf, 1);
  localBuf.buf[localBuf.usedVerts++] = 4294967295;
}
function uploadAllTris(render) {
  let gl = render.gl;
  uploadFloatBuffer(gl, render.vbo);
  uploadElementBuffer(gl, render.ibo);
}
function renderAllTris(render, renderPhase) {
  let gl = render.gl;
  let localIdxBuf = render.ibo.localBufs[renderPhase];
  if (localIdxBuf.usedVerts === 0) {
    return;
  }
  gl.depthMask(renderPhase === 0 /* Opaque */);
  gl.disable(gl.CULL_FACE);
  gl.useProgram(render.triShader.program);
  gl.bindVertexArray(render.vao);
  gl.drawElements(gl.TRIANGLE_STRIP, localIdxBuf.usedVerts, gl.UNSIGNED_INT, localIdxBuf.glOffsetBytes);
  gl.depthMask(true);
}
function resetTriRender(render) {
  resetElementBufferMap(render.ibo);
  resetFloatBufferMap(render.vbo);
}

// features/llm-visualization/upstream/src/utils/bezier.ts
var _cacheRes = new Float32Array(1024 * 3);
function bezierCurveBuild(p0, p1, p2, p3, threshold) {
  let res = _cacheRes;
  let resOff = 0;
  let queue = [];
  function push(p02, p12, p22, p32) {
    queue.push({ p0: p02, p1: p12, p2: p22, p3: p32 });
  }
  push(p0, p1, p2, p3);
  p3.writeToBuf(res, resOff);
  resOff += 3;
  let iter = 0;
  while (queue.length > 0) {
    let { p0: p02, p1: p12, p2: p22, p3: p32 } = queue.pop();
    let q0 = p02.mid(p12);
    let q1 = p12.mid(p22);
    let q2 = p22.mid(p32);
    let r0 = q0.mid(q1);
    let r1 = q1.mid(q2);
    let s0 = r0.mid(r1);
    let d03 = p32.sub(p02);
    let d31 = p12.sub(p32);
    let d32 = p22.sub(p32);
    let d2a = Math.abs(d31.y * d03.z - d31.z * d03.y);
    let d2b = Math.abs(d32.y * d03.z - d32.z * d03.y);
    let needsSubdivion = (d2a + d2b) * (d2a + d2b) > threshold * d03.lenSq();
    if (needsSubdivion) {
      push(p02, q0, r0, s0);
      push(s0, r1, q2, p32);
    } else {
      if (resOff + 6 > res.length) {
        let newRes = new Float32Array(res.length * 2);
        newRes.set(res);
        res = newRes;
      }
      p02.writeToBuf(res, resOff);
      resOff += 3;
    }
    iter++;
  }
  _cacheRes = res;
  return res.slice(0, resOff);
}

// features/llm-visualization/theme.ts
var DEVELO_LLM_VIZ_THEME = {
  text: Vec4.fromHexColor("#ffffff"),
  muted: Vec4.fromHexColor("#b9b9b9"),
  token: Vec4.fromHexColor("#969aff"),
  embedding: Vec4.fromHexColor("#676adb"),
  q: Vec4.fromHexColor("#969aff"),
  k: Vec4.fromHexColor("#676adb"),
  v: Vec4.fromHexColor("#b8baff"),
  attention: Vec4.fromHexColor("#969aff"),
  residual: Vec4.fromHexColor("#b9b9b9"),
  mlp: Vec4.fromHexColor("#d8400e"),
  output: Vec4.fromHexColor("#ffffff"),
  border: Vec4.fromHexColor("#969696"),
  panel: Vec4.fromHexColor("#050505")
};

// features/llm-visualization/upstream/src/llm/components/Arrow.ts
function drawAllArrows(state, layout) {
  let pad = 2;
  let prevResid = layout.residual0;
  let residWidth = 6;
  let weightColor = DEVELO_LLM_VIZ_THEME.embedding;
  let dataColor = DEVELO_LLM_VIZ_THEME.mlp;
  drawVertArrow(layout.idxObj, layout.residual0);
  drawHorizArrow(layout.tokEmbedObj, layout.residual0);
  drawArrowBetween(layout.posEmbedObj, 0 /* Left */, layout.residual0, 1 /* Right */);
  for (let i = 0; i < 3; i++) {
    let block = layout.blocks[i];
    drawVertArrow(prevResid, block.attnResidual);
    drawArrowResidSplit(prevResid, block.ln1.lnResid);
    drawArrowResidSplit(prevResid, block.ln1.lnAgg2, 2);
    drawVertArrow(block.ln1.lnAgg2, block.ln1.lnResid, 2);
    for (let head of block.heads) {
      drawArrowBetween(block.ln1.lnResid, 0 /* Left */, head.qBlock, 1 /* Right */);
      drawArrowBetween(block.ln1.lnResid, 0 /* Left */, head.kBlock, 1 /* Right */);
      drawArrowBetween(block.ln1.lnResid, 0 /* Left */, head.vBlock, 1 /* Right */);
      drawHorizArrow(head.qBiasBlock, head.qWeightBlock);
      drawHorizArrow(head.kBiasBlock, head.kWeightBlock);
      drawHorizArrow(head.vBiasBlock, head.vWeightBlock);
      drawHorizArrow(head.qWeightBlock, head.qBlock);
      drawHorizArrow(head.kWeightBlock, head.kBlock);
      drawHorizArrow(head.vWeightBlock, head.vBlock);
      drawArrowBotToSide(head.qBlock, head.attnMtx, 0, void 0, head.qBlock.y !== head.kBlock.y);
      drawArrowBotToSide(head.kBlock, head.attnMtx, 0, void 0, head.kBlock.y !== head.qBlock.y);
      drawArrowBotToSide(head.vBlock, head.vOutBlock, 0, void 0, head.vBlock.y !== head.kBlock.y);
      drawArrowBetween(head.attnMtx, 0 /* Left */, head.attnMtxAgg2, 1 /* Right */);
      drawArrowBetween(head.attnMtxAgg1, 0 /* Left */, head.attnMtxSm, 1 /* Right */);
      drawArrowBetween(head.attnMtxSm, 3 /* Bot */, head.vOutBlock, 0 /* Left */);
      drawArrowBetween(head.vOutBlock, 3 /* Bot */, block.attnOut, 2 /* Top */);
    }
    drawVertArrow(block.attnResidual, block.mlpResidual);
    drawHorizArrow(block.attnOut, block.attnResidual);
    drawHorizArrow(block.projBias, block.projWeight);
    drawHorizArrow(block.projWeight, block.attnOut);
    drawHorizArrow(block.ln1.lnMu, block.ln1.lnSigma);
    drawHorizArrow(block.ln1.lnSigma, block.ln1.lnResid);
    drawArrowResidSplit(block.attnResidual, block.ln2.lnAgg2, 2);
    drawVertArrow(block.ln2.lnAgg2, block.ln2.lnResid, 2);
    drawHorizArrow(block.ln2.lnMu, block.ln2.lnSigma);
    drawHorizArrow(block.ln2.lnSigma, block.ln2.lnResid);
    drawArrowResidSplit(block.attnResidual, block.ln2.lnResid);
    drawArrowBetween(block.ln2.lnResid, 3 /* Bot */, block.mlpFc, 1 /* Right */);
    drawVertArrow(block.mlpFcBias, block.mlpFcWeight);
    drawVertArrow(block.mlpFcWeight, block.mlpFc, 12);
    drawVertArrow(block.mlpFc, block.mlpAct, 12);
    drawHorizArrow(block.mlpProjBias, block.mlpProjWeight);
    drawHorizArrow(block.mlpProjWeight, block.mlpResult);
    drawHorizArrow(block.mlpResult, block.mlpResidual);
    drawArrowBetween(block.mlpAct, 1 /* Right */, block.mlpResult, 2 /* Top */);
    prevResid = block.mlpResidual;
  }
  drawArrowResidSplit(prevResid, layout.ln_f.lnAgg2, 2);
  drawArrowBetween(prevResid, 3 /* Bot */, layout.ln_f.lnResid, 1 /* Right */);
  drawVertArrow(layout.ln_f.lnAgg2, layout.ln_f.lnResid);
  drawHorizArrow(layout.ln_f.lnMu, layout.ln_f.lnSigma);
  drawHorizArrow(layout.ln_f.lnSigma, layout.ln_f.lnResid);
  if (layout.logitsTransposed) {
    drawArrowBetween(layout.ln_f.lnResid, 3 /* Bot */, layout.logits, 1 /* Right */);
    drawVertArrow(layout.lmHeadWeight, layout.logits);
    drawVertArrow(layout.logits, layout.logitsSoftmax);
    drawHorizArrow(layout.logits, layout.logitsAgg1, 2);
    drawArrowBetween(layout.logitsAgg2, 3 /* Bot */, layout.logitsSoftmax, 1 /* Right */, 2);
  } else {
    drawVertArrow(layout.ln_f.lnResid, layout.logits);
    drawHorizArrow(layout.lmHeadWeight, layout.logits);
    drawVertArrow(layout.logits, layout.logitsAgg2);
    drawVertArrow(layout.logitsAgg1, layout.logitsSoftmax);
  }
  function blkColor(src) {
    return src.t === "w" ? weightColor : dataColor;
  }
  function drawVertArrow(src, dest, width = 6) {
    drawArrowBetween(src, 3 /* Bot */, dest, 2 /* Top */, width);
  }
  function drawHorizArrow(src, dest, width = 6) {
    drawArrowBetween(src, 1 /* Right */, dest, 0 /* Left */, width);
  }
  function blockPos(block, pos) {
    let z = block.z + block.dz / 2;
    switch (pos) {
      case 0 /* Left */:
        return new Vec3(block.x - pad, block.y + block.dy / 2, z);
      case 1 /* Right */:
        return new Vec3(block.x + block.dx + pad, block.y + block.dy / 2, z);
      case 2 /* Top */:
        return new Vec3(block.x + block.dx / 2, block.y - pad, z);
      case 3 /* Bot */:
        return new Vec3(block.x + block.dx / 2, block.y + block.dy + pad, z);
    }
  }
  function drawArrowResidSplit(src, dest, width = 6) {
    let start = blockPos(src, 3 /* Bot */);
    let end = blockPos(dest, 1 /* Right */);
    let opacity = Math.min(src.opacity, dest.opacity);
    if (opacity === 0) {
      return;
    }
    let normal = new Vec3(0, 0, 1);
    let color = blkColor(src).mul(opacity);
    let mid1 = new Vec3(start.x - residWidth / 2, end.y);
    drawArrow(state, mid1, end, width, normal, color, true);
  }
  function drawArrowBotToSide(src, dest, offset, width = 6, forceOffset = false) {
    let start = blockPos(src, 3 /* Bot */);
    let left = start.z > dest.z + dest.dz / 2;
    let end = new Vec3(dest.x + dest.dx / 2, dest.y + layout.cell * (offset + 0.5), left ? dest.z + dest.dz / 2 + pad : dest.z - pad);
    let opacity = Math.min(src.opacity, dest.opacity);
    if (opacity === 0) {
      return;
    }
    let normal = new Vec3(0, 0, 1);
    let color = blkColor(src).mul(opacity);
    let endDir = new Vec3(0, 0, left ? -1 : 1);
    let areClose = Math.abs(start.z - (dest.z + dest.dz / 2)) < 1;
    if (areClose && !forceOffset) {
      endDir = void 0;
      end = blockPos(dest, 2 /* Top */);
    }
    drawArrow(state, start, end, width, normal, color, true, 0 /* None */, endDir);
  }
  function drawArrowBetween(src, srcPos, dest, destPos, width = 6) {
    let start = blockPos(src, srcPos);
    let end = blockPos(dest, destPos);
    let opacity = Math.min(src.opacity, dest.opacity);
    if (opacity === 0) {
      return;
    }
    let normal = new Vec3(0, 0, 1);
    let color = blkColor(src).mul(opacity);
    if (srcPos === 0 /* Left */ && destPos === 1 /* Right */) {
      start.y = end.y;
    }
    if (srcPos === 1 /* Right */ && destPos === 2 /* Top */) {
      let mid0 = new Vec3(end.x - width / 2, start.y, start.z);
      let mid1 = new Vec3(end.x, start.y + width / 2, end.z);
      drawArrow(state, start, mid0, width, normal, color, false);
      drawArrow(state, mid1, end, width, normal, color, true, 1 /* Left */);
    } else if (srcPos === 3 /* Bot */ && destPos === 1 /* Right */) {
      let mid0 = new Vec3(start.x, end.y - width / 2, end.z);
      let mid1 = new Vec3(start.x - width / 2, end.y, end.z);
      drawArrow(state, start, mid0, width, normal, color, false);
      drawArrow(state, mid1, end, width, normal, color, true, 1 /* Left */);
    } else if (srcPos === 3 /* Bot */ && destPos === 0 /* Left */) {
      let mid0 = new Vec3(start.x, end.y - width / 2, end.z);
      let mid1 = new Vec3(start.x + width / 2, end.y, end.z);
      drawArrow(state, start, mid0, width, normal, color, false, 0 /* None */, new Vec3(0, 1, 0));
      drawArrow(state, mid1, end, width, normal, color, true, 2 /* Right */);
    } else {
      drawArrow(state, start, end, width, normal, color, true);
    }
  }
}
var _bezierLineBuf = new Float32Array(4 * 3);
function drawArrow(state, start, end, width, normal, color, drawHead = true, drawCorner = 0 /* None */, endDir) {
  let dir = end.sub(start);
  dir.z = 0;
  dir = dir.normalize();
  let len = end.sub(start).len();
  let headExtra = 3;
  let headDepth = drawHead ? Math.min(len * 0.7, headExtra * 1) : 0;
  let mtx = new Mat4f();
  let side = Vec3.cross(dir, normal).mul(-1).normalize();
  normal = Vec3.cross(side, dir).normalize();
  mtx[0] = side.x;
  mtx[1] = side.y;
  mtx[2] = side.z;
  mtx[4] = dir.x;
  mtx[5] = dir.y;
  mtx[6] = dir.z;
  mtx[8] = normal.x;
  mtx[9] = normal.y;
  mtx[10] = normal.z;
  start = mtx.mulVec3Proj(start);
  end = mtx.mulVec3Proj(end);
  let borderColor = color.mul(0.8);
  let ribbonColor = color.mul(0.3);
  let opts = {
    width,
    borderColor,
    ribbonColor,
    headDepth,
    headExtra,
    lineThick: 1.2,
    mtx
  };
  endDir = endDir ? mtx.mulVec3ProjVec(endDir) : void 0;
  function drawBezierRibbon() {
    let dist = Math.max(headDepth, Math.abs(start.y - end.y - headDepth) / 2);
    let p0 = new Vec3(start.x, start.y, start.z);
    let p1 = new Vec3(start.x, start.y + dist, start.z);
    let p2 = new Vec3(end.x, end.y - headDepth - dist, end.z);
    let p3 = new Vec3(end.x, end.y - headDepth, end.z);
    if (endDir) {
      p2 = end.mulAdd(endDir, -headDepth - dist);
      p3 = end.mulAdd(endDir, -headDepth);
    }
    let steps = bezierCurveBuild(p0, p1, p2, p3, 0.1);
    let nPts = steps.length / 3;
    let headNPts = drawHead ? 3 : 0;
    let nFloats = (nPts * 2 + headNPts) * 3;
    if (_bezierLineBuf.length < nFloats) {
      _bezierLineBuf = new Float32Array(nFloats);
    }
    let arrowLine = _bezierLineBuf.subarray(0, nFloats);
    for (let i = 0; i < nPts - 1; i++) {
      let p02 = new Vec3(steps[i * 3 + 0], steps[i * 3 + 1], steps[i * 3 + 2]);
      let p12 = new Vec3(steps[i * 3 + 3], steps[i * 3 + 4], steps[i * 3 + 5]);
      drawArrowSeg(state, p02, p12, opts);
    }
    let arrowStartIdx = nPts;
    let arrowEndIdx = arrowStartIdx + headNPts;
    for (let i = 0; i < nPts; i++) {
      let j = arrowEndIdx + i;
      arrowLine[j * 3 + 0] = steps[i * 3 + 0] + opts.width / 2;
      arrowLine[j * 3 + 1] = steps[i * 3 + 1];
      arrowLine[j * 3 + 2] = steps[i * 3 + 2];
      let k = nPts - i - 1;
      arrowLine[k * 3 + 0] = steps[i * 3 + 0] - opts.width / 2;
      arrowLine[k * 3 + 1] = steps[i * 3 + 1];
      arrowLine[k * 3 + 2] = steps[i * 3 + 2];
    }
    if (drawHead) {
      let headExtra2 = 3;
      endDir = endDir ?? new Vec3(0, 1, 0);
      let endA = end.mulAdd(endDir, -headDepth);
      let i = arrowStartIdx;
      arrowLine[i * 3 + 0] = endA.x - opts.width / 2 - headExtra2;
      arrowLine[i * 3 + 1] = endA.y;
      arrowLine[i * 3 + 2] = endA.z;
      i += 1;
      arrowLine[i * 3 + 0] = end.x;
      arrowLine[i * 3 + 1] = end.y;
      arrowLine[i * 3 + 2] = end.z;
      i += 1;
      arrowLine[i * 3 + 0] = endA.x + opts.width / 2 + headExtra2;
      arrowLine[i * 3 + 1] = endA.y;
      arrowLine[i * 3 + 2] = endA.z;
    }
    let lineOpts = makeLineOpts({ thick: opts.lineThick, mtx: opts.mtx, color: opts.borderColor });
    drawLineSegs(state.lineRender, arrowLine, lineOpts);
  }
  if (Math.abs(start.z - end.z) > 0.01 || endDir) {
    drawBezierRibbon();
  } else {
    drawArrowSeg(state, start, end.sub(new Vec3(0, headDepth)), opts);
  }
  if (drawCorner !== 0 /* None */) {
    drawArrowCorner(state, start.sub(new Vec3(0, width / 2)), drawCorner, opts);
  }
  if (drawHead) {
    endDir = endDir ?? new Vec3(0, 1, 0);
    drawArrowHead(state, end.mulAdd(endDir, -headDepth), end, opts);
  }
}
var _segTl = new Vec3();
var _segBr = new Vec3();
var _segBl = new Vec3();
var _segTr = new Vec3();
function drawArrowSeg(state, start, end, opts) {
  _segTl.x = start.x - opts.width / 2;
  _segTl.y = start.y;
  _segTl.z = start.z;
  _segBr.x = end.x + opts.width / 2;
  _segBr.y = end.y;
  _segBr.z = end.z;
  addQuad(state.triRender, _segTl, _segBr, opts.ribbonColor, opts.mtx);
}
var _headTl = new Vec3();
var _headTr = new Vec3();
var _headBr = new Vec3();
var _headLeft = new Vec3();
var _headRight = new Vec3();
var _headTip = new Vec3();
var _headN = new Vec3(0, 0, 1);
function drawArrowHead(state, a, b, opts) {
  let headExtra = 3;
  _headTl.copy_(a);
  _headTl.x -= opts.width / 2;
  _headTr.copy_(a);
  _headTr.x += opts.width / 2;
  _headBr.copy_(b);
  _headBr.x += opts.width / 2;
  _headLeft.copy_(a);
  _headLeft.x = _headTl.x - headExtra;
  _headRight.copy_(a);
  _headRight.x = _headBr.x + headExtra;
  _headTip.copy_(b);
  _headTip.x = _headTl.x + opts.width / 2;
  addVert(state.triRender, _headLeft, opts.ribbonColor, _headN, opts.mtx);
  addVert(state.triRender, _headTip, opts.ribbonColor, _headN, opts.mtx);
  addVert(state.triRender, _headRight, opts.ribbonColor, _headN, opts.mtx);
  addPrimitiveRestart(state.triRender);
}
var _cornerPivot = new Vec3();
var _cornerN = new Vec3(0, 0, 1);
var _cornerCurrP = new Vec3();
var _cornerPrevP = new Vec3();
function drawArrowCorner(state, center, mode, opts) {
  let mul = mode === 1 /* Left */ ? 1 : -1;
  _cornerPivot.x = center.x + opts.width / 2 * mul;
  _cornerPivot.y = center.y + opts.width / 2;
  _cornerPivot.z = center.z;
  _cornerCurrP.z = center.z;
  _cornerPrevP.z = center.z;
  let count = 8;
  for (let i = 0; i < count; i++) {
    let theta = i / (count - 1) * Math.PI / 2;
    let c = opts.width * Math.cos(theta) * mul;
    let s = opts.width * Math.sin(theta);
    _cornerCurrP.x = _cornerPivot.x - c;
    _cornerCurrP.y = _cornerPivot.y - s;
    addVert(state.triRender, _cornerCurrP, opts.ribbonColor, _cornerN, opts.mtx);
    addVert(state.triRender, _cornerPivot, opts.ribbonColor, _cornerN, opts.mtx);
    if (i > 0) {
    }
    let tmp = _cornerPrevP;
    _cornerPrevP = _cornerCurrP;
    _cornerCurrP = tmp;
  }
  addPrimitiveRestart(state.triRender);
}

// features/llm-visualization/upstream/src/llm/render/fontRender.ts
var floatsPerSegment = 16 + 4;
var floatsPerVert = 5;
var bytesPerVert = floatsPerVert * 4;
var texWidth = 1024;
async function fetchFontAtlasData(signal) {
  let imgEl = document.createElement("img");
  let imgP = new Promise((resolve, reject) => {
    imgEl.onload = () => resolve(imgEl);
    imgEl.onerror = () => reject(new Error("[llm-viz] Failed to load font atlas image"));
  });
  const imgResp = await fetchRequiredAsset(`${LLM_VIZ_ASSET_BASE}/fonts/font-atlas.png`, signal);
  const imgBlob = await imgResp.blob();
  imgEl.src = URL.createObjectURL(imgBlob);
  let fontDefP = fetchJsonAsset(`${LLM_VIZ_ASSET_BASE}/fonts/font-def.json`, signal);
  let [fontAtlasImage, fontDef] = await Promise.all([imgP, fontDefP]);
  return {
    fontAtlasImage,
    fontDef
  };
}
function setupFontAtlas(ctx, data) {
  let gl = ctx.gl;
  let fontDef = data.fontDef;
  let atlasTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, atlasTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data.fontAtlasImage);
  let program = createShaderProgram(
    ctx.shaderManager,
    "font",
    /*glsl*/
    `#version 300 es
        precision highp float;
        ${modelViewUboText}
        uniform sampler2D u_transformTex;
        layout (location = 0) in vec2 a_position;
        layout (location = 1) in vec2 a_uv;
        layout (location = 2) in float a_textId;
        out vec2 v_uv;
        out vec4 v_fgColor;
        out vec4 v_bgColor;

        void main() {
            int texWidth = textureSize(u_transformTex, 0).x;
            int texOffset = int(a_textId) * ${floatsPerSegment / 4};
            int y = texOffset / texWidth;
            int x = texOffset % texWidth;
            vec4 t0 = texelFetch(u_transformTex, ivec2(x + 0, y), 0);
            vec4 t1 = texelFetch(u_transformTex, ivec2(x + 1, y), 0);
            vec4 t2 = texelFetch(u_transformTex, ivec2(x + 2, y), 0);
            vec4 t3 = texelFetch(u_transformTex, ivec2(x + 3, y), 0);
            vec4 c = texelFetch(u_transformTex, ivec2(x + 4, y), 0);
            mat4 transform = mat4(t0, t1, t2, t3);

            gl_Position = u_view * u_model * transform * vec4(a_position, 0.0, 1.0);
            v_uv = a_uv;
            v_fgColor = c;
            v_bgColor = vec4(0, 0, 0, 0);
        }

    `,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D u_tex;
        uniform float pxRange; // set to distance field's pixel range
        in vec2 v_uv;
        in vec4 v_fgColor;
        in vec4 v_bgColor;
        out vec4 color;

        float median(float r, float g, float b) {
            return max(min(r, g), min(max(r, g), b));
        }

        float screenPxRange() {
            vec2 unitRange = vec2(pxRange) / vec2(textureSize(u_tex, 0));
            vec2 screenTexSize = vec2(1.0) / fwidth(v_uv);
            return max(0.5*dot(unitRange, screenTexSize), 1.0);
        }

        void main() {
            vec3 msd = texture(u_tex, v_uv).rgb;
            float sd = median(msd.r, msd.g, msd.b);
            float screenRange = screenPxRange();
            float screenPxDistance = screenRange*(sd - 0.5);
            float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);

            float blurOpacity = 0.0; //smoothstep(0.5 - 0.4, 0.5, sd);

            if (opacity == 0.0 && blurOpacity == 0.0) {
                discard;
            }
            color = mix(vec4(0,0,0,1.0) * blurOpacity, v_fgColor, opacity);
        }
    `,
    ["u_tex", "u_transformTex", "pxRange"],
    { uboBindings: { "ModelViewUbo": UboBindings.ModelView } }
  );
  ensureShadersReady(ctx.shaderManager);
  let locs = program.locs;
  gl.useProgram(program.program);
  gl.uniform1i(locs.u_tex, 0);
  gl.uniform1i(locs.u_transformTex, 1);
  let faceInfos = [];
  for (let face of fontDef.faces) {
    let charArr = new Int16Array(base64ToArrayBuffer(face.chars));
    let perCharSize = 12;
    let numChars = charArr.length / perCharSize;
    let charMap = /* @__PURE__ */ new Map();
    let charCodeMap = /* @__PURE__ */ new Map();
    let chars = [];
    for (let i = 0; i < numChars; i++) {
      let offset = i * perCharSize;
      let char = {
        id: charArr[offset + 0],
        index: charArr[offset + 1],
        char: String.fromCharCode(charArr[offset + 2]),
        x: charArr[offset + 3],
        y: charArr[offset + 4],
        width: charArr[offset + 5],
        height: charArr[offset + 6],
        xoffset: charArr[offset + 7],
        yoffset: charArr[offset + 8],
        xadvance: charArr[offset + 9],
        page: charArr[offset + 10],
        chnl: charArr[offset + 11]
      };
      charMap.set(char.char, char);
      charCodeMap.set(char.id, char);
      chars.push(char);
    }
    let kernArr = new Int16Array(base64ToArrayBuffer(face.kernings));
    let perKernSize = 3;
    let numKerns = kernArr.length / perKernSize;
    let kernMap = /* @__PURE__ */ new Map();
    for (let i = 0; i < numKerns; i++) {
      let offset = i * perKernSize;
      let kern = {
        first: kernArr[offset + 0],
        second: kernArr[offset + 1],
        amount: kernArr[offset + 2]
      };
      let firstChar = charCodeMap.get(kern.first).char;
      let secondChar = charCodeMap.get(kern.second).char;
      kernMap.set(`${firstChar}${secondChar}`, kern.amount);
    }
    faceInfos.push({
      name: face.name,
      common: face.common,
      charMap,
      kernMap
    });
  }
  return {
    gl,
    faceInfos,
    program,
    atlasTex
  };
}
function createFontBuffers(atlas, sharedRender) {
  let gl = atlas.gl;
  let segmentCapacity = 1024;
  let glyphCapacity = 1024;
  let transformTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, transformTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, texWidth, computeTexHeight(segmentCapacity), 0, gl.RGBA, gl.FLOAT, null);
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  let vertVbo = gl.createBuffer();
  bindFloatAttribs(gl, vertVbo, {}, [
    { name: "a_pos", size: 2 },
    { name: "a_uv", size: 2 },
    { name: "a_texIndex", size: 1 }
  ]);
  let vertBuffer = createFloatBuffer(gl, gl.ARRAY_BUFFER, vertVbo, glyphCapacity, bytesPerVert, sharedRender);
  let localTexBuffer = new Float32Array(segmentCapacity * floatsPerSegment);
  return {
    atlas,
    vao,
    transformTex,
    vertBuffer,
    localTexBuffer,
    segmentsUsed: 0,
    segmentCapacity: 1024,
    glSegmentCapacity: 1024,
    sharedRender
  };
}
function computeTexHeight(numSegments) {
  return Math.ceil(numSegments * floatsPerSegment / 4 / texWidth);
}
var scaleFudgeFactor = 1.04;
function measureTextWidth(fontBuf, text, scale = 1, faceName) {
  let face = faceName ? fontBuf.atlas.faceInfos.find((a) => a.name === faceName) : fontBuf.atlas.faceInfos[0];
  let x = 0;
  let prevCodePoint = "";
  for (let codePoint of text) {
    let charDef = face.charMap.get(codePoint);
    if (!charDef) {
      continue;
    }
    let kernKey = `${prevCodePoint}${codePoint}`;
    let kernAmount = face.kernMap.get(kernKey) || 0;
    x += kernAmount + charDef.xadvance;
    prevCodePoint = codePoint;
  }
  return x * scale / face.common.lineHeight * scaleFudgeFactor;
}
function measureText(fontBuf, text, opts) {
  return measureTextWidth(fontBuf, text, opts.size, opts.faceName);
}
function drawText(fontBuf, text, dx, dy, opts) {
  writeTextToBuffer(fontBuf, text, opts.color, dx, dy, opts.size, opts.mtx, opts.faceName);
}
function writeTextToBuffer(fontBuf, text, color, dx, dy, scale, mtx, faceName) {
  let face = faceName ? fontBuf.atlas.faceInfos.find((a) => a.name === faceName) : fontBuf.atlas.faceInfos[0];
  if (!face) {
    face = fontBuf.atlas.faceInfos[0];
  }
  let phase = fontBuf.sharedRender.activePhase;
  let vertBuf = fontBuf.vertBuffer.localBufs[phase];
  ensureFloatBufferSize(vertBuf, text.length * floatsPerVert);
  if (fontBuf.segmentsUsed === Math.floor(texWidth * 4 / floatsPerSegment)) {
    fontBuf.segmentsUsed += 1;
  }
  let segmentId = fontBuf.segmentsUsed;
  let buf = vertBuf.buf;
  let bufIdx = vertBuf.usedEls * fontBuf.vertBuffer.strideFloats;
  let atlasWInv = 1 / face.common.scaleW;
  let atlasHInv = 1 / face.common.scaleH;
  let numGlyphs = 0;
  let x = dx ?? 0;
  let y = dy ?? 0;
  let prevCodePoint = "";
  scale = scale ?? 1;
  let localScale = scale / face.common.lineHeight * scaleFudgeFactor;
  for (let codePoint of text) {
    let charDef = face.charMap.get(codePoint);
    if (!charDef) {
      continue;
    }
    let kernKey = `${prevCodePoint}${codePoint}`;
    let kernAmount = face.kernMap.get(kernKey) || 0;
    x += kernAmount * localScale;
    let ux = [charDef.x * atlasWInv, (charDef.x + charDef.width) * atlasWInv];
    let uy = [charDef.y * atlasHInv, (charDef.y + charDef.height) * atlasHInv];
    let px = [x + charDef.xoffset * localScale, x + (charDef.xoffset + charDef.width) * localScale];
    let py = [y + charDef.yoffset * localScale, y + (charDef.yoffset + charDef.height) * localScale];
    let tri = [0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0];
    for (let i = 0; i < 6; i++) {
      let ix = tri[i * 2];
      let iy = tri[i * 2 + 1];
      buf[bufIdx++] = px[ix];
      buf[bufIdx++] = py[iy];
      buf[bufIdx++] = ux[ix];
      buf[bufIdx++] = uy[iy];
      buf[bufIdx++] = segmentId;
    }
    x += charDef.xadvance * localScale;
    prevCodePoint = codePoint;
    numGlyphs += 1;
  }
  vertBuf.usedEls += numGlyphs * 6;
  mtx = mtx ?? new Mat4f();
  color = color ?? new Vec4(1, 1, 1, 1);
  if (fontBuf.segmentsUsed >= fontBuf.segmentCapacity) {
    let newCapacity = fontBuf.segmentCapacity * 2;
    let newBuf = new Float32Array(newCapacity * floatsPerSegment);
    newBuf.set(fontBuf.localTexBuffer);
    fontBuf.localTexBuffer = newBuf;
  }
  fontBuf.localTexBuffer.set(mtx, fontBuf.segmentsUsed * floatsPerSegment + 0);
  fontBuf.localTexBuffer.set(color.toArray(), fontBuf.segmentsUsed * floatsPerSegment + 16);
  fontBuf.segmentsUsed += 1;
}
function uploadAllText(fontBuf) {
  let atlas = fontBuf.atlas;
  let gl = atlas.gl;
  gl.bindTexture(gl.TEXTURE_2D, fontBuf.transformTex);
  if (fontBuf.segmentCapacity > fontBuf.glSegmentCapacity) {
    let w = 1024;
    let h = Math.ceil(fontBuf.segmentCapacity * floatsPerSegment / 4 / w);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, null);
    fontBuf.glSegmentCapacity = w * h / 4;
  }
  {
    let w = 1024;
    let h = Math.ceil(fontBuf.segmentsUsed * floatsPerSegment / 4 / w);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RGBA, gl.FLOAT, fontBuf.localTexBuffer);
  }
  uploadFloatBuffer(gl, fontBuf.vertBuffer);
}
function renderAllText(fontBuf, renderPhase) {
  let atlas = fontBuf.atlas;
  let gl = atlas.gl;
  gl.disable(gl.CULL_FACE);
  gl.depthMask(false);
  gl.useProgram(atlas.program.program);
  let locs = atlas.program.locs;
  gl.uniform1f(locs.pxRange, 4);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, atlas.atlasTex);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, fontBuf.transformTex);
  gl.bindVertexArray(fontBuf.vao);
  let localBuf = fontBuf.vertBuffer.localBufs[renderPhase];
  gl.drawArrays(gl.TRIANGLES, localBuf.glOffsetEls, localBuf.usedEls);
  gl.depthMask(true);
}
function resetFontBuffers(fontBuf) {
  resetFloatBufferMap(fontBuf.vertBuffer);
  fontBuf.segmentsUsed = 0;
}

// features/llm-visualization/upstream/src/llm/components/SectionLabels.ts
function drawBlockLabels(state, layout) {
  let baseColor = DEVELO_LLM_VIZ_THEME.muted;
  {
    let color = baseColor.mul(layout.embedLabel.visible);
    let tl = new Vec3(layout.tokEmbedObj.x - layout.margin * 2, layout.tokEmbedObj.y, 0);
    let br = new Vec3(layout.tokEmbedObj.x - layout.margin * 2, layout.tokEmbedObj.y + layout.tokEmbedObj.dy, 0);
    drawSectionLabel(state, "Embedding", tl, br, { color, fontSize: 6, pad: 4 });
  }
  let transformerIdx = 0;
  for (let block of layout.blocks) {
    let blockTop = block.ln1.lnResid.y - layout.margin / 2;
    let blockBottom = block.mlpResult.y + block.mlpResult.dy + layout.margin / 2;
    let mlpLeft = block.mlpProjBias.x - layout.margin * 3;
    let headLeft = block.projBias.x - layout.margin;
    let attnLabelLeft = headLeft - layout.margin * 3;
    let attnLeft = lerp(headLeft, mlpLeft, 0.6);
    let attnProjTop = block.attnOut.y - layout.margin / 2;
    let attnProjBot = block.attnOut.y + block.attnOut.dy + layout.margin / 2;
    let mlpTop = block.mlpFcBias.y - layout.margin / 2;
    let blockLeft = mlpLeft - layout.margin * 6;
    {
      let color = baseColor.mul(block.mlpResidual.opacity * block.transformerLabel.visible);
      let tl = new Vec3(blockLeft, blockTop, 0);
      let br = new Vec3(blockLeft, blockBottom, 0);
      drawSectionLabel(state, `Transformer ${transformerIdx}`, tl, br, { color, fontSize: 26 });
    }
    {
      let color = baseColor.mul(block.attnResidual.opacity * block.selfAttendLabel.visible);
      let tl = new Vec3(attnLeft, blockTop, 0);
      let br = new Vec3(attnLeft, attnProjBot, 0);
      drawSectionLabel(state, `Self-attention`, tl, br, { color, fontSize: 12 });
    }
    {
      let color = baseColor.mul(block.mlpAct.opacity * block.mlpLabel.visible);
      let tl = new Vec3(mlpLeft, mlpTop, 0);
      let br = new Vec3(mlpLeft, blockBottom, 0);
      drawSectionLabel(state, `MLP`, tl, br, { color, fontSize: 12 });
    }
    {
      let color = baseColor.mul(block.attnOut.opacity * block.projLabel.visible);
      let tl = new Vec3(attnLabelLeft, attnProjTop, 0);
      let br = new Vec3(attnLabelLeft, attnProjBot, 0);
      drawSectionLabel(state, `Projection`, tl, br, { color, fontSize: 10 });
    }
    let headIdx = 0;
    for (let head of block.heads) {
      {
        let color = baseColor.mul(head.attnMtx.opacity * head.headLabel.visible);
        let tl = new Vec3(attnLabelLeft, head.vBlock.y, head.vBlock.z + head.vBlock.dz / 2);
        let br = new Vec3(attnLabelLeft, head.qBlock.y + head.qBlock.dy, head.qBlock.z + head.qBlock.dz / 2);
        if (head.qBlock.y !== head.vBlock.y) {
          tl = new Vec3(attnLabelLeft, head.vBlock.y, head.vOutBlock.z + head.vOutBlock.dz / 2);
          br = new Vec3(attnLabelLeft, head.vOutBlock.y + head.vOutBlock.dy, head.vOutBlock.z + head.vOutBlock.dz / 2);
        }
        drawSectionLabel(state, `Head ${headIdx}`, tl, br, { color, fontSize: 10 });
      }
      {
        let color = baseColor.mul(head.qBlock.opacity * head.qLabel.visible);
        let tl = new Vec3(headLeft, head.qBlock.y, head.qBlock.z + head.qBlock.dz / 2);
        let br = new Vec3(headLeft, head.qBlock.y + head.qBlock.dy, head.qBlock.z + head.qBlock.dz / 2);
        drawSectionLabel(state, `Q`, tl, br, { color, fontSize: 6, pad: 4 });
      }
      {
        let color = baseColor.mul(head.kBlock.opacity * head.kLabel.visible);
        let tl = new Vec3(headLeft, head.kBlock.y, head.kBlock.z + head.kBlock.dz / 2);
        let br = new Vec3(headLeft, head.kBlock.y + head.kBlock.dy, head.kBlock.z + head.kBlock.dz / 2);
        drawSectionLabel(state, `K`, tl, br, { color, fontSize: 6, pad: 4 });
      }
      {
        let color = baseColor.mul(head.vBlock.opacity * head.vLabel.visible);
        let tl = new Vec3(headLeft, head.vBlock.y, head.vBlock.z + head.vBlock.dz / 2);
        let br = new Vec3(headLeft, head.vBlock.y + head.vBlock.dy, head.vBlock.z + head.vBlock.dz / 2);
        drawSectionLabel(state, `V`, tl, br, { color, fontSize: 6, pad: 4 });
      }
      headIdx++;
    }
    transformerIdx++;
  }
}
function drawSectionLabel(state, text, tl, br, opts) {
  let mtx = new Mat4f();
  mtx[14] = (tl.z + br.z) / 2;
  let color = opts.color;
  let fontScale = opts.fontSize;
  let pad = opts.pad ?? 10;
  let textColor = color;
  let lineColor = color.mul(0.4);
  let tw = measureTextWidth(state.modelFontBuf, text, fontScale);
  writeTextToBuffer(state.modelFontBuf, text, textColor, tl.x - tw - 2 * pad, (tl.y + br.y) / 2 - fontScale / 2, fontScale, mtx);
  let p0 = new Vec3(tl.x, tl.y, (tl.z + br.z) / 2);
  let p1 = new Vec3(br.x, br.y, (tl.z + br.z) / 2);
  if (tl.z != br.z) {
    p0 = new Vec3(tl.x, (tl.y + br.y) / 2, tl.z);
    p1 = new Vec3(tl.x, (tl.y + br.y) / 2, br.z);
  }
  let inward = new Vec3(1, 0, 0);
  addLine(state.lineRender, 1, lineColor, p0.mulAdd(inward, -pad), p1.mulAdd(inward, -pad), void 0);
  addLine(state.lineRender, 1, lineColor, p0.mulAdd(inward, -pad), p0, void 0);
  addLine(state.lineRender, 1, lineColor, p1.mulAdd(inward, -pad), p1, void 0);
}

// features/llm-visualization/upstream/src/llm/walkthrough/WalkthroughTools.ts
var DimStyle = /* @__PURE__ */ ((DimStyle2) => {
  DimStyle2[DimStyle2["None"] = 0] = "None";
  DimStyle2[DimStyle2["t"] = 1] = "t";
  DimStyle2[DimStyle2["T"] = 2] = "T";
  DimStyle2[DimStyle2["C"] = 3] = "C";
  DimStyle2[DimStyle2["B"] = 4] = "B";
  DimStyle2[DimStyle2["A"] = 5] = "A";
  DimStyle2[DimStyle2["n_vocab"] = 6] = "n_vocab";
  DimStyle2[DimStyle2["n_heads"] = 7] = "n_heads";
  DimStyle2[DimStyle2["n_layers"] = 8] = "n_layers";
  DimStyle2[DimStyle2["Token"] = 9] = "Token";
  DimStyle2[DimStyle2["TokenIdx"] = 10] = "TokenIdx";
  DimStyle2[DimStyle2["C4"] = 11] = "C4";
  DimStyle2[DimStyle2["Intermediates"] = 12] = "Intermediates";
  DimStyle2[DimStyle2["Weights"] = 13] = "Weights";
  DimStyle2[DimStyle2["Aggregates"] = 14] = "Aggregates";
  return DimStyle2;
})(DimStyle || {});
function dimStyleColor(style) {
  switch (style) {
    case 1 /* t */:
    case 2 /* T */:
      return DEVELO_LLM_VIZ_THEME.token;
    case 5 /* A */:
      return DEVELO_LLM_VIZ_THEME.v;
    case 3 /* C */:
    case 11 /* C4 */:
      return DEVELO_LLM_VIZ_THEME.embedding;
    case 9 /* Token */:
      return DEVELO_LLM_VIZ_THEME.token;
    case 10 /* TokenIdx */:
      return DEVELO_LLM_VIZ_THEME.muted;
    case 6 /* n_vocab */:
      return DEVELO_LLM_VIZ_THEME.mlp;
    case 12 /* Intermediates */:
      return DEVELO_LLM_VIZ_THEME.mlp;
    case 13 /* Weights */:
      return Colors.Weights;
    case 14 /* Aggregates */:
      return DEVELO_LLM_VIZ_THEME.attention;
  }
  return DEVELO_LLM_VIZ_THEME.text;
}
function dimStyleTextShort(style) {
  switch (style) {
    case 4 /* B */:
      return "b";
    case 2 /* T */:
      return "t";
    case 5 /* A */:
      return "a";
    case 3 /* C */:
      return "c";
    case 11 /* C4 */:
      return "c";
    default:
      return DimStyle[style];
  }
}
var Colors = {
  Weights: DEVELO_LLM_VIZ_THEME.embedding,
  Intermediates: DEVELO_LLM_VIZ_THEME.mlp,
  Aggregates: DEVELO_LLM_VIZ_THEME.attention
};

// features/llm-visualization/upstream/src/llm/Annotations.ts
var dimConstX = { vecId: 0, xName: "x", dxName: "dx", cxName: "cx", offXName: "offX", sizeXName: "sizeX" };
var dimConstY = { vecId: 1, xName: "y", dxName: "dy", cxName: "cy", offXName: "offY", sizeXName: "sizeY" };
var dimConstZ = { vecId: 2, xName: "z", dxName: "dz", cxName: "cz", offXName: "offZ", sizeXName: "sizeZ" };
function dimConsts(dim) {
  return dim === 0 /* X */ ? dimConstX : dim === 1 /* Y */ ? dimConstY : dimConstZ;
}
function dimProps(blk, dim) {
  switch (dim) {
    case 0 /* X */:
      return { x: blk.x, cx: blk.cx, dx: blk.dx, rangeOffsets: blk.rangeOffsetsX, offX: blk.offX ?? 0, sizeX: blk.sizeX ?? blk.cx };
    case 1 /* Y */:
      return { x: blk.y, cx: blk.cy, dx: blk.dy, rangeOffsets: blk.rangeOffsetsY, offX: blk.offY ?? 0, sizeX: blk.sizeY ?? blk.cy };
    case 2 /* Z */:
      return { x: blk.z, cx: blk.cz, dx: blk.dz, rangeOffsets: blk.rangeOffsetsZ, offX: blk.offZ ?? 0, sizeX: blk.sizeZ ?? blk.cz };
  }
}
function duplicateGrid(layout, blk) {
  let newBlk = { ...blk, access: blk.access ? { ...blk.access } : void 0 };
  newBlk.name = "";
  layout.cubes.push(newBlk);
  return newBlk;
}
function splitGridForHighlight(layout, blk, dim, xSplit) {
  let { x, cx, rangeOffsets } = dimProps(blk, dim);
  if (cx <= 1) {
    return blk;
  }
  if (rangeOffsets && blk.subs) {
    for (let s of blk.subs) {
      let res = splitGrid(layout, s, dim, xSplit, 0);
      if (res) {
        return res;
      }
    }
  }
  return splitGrid(layout, blk, dim, xSplit, 0);
}
function splitGrid(layout, blk, dim, xSplit, splitAmt) {
  let { offX, sizeX } = dimProps(blk, dim);
  let blocks = [];
  let rangeOffsets = [];
  let colX = Math.floor(xSplit) - offX;
  if (colX < 0 || colX >= sizeX) {
    return null;
  }
  if (sizeX <= 1) {
    return blk;
  }
  function addSubBlockLocal(iStart, iEnd, xOffset) {
    let res = addSubBlock(layout, blk, dim, iStart, iEnd, xOffset);
    if (res) {
      blocks.push(res.subBlock);
      rangeOffsets.push(res.rangeOffset);
    }
    return res?.subBlock ?? null;
  }
  let midBlock;
  if (splitAmt === 0) {
    addSubBlockLocal(0, colX, 0);
    midBlock = addSubBlockLocal(colX, colX + 1, 0);
    addSubBlockLocal(colX + 1, sizeX, 0);
  } else {
    let scale = 0.5;
    let fract = (xSplit - colX - 0.5) * scale + 0.5;
    let addMidBlockBefore = fract + scale < 1;
    let addMidBlockAfter = fract - scale > 0;
    let offset = lerpSmoothstep(-splitAmt, 0, (xSplit - 0.5) * scale + 0.5);
    addSubBlockLocal(0, colX - (addMidBlockBefore ? 1 : 0), offset + 0);
    if (addMidBlockBefore) {
      addSubBlockLocal(colX - 1, colX, offset + lerpSmoothstep(splitAmt, 0, fract + scale));
    }
    midBlock = addSubBlockLocal(colX, colX + 1, offset + lerpSmoothstep(splitAmt, 0, fract));
    if (addMidBlockAfter) {
      addSubBlockLocal(colX + 1, colX + 2, offset + lerpSmoothstep(splitAmt, 0, fract - scale));
    }
    addSubBlockLocal(colX + (addMidBlockAfter ? 2 : 1), sizeX, offset + splitAmt);
  }
  if (blocks.length > 0) {
    if (dim === 0 /* X */) blk.rangeOffsetsX = rangeOffsets;
    if (dim === 1 /* Y */) blk.rangeOffsetsY = rangeOffsets;
    if (dim === 2 /* Z */) blk.rangeOffsetsZ = rangeOffsets;
    blk.subs = blocks;
    return midBlock;
  } else {
    return null;
  }
}
function addSubBlock(layout, blk, dim, iStart, iEnd, xOffset) {
  let { x, cx, sizeX, offX } = dimProps(blk, dim);
  let { vecId, xName, dxName, offXName, sizeXName } = dimConsts(dim);
  if (iStart >= iEnd || iEnd <= 0 || iStart >= sizeX) {
    return null;
  }
  let scale = (iEnd - iStart) / sizeX;
  let translate = iStart / sizeX;
  let mtx = Mat4f.fromScaleTranslation(new Vec3(1, 1, 1).setAt(vecId, scale), new Vec3().setAt(vecId, translate));
  let subBlock = {
    ...blk,
    [dxName]: (iEnd - iStart) * layout.cell,
    // [cxName]: iEnd - iStart,
    access: blk.access && { ...blk.access },
    localMtx: (blk.localMtx ?? new Mat4f()).mul(mtx),
    [xName]: x + (iStart * layout.cell + xOffset),
    [offXName]: iStart + offX,
    [sizeXName]: iEnd - iStart
  };
  return { subBlock, rangeOffset: [iEnd, xOffset] };
}
function splitGridAll(layout, blk, dim) {
  let { dx } = dimProps(blk, dim);
  let nCells = Math.ceil(dx / layout.cell);
  let blocks = [];
  let rangeOffsets = [];
  for (let i = 0; i < nCells; i += 1) {
    let res = addSubBlock(layout, blk, dim, i, i + 1, 0);
    blocks.push(res.subBlock);
    rangeOffsets.push(res.rangeOffset);
  }
  if (dim === 0 /* X */) blk.rangeOffsetsX = rangeOffsets;
  if (dim === 1 /* Y */) blk.rangeOffsetsY = rangeOffsets;
  if (dim === 2 /* Z */) blk.rangeOffsetsZ = rangeOffsets;
  blk.subs = blocks;
  return blocks;
}
function findSubBlocks(blk, dim, idxLow, idxHi) {
  if (!blk.subs) {
    return [];
  }
  let offsets = dim === 0 /* X */ ? blk.rangeOffsetsX : dim === 1 /* Y */ ? blk.rangeOffsetsY : blk.rangeOffsetsZ;
  idxLow = idxLow === null ? null : Math.floor(idxLow);
  idxHi = idxHi === null ? null : Math.floor(idxHi);
  let subBlocks = [];
  let startIdx = 0;
  for (let i = 0; i < blk.subs.length; i += 1) {
    let endIdx = offsets?.[i]?.[0];
    if (isNil(endIdx)) {
      break;
    }
    if ((idxLow === null || idxLow < endIdx) && (idxHi === null || idxHi >= startIdx)) {
      subBlocks.push(blk.subs[i]);
    }
    startIdx = endIdx;
  }
  return subBlocks;
}

// features/llm-visualization/upstream/src/llm/GptModelLayout.ts
var depIdxVars = "0xybi";
function parseDepIdxStr(str) {
  let mtx = Mat4f.zeros();
  for (let destI = 0; destI < str.length; destI++) {
    let srcIdx = depIdxVars.indexOf(str[destI]);
    if (srcIdx > 0) {
      mtx.s(destI, srcIdx - 1, 1);
    }
  }
  return mtx;
}
function depArgsToDeps(args) {
  let makeBlkDeps = (src, depStr) => ({ src, srcIdxMtx: parseDepIdxStr(depStr) });
  return {
    dot: args.dot && args.dot.map(([src, depStr]) => makeBlkDeps(src, depStr)),
    dotLen: args.dotLen,
    add: args.add && args.add.map(([src, depStr]) => makeBlkDeps(src, depStr)),
    special: args.special ?? 0 /* None */,
    lowerTri: args.lowerTri
  };
}
function getBlkDimensions(blk) {
  let { x, y, z, dx, dy, dz } = blk;
  return {
    tl: new Vec3(x, y, z),
    br: new Vec3(x + dx, y + dy, z + dz)
  };
}
function setBlkPosition(blk, pos) {
  blk.x = pos.x;
  blk.y = pos.y;
  blk.z = pos.z;
}
function cellPosition(layout, blk, dim, index) {
  let { x, rangeOffsets } = dimProps(blk, dim);
  let base = x + layout.cell * index;
  if (!rangeOffsets) {
    return base;
  }
  for (let [s, xOff] of rangeOffsets) {
    if (index < s) {
      return base + xOff;
    }
  }
  return base;
}
function genGptModelLayout(shape, gptGpuModel = null, offset = new Vec3(0, 0, 0)) {
  let { B, T, C, vocabSize, nHeads, A, nBlocks } = shape;
  let isLargeModel = shape.nBlocks > 12;
  let y = 0;
  let cell = 1.5;
  let margin = Math.max(12, C / 10);
  function mk(args) {
    let xDef = [args.xL, args.xR, args.xM].map((a) => +!isNil(a)).reduce((a, b) => a + b, 0);
    let yDef = [args.zF, args.zB, args.zM].map((a) => +!isNil(a)).reduce((a, b) => a + b, 0);
    if (xDef !== 1 || yDef !== 1) {
      throw new Error(`Must supply exactly 1 x arg & 1 y arg: ${JSON.stringify(args)}`);
    }
    let dx = args.cx * cell;
    let dy = args.cz * cell;
    let x = !isNil(args.xL) ? args.xL : !isNil(args.xR) ? args.xR - dx : args.xM - dx / 2;
    let z = !isNil(args.zB) ? args.zB : !isNil(args.zF) ? args.zF - dy : args.zM - dy / 2;
    function ensure4(a) {
      return a.length === 4 ? a : [...a, 0];
    }
    return {
      dx: args.cx * cell,
      dy: args.cy * cell,
      dz: args.cz * cell,
      t: args.t,
      x,
      y: args.y,
      z,
      cx: args.cx,
      cy: args.cy,
      cz: args.cz,
      dimX: args.dimX,
      dimY: args.dimY,
      name: args.name ?? "<unknown>",
      access: args.access?.src ? {
        channel: args.access.channel ?? "r",
        src: args.access.src,
        scale: args.access.scale ?? 1,
        mat: Mat4f.fromColMajor([...ensure4(args.access.x), ...ensure4(args.access.y), 0, 0, 0, 0, 0, 0, 0, 0])
      } : void 0,
      deps: args.deps ? depArgsToDeps(args.deps) : void 0,
      opacity: args.hidden ? 0 : 1,
      highlight: 0,
      small: args.small ?? false,
      special: args.special ?? 0 /* None */,
      transpose: args.transpose,
      idx: -1
    };
  }
  function mkLabel(init, cubes2) {
    return { visible: 0, cubes: cubes2 ?? [] };
  }
  let cubes = [];
  let idxObj = mk({
    t: "i",
    cx: T,
    cz: B,
    cy: 1,
    y,
    xM: 0,
    zM: 0,
    access: { src: gptGpuModel?.inputTokens, x: [0, 1, 0], y: [1, 0, T], scale: 1 / vocabSize },
    dimX: 2 /* T */,
    dimY: 0 /* None */,
    name: "Tokens"
  });
  let leftX = -T * cell / 2 - margin;
  let rightX = T * cell / 2 + margin;
  y += cell + margin;
  let tokEmbedObj = mk({
    t: "w",
    xR: leftX,
    zM: 0,
    y,
    cx: vocabSize,
    cz: 1,
    cy: C,
    // src has shape [vocabSize, C]
    access: { src: gptGpuModel?.vocabEmbed.weight, x: [0, 1, 0], y: [1, 0, 0], scale: 10 },
    dimX: 6 /* n_vocab */,
    dimY: 3 /* C */,
    name: "Token Embed"
  });
  let posEmbedObj = mk({
    t: "w",
    xL: rightX,
    zM: 0,
    y,
    cx: T,
    cz: 1,
    cy: C,
    access: { src: gptGpuModel?.posEmbed.weight, x: [0, 1, 0], y: [1, 0, 0], scale: 10 },
    dimX: 2 /* T */,
    dimY: 3 /* C */,
    name: "Position Embed"
  });
  let residual0 = mk({
    t: "i",
    xM: 0,
    zM: 0,
    y,
    cx: T,
    cz: B,
    cy: C,
    access: { src: gptGpuModel?.add.output, x: [0, 1, 0], y: [1, 0, T], scale: 10 },
    deps: { add: [[tokEmbedObj, "iy"], [posEmbedObj, "xy"], [idxObj, "x0"]], special: 4 /* InputEmbed */ },
    // the i comes from the idxObj lookup
    dimX: 2 /* T */,
    dimY: 3 /* C */,
    name: "Input Embed"
  });
  cubes.push(idxObj, tokEmbedObj, posEmbedObj, residual0);
  let embedLabel = mkLabel(y, [idxObj, tokEmbedObj, posEmbedObj, residual0]);
  y += C * cell + margin;
  function createLn(x, src, target) {
    let lnLeftX2 = leftX + x;
    let resLeftX = lnLeftX2 - T * cell - margin;
    let lnAgg1 = mk({
      t: "a",
      cx: T,
      cz: B,
      cy: 1,
      y,
      xR: lnLeftX2,
      zM: 0,
      access: { src: target?.normAgg, x: [0, 1, 0], y: [1, 0, T], scale: 10, channel: "r" },
      deps: { add: [[src, "xi"]], special: 5 /* LayerNormMu */ },
      dimX: 2 /* T */,
      dimY: 0 /* None */,
      small: true,
      name: "LN Agg: \u03BC, \u03C3"
    });
    let lnAgg2 = mk({
      t: "a",
      cx: T,
      cz: B,
      cy: 1,
      y: y + cell,
      xR: lnLeftX2,
      zM: 0,
      access: { src: target?.normAgg, x: [0, 1, 0], y: [1, 0, T], scale: 10, channel: "g" },
      deps: { add: [[src, "xi"]], special: 6 /* LayerNormSigma */ },
      dimX: 2 /* T */,
      dimY: 0 /* None */,
      small: true,
      name: ""
    });
    y += 2 * cell + margin;
    let lnSigma = mk({
      t: "w",
      cx: 1,
      cz: 1,
      cy: C,
      y,
      xR: resLeftX,
      zM: 0,
      access: { src: target?.normWeight, x: [1, 0, 0], y: [0, 1, 0], scale: 0.5 },
      // mostly around 1.0
      dimX: 0 /* None */,
      dimY: 3 /* C */,
      name: "\u03B3",
      small: true
    });
    let lnMu = mk({
      t: "w",
      cx: 1,
      cz: 1,
      cy: C,
      y,
      xR: resLeftX - cell * 1 - margin,
      zM: 0,
      access: { src: target?.normBias, x: [1, 0, 0], y: [0, 1, 0] },
      dimX: 0 /* None */,
      dimY: 3 /* C */,
      name: "\u03B2",
      small: true
    });
    let lnResid = mk({
      t: "i",
      cx: T,
      cz: B,
      cy: C,
      y,
      xR: lnLeftX2,
      zM: 0,
      access: { src: target?.output, x: [0, 1, 0], y: [1, 0, T], scale: 1 },
      deps: { add: [[src, "xy"], [lnAgg1, "xi"], [lnAgg2, "xi"], [lnSigma, "0y"], [lnMu, "0y"]], special: 3 /* LayerNorm */ },
      // lnSigma is really mul rather than add
      dimX: 2 /* T */,
      dimY: 3 /* C */,
      name: "Layer Norm"
    });
    let lnCubes = [lnAgg1, lnAgg2, lnSigma, lnMu, lnResid];
    return { lnAgg1, lnAgg2, lnResid, lnSigma, lnMu, cubes: lnCubes };
  }
  let lnLeftX = leftX - (T + 2) * cell - 3 * margin;
  function createLayer(src, target) {
    let ln1 = createLn(0, src, target?.ln_1);
    let interHeadMargin = 3 * margin + C * cell / 16;
    let qkvMargin = 1 * margin + C * cell / 16;
    let headWidth = 3 * B * cell + qkvMargin * 2 + (isLargeModel ? 0 : interHeadMargin);
    let attn1Y = y + A * cell + margin + (isLargeModel ? 2 * A * cell : 0);
    let attn2Y = attn1Y;
    let vOutY = attn2Y + T * cell + margin;
    let attnLeftX = lnLeftX;
    let qkvValLeftX = attnLeftX - T * cell - margin;
    let qkvBiasLeftX = qkvValLeftX - C * cell - margin;
    let stepPerHeadY = 0;
    let attnTarget = target?.attn;
    let heads = [];
    for (let i = 0; i < nHeads; i++) {
      let headZMid = headWidth * i - (nHeads - 1) * headWidth / 2;
      let qMid = headZMid + B * cell + qkvMargin;
      let kMid = headZMid;
      let vMid = headZMid - B * cell - qkvMargin;
      let qWeightBlock = mk({
        t: "w",
        cx: C,
        cz: 1,
        cy: A,
        y,
        xR: qkvValLeftX,
        zM: qMid,
        access: { src: attnTarget?.qkvWeight, x: [1, 0, 0], y: [0, 1, 0, 0 * C + A * i], scale: C * 0.25 },
        dimX: 3 /* C */,
        dimY: 5 /* A */,
        name: "Q Weights"
      });
      let kWeightBlock = mk({
        t: "w",
        cx: C,
        cz: 1,
        cy: A,
        y,
        xR: qkvValLeftX,
        zM: kMid,
        access: { src: attnTarget?.qkvWeight, x: [1, 0, 0], y: [0, 1, 0, 1 * C + A * i], scale: C * 0.25 },
        dimX: 3 /* C */,
        dimY: 5 /* A */,
        name: "K Weights"
      });
      let vWeightBlock = mk({
        t: "w",
        cx: C,
        cz: 1,
        cy: A,
        y,
        xR: qkvValLeftX,
        zM: vMid,
        access: { src: attnTarget?.qkvWeight, x: [1, 0, 0], y: [0, 1, 0, 2 * C + A * i], scale: C * 0.25 },
        dimX: 3 /* C */,
        dimY: 5 /* A */,
        name: "V Weights"
      });
      let qkvWeightBlock = mk({
        t: "w",
        cx: C,
        cz: 1,
        cy: A * 3,
        y,
        xR: qkvValLeftX,
        zM: kMid,
        dimX: 3 /* C */,
        dimY: 3 /* C */,
        name: "QKV Weights"
      });
      let qBiasBlock = mk({
        t: "w",
        cx: 1,
        cz: 1,
        cy: A,
        y,
        xR: qkvBiasLeftX,
        zM: qMid,
        access: { src: attnTarget?.qkvBias, x: [1, 0, 0], y: [0, 1, 0, 0 * C + A * i] },
        dimX: 0 /* None */,
        dimY: 5 /* A */,
        small: true,
        name: "Q Bias"
      });
      let kBiasBlock = mk({
        t: "w",
        cx: 1,
        cz: 1,
        cy: A,
        y,
        xR: qkvBiasLeftX,
        zM: kMid,
        access: { src: attnTarget?.qkvBias, x: [1, 0, 0], y: [0, 1, 0, 1 * C + A * i] },
        dimX: 0 /* None */,
        dimY: 5 /* A */,
        small: true,
        name: "K Bias"
      });
      let vBiasBlock = mk({
        t: "w",
        cx: 1,
        cz: 1,
        cy: A,
        y,
        xR: qkvBiasLeftX,
        zM: vMid,
        access: { src: attnTarget?.qkvBias, x: [1, 0, 0], y: [0, 1, 0, 2 * C + A * i] },
        dimX: 0 /* None */,
        dimY: 5 /* A */,
        small: true,
        name: "V Bias"
      });
      let qBlock = mk({
        t: "i",
        cx: T,
        cz: B,
        cy: A,
        y,
        xR: attnLeftX,
        zM: qMid,
        access: { src: attnTarget?.qkvOutput, x: [0, 1, 0, 0 * C + A * i], y: [1, 0, T], scale: 1 },
        deps: { dot: [[qWeightBlock, "iy"], [ln1.lnResid, "xi"]], add: [[qBiasBlock, "0y"]], dotLen: C },
        dimX: 2 /* T */,
        dimY: 5 /* A */,
        name: "Q vectors"
      });
      let kBlock = mk({
        t: "i",
        cx: T,
        cz: B,
        cy: A,
        y,
        xR: attnLeftX,
        zM: kMid,
        access: { src: attnTarget?.qkvOutput, x: [0, 1, 0, 1 * C + A * i], y: [1, 0, T], scale: 1 },
        deps: { dot: [[kWeightBlock, "iy"], [ln1.lnResid, "xi"]], add: [[kBiasBlock, "0y"]], dotLen: C },
        dimX: 2 /* T */,
        dimY: 5 /* A */,
        name: "K vectors"
      });
      let vBlock = mk({
        t: "i",
        cx: T,
        cz: B,
        cy: A,
        y,
        xR: attnLeftX,
        zM: vMid,
        access: { src: attnTarget?.qkvOutput, x: [0, 1, 0, 2 * C + A * i], y: [1, 0, T], scale: 1 },
        deps: { dot: [[vWeightBlock, "iy"], [ln1.lnResid, "xi"]], add: [[vBiasBlock, "0y"]], dotLen: C },
        dimX: 2 /* T */,
        dimY: 5 /* A */,
        name: "V vectors"
      });
      let qkvBlock = mk({
        t: "i",
        cx: T,
        cz: B,
        cy: A * 3,
        y,
        xR: attnLeftX,
        zM: kMid,
        dimX: 2 /* T */,
        dimY: 3 /* C */,
        name: "QKV vectors"
      });
      let attn2LeftX = attnLeftX - (T + 2) * cell - 2 * margin;
      let attnMtx = mk({
        t: "i",
        cx: T,
        cz: B,
        cy: T,
        y: attn1Y,
        xR: attnLeftX,
        zM: headZMid,
        access: { src: attnTarget?.attnMatrix, x: [1, 0, 0], y: [0, 1, nHeads * T, T * i], scale: 1 },
        deps: { dot: [[qBlock, "yi"], [kBlock, "xi"]], lowerTri: true, dotLen: A, special: 9 /* Attention */ },
        dimX: 2 /* T */,
        dimY: 2 /* T */,
        special: 1 /* Attention */,
        transpose: true,
        name: "Attention Matrix"
      });
      let attnMtxAgg1 = mk({
        t: "a",
        cx: 1,
        cz: B,
        cy: T,
        y: attn1Y,
        xR: attnLeftX - T * cell - margin - cell,
        zM: headZMid,
        access: { src: attnTarget?.attnMatrixAgg, x: [0, 0, 0, 0], y: [0, 1, nHeads * T, T * i], channel: "r" },
        deps: { add: [[attnMtx, "iy"]], special: 8 /* SoftmaxAggExp */ },
        dimX: 0 /* None */,
        dimY: 2 /* T */,
        small: true,
        name: ""
      });
      let attnMtxAgg2 = mk({
        t: "a",
        cx: 1,
        cz: B,
        cy: T,
        y: attn1Y,
        xR: attnLeftX - T * cell - margin,
        zM: headZMid,
        access: { src: attnTarget?.attnMatrixAgg, x: [0, 0, 0, 0], y: [0, 1, nHeads * T, T * i], channel: "g" },
        deps: { add: [[attnMtx, "iy"]], special: 7 /* SoftmaxAggMax */ },
        dimX: 0 /* None */,
        dimY: 2 /* T */,
        small: true,
        name: ""
      });
      let attnMtxSm = mk({
        t: "i",
        cx: T,
        cz: B,
        cy: T,
        y: attn1Y,
        xR: attn2LeftX,
        zM: headZMid,
        access: { src: attnTarget?.attnMatrixSoftmax, x: [1, 0, 0], y: [0, 1, nHeads * T, T * i], scale: 2 },
        deps: { add: [[attnMtx, "xy"], [attnMtxAgg1, "iy"], [attnMtxAgg2, "iy"]], lowerTri: true, special: 1 /* Softmax */ },
        dimX: 2 /* T */,
        dimY: 2 /* T */,
        special: 1 /* Attention */,
        transpose: true,
        name: "Attn Matrix Softmax"
      });
      let vOutBlock = mk({
        t: "i",
        cx: T,
        cz: B,
        cy: A,
        y: vOutY + i * stepPerHeadY,
        xR: attnLeftX,
        zM: headZMid,
        access: { src: attnTarget?.scaledVectors, x: [0, 1, 0, i * A], y: [1, 0, T] },
        deps: { dot: [[vBlock, "iy"], [attnMtxSm, "ix"]], dotLen: A },
        dimX: 2 /* T */,
        dimY: 5 /* A */,
        name: "V Output"
      });
      let headCubes2 = [
        ...isLargeModel ? [qkvWeightBlock, qkvBlock] : [qWeightBlock, kWeightBlock, vWeightBlock, qBlock, kBlock, vBlock],
        qBiasBlock,
        kBiasBlock,
        vBiasBlock,
        attnMtx,
        attnMtxAgg1,
        attnMtxAgg2,
        attnMtxSm,
        vOutBlock
      ];
      let headLabel = mkLabel(1, headCubes2);
      let qLabel = mkLabel(1, [qWeightBlock, qBiasBlock, qBlock]);
      let kLabel = mkLabel(1, [kWeightBlock, kBiasBlock, kBlock]);
      let vLabel = mkLabel(1, [vWeightBlock, vBiasBlock, vBlock]);
      let biasLabel = mkLabel(1, [qBiasBlock, kBiasBlock, vBiasBlock]);
      let mtxLabel = mkLabel(1, [attnMtx, attnMtxAgg1, attnMtxAgg2, attnMtxSm]);
      let vectorLabel = mkLabel(1, [vOutBlock]);
      let head = {
        qWeightBlock,
        kWeightBlock,
        vWeightBlock,
        qBiasBlock,
        kBiasBlock,
        vBiasBlock,
        qBlock,
        kBlock,
        vBlock,
        attnMtx,
        attnMtxAgg1,
        attnMtxAgg2,
        attnMtxSm,
        vOutBlock,
        qLabel,
        kLabel,
        vLabel,
        biasLabel,
        mtxLabel,
        vectorLabel,
        headLabel,
        cubes: headCubes2,
        labels: [qLabel, kLabel, vLabel, biasLabel, mtxLabel, vectorLabel, headLabel]
      };
      heads.push(head);
    }
    let vOutCombined = mk({
      t: "i",
      cx: T,
      cz: B,
      cy: C,
      y: vOutY,
      xR: attnLeftX,
      zF: -headWidth * nHeads / 2,
      dimX: 2 /* T */,
      dimY: 3 /* C */,
      hidden: true,
      name: "V Output Combined"
    });
    let vFinalZ = Math.max(
      vOutY + stepPerHeadY * (nHeads - 1) + A * cell + 2 * margin,
      y + C * cell + margin
      // in case the layer norm block is shorter
    );
    let projWeight = mk({
      t: "w",
      cx: C,
      cz: 1,
      cy: C,
      y: vFinalZ,
      xR: qkvValLeftX,
      zM: 0,
      access: { src: attnTarget?.proj.weight, x: [1, 0, 0], y: [0, 1, 0], scale: C * 0.5 },
      dimX: 3 /* C */,
      dimY: 3 /* C */,
      name: "Projection Weights"
    });
    let projBias = mk({
      t: "w",
      cx: 1,
      cz: 1,
      cy: C,
      y: vFinalZ,
      xR: qkvValLeftX - C * cell - margin,
      zM: 0,
      access: { src: attnTarget?.proj.bias, x: [0, 0, 0], y: [0, 1, 0], scale: C * 0.5 },
      dimX: 0 /* None */,
      dimY: 3 /* C */,
      small: true,
      name: "Projection Bias"
    });
    let attnOut = mk({
      t: "i",
      cx: T,
      cz: B,
      cy: C,
      y: vFinalZ,
      xR: attnLeftX,
      zM: 0,
      access: { src: attnTarget?.proj.output, x: [0, 1, 0], y: [1, 0, T] },
      // deps: { dot: [[projWeight, 'iy'], [vOutCombined, 'xi']], dotLen: C },
      // vOutCombined isn't displayed atm, so add from the heads instead
      deps: {
        dot: [[projWeight, "iy"], [vOutCombined, "xi"]],
        dotLen: C,
        add: [[projBias, "0y"], ...heads.map((h) => [h.vOutBlock, "xi"])]
      },
      dimX: 2 /* T */,
      dimY: 3 /* C */,
      name: "Attention Output"
    });
    let attnResidual = mk({
      t: "i",
      cx: T,
      cz: B,
      cy: C,
      y: vFinalZ,
      xM: 0,
      zM: 0,
      access: { src: attnTarget?.output, x: [0, 1, 0], y: [1, 0, T] },
      deps: { add: [[attnOut, "xy"], [src, "xy"]] },
      dimX: 2 /* T */,
      dimY: 3 /* C */,
      name: "Attention Residual"
    });
    y = vFinalZ + C * cell + margin;
    let ln2 = createLn(0, attnResidual, target?.ln_2);
    let mlpFcWeight = mk({
      t: "w",
      cx: C * 4,
      cz: 1,
      cy: C,
      y,
      xR: attnLeftX,
      zM: 0,
      access: { src: target?.mlp.fcLayer.weight, x: [0, 1, 0], y: [1, 0, 0], scale: C * 0.5 },
      dimX: 11 /* C4 */,
      dimY: 3 /* C */,
      name: "MLP Weights"
    });
    let mlpFcBias = mk({
      t: "w",
      cx: C * 4,
      cz: 1,
      cy: 1,
      y: y - 1 * cell - margin,
      xR: attnLeftX,
      zM: 0,
      access: { src: target?.mlp.fcLayer.bias, x: [0, 1, 0], y: [1, 0, 0], scale: C * 0.5 },
      dimX: 11 /* C4 */,
      dimY: 0 /* None */,
      name: "MLP Bias",
      small: true
    });
    y += C * cell + margin;
    let mlpFc = mk({
      t: "i",
      cx: C * 4,
      cz: B,
      cy: T,
      y,
      xR: attnLeftX,
      zM: 0,
      access: { src: target?.mlp.fcLayer.output, x: [1, 0, 0], y: [0, 1, T], scale: 1 },
      deps: { dot: [[mlpFcWeight, "xi"], [ln2.lnResid, "yi"]], dotLen: C, add: [[mlpFcBias, "x"]] },
      dimX: 11 /* C4 */,
      dimY: 2 /* T */,
      name: "MLP",
      transpose: true
    });
    y += T * cell + margin;
    let mlpAct = mk({
      t: "i",
      cx: C * 4,
      cz: B,
      cy: T,
      y,
      xR: attnLeftX,
      zM: 0,
      access: { src: target?.mlp.mlpGelu, x: [1, 0, 0], y: [0, 1, T], scale: 1 },
      deps: { add: [[mlpFc, "xy"]], special: 2 /* Gelu */ },
      dimX: 11 /* C4 */,
      dimY: 2 /* T */,
      name: "MLP Activation",
      transpose: true
    });
    y += T * cell + margin;
    let mlpProjWeight = mk({
      t: "w",
      cx: C * 4,
      cz: 1,
      cy: C,
      y,
      xR: attnLeftX,
      zM: 0,
      access: { src: target?.mlp.projLayer.weight, x: [1, 0, 0], y: [0, 1, 0], scale: C * 0.5 },
      dimX: 11 /* C4 */,
      dimY: 3 /* C */,
      name: "MLP Projection Weights"
    });
    let mlpProjBias = mk({
      t: "w",
      cx: 1,
      cz: 1,
      cy: C,
      y,
      xR: attnLeftX - C * 4 * cell - margin,
      zM: 0,
      access: { src: target?.mlp.projLayer.bias, x: [1, 0, 0], y: [0, 1, 0], scale: C * 0.5 },
      dimX: 0 /* None */,
      dimY: 3 /* C */,
      small: true,
      name: "MLP Projection Bias"
    });
    let mlpResult = mk({
      t: "i",
      cx: T,
      cz: B,
      cy: C,
      y,
      xL: attnLeftX + margin,
      zM: 0,
      access: { src: target?.mlp.projLayer.output, x: [0, 1, 0], y: [1, 0, T] },
      deps: { dot: [[mlpProjWeight, "iy"], [mlpAct, "ix"]], dotLen: C, add: [[mlpProjBias, "0y"]] },
      dimX: 2 /* T */,
      dimY: 3 /* C */,
      name: "MLP Result"
    });
    let mlpResidual = mk({
      t: "i",
      cx: T,
      cz: B,
      cy: C,
      y,
      xM: 0,
      zM: 0,
      access: { src: target?.mlp.output, x: [0, 1, 0], y: [1, 0, T] },
      deps: { add: [[mlpResult, "xy"], [attnResidual, "xy"]] },
      dimX: 2 /* T */,
      dimY: 3 /* C */,
      name: "MLP Residual"
    });
    y += C * cell - margin;
    let blockCubes = [
      ...ln1.cubes,
      ...heads.flatMap((h) => h.cubes),
      projWeight,
      projBias,
      attnOut,
      attnResidual,
      ...ln2.cubes,
      mlpFcWeight,
      mlpFcBias,
      mlpFc,
      mlpAct,
      mlpProjWeight,
      mlpProjBias,
      mlpResult,
      mlpResidual
    ];
    let headCubes = [...ln1.cubes, ...heads.flatMap((h) => h.cubes)];
    let projCubes = [projWeight, projBias, attnOut, attnResidual];
    let transformerLabel = mkLabel(1, blockCubes);
    let selfAttendLabel = mkLabel(1, [...headCubes, ...projCubes]);
    let projLabel = mkLabel(1, projCubes);
    let mlpLabel = mkLabel(1, [...ln2.cubes, mlpFcWeight, mlpFcBias, mlpFc, mlpAct, mlpProjWeight, mlpProjBias, mlpResult, mlpResidual]);
    cubes.push(...blockCubes);
    return {
      ln1,
      heads,
      labels: [transformerLabel, projLabel, selfAttendLabel, mlpLabel, ...heads.flatMap((h) => h.labels)],
      cubes: blockCubes,
      transformerLabel,
      projLabel,
      selfAttendLabel,
      mlpLabel,
      projWeight,
      projBias,
      attnOut,
      attnResidual,
      mlpFc,
      mlpFcWeight,
      mlpFcBias,
      mlpAct,
      mlpProjWeight,
      mlpProjBias,
      mlpResult,
      mlpResidual,
      ln2
    };
  }
  let blockHalfMargin = 2 * margin;
  y += blockHalfMargin;
  let numColumns = 1;
  let blocksPerColumn = 12;
  if (shape.nBlocks > blocksPerColumn) {
    numColumns = Math.ceil(shape.nBlocks / blocksPerColumn);
  }
  let columnWidth = C * 14 * cell + margin * 2;
  let blockIdxInColumn = 0;
  let blockYTop = y;
  let blocks = [];
  let blockSrc = residual0;
  for (let i = 0; i < nBlocks; i++) {
    if (blockIdxInColumn >= blocksPerColumn) {
      blockIdxInColumn = 0;
      y = blockYTop;
      lnLeftX += columnWidth;
      leftX += columnWidth;
      rightX += columnWidth;
    }
    let target = gptGpuModel?.blocks[i];
    y += blockHalfMargin;
    let block = createLayer(blockSrc, target);
    blocks.push(block);
    blockSrc = block.mlpResidual;
    y += blockHalfMargin;
    blockIdxInColumn++;
  }
  y += blockHalfMargin;
  let ln_f = createLn(0, blockSrc, gptGpuModel?.ln_f);
  cubes.push(...ln_f.cubes);
  let logitsTransposed = false;
  let lmHeadWeight, logits, logitsAgg1, logitsAgg2, logitsSoftmax;
  if (logitsTransposed) {
    lmHeadWeight = mk({
      t: "w",
      cx: vocabSize,
      cz: 1,
      cy: C,
      y,
      xR: lnLeftX,
      zM: 0,
      access: { src: gptGpuModel?.lm_head.weight, x: [0, 1, 0], y: [1, 0, 0], scale: 5 },
      dimX: 6 /* n_vocab */,
      dimY: 3 /* C */,
      name: "LM Head Weights"
    });
    y += C * cell + margin;
    logits = mk({
      t: "i",
      cx: vocabSize,
      cz: B,
      cy: T,
      y,
      xR: lnLeftX,
      zM: 0,
      access: { src: gptGpuModel?.lm_head.output, x: [1, 0, 0], y: [0, 1, T] },
      deps: { dot: [[lmHeadWeight, "xi"], [ln_f.lnResid, "yi"]], dotLen: C },
      dimX: 6 /* n_vocab */,
      dimY: 2 /* T */,
      name: "Logits"
    });
    logitsAgg1 = mk({
      t: "a",
      cx: 1,
      cz: B,
      cy: T,
      y,
      xL: lnLeftX + 1.5 * margin,
      zM: -3 * cell,
      access: { src: gptGpuModel?.softmaxFinal.agg, x: [1, 0, 0], y: [0, 1, T], channel: "r" },
      deps: { add: [[logits, "iy"]], special: 8 /* SoftmaxAggExp */ },
      dimX: 0 /* None */,
      dimY: 2 /* T */,
      name: "SM Agg"
    });
    logitsAgg2 = mk({
      t: "a",
      cx: 1,
      cz: B,
      cy: T,
      y,
      xL: lnLeftX + 1.5 * margin + cell,
      zM: -3 * cell,
      access: { src: gptGpuModel?.softmaxFinal.agg, x: [1, 0, 0], y: [0, 1, T], channel: "g" },
      deps: { add: [[logits, "iy"]], special: 7 /* SoftmaxAggMax */ },
      dimX: 0 /* None */,
      dimY: 2 /* T */,
      name: ""
    });
    y += T * cell + margin;
    logitsSoftmax = mk({
      t: "i",
      cx: vocabSize,
      cz: B,
      cy: T,
      y,
      xR: lnLeftX,
      zM: 0,
      access: { src: gptGpuModel?.softmaxFinal.output, x: [1, 0, 0], y: [0, 1, T] },
      deps: { add: [[logits, "xy"], [logitsAgg1, "iy"], [logitsAgg2, "iy"]], special: 1 /* Softmax */ },
      dimX: 6 /* n_vocab */,
      dimY: 2 /* T */,
      name: "Logits Softmax"
    });
  } else {
    y += C * cell + margin;
    let leftX2 = leftX - T * cell - margin;
    lmHeadWeight = mk({
      t: "w",
      cx: C,
      cy: vocabSize,
      cz: 1,
      y,
      xR: leftX2,
      zM: 0,
      access: { src: gptGpuModel?.lm_head.weight, x: [1, 0, 0], y: [0, 1, 0], scale: 5 },
      dimX: 3 /* C */,
      dimY: 6 /* n_vocab */,
      name: "LM Head Weights"
    });
    logits = mk({
      t: "i",
      cx: T,
      cy: vocabSize,
      cz: B,
      y,
      xR: leftX,
      zM: 0,
      access: { src: gptGpuModel?.lm_head.output, x: [0, 1, 0], y: [1, 0, T] },
      deps: { dot: [[lmHeadWeight, "iy"], [ln_f.lnResid, "xi"]], dotLen: C },
      dimX: 2 /* T */,
      dimY: 6 /* n_vocab */,
      name: "Logits"
    });
    y += vocabSize * cell + margin;
    logitsAgg2 = mk({
      t: "a",
      cx: T,
      cy: 1,
      cz: B,
      y,
      xR: leftX,
      zM: 0,
      access: { src: gptGpuModel?.softmaxFinal.agg, x: [0, 1, 0], y: [1, 0, T], channel: "g" },
      deps: { add: [[logits, "xi"]], special: 7 /* SoftmaxAggMax */ },
      dimX: 2 /* T */,
      dimY: 0 /* None */,
      name: "SM Agg"
    });
    logitsAgg1 = mk({
      t: "a",
      cx: T,
      cy: 1,
      cz: B,
      y: y + cell,
      xR: leftX,
      zM: 0,
      access: { src: gptGpuModel?.softmaxFinal.agg, x: [0, 1, 0], y: [1, 0, T], channel: "r" },
      deps: { add: [[logits, "xi"], [logitsAgg2, "x0"]], special: 8 /* SoftmaxAggExp */ },
      dimX: 2 /* T */,
      dimY: 0 /* None */,
      name: ""
    });
    y += 2 * cell + margin;
    logitsSoftmax = mk({
      t: "i",
      cx: T,
      cy: vocabSize,
      cz: B,
      y,
      xR: leftX,
      zM: 0,
      access: { src: gptGpuModel?.softmaxFinal.output, x: [0, 1, 0], y: [1, 0, T] },
      deps: { add: [[logits, "xy"], [logitsAgg1, "xi"], [logitsAgg2, "xi"]], special: 1 /* Softmax */ },
      dimX: 2 /* T */,
      dimY: 6 /* n_vocab */,
      name: "Logits Softmax"
    });
  }
  let weightCount = vocabSize * C + T * C + nBlocks * (2 * C + 4 * C * C + C + 3 * C + // self attn
  (2 * C + 4 * C + 8 * C * C + C)) + 2 * C;
  cubes.push(lmHeadWeight, logits, logitsAgg2, logitsAgg1, logitsSoftmax);
  for (let i = 0; i < cubes.length; i++) {
    cubes[i].idx = i;
  }
  return {
    cubes,
    cell,
    margin,
    idxObj,
    tokEmbedObj,
    posEmbedObj,
    residual0,
    ln_f,
    lmHeadWeight,
    logits,
    logitsAgg1,
    logitsAgg2,
    logitsSoftmax,
    embedLabel,
    blocks,
    height: y,
    logitsTransposed,
    model: gptGpuModel,
    labels: [embedLabel, ...blocks.flatMap((b) => b.labels)],
    weightCount,
    shape,
    extraSources: {
      idx: gptGpuModel?.inputBuf,
      tokEmbedOut: gptGpuModel?.vocabEmbed.output,
      posEmbedOut: gptGpuModel?.posEmbed.output
    }
  };
}

// features/llm-visualization/upstream/src/llm/components/Tokens.ts
var DEVELO_VISIBLE_INPUT_LABELS = [
  "<d",
  "e",
  "v",
  "e",
  "l",
  "o>"
];
function drawTokens(renderState, layout, display, data, count) {
  let { modelFontBuf: fontBuf, lineRender } = renderState;
  data = data ?? layout.model?.inputTokens?.localBuffer ?? new Float32Array([0, 1, 2]);
  count = count || 6;
  let em = layout.cell * 2;
  let lowerFontSize = em * 1;
  let upperFontSize = em * 2;
  let yLower = layout.idxObj.y - lowerFontSize - layout.cell * 3;
  let yUpper = yLower - upperFontSize;
  function tokenIndexToString(a) {
    return String.fromCharCode("A".charCodeAt(0) + a);
  }
  let strParts = [];
  let strOffset = 0;
  let idxOffset = 0;
  let i = 0;
  for (let a of data) {
    if (i >= count) {
      break;
    }
    let str = i < DEVELO_VISIBLE_INPUT_LABELS.length ? DEVELO_VISIBLE_INPUT_LABELS[i] : tokenIndexToString(a);
    let w = measureTextWidth(fontBuf, str, upperFontSize);
    let w2 = measureTextWidth(fontBuf, "" + a, lowerFontSize);
    strParts.push({ str, val: a, w, offset: strOffset, w2, idxOffset, i });
    strOffset += w;
    idxOffset += w2;
    i += 1;
  }
  let target = layout.idxObj;
  let mtxRes = new Mat4f();
  let totalOffset = -strOffset / 2 - layout.cell / 2 * (count - 1);
  let tokColor = dimStyleColor(9 /* Token */);
  let tokIdxColor = dimStyleColor(10 /* TokenIdx */);
  for (let a of strParts) {
    let tokDrawColor = tokColor;
    if (display.tokenColors) {
      let val = display.tokenColors.mixes[a.i];
      if (val > 0) {
        tokDrawColor = Vec4.lerp(tokColor, display.tokenColors.color2, val);
      }
    }
    let tokIdxDrawColor = tokIdxColor;
    if (display.tokenIdxColors) {
      let val = display.tokenIdxColors.mixes[a.i];
      if (val > 0) {
        tokIdxDrawColor = Vec4.lerp(tokIdxColor, display.tokenIdxColors.color2, val);
      }
    }
    if (display.tokenIdxModelOpacity) {
      tokIdxDrawColor = tokIdxDrawColor.mul(display.tokenIdxModelOpacity[a.i]);
    }
    writeTextToBuffer(fontBuf, a.str, tokDrawColor, totalOffset + a.offset, yUpper, upperFontSize, mtxRes);
    let x = totalOffset + a.offset + a.w / 2 - a.w2 / 2;
    writeTextToBuffer(fontBuf, "" + a.val, tokIdxDrawColor, x, yLower, lowerFontSize, mtxRes);
    let tx = x + a.w2 / 2;
    let bx = cellPosition(layout, target, 0 /* X */, a.i) + layout.cell * 0.5;
    let top = -4;
    let delta = 0.6;
    let bot = -0.3;
    let thick = 0.03;
    let opts = { color: tokIdxDrawColor, thick, n: new Vec3(0, 0, 1), mtx: new Mat4f() };
    addLine2(lineRender, new Vec3(tx, top, 0), new Vec3(tx, top + delta, 0), opts);
    addLine2(lineRender, new Vec3(tx, top + delta, 0), new Vec3(bx, bot - delta, 0), opts);
    addLine2(lineRender, new Vec3(bx, bot - delta, 0), new Vec3(bx, bot, 0), opts);
  }
}

// features/llm-visualization/upstream/src/llm/Interaction.ts
function getDepSrcIdx(dep, destIdx) {
  let mtx = dep.srcIdxMtx;
  let hasXDot = mtx.g(0, 3) !== 0;
  let hasYDot = mtx.g(1, 3) !== 0;
  let srcIdx4 = mtx.mulVec4(Vec4.fromVec3(destIdx, 0));
  let srcIdx = new Vec3(srcIdx4.x, srcIdx4.y, srcIdx4.z);
  let dotDim = hasXDot ? 1 /* Y */ : 0 /* X */;
  return { srcIdx, dotDim, otherDim: dotDim === 0 /* X */ ? 1 /* Y */ : 0 /* X */, isDot: hasXDot || hasYDot };
}
function getDepDotLen(blk, destIdx) {
  if (!blk.deps?.dot) {
    return null;
  }
  let dotLen = null;
  let triLimit = blk.deps.dot.find((d) => d.src.deps?.lowerTri);
  if (triLimit) {
    let { srcIdx, dotDim } = getDepSrcIdx(triLimit, destIdx);
    dotLen = srcIdx.getAt(dotDim);
  }
  return dotLen;
}
function drawDependences(state, blk, idx) {
  let layout = state.layout;
  let deps = blk.deps;
  if (!deps) {
    return;
  }
  function drawDep(dep, destIdx, dotLen) {
    let { srcIdx, dotDim, otherDim, isDot } = getDepSrcIdx(dep, destIdx);
    if (blk.deps?.special === 4 /* InputEmbed */ && dep.src === state.layout.tokEmbedObj) {
      let tokenIdx = getBlockValueAtIdx(state.layout.idxObj, new Vec3(destIdx.x, 0, destIdx.z));
      isDot = false;
      srcIdx.setAt(0 /* X */, tokenIdx ?? 0);
    }
    if (isDot) {
      if (dep.src.deps?.lowerTri) {
        dotLen = dotLen ?? srcIdx.getAt(dotDim);
      }
      let sub = splitGridForHighlight(layout, dep.src, dotDim, srcIdx.getAt(dotDim));
      if (sub && isNotNil(dotLen)) {
        splitGrid(layout, sub, otherDim, dotLen, 0);
        for (let parts of findSubBlocks(sub, otherDim, null, dotLen)) {
          parts.highlight = 0.5;
        }
      } else {
        if (sub) sub.highlight = 0.5;
      }
    } else {
      let sub = splitGridForHighlight(layout, dep.src, 0 /* X */, srcIdx.x);
      if (!sub) return;
      sub = splitGridForHighlight(layout, sub, 1 /* Y */, srcIdx.y);
      if (!sub) return;
      sub = splitGridForHighlight(layout, sub, 2 /* Z */, srcIdx.z);
      if (sub) sub.highlight = 0.5;
    }
  }
  if (deps.dot) {
    let dotLen = getDepDotLen(blk, idx);
    for (let dep of deps.dot) {
      drawDep(dep, idx, dotLen);
    }
  }
  if (deps.add) {
    for (let dep of deps.add) {
      drawDep(dep, idx);
    }
  }
}

// features/llm-visualization/upstream/src/llm/components/ModelCard.ts
var _lineRectArr = new Float32Array(3 * 4);
function drawLineRect(render, tl, br, opts) {
  _lineRectArr[0] = tl.x;
  _lineRectArr[1] = tl.y;
  _lineRectArr[2] = 0;
  _lineRectArr[3] = br.x;
  _lineRectArr[4] = tl.y;
  _lineRectArr[5] = 0;
  _lineRectArr[6] = br.x;
  _lineRectArr[7] = br.y;
  _lineRectArr[8] = 0;
  _lineRectArr[9] = tl.x;
  _lineRectArr[10] = br.y;
  _lineRectArr[11] = 0;
  drawLineSegs(render.lineRender, _lineRectArr, makeLineOpts({ ...opts, closed: true }));
}

// features/llm-visualization/upstream/src/llm/components/TextLayout.ts
function lineHeight(fontOpts) {
  return fontOpts.size * 1.2;
}
function mkTextBlock(args) {
  let type = args.type ?? (args.text ? 1 /* Text */ : args.subs ? 0 /* Line */ : isNotNil(args.cellX) && isNotNil(args.cellY) ? 4 /* Cells */ : null);
  if (isNil(type)) {
    throw new Error("Unknown text block type");
  }
  let opts = args.opts;
  if (opts && args.color) {
    opts = { ...opts, color: args.color };
  }
  if (!opts) {
    throw new Error("No font opts");
  }
  return {
    type,
    id: args.id,
    text: args.text,
    align: args.align,
    opts,
    size: args.size ?? new Vec3(0, 0, 0),
    offset: args.offset ?? new Vec3(0, 0, 0),
    subs: args.subs?.filter(isNotNil).map((a) => mkTextBlock({ ...a, opts: a.opts ?? opts })),
    rectOpts: args.rectOpts,
    draw: args.draw,
    cellX: args.cellX,
    cellY: args.cellY
  };
}
function sqrtSpacing(opts, inner) {
  return {
    tl: new Vec3(inner.size.y * 0.9, inner.size.y * 0.2),
    br: new Vec3(inner.size.y * 0.1, 0)
  };
}
function divideSpacing(opts, inner) {
  return {
    padX: 0,
    padInnerY: inner.size.y * 0.5
  };
}
var cellSize = 7;
function cellSizing(blk) {
  return {
    size: new Vec3(blk.cellX * cellSize, blk.cellY * cellSize),
    pad: cellSize * 1
  };
}
function sizeBlock(render, blk) {
  let opts = blk.opts;
  switch (blk.type) {
    case 0 /* Line */: {
      let x = 0;
      let maxH = 0;
      for (let sub of blk.subs) {
        sizeBlock(render, sub);
        x += sub.size.x;
        maxH = Math.max(maxH, sub.size.y);
      }
      blk.size = new Vec3(x, maxH, 0);
      if (blk.rectOpts) {
        blk.size.x += cellSize * 0.5;
        blk.size.y += cellSize * 0.5;
      }
      break;
    }
    case 1 /* Text */: {
      if (isNil(blk.text)) {
        throw new Error("Text block has no text");
      }
      blk.size = new Vec3(
        Math.max(blk.size.x, measureText(render.modelFontBuf, blk.text, opts)),
        lineHeight(opts)
      );
      break;
    }
    case 2 /* Sqrt */: {
      let sub = blk.subs[0];
      sizeBlock(render, sub);
      let spacing = sqrtSpacing(opts, sub);
      blk.size = sub.size.add(spacing.tl).add(spacing.br);
      break;
    }
    case 3 /* Divide */: {
      let subA = blk.subs[0];
      let subB = blk.subs[1];
      sizeBlock(render, subA);
      sizeBlock(render, subB);
      let spacing = divideSpacing(opts, subA);
      blk.size = new Vec3(Math.max(subA.size.x, subB.size.x) + spacing.padX, subA.size.y + subB.size.y + spacing.padInnerY, 0);
      break;
    }
    case 4 /* Cells */: {
      let spacing = cellSizing(blk);
      blk.size = new Vec3(spacing.size.x + spacing.pad, spacing.size.y);
      break;
    }
    case 5 /* Custom */: {
      break;
    }
    default: {
      let _exhaustCheck = blk.type;
    }
  }
}
function layoutBlock(blk) {
  switch (blk.type) {
    case 0 /* Line */: {
      let x = blk.offset.x + cellSize * 0.25;
      let midY = blk.offset.y + blk.size.y / 2;
      for (let sub of blk.subs) {
        sub.offset = new Vec3(x, midY - sub.size.y / 2).round_();
        layoutBlock(sub);
        x += sub.size.x;
      }
      break;
    }
    case 2 /* Sqrt */: {
      let sub = blk.subs[0];
      sub.offset = blk.offset.add(sqrtSpacing(blk.opts, sub).tl).round_();
      layoutBlock(sub);
      break;
    }
    case 3 /* Divide */: {
      let subA = blk.subs[0];
      let subB = blk.subs[1];
      let midX = blk.size.x / 2;
      subA.offset = blk.offset.add(new Vec3(midX - subA.size.x / 2, 0)).round_();
      subB.offset = blk.offset.add(new Vec3(midX - subB.size.x / 2, blk.size.y - subB.size.y)).round_();
      layoutBlock(subA);
      layoutBlock(subB);
      break;
    }
    case 1 /* Text */: {
      break;
    }
    case 4 /* Cells */: {
      break;
    }
    case 5 /* Custom */: {
      break;
    }
    default: {
      let _exhaustCheck = blk.type;
    }
  }
}
function drawBlock(render, blk) {
  switch (blk.type) {
    case 0 /* Line */: {
      for (let sub of blk.subs) {
        drawBlock(render, sub);
      }
      if (blk.rectOpts) {
        let rectOpts = makeLineOpts(blk.rectOpts);
        let tl = blk.offset.round().add(new Vec3(0.5, 0.5));
        let br = blk.offset.add(blk.size).round().add(new Vec3(0.5, 0.5));
        drawRoundedRect(render, tl, br, rectOpts.color.mul(0.24), rectOpts.mtx, 2);
        drawLineRect(render, tl, br, rectOpts);
      }
      break;
    }
    case 1 /* Text */: {
      let xPos = blk.offset.x;
      if (blk.align === 2 /* Right */) {
        xPos = blk.offset.x + blk.size.x - measureText(render.modelFontBuf, blk.text, blk.opts);
      }
      drawText(render.modelFontBuf, blk.text, xPos, blk.offset.y + blk.opts.size * 0.1, blk.opts);
      break;
    }
    case 2 /* Sqrt */: {
      let sub = blk.subs[0];
      let subY = sub.size.y;
      let sqrtX = blk.offset.x;
      let sqrtY = blk.offset.y - subY * 0.9;
      let sqrtSize = subY * 1.8;
      let mathOpts = { ...blk.opts, faceName: "cmsy10", size: sqrtSize };
      let lineOpts = makeLineOpts({ color: blk.opts.color, n: new Vec3(0, 0, 1), mtx: blk.opts.mtx, thick: 0.4 });
      let lineX = sqrtX + sqrtSize * 0.5;
      let lineY = sqrtY + sqrtSize * 0.5;
      addLine2(render.lineRender, new Vec3(lineX, lineY).round_(), new Vec3(sub.offset.x + sub.size.x, lineY).round_(), lineOpts);
      drawText(render.modelFontBuf, "p", sqrtX, sqrtY, mathOpts);
      drawBlock(render, sub);
      break;
    }
    case 3 /* Divide */: {
      let subA = blk.subs[0];
      let subB = blk.subs[1];
      let lineOpts = makeLineOpts({ color: blk.opts.color, n: new Vec3(0, 0, 1), mtx: blk.opts.mtx, thick: 0.4 });
      let lineY = lerp(subA.offset.y + subA.size.y, subB.offset.y, 0.5) + 1;
      addLine2(render.lineRender, new Vec3(blk.offset.x, lineY), new Vec3(blk.offset.x + blk.size.x, lineY), lineOpts);
      drawBlock(render, blk.subs[0]);
      drawBlock(render, blk.subs[1]);
      break;
    }
    case 4 /* Cells */: {
      let center = blk.offset.add(new Vec3(blk.size.x / 2, blk.size.y / 2));
      let spacing = cellSizing(blk);
      drawCells(render, new Vec3(blk.cellX, blk.cellY), center, spacing.size, blk.opts.color, blk.opts.mtx);
      break;
    }
    case 5 /* Custom */: {
      blk.draw?.(blk, render);
      break;
    }
    default: {
      let _exhaustCheck = blk.type;
    }
  }
}
function drawCells(render, nCells, center, size, color, mtx) {
  let thick = 0.4;
  let tl = center.mulAdd(size, -0.5).add(new Vec3(0.5, 0.5));
  let br = center.mulAdd(size, 0.5).add(new Vec3(0.5, 0.5));
  let lineOpts = makeLineOpts({ color, mtx, n: new Vec3(0, 0, 1), thick });
  drawLineRect(render, tl, br, lineOpts);
  addQuad(render.triRender, tl, br, color.mul(0.3), mtx);
  for (let i = 1; i < nCells.x; i++) {
    let lineX = tl.x + i * cellSize;
    addLine2(render.lineRender, new Vec3(lineX, tl.y, 0), new Vec3(lineX, br.y, 0), lineOpts);
  }
  for (let i = 1; i < nCells.y; i++) {
    let lineY = tl.y + i * cellSize;
    addLine2(render.lineRender, new Vec3(tl.x, lineY, 0), new Vec3(br.x, lineY, 0), lineOpts);
  }
}

// features/llm-visualization/upstream/src/llm/components/DataFlow.ts
function drawDataFlow(state, blk, destIdx, pinIdx) {
  if (!blk.deps) {
    return;
  }
  let prevPhase = state.render.sharedRender.activePhase;
  state.render.sharedRender.activePhase = 3 /* Overlay2D */;
  pinIdx = pinIdx ?? destIdx;
  let cellPos = new Vec3(
    cellPosition(state.layout, blk, 0 /* X */, pinIdx.x) + state.layout.cell * 0.5,
    cellPosition(state.layout, blk, 1 /* Y */, pinIdx.y) + state.layout.cell * 0.5,
    cellPosition(state.layout, blk, 2 /* Z */, pinIdx.z) + state.layout.cell * 1.1
  );
  let resMtx = new Mat4f();
  let screenPos = projectToScreen(state, cellPos).round_();
  let center = screenPos.add(new Vec3(0, -50));
  let dataFlowArgs = {
    state,
    center,
    blk,
    destIdx,
    mtx: resMtx
  };
  let bb = new BoundingBox3d();
  if (blk.deps.lowerTri && destIdx.x > destIdx.y) {
    drawZeroSymbol(dataFlowArgs);
  } else if (blk.deps.special === 4 /* InputEmbed */) {
    bb = drawOLInputEmbed(dataFlowArgs);
  } else if (blk.deps.special === 3 /* LayerNorm */) {
    bb = drawLayerNorm(dataFlowArgs);
  } else if (blk.deps.special === 5 /* LayerNormMu */) {
    bb = drawLayerNormMuAgg(dataFlowArgs);
  } else if (blk.deps.special === 6 /* LayerNormSigma */) {
    bb = drawLayerNormSigmaAgg(dataFlowArgs);
  } else if (blk.deps.special === 7 /* SoftmaxAggMax */) {
    bb = drawSoftmaxAggMax(dataFlowArgs);
  } else if (blk.deps.special === 8 /* SoftmaxAggExp */) {
    bb = drawSoftmaxAggExp(dataFlowArgs);
  } else if (blk.deps.special === 1 /* Softmax */) {
    bb = drawSoftmax(dataFlowArgs);
  } else if (blk.deps.special === 9 /* Attention */) {
    bb = drawAttention(dataFlowArgs);
  } else if (blk.deps.special === 2 /* Gelu */) {
    bb = drawGeluActivation(dataFlowArgs);
  } else if (blk.deps.dot) {
    bb = drawOLMatrixMul(dataFlowArgs);
  } else if (blk.deps.add && blk.deps.add.length === 2) {
    bb = drawResidualAdd(dataFlowArgs);
  }
  if (!bb.empty) {
    let cellIdxBb = drawCellIndexAndValue(dataFlowArgs, bb);
    let fullBB = new BoundingBox3d(bb.min, bb.max, cellIdxBb.min, cellIdxBb.max);
    drawDepArrows(dataFlowArgs, fullBB);
  }
  state.render.sharedRender.activePhase = prevPhase;
}
function drawCircle(render, center, radius, width, color, mtx) {
  let nPoints = 30;
  let buf = new Float32Array(nPoints * 3);
  for (let i = 0; i < nPoints; i++) {
    let theta = i / nPoints * Math.PI * 2;
    buf[i * 3 + 0] = center.x + Math.cos(theta) * radius;
    buf[i * 3 + 1] = center.y + Math.sin(theta) * radius;
    buf[i * 3 + 2] = center.z;
  }
  drawLineSegs(render.lineRender, buf, makeLineOpts({ color, n: new Vec3(0, 0, 1), thick: width, closed: true, mtx }));
}
function projectToScreen(state, modelPos) {
  let model = state.camera.modelMtx;
  let view = state.camera.viewMtx;
  let ndc = view.mulVec3Proj(model.mulVec3Affine(modelPos));
  return new Vec3(
    (ndc.x + 1) * 0.5 * state.render.size.x,
    (1 - ndc.y) * 0.5 * state.render.size.y,
    0
  );
}
var weightSrcColor = new Vec4(0.4, 0.4, 0.9, 1);
var workingSrcColor = new Vec4(0.3, 0.7, 0.3, 1);
var opColor = new Vec4(0.9, 0.9, 0.9, 1);
var backWhiteColor = new Vec4(0, 0, 0, 1).mul(1);
var nameColor = new Vec4(1, 1, 1, 1);
var embedBlockHeight = 30;
var tokEmbedBlockWidth = 40;
var posEmbedBlockWidth = 35;
function drawOLInputEmbed(args) {
  let { center, mtx } = args;
  return drawMaths(args, center, mkTextBlock({
    opts: { color: nameColor, mtx, size: 16 },
    subs: [
      { type: 5 /* Custom */, draw: (blk) => drawOLIndexLookup(args, blk.offset), size: new Vec3(tokEmbedBlockWidth, embedBlockHeight) },
      { text: " + " },
      { type: 5 /* Custom */, draw: (blk) => drawOLPosEmbedLookup(args, blk.offset), size: new Vec3(posEmbedBlockWidth, embedBlockHeight) }
    ]
  }), [20, 0, 0, 0]);
}
function getBlockValueAtIdx(blk, blkIdx) {
  let localBuffer = blk.access?.src.localBuffer;
  if (!blk.access || !localBuffer) {
    return null;
  }
  let bufferTex = blk.access.src;
  let m = blk.access.mat;
  let bx = blkIdx.x, by = blkIdx.y, bz = blkIdx.z;
  let texX = Math.round(m[0] * bx + m[1] * by + m[2] * bz + m[3]);
  let texY = Math.round(m[4] * bx + m[5] * by + m[6] * bz + m[7]);
  let channelIdx = blk.access.channel === "r" ? 0 : blk.access.channel === "g" ? 1 : blk.access.channel === "b" ? 2 : 3;
  let idx = texY * bufferTex.width * bufferTex.channels + texX * bufferTex.channels + channelIdx;
  if (idx < 0 || idx >= localBuffer.length) {
    return null;
  }
  return localBuffer[idx];
}
function drawOLIndexLookup(args, offset) {
  let { state, center, destIdx, mtx } = args;
  let tokenIdx = getBlockValueAtIdx(state.layout.idxObj, new Vec3(destIdx.x, 0, destIdx.z));
  let tokenPct = isNotNil(tokenIdx) ? tokenIdx / (state.layout.tokEmbedObj.cx - 1) : 0.3;
  let heightPct = destIdx.y / (state.layout.residual0.cy - 1);
  let pos = center.add(new Vec3(-35, -20, 0));
  let color = Colors.Weights;
  let tl = offset;
  let br = tl.add(new Vec3(tokEmbedBlockWidth, embedBlockHeight));
  drawLineRect(state.render, tl, br, makeLineOpts({ color, mtx, n: new Vec3(0, 0, 1), thick: 0.4 }));
  addQuad(state.render.triRender, tl, br, backWhiteColor, mtx);
  let colW = 8;
  let colTl = new Vec3(tl.x + lerp(0, br.x - tl.x - colW, tokenPct), tl.y);
  let colBr = new Vec3(colTl.x + colW, br.y);
  let cellTl = new Vec3(colTl.x, colTl.y + lerp(0, br.y - tl.y - colW, heightPct));
  let cellBr = new Vec3(colBr.x, cellTl.y + colW);
  addQuad(state.render.triRender, colTl, colBr, color.mul(0.3), mtx);
  addQuad(state.render.triRender, cellTl, cellBr, color, mtx);
  let lineColor = Colors.Intermediates;
  let lineEndX = colTl.x + colW / 2;
  let lineEndY = colTl.y - 5;
  let lineStartX = br.x;
  let lineHeight2 = 10;
  let pts = new Float32Array([
    lineStartX,
    lineEndY - lineHeight2,
    0,
    lineEndX,
    lineEndY - lineHeight2,
    0,
    lineEndX,
    lineEndY,
    0
  ]);
  let lineOpts = makeLineOpts({ color: lineColor, mtx, n: new Vec3(0, 0, 1), thick: 0.5 });
  drawLineSegs(state.render.lineRender, pts, lineOpts);
  drawCells(state.render, new Vec3(1, 1), new Vec3(lineStartX + 8, lineEndY - lineHeight2), new Vec3(7, 7), Colors.Intermediates, mtx);
}
function drawOLPosEmbedLookup(args, offset) {
  let { state, center, destIdx, mtx } = args;
  let posPct = destIdx.x / (state.layout.posEmbedObj.cx - 1);
  let heightPct = destIdx.y / (state.layout.residual0.cy - 1);
  let pos = center.add(new Vec3(35, -20, 0));
  let color = Colors.Weights;
  let tl = offset;
  let br = tl.add(new Vec3(tokEmbedBlockWidth, embedBlockHeight));
  drawLineRect(state.render, tl, br, makeLineOpts({ color, mtx, n: new Vec3(0, 0, 1), thick: 0.4 }));
  addQuad(state.render.triRender, tl, br, backWhiteColor, mtx);
  let colW = 8;
  let colTl = new Vec3(tl.x + lerp(0, br.x - tl.x - colW, posPct), tl.y);
  let colBr = new Vec3(colTl.x + colW, br.y);
  let cellTl = new Vec3(colTl.x, colTl.y + lerp(0, br.y - tl.y - colW, heightPct));
  let cellBr = new Vec3(colBr.x, cellTl.y + colW);
  addQuad(state.render.triRender, colTl, colBr, color.mul(0.3), mtx);
  addQuad(state.render.triRender, cellTl, cellBr, color, mtx);
  let textOpts = { color: new Vec4(1, 1, 1, 1).mul(0.8), mtx, size: 20 };
  let tw = measureText(state.render.modelFontBuf, "t", textOpts);
  drawText(state.render.modelFontBuf, "t", (cellTl.x + cellBr.x) / 2 - tw / 2, colTl.y - 3 - textOpts.size, textOpts);
}
function drawOLMatrixMul(args) {
  let { center, mtx, blk } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let hasAdd = !!blk.deps.add;
  let dotA = blk.deps.dot[0];
  let dotB = blk.deps.dot[1];
  function cellSizeAndColor(dep) {
    let isRow = dep.srcIdxMtx.g(0, 3) === 1;
    return {
      cellX: isRow ? 4 : 1,
      cellY: isRow ? 1 : 4,
      color: dep.src.t === "w" ? weightSrcColor : workingSrcColor
    };
  }
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [
      hasAdd ? { cellX: 1, cellY: 1, color: weightSrcColor } : null,
      hasAdd ? { text: " + dot(" } : { text: "dot(" },
      cellSizeAndColor(dotA),
      { text: "," },
      cellSizeAndColor(dotB),
      { text: ")" }
    ].filter(isNotNil)
  });
  return drawMaths(args, center, textBlock);
}
function drawRoundedRect(state, tl, br, color, mtx, radius) {
  if (radius === 0) {
    addQuad(state.triRender, tl, br, color, mtx);
    return;
  }
  radius = Math.min(radius, (br.x - tl.x) / 2, (br.y - tl.y) / 2);
  let n = new Vec3(0, 0, 1);
  let innerQuadTl = tl.add(new Vec3(radius, radius));
  let innerQuadBr = br.sub(new Vec3(radius, radius));
  addQuad(state.triRender, innerQuadTl, innerQuadBr, color, mtx);
  addVert(state.triRender, new Vec3(innerQuadBr.x, br.y), color, n, mtx);
  addVert(state.triRender, new Vec3(innerQuadBr.x, innerQuadBr.y), color, n, mtx);
  for (let cIdx = 0; cIdx < 4; cIdx++) {
    let pivot = new Vec3(
      cIdx < 2 ? innerQuadTl.x : innerQuadBr.x,
      (cIdx + 1) % 4 < 2 ? innerQuadBr.y : innerQuadTl.y
    );
    let startTheta = (cIdx + 1) % 4 * Math.PI / 2;
    let nRadiusVerts = 6;
    for (let i = 0; i < nRadiusVerts + 1; i++) {
      let pt = new Vec3(
        pivot.x + radius * Math.cos(startTheta + i * Math.PI / nRadiusVerts / 2),
        pivot.y + radius * Math.sin(startTheta + i * Math.PI / nRadiusVerts / 2)
      );
      addVert(state.triRender, pt, color, n, mtx);
      addVert(state.triRender, pivot, color, n, mtx);
    }
  }
  addPrimitiveRestart(state.triRender);
}
function drawMaths(args, bottomMiddle, textBlk, pad) {
  let { state, mtx } = args;
  let value = getBlockValueAtIdx(args.blk, args.destIdx);
  if (textBlk.type === 0 /* Line */) {
    textBlk.subs.push(
      mkTextBlock({ text: "  =  ", opts: textBlk.opts })
    );
    if (isNotNil(value)) {
      textBlk.subs.push(
        mkTextBlock({ text: value.toFixed(2), opts: textBlk.opts, size: new Vec3(35, 0), align: 2 /* Right */ })
      );
    }
  }
  sizeBlock(state.render, textBlk);
  textBlk.offset = new Vec3(bottomMiddle.x - textBlk.size.x / 2, bottomMiddle.y - textBlk.size.y);
  layoutBlock(textBlk);
  let padX = 4;
  let padY = 4;
  let tl = textBlk.offset.sub(new Vec3(padX + getPad(pad, 2), padY + getPad(pad, 0)));
  let br = textBlk.offset.add(textBlk.size).add(new Vec3(padX * 2 + getPad(pad, 1), padY + getPad(pad, 3)));
  drawRoundedRect(state.render, tl, br, backWhiteColor, mtx, 4);
  drawBlock(state.render, textBlk);
  return new BoundingBox3d(tl, br);
}
function getPad(pad, dir) {
  if (Array.isArray(pad)) {
    return pad[dir];
  } else if (typeof pad === "number") {
    return pad;
  }
  return 0;
}
function drawLayerNormMuAgg(args) {
  let { center, mtx } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [
      { text: "E[", color: workingSrcColor },
      { cellX: 1, cellY: 3, color: workingSrcColor },
      { text: "]", color: workingSrcColor }
    ]
  });
  return drawMaths(args, center, textBlock);
}
function drawLayerNormSigmaAgg(args) {
  let { center, mtx } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [{
      type: 2 /* Sqrt */,
      subs: [
        { type: 0 /* Line */, subs: [
          { text: "Var[", color: workingSrcColor },
          { cellX: 1, cellY: 3, color: workingSrcColor },
          { text: "]", color: workingSrcColor },
          { text: " + \u03B5" }
        ] }
      ]
    }]
  });
  return drawMaths(args, center, textBlock);
}
function drawLayerNorm(args) {
  let { center, mtx } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let blk = mkTextBlock({
    opts: fontOpts,
    subs: [
      {
        type: 3 /* Divide */,
        subs: [
          {
            subs: [
              { cellX: 1, cellY: 1, color: workingSrcColor },
              { text: " \u2014 " },
              {
                type: 0 /* Line */,
                rectOpts: { color: Colors.Aggregates.mul(0.8), mtx, thick: 1, dash: 6 },
                subs: [
                  { text: "E[", color: workingSrcColor },
                  { cellX: 1, cellY: 3, color: workingSrcColor },
                  { text: "]", color: workingSrcColor }
                ]
              }
            ]
          },
          {
            type: 0 /* Line */,
            rectOpts: { color: Colors.Aggregates.mul(0.8), mtx, thick: 1, dash: 6 },
            subs: [{
              type: 2 /* Sqrt */,
              subs: [
                { type: 0 /* Line */, subs: [
                  { text: "Var[", color: workingSrcColor },
                  { cellX: 1, cellY: 3, color: workingSrcColor },
                  { text: "]", color: workingSrcColor },
                  { text: " + \u03B5" }
                ] }
              ]
            }]
          }
        ]
      },
      { text: "  \u2027 " },
      { text: "\u03B3", color: weightSrcColor },
      { text: " + " },
      { text: "\u03B2", color: weightSrcColor }
    ]
  });
  return drawMaths(args, center, blk);
}
function drawResidualAdd(args) {
  let { center, mtx } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [
      { cellX: 1, cellY: 1, opts: { ...fontOpts, color: workingSrcColor } },
      { text: " + " },
      { cellX: 1, cellY: 1, opts: { ...fontOpts, color: workingSrcColor } }
    ]
  });
  return drawMaths(args, center, textBlock);
}
function drawZeroSymbol(args) {
  let { center, mtx } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [
      { text: "-" }
    ]
  });
  return drawMaths(args, center, textBlock);
}
function drawSoftmaxAggMax(args) {
  let { center, mtx } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [
      { text: "max(" },
      { cellX: 3, cellY: 1, color: workingSrcColor },
      { text: ")" }
    ]
  });
  return drawMaths(args, center, textBlock);
}
function drawSoftmaxAggExp(args) {
  let { center, mtx } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [
      { text: "\u03A3", opts: { ...fontOpts, size: fontOpts.size * 1.5 } },
      { text: "exp(" },
      { cellX: 1, cellY: 1, color: workingSrcColor },
      { text: " - " },
      {
        type: 0 /* Line */,
        rectOpts: { color: Colors.Aggregates.mul(0.8), mtx, thick: 1, dash: 6 },
        subs: [
          { text: "max(" },
          { cellX: 3, cellY: 1, color: workingSrcColor },
          { text: ")" }
        ]
      },
      { text: ")" }
    ]
  });
  return drawMaths(args, center, textBlock);
}
function drawSoftmax(args) {
  let { center, mtx } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [{
      type: 3 /* Divide */,
      subs: [{
        subs: [
          { text: "exp(" },
          { cellX: 1, cellY: 1, color: workingSrcColor },
          { text: " - " },
          {
            rectOpts: { color: Colors.Aggregates.mul(0.8), mtx, thick: 1, dash: 6 },
            subs: [
              { text: "max(" },
              { cellX: 3, cellY: 1, color: workingSrcColor },
              { text: ")" }
            ]
          },
          { text: ")" }
        ]
      }, {
        type: 0 /* Line */,
        rectOpts: { color: Colors.Aggregates.mul(0.8), mtx, thick: 1, dash: 6 },
        subs: [
          { text: "\u03A3", opts: { ...fontOpts, size: fontOpts.size * 1.5 } },
          { text: "exp(" },
          { cellX: 1, cellY: 1, color: workingSrcColor },
          { text: " - " },
          {
            type: 0 /* Line */,
            subs: [
              { text: "max(" },
              { cellX: 3, cellY: 1, color: workingSrcColor },
              { text: ")" }
            ]
          },
          { text: ")" }
        ]
      }]
    }]
  });
  return drawMaths(args, center, textBlock);
}
function drawAttention(args) {
  let { center, mtx, blk } = args;
  let fontOpts = { color: opColor, mtx, size: 16 };
  let dotA = blk.deps.dot[0];
  let dotB = blk.deps.dot[1];
  function cellSizeAndColor(dep) {
    let isRow = dep.srcIdxMtx.g(0, 3) === 1;
    return {
      cellX: isRow ? 4 : 1,
      cellY: isRow ? 1 : 4,
      color: dep.src.t === "w" ? weightSrcColor : workingSrcColor
    };
  }
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [
      { text: "dot(" },
      cellSizeAndColor(dotA),
      { text: "," },
      cellSizeAndColor(dotB),
      { text: ") / " },
      {
        type: 2 /* Sqrt */,
        subs: [{ text: "A" }]
      }
    ]
  });
  return drawMaths(args, center, textBlock);
}
function drawGeluActivation(args) {
  let { state, center, mtx, blk, destIdx } = args;
  let geluX = (x) => x * 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));
  let w = 70;
  let h = 50;
  let tl = center.sub(new Vec3(w / 2, h, 0));
  let br = center.add(new Vec3(w / 2, 0, 0));
  drawRoundedRect(state.render, tl, br, backWhiteColor, mtx, 4);
  let halfW = 3;
  let halfH = halfW * h / w;
  let hOffset = 1.2;
  let mappingX = createMapping(tl.x, br.x, -halfW, halfW);
  let mappingY = createMapping(br.y, tl.y, -halfH + hOffset, halfH + hOffset);
  let nPts = 30;
  let pts = new Float32Array(nPts * 3);
  for (let i = 0; i < nPts; i++) {
    let x = -halfW + i * halfW * 2 / (nPts - 1);
    let y = geluX(x);
    pts[i * 3 + 0] = mappingX(x);
    pts[i * 3 + 1] = mappingY(y);
  }
  let axisLineOpts = makeLineOpts({ color: new Vec4(0.5, 0.5, 0.5, 1), mtx, thick: 1.5 });
  addLine2(state.render.lineRender, new Vec3(tl.x, mappingY(0)), new Vec3(br.x, mappingY(0)), axisLineOpts);
  addLine2(state.render.lineRender, new Vec3(mappingX(0), tl.y), new Vec3(mappingX(0), br.y), axisLineOpts);
  let curveLineOpts = makeLineOpts({ color: Colors.Intermediates, mtx, thick: 3.5 });
  drawLineSegs(state.render.lineRender, pts, curveLineOpts);
  let srcBlk = blk.deps.add[0].src;
  let srcVal = getBlockValueAtIdx(srcBlk, destIdx);
  if (isNotNil(srcVal)) {
    let destVal = geluX(srcVal);
    drawCircle(state.render, new Vec3(mappingX(srcVal), mappingY(destVal)), 2, 1, Colors.Intermediates, mtx);
  }
  let bb = new BoundingBox3d(tl, br);
  return bb;
}
function createMapping(range0, range1, domain0, domain1) {
  let m = (range1 - range0) / (domain1 - domain0);
  let b = range0 - m * domain0;
  return (x) => m * x + b;
}
function drawCellIndexAndValue(args, bb) {
  let { center, mtx, blk, destIdx } = args;
  let fontOpts = { color: opColor, mtx, size: 14 };
  function mapDimToSub(dim, idx) {
    if (dim === 0 /* None */) {
      return null;
    }
    let posValue = destIdx.getAt(idx);
    let color = dimStyleColor(dim);
    let text = `${dimStyleTextShort(dim)}: ${posValue}`;
    return { text, color };
  }
  let xDim = mapDimToSub(blk.dimX, 0);
  let yDim = mapDimToSub(blk.dimY, 1);
  let textBlock = mkTextBlock({
    opts: fontOpts,
    subs: [
      xDim,
      xDim && yDim && { text: ", " },
      yDim
    ]
  });
  let padX = 4;
  let padY = 4;
  sizeBlock(args.state.render, textBlock);
  textBlock.offset = new Vec3(args.center.x - textBlock.size.x / 2, bb.min.y - fontOpts.size * 1.2 - padX, 0);
  layoutBlock(textBlock);
  let tl = textBlock.offset.sub(new Vec3(padX, padY));
  let br = textBlock.offset.add(textBlock.size).add(new Vec3(padX * 2, padY * 2));
  drawRoundedRect(args.state.render, tl, br, backWhiteColor, mtx, 4);
  drawBlock(args.state.render, textBlock);
  return new BoundingBox3d(tl, br);
}
function drawDepArrows(args, bb) {
  let { state, mtx, blk, destIdx } = args;
  if (!blk.deps) {
    return;
  }
  function drawDepArrow(dep, dotLen) {
    let { srcIdx, otherDim, isDot } = getDepSrcIdx(dep, destIdx);
    if (dep.src.opacity === 0) {
      return;
    }
    if (isDot) {
      let { cx } = dimProps(dep.src, otherDim);
      srcIdx.setAt(otherDim, (dotLen ?? cx) / 2);
    }
    if (blk.deps?.special === 4 /* InputEmbed */ && dep.src === args.state.layout.tokEmbedObj) {
      let tokenIdx = getBlockValueAtIdx(state.layout.idxObj, new Vec3(destIdx.x, 0, destIdx.z));
      srcIdx.setAt(0 /* X */, tokenIdx ?? 0);
    }
    let srcT = dep.src.t;
    let color = srcT === "w" ? Colors.Weights : srcT === "i" ? Colors.Intermediates : Colors.Aggregates;
    drawArrow2(dep.src, srcIdx, color, false);
  }
  function drawFinalArrow() {
    drawArrow2(blk, destIdx, new Vec4(0, 0, 0, 1), true);
  }
  function drawArrow2(blk2, idx, color, reverse) {
    let cellPos = new Vec3(
      cellPosition(state.layout, blk2, 0 /* X */, idx.x) + state.layout.cell * 0.5,
      cellPosition(state.layout, blk2, 1 /* Y */, idx.y) + state.layout.cell * 0.5,
      cellPosition(state.layout, blk2, 2 /* Z */, idx.z) + state.layout.cell * 1.1
    );
    let lineOpts = makeLineOpts({ n: new Vec3(0, 0, 1), color, mtx, thick: 0.5, dash: 10 });
    let source = projectToScreen(state, cellPos);
    let center = bb.center();
    let dir = source.sub(center).normalize();
    let tVals = [
      (bb.min.x - center.x) / dir.x,
      (bb.max.x - center.x) / dir.x,
      (bb.min.y - center.y) / dir.y,
      (bb.max.y - center.y) / dir.y
    ];
    let actualTarget = null;
    for (let t of tVals) {
      let p = center.mulAdd(dir, t);
      let eps = 1e-5;
      if (t > 0 && p.x > bb.min.x - eps && p.y > bb.min.y - eps && p.x < bb.max.x + eps && p.y < bb.max.y + eps) {
        actualTarget = center.mulAdd(dir, t + 4);
        break;
      }
    }
    if (actualTarget) {
      if (reverse) {
        let tmp = source;
        source = actualTarget;
        actualTarget = tmp;
      }
      drawArc(state, source, actualTarget, color, mtx, 1);
    }
  }
  if (blk.deps.add) {
    for (let dep of blk.deps.add) {
      drawDepArrow(dep);
    }
  }
  if (blk.deps.dot) {
    let dotLen = getDepDotLen(blk, destIdx);
    for (let dep of blk.deps.dot) {
      drawDepArrow(dep, dotLen);
    }
  }
  drawFinalArrow();
}
function drawArc(state, a, b, color, mtx, thick) {
  let dir = b.sub(a).normalize();
  let bisect = Vec3.cross(dir, new Vec3(0, 0, 1)).normalize();
  let center = a.lerp(b, 0.5).add(bisect.mul(a.dist(b) * -2));
  let radius = a.dist(center);
  let endAngle = Math.atan2(b.y - center.y, b.x - center.x);
  let startAngle = Math.atan2(a.y - center.y, a.x - center.x);
  if (endAngle < startAngle) {
    endAngle += Math.PI * 2;
  }
  if (endAngle - startAngle > Math.PI) {
    endAngle -= Math.PI * 2;
  }
  let lineOpts = makeLineOpts({ color, mtx, thick, dash: 0 });
  let nPts = 32;
  let pts = new Float32Array(3 * nPts);
  for (let i = 0; i < nPts; i++) {
    let t = i / (nPts - 1);
    let angle = lerp(startAngle, endAngle, t);
    let x = center.x + radius * Math.cos(angle);
    let y = center.y + radius * Math.sin(angle);
    pts[i * 3 + 0] = x;
    pts[i * 3 + 1] = y;
  }
  drawLineSegs(state.render.lineRender, pts, lineOpts);
  let tangent = new Vec3(Math.sin(endAngle), -Math.cos(endAngle));
  let dirA = tangent.rotateAbout(new Vec3(0, 0, 1), -Math.PI * 0.25);
  let dirB = tangent.rotateAbout(new Vec3(0, 0, 1), Math.PI * 0.25);
  let arrowLen = 10;
  addLine2(state.render.lineRender, b, b.mulAdd(dirA, arrowLen), lineOpts);
  addLine2(state.render.lineRender, b, b.mulAdd(dirB, arrowLen), lineOpts);
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloProcessFlow.ts
function startProcessBefore(state, block) {
  let activeBlocks = state.layout.cubes.filter((a) => a.t !== "w");
  return {
    lastBlockIdx: activeBlocks.indexOf(block) - 1
  };
}
function processUpTo(state, timer, block, prevInfo) {
  let activeBlocks = state.layout.cubes.filter((a) => a.t !== "w");
  let firstIdx = prevInfo ? prevInfo.lastBlockIdx + 1 : 0;
  let lastIdx = activeBlocks.indexOf(block);
  let cellCounts = activeBlocks.filter((_, i) => i >= firstIdx && i <= lastIdx).map((a) => a.cx * a.cy * Math.pow(a.deps?.dotLen ?? 1, 0.25));
  let totalCells = cellCounts.reduce((a, b) => a + b, 0);
  let accCell = 0;
  let currIdx = firstIdx;
  let subPos = 0;
  for (let i = firstIdx; i <= lastIdx; i++) {
    let blockFract = cellCounts[i - firstIdx] / totalCells;
    accCell += blockFract;
    if (timer.t < accCell) {
      currIdx = i;
      subPos = (timer.t - (accCell - blockFract)) / blockFract;
      break;
    }
  }
  let blk = activeBlocks[currIdx];
  let dim0 = 0 /* X */;
  let dim1 = 1 /* Y */;
  if (blk.transpose) {
    dim0 = 1 /* Y */;
    dim1 = 0 /* X */;
  }
  let { cx } = dimProps(blk, dim0);
  let { cx: cy } = dimProps(blk, dim1);
  let horizPos = lerp(0, cx, subPos);
  let horizIdx = Math.floor(horizPos);
  let vertPos = lerp(0, cy, horizPos - horizIdx);
  let vertIdx = Math.floor(vertPos);
  let blockPos = new Vec3().withSetAt(dim0, horizIdx).withSetAt(dim1, vertIdx);
  let pinPos = new Vec3(Math.floor(cx / 2), 0, 0);
  if (blk === state.layout.residual0) {
    pinPos = new Vec3(cx * 2, -2, 0);
  }
  if (timer.t >= 1) {
    currIdx = lastIdx;
  }
  for (let i = firstIdx; i < currIdx; i++) {
    let blk2 = activeBlocks[i];
    if (blk2.access) {
      blk2.access.disable = false;
    }
  }
  if (timer.active && timer.t < 1) {
    drawDependences(state, blk, blockPos);
    drawDataFlow(state, blk, blockPos, pinPos);
    for (let label of state.layout.labels) {
      for (let c of label.cubes) {
        if (c === blk) {
          label.visible = 1;
        }
      }
    }
    blk.highlight = 0.3;
    let column = splitGrid(state.layout, blk, dim0, horizPos, 0);
    if (column) {
      for (let col of findSubBlocks(blk, dim0, null, horizIdx)) {
        if (col.access) {
          col.access.disable = false;
          col.highlight = 0.1;
        }
      }
      column.highlight = 0.4;
      let curr = splitGrid(state.layout, column, dim1, vertPos, 0);
      for (let blk2 of findSubBlocks(column, dim1, null, vertIdx)) {
        if (blk2.access) {
          blk2.access.disable = false;
        }
      }
      if (curr) {
        curr.highlight = 0.7;
      }
    }
  } else if (timer.active) {
    let blk2 = activeBlocks[lastIdx];
    if (blk2.access) {
      blk2.access.disable = false;
    }
  }
  let info = prevInfo ?? { lastBlockIdx: currIdx };
  info.lastBlockIdx = lastIdx;
  return info;
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloWalkthroughTools.ts
function createAtTime(walkthrough, start, duration, wait) {
  duration = duration ?? 0;
  wait = wait ?? 0;
  let info = {
    name: "",
    start,
    duration,
    wait,
    t: duration === 0 ? walkthrough.time > start ? 1 : 0 : clamp((walkthrough.time - start) / duration, 0, 1),
    active: walkthrough.time > start
  };
  walkthrough.times.push(info);
  walkthrough.phaseLength = Math.max(walkthrough.phaseLength, start + duration + wait);
  return info;
}
function atTime(walkthrough, start, duration, wait) {
  return createAtTime(walkthrough, start, duration, wait);
}
function afterTime(walkthrough, prev, duration, wait) {
  prev = prev ?? walkthrough.times[walkthrough.times.length - 1] ?? { name: "", start: 0, duration: 0, wait: 0, t: 0, active: false };
  return atTime(walkthrough, prev.start + prev.duration + prev.wait, duration, wait);
}
function cleanup(walkthrough, t, times) {
  let list = times ?? walkthrough.times;
  if (t.t > 0) {
    for (let prevTime of list) {
      prevTime.t = 1 - t.t;
      if (t.t >= 1) {
        prevTime.active = false;
      }
    }
  }
}
function getPhaseTransitiveData(wt) {
  wt.phaseTransitiveData ?? (wt.phaseTransitiveData = {});
  return wt.phaseTransitiveData;
}
function setInitialCamera(state, target, rot) {
  let wt = state.walkthrough;
  wt.cameraInitial = { angle: rot, center: target };
  let data = getPhaseTransitiveData(wt);
  if (wt.time === 0 && wt.running) {
    data.cameraSrc ?? (data.cameraSrc = { angle: state.camera.angle, center: state.camera.center });
    data.cameraT ?? (data.cameraT = 0);
    if (data.cameraT < 1) {
      let src = data.cameraSrc;
      let dest = wt.cameraInitial;
      let t = data.cameraT;
      state.camera.angle = src.angle.lerp(dest.angle, t);
      state.camera.center = src.center.lerp(dest.center, t);
      data.cameraT = t + wt.viewDt / 1e3 * 1.5;
      wt.markDirty();
    }
  }
}
function moveCameraTo(state, time, target, rot) {
  let wt = state.walkthrough;
  let phaseData = wt.phaseData.get(wt.phase);
  if (!phaseData) {
    wt.phaseData.set(wt.phase, phaseData = { cameraData: null });
  }
  if (!phaseData.cameraData) {
    phaseData.cameraData = /* @__PURE__ */ new Map();
  }
  let prevTime = [...phaseData.cameraData.entries()].filter(([t]) => t < time.start).pop()?.[1];
  let camData = phaseData.cameraData.get(time.start);
  if (!camData) {
    phaseData.cameraData.set(time.start, camData = {
      initialCaptured: prevTime ? void 0 : wt.cameraInitial ?? {
        angle: state.camera.angle,
        center: state.camera.center
      },
      target: { angle: rot, center: target }
    });
  }
  let src = prevTime?.target ?? wt.cameraInitial ?? camData.initialCaptured;
  let dest = {
    center: target,
    angle: rot
  };
  let isMoving = wt.running || wt.time !== wt.prevTime;
  let prevWasActive = wt.prevTime >= time.start && wt.prevTime <= time.start + time.duration;
  if (src && isMoving && (time.active || prevWasActive)) {
    let t = time.t;
    state.camera.angle = src.angle.lerp(dest.angle, t);
    state.camera.center = src.center.lerp(dest.center, t);
  }
}
function phaseTools(state) {
  let phaseState = state.walkthrough;
  function atTimeBound(start, duration, wait) {
    return createAtTime(phaseState, start, duration, wait);
  }
  function afterTimeBound(prev, duration, wait) {
    return afterTime(phaseState, prev, duration, wait);
  }
  function cleanupBound(t, times) {
    cleanup(phaseState, t, times);
  }
  return { atTime: atTimeBound, afterTime: afterTimeBound, cleanup: cleanupBound };
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloEmbedding.ts
function runDeveloEmbedding(args) {
  let { walkthrough: wt, state, tools: { afterTime: afterTime2, cleanup: cleanup2 }, layout } = args;
  let render = state.render;
  setInitialCamera(state, new Vec3(15.654, 0, -80.905), new Vec3(287, 14.5, 3.199));
  wt.dimHighlightBlocks = [layout.idxObj, layout.tokEmbedObj, layout.posEmbedObj, layout.residual0];
  let t_moveCamera = afterTime2(null, 1);
  let t0_splitEmbedAnim = afterTime2(null, 0.3);
  let t1_fadeEmbedAnim = afterTime2(null, 0.3);
  let t2_highlightTokenEmbed = afterTime2(null, 0.8);
  let t4_highlightPosEmbed = afterTime2(null, 0.8);
  let t3_moveTokenEmbed = afterTime2(null, 0.8);
  let t5_movePosEmbed = afterTime2(null, 0.8);
  let t6_plusSymAnim = afterTime2(null, 0.8);
  let t7_addAnim = afterTime2(null, 0.8);
  let t8_placeAnim = afterTime2(null, 0.8);
  let t9_cleanupInstant = afterTime2(null, 0);
  let t10_fadeAnim = afterTime2(null, 0.8);
  let t11_fillRest = afterTime2(null, 5);
  cleanup2(t9_cleanupInstant, [t3_moveTokenEmbed, t5_movePosEmbed, t6_plusSymAnim, t7_addAnim, t8_placeAnim]);
  cleanup2(t10_fadeAnim, [t0_splitEmbedAnim, t1_fadeEmbedAnim, t2_highlightTokenEmbed, t4_highlightPosEmbed]);
  moveCameraTo(state, t_moveCamera, new Vec3(7.6, 0, -33.1), new Vec3(290, 15.5, 0.8));
  let residCol = null;
  let exampleIdx = 3;
  if ((t0_splitEmbedAnim.t > 0 || t10_fadeAnim.t > 0) && t11_fillRest.t === 0) {
    splitGrid(layout, layout.idxObj, 0 /* X */, exampleIdx + 0.5, t0_splitEmbedAnim.t * 4);
    layout.residual0.access.disable = true;
    layout.residual0.opacity = lerp(1, 0.1, t1_fadeEmbedAnim.t);
    residCol = splitGrid(layout, layout.residual0, 0 /* X */, exampleIdx + 0.5, t0_splitEmbedAnim.t * 4);
    residCol.highlight = 0.3;
    residCol.opacity = lerp(1, 0, t1_fadeEmbedAnim.t);
  }
  let tokValue = getBlockValueAtIdx(layout.idxObj, new Vec3(exampleIdx, 0, 0)) ?? 1;
  let tokColDupe = null;
  let posColDupe = null;
  if (t2_highlightTokenEmbed.t > 0) {
    let tokEmbedCol = splitGrid(layout, layout.tokEmbedObj, 0 /* X */, tokValue + 0.5, t2_highlightTokenEmbed.t * 4);
    tokColDupe = duplicateGrid(layout, tokEmbedCol);
    tokColDupe.t = "i";
    tokEmbedCol.highlight = 0.3;
    let startPos = new Vec3(tokEmbedCol.x, tokEmbedCol.y, tokEmbedCol.z);
    let targetPos = new Vec3(residCol.x, residCol.y, residCol.z).add(new Vec3(-2, 0, 3));
    let pos = startPos.lerp(targetPos, t3_moveTokenEmbed.t);
    tokColDupe.x = pos.x;
    tokColDupe.y = pos.y;
    tokColDupe.z = pos.z;
  }
  if (t4_highlightPosEmbed.t > 0) {
    let posEmbedCol = splitGrid(layout, layout.posEmbedObj, 0 /* X */, exampleIdx + 0.5, t4_highlightPosEmbed.t * 4);
    posColDupe = duplicateGrid(layout, posEmbedCol);
    posColDupe.t = "i";
    posEmbedCol.highlight = 0.3;
    let startPos = new Vec3(posEmbedCol.x, posEmbedCol.y, posEmbedCol.z);
    let targetPos = new Vec3(residCol.x, residCol.y, residCol.z).add(new Vec3(2, 0, 3));
    let pos = startPos.lerp(targetPos, t5_movePosEmbed.t);
    posColDupe.x = pos.x;
    posColDupe.y = pos.y;
    posColDupe.z = pos.z;
  }
  if (t6_plusSymAnim.t > 0 && tokColDupe && posColDupe && t7_addAnim.t < 1) {
    for (let c = 0; c < layout.shape.C; c++) {
      let plusCenter = new Vec3(
        (tokColDupe.x + tokColDupe.dx + posColDupe.x) / 2,
        tokColDupe.y + layout.cell * (c + 0.5),
        tokColDupe.z + tokColDupe.dz / 2
      );
      let isActive = t6_plusSymAnim.t > (c + 1) / layout.shape.C;
      let opacity = lerp(0, 1, isActive ? 1 : 0);
      let fontOpts = { color: new Vec4(0, 0, 0, 1).mul(opacity), size: 1.5, mtx: Mat4f.fromTranslation(plusCenter) };
      let w = measureText(render.modelFontBuf, "+", fontOpts);
      drawText(render.modelFontBuf, "+", -w / 2, -fontOpts.size / 2, fontOpts);
    }
  }
  let origResidPos = residCol ? new Vec3(residCol.x, residCol.y, residCol.z) : new Vec3();
  let offsetResidPos = origResidPos.add(new Vec3(0, 0, 3));
  if (t7_addAnim.t > 0 && tokColDupe && posColDupe) {
    let targetPos = offsetResidPos;
    let tokStartPos = new Vec3(tokColDupe.x, tokColDupe.y, tokColDupe.z);
    let posStartPos = new Vec3(posColDupe.x, posColDupe.y, posColDupe.z);
    let tokPos = tokStartPos.lerp(targetPos, t7_addAnim.t);
    let posPos = posStartPos.lerp(targetPos, t7_addAnim.t);
    tokColDupe.x = tokPos.x;
    tokColDupe.y = tokPos.y;
    tokColDupe.z = tokPos.z;
    posColDupe.x = posPos.x;
    posColDupe.y = posPos.y;
    posColDupe.z = posPos.z;
    if (t7_addAnim.t > 0.95) {
      tokColDupe.opacity = 0;
      posColDupe.opacity = 0;
      residCol.opacity = 1;
      residCol.highlight = 0;
      residCol.access.disable = false;
      residCol.x = targetPos.x;
      residCol.y = targetPos.y;
      residCol.z = targetPos.z;
    }
  }
  if (t8_placeAnim.t > 0) {
    let startPos = offsetResidPos;
    let targetPos = origResidPos;
    let pos = startPos.lerp(targetPos, t8_placeAnim.t);
    residCol.x = pos.x;
    residCol.y = pos.y;
    residCol.z = pos.z;
  }
  if (t9_cleanupInstant.t > 0 && residCol) {
    residCol.opacity = 1;
    residCol.highlight = 0;
    residCol.access.disable = false;
  }
  if (t11_fillRest.t > 0) {
    layout.residual0.access.disable = true;
    let prevInfo = startProcessBefore(state, layout.residual0);
    processUpTo(state, t11_fillRest, layout.residual0, prevInfo);
  }
  if (t3_moveTokenEmbed.active || t5_movePosEmbed.active || t6_plusSymAnim.active || t7_addAnim.active || t8_placeAnim.active) {
    setMathCue(state, "embedding_sum");
  } else if (t4_highlightPosEmbed.active) {
    setMathCue(state, "embedding_position");
  } else if (t2_highlightTokenEmbed.active) {
    setMathCue(state, "embedding_token");
  }
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloIntro.ts
function runDeveloIntro(args) {
  let { afterTime: afterTime2 } = args.tools;
  let { state, layout, walkthrough: wt } = args;
  setInitialCamera(state, new Vec3(184.744, 0, -636.82), new Vec3(296, 16, 13.5));
  if (wt.time > 0) {
    for (let cube of layout.cubes) {
      if (cube.t === "i" && cube.access) {
        cube.access.disable = true;
      }
    }
    state.display.tokenIdxModelOpacity = makeArray(6, 0);
  }
  let t4 = afterTime2(null, 1.5, 0.4);
  moveCameraTo(args.state, t4, new Vec3(5.45, 0, 7.913), new Vec3(281.5, 12.5, 0.519));
  let t6 = afterTime2(null, 1, 0.2);
  if (t4.active) {
    state.display.topOutputOpacity = 0.2;
  }
  if (t6.active && t6.t < 1) {
    let mixes = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; i++) {
      let highT = (i + 1.5) / 8;
      mixes[i] = 1 - clamp(Math.abs(t6.t - highT) * 4, 0, 1);
    }
    state.display.tokenColors = { mixes, color2: dimStyleColor(9 /* Token */) };
  }
  let t7 = afterTime2(null, 1.5, 0.5);
  if (t7.active) {
    let opacity = makeArray(6, 0);
    for (let i = 0; i < 6; i++) {
      let highT = (i + 1.5) / 8;
      opacity[i] = clamp((t7.t - highT) * 4, 0, 1);
    }
    state.display.tokenIdxColors = { mixes: opacity, color2: dimStyleColor(10 /* TokenIdx */) };
    let idxPos = t7.t * 6;
    if (t7.t < 1) {
      splitGrid(layout, layout.idxObj, 0 /* X */, idxPos, clamp(6 - idxPos, 0, 1));
      for (let blk of findSubBlocks(layout.idxObj, 0 /* X */, null, Math.min(5, Math.floor(idxPos)))) {
        if (blk.access) {
          blk.access.disable = false;
        }
      }
    } else {
      if (layout.idxObj.access) {
        layout.idxObj.access.disable = false;
      }
    }
  }
  let t_camMove = afterTime2(null, 1, 0.5);
  let t_makeVecs = afterTime2(null, 2, 0.5);
  moveCameraTo(state, t_camMove, new Vec3(14.1, 0, -30.4), new Vec3(286, 14.5, 0.8));
  if (t_makeVecs.active) {
    let idxPos = t_makeVecs.t * 6;
    let splitWidth = clamp(6 - idxPos, 0, 2);
    let splitIdx = Math.min(5, Math.floor(idxPos));
    if (t_makeVecs.t < 1) {
      splitGrid(layout, layout.idxObj, 0 /* X */, idxPos, splitWidth);
      for (let blk of findSubBlocks(layout.idxObj, 0 /* X */, null, splitIdx)) {
        if (blk.access) {
          blk.access.disable = false;
        }
      }
      splitGrid(layout, layout.residual0, 0 /* X */, idxPos, splitWidth);
      for (let blk of findSubBlocks(layout.residual0, 0 /* X */, null, splitIdx)) {
        if (blk.access) {
          blk.access.disable = false;
        }
      }
    } else {
      if (layout.residual0.access) {
        layout.residual0.access.disable = false;
      }
    }
  }
  let t_firstResid = afterTime2(null, 1, 0.5);
  moveCameraTo(state, t_firstResid, new Vec3(-23.16, 0, -128.38), new Vec3(292.3, 26.8, 2.4));
  let t_firstResidWalk = afterTime2(null, 5, 0.5);
  let processState = processUpTo(state, t_firstResidWalk, layout.blocks[0].attnResidual);
  let t_firstTransformer = afterTime2(null, 1, 0.5);
  moveCameraTo(state, t_firstTransformer, new Vec3(-78.7, 0, -274.2), new Vec3(299.4, 14.7, 4.3));
  let t_firstTransformerWalk = afterTime2(null, 3.5, 0.5);
  processUpTo(state, t_firstTransformerWalk, layout.blocks[0].mlpResidual, processState);
  if (t_firstTransformer.active) {
    layout.blocks[0].transformerLabel.visible = t_firstTransformer.t;
  }
  let t_fullFrame = afterTime2(null, 1, 0.5);
  moveCameraTo(state, t_fullFrame, new Vec3(-147, 0, -744.1), new Vec3(298.5, 23.4, 12.2));
  let t_fullFrameWalk = afterTime2(null, 5, 0.5);
  processUpTo(state, t_fullFrameWalk, layout.ln_f.lnResid, processState);
  let t_output = afterTime2(null, 1, 0.5);
  moveCameraTo(state, t_output, new Vec3(-58.4, 0, -1654.9), new Vec3(271.3, 6.4, 1.1));
  let t_outputWalk = afterTime2(null, 2, 0.5);
  processUpTo(state, t_outputWalk, layout.logitsSoftmax, processState);
  let t_outputToks = afterTime2(null, 1, 0.5);
  if (t_firstResid.active) {
    let arr = makeArray(6, 0);
    if (t_outputToks.active) {
      for (let i = 0; i < 6; i++) {
        let highT = (i + 1.5) / 8;
        arr[i] = clamp((t_outputToks.t - highT) * 4, 0, 1);
      }
    }
    state.display.tokenOutputColors = { color1: new Vec4(0, 0, 0, 0), color2: Vec4.fromHexColor("#000", 1), mixes: arr };
  }
  if (t_firstResid.active) {
    setMathCue(state, "intro_flow");
  } else if (t_makeVecs.active || t_camMove.active) {
    setMathCue(state, "intro_embedding");
  } else if (t7.active) {
    setMathCue(state, "intro_indices");
  } else if (t6.active) {
    setMathCue(state, "intro_tokens");
  }
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloLayerNorm.ts
function runDeveloLayerNorm(args) {
  let { walkthrough: wt, layout, state, tools: { afterTime: afterTime2, cleanup: cleanup2 } } = args;
  let { C } = layout.shape;
  let ln = layout.blocks[0].ln1;
  setInitialCamera(state, new Vec3(-6.68, 0, -65.256), new Vec3(281, 9, 2.576));
  wt.dimHighlightBlocks = [layout.residual0, ...ln.cubes];
  let t_moveCamera = afterTime2(null, 1);
  let t_hideExtra = afterTime2(null, 1, 1);
  let t_moveInputEmbed = afterTime2(null, 1);
  let t_moveCameraClose = afterTime2(null, 0.5);
  let t_focusColumn = afterTime2(null, 0.5);
  let t_calcMuAgg = afterTime2(null, 0.5);
  let t_calcVarAgg = afterTime2(null, 0.5);
  let t_clean_aggs = afterTime2(null, 0.2);
  cleanup2(t_clean_aggs, [t_calcMuAgg, t_calcVarAgg]);
  let t_colSequence = afterTime2(null, 2);
  let t_cleanupSplits = afterTime2(null, 0.5);
  cleanup2(t_cleanupSplits, [t_focusColumn]);
  if (t_cleanupSplits.t > 0) {
    t_colSequence.t = 0;
  }
  let t_runAggFull = afterTime2(null, 2);
  let t_runNormFull = afterTime2(null, 6);
  moveCameraTo(state, t_moveCamera, new Vec3(21.2, 0, -102.9), new Vec3(281.5, 11, 1.7));
  let exampleIdx = 3;
  let ln1 = layout.blocks[0].ln1;
  let inputBlock = layout.residual0;
  inputBlock.highlight = lerp(0, 0.3, t_hideExtra.t);
  let relevantBlocks = /* @__PURE__ */ new Set([
    layout.residual0,
    ...ln1.cubes
  ]);
  for (let blk of layout.cubes) {
    if (!relevantBlocks.has(blk)) {
      blk.opacity = lerp(1, 0, t_hideExtra.t);
    }
  }
  for (let blk of relevantBlocks) {
    if (blk != layout.residual0 && blk.t !== "w") {
      blk.access.disable = true;
    }
  }
  let startResidualY = layout.residual0.y;
  let endResidulY = ln1.lnResid.y;
  layout.residual0.y = lerp(startResidualY, endResidulY, t_moveInputEmbed.t);
  if (t_moveInputEmbed.t >= 0) {
    inputBlock.highlight = lerp(0.3, 0, t_moveInputEmbed.t);
  }
  moveCameraTo(state, t_moveCameraClose, new Vec3(-14.1, 0, -187.1), new Vec3(270, 4, 0.7));
  let splitAmt = lerp(0, 2, t_focusColumn.t);
  let splitPos = exampleIdx + 0.5;
  let otherColOpacity = lerp(1, 0.3, t_focusColumn.t);
  ln1.lnAgg1.opacity = otherColOpacity;
  ln1.lnAgg2.opacity = otherColOpacity;
  ln1.lnResid.opacity = otherColOpacity;
  inputBlock.opacity = otherColOpacity;
  if (t_focusColumn.t > 0) {
    let aggMuCol = splitGrid(layout, ln1.lnAgg1, 0 /* X */, splitPos, splitAmt);
    let aggVarCol = splitGrid(layout, ln1.lnAgg2, 0 /* X */, splitPos, splitAmt);
    let residCol = splitGrid(layout, ln1.lnResid, 0 /* X */, splitPos, splitAmt);
    let inputCol = splitGrid(layout, inputBlock, 0 /* X */, splitPos, splitAmt);
    aggMuCol.opacity = 1;
    aggVarCol.opacity = 1;
    residCol.opacity = 1;
    inputCol.opacity = 1;
    let aggDestIdx = new Vec3(exampleIdx, 0, 0);
    if (t_calcMuAgg.t > 0) {
      let pinIdx = new Vec3(0, 10, 0);
      drawDependences(state, ln1.lnAgg1, aggDestIdx);
      drawDataFlow(state, ln1.lnAgg1, aggDestIdx, pinIdx);
      aggMuCol.access.disable = false;
      inputCol.highlight = 0.3;
    }
    if (t_calcVarAgg.t > 0) {
      let pinIdx = new Vec3(9, 9, 0);
      drawDependences(state, ln1.lnAgg2, aggDestIdx);
      drawDataFlow(state, ln1.lnAgg2, aggDestIdx, pinIdx);
      aggVarCol.access.disable = false;
    }
    if (t_colSequence.t > 0) {
      aggMuCol.access.disable = false;
      aggVarCol.access.disable = false;
      let pinIdx = new Vec3(-10, 0, 0);
      let cPos = t_colSequence.t * C;
      let cIdx = clamp(Math.floor(cPos), 0, C - 1);
      let destIdx = new Vec3(exampleIdx, cIdx, 0);
      drawDependences(state, ln1.lnResid, destIdx);
      drawDataFlow(state, ln1.lnResid, destIdx, pinIdx);
      let targetCell = splitGrid(layout, residCol, 1 /* Y */, cIdx + 0.5, 0);
      targetCell.highlight = 0.3;
      findSubBlocks(residCol, 1 /* Y */, 0, cIdx).forEach((blk) => {
        blk.access.disable = false;
      });
    }
  }
  if (t_runAggFull.t > 0) {
    try {
      let processInfo = startProcessBefore(state, ln1.lnAgg1);
      processUpTo(state, t_runAggFull, ln1.lnAgg2, processInfo);
      processUpTo(state, t_runNormFull, ln1.lnResid, processInfo);
    } catch (e) {
      console.log(e);
    }
  }
  if (t_runAggFull.active || t_runNormFull.active) {
    setMathCue(state, "layernorm_affine");
  } else if (t_colSequence.active) {
    setMathCue(state, "layernorm_normalize");
  } else if (t_calcVarAgg.active) {
    setMathCue(state, "layernorm_variance");
  } else if (t_calcMuAgg.active) {
    setMathCue(state, "layernorm_mean");
  }
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloMlp.ts
function runDeveloMlp(args) {
  let { walkthrough: wt, state, layout, tools: { afterTime: afterTime2, cleanup: cleanup2 } } = args;
  let block = layout.blocks[0];
  setInitialCamera(state, new Vec3(-154.755, 0, -460.042), new Vec3(289.1, -8.9, 2.298));
  wt.dimHighlightBlocks = [block.ln2.lnResid, block.mlpAct, block.mlpFc, block.mlpFcBias, block.mlpFcWeight, block.mlpProjBias, block.mlpProjWeight, block.mlpResult, block.mlpResidual];
  let t0_fadeOut = afterTime2(null, 1);
  let t1_process = afterTime2(null, 3);
  let t2_process = afterTime2(null, 3);
  let t3_process = afterTime2(null, 3);
  let t4_process = afterTime2(null, 3);
  let t5_cleanup = afterTime2(null, 1, 0.5);
  cleanup2(t5_cleanup, [t0_fadeOut]);
  let t6_processAll = afterTime2(null, 6);
  let targetIdx = 3;
  let inputBlk = block.ln2.lnResid;
  let mlp1Blk = block.mlpFc;
  let mlp2Blk = block.mlpAct;
  let mlpRes = block.mlpResult;
  let mlpResid = block.mlpResidual;
  function dimExceptVector(blk, axis, disable) {
    if (t0_fadeOut.t === 0 || t6_processAll.t > 0) {
      return;
    }
    if (disable) {
      blk.access.disable = true;
    }
    let col = splitGrid(layout, blk, axis, targetIdx + 0.5, lerp(0, 1, t0_fadeOut.t));
    for (let sub of blk.subs) {
      sub.opacity = lerp(1, 0.2, t0_fadeOut.t);
    }
    col.opacity = 1;
    return col;
  }
  dimExceptVector(inputBlk, 0 /* X */, false);
  let mlp1Col = dimExceptVector(mlp1Blk, 1 /* Y */, true);
  let mlp2Col = dimExceptVector(mlp2Blk, 1 /* Y */, true);
  let mlpResCol = dimExceptVector(mlpRes, 0 /* X */, true);
  let mplResIdCol = dimExceptVector(mlpResid, 0 /* X */, true);
  function processVector(blk, col, t, pinIdx) {
    if (t === 0) {
      return;
    }
    let dim0 = blk.transpose ? 1 /* Y */ : 0 /* X */;
    let dim1 = blk.transpose ? 0 /* X */ : 1 /* Y */;
    let { cx: numCells } = dimProps(blk, dim1);
    let xPos = Math.floor(lerp(0, numCells, t));
    let destIdx = new Vec3().setAt(dim0, targetIdx).setAt(dim1, xPos).round_();
    if (col) {
      let row = splitGrid(layout, col, dim1, xPos, 0);
      for (let a of findSubBlocks(col, dim1, 0, xPos)) {
        a.access.disable = false;
      }
      void row;
    }
    if (t < 1) {
      drawDataFlow(state, blk, destIdx, pinIdx);
      drawDependences(state, blk, destIdx);
    } else if (col) {
      col.access.disable = false;
    }
  }
  processVector(mlp1Blk, mlp1Col, t1_process.t, new Vec3(40));
  processVector(mlp2Blk, mlp2Col, t2_process.t, new Vec3(mlp1Blk.cx / 2, -15));
  processVector(mlpRes, mlpResCol, t3_process.t, new Vec3(mlpRes.cx / 2, -15));
  processVector(mlpResid, mplResIdCol, t4_process.t, new Vec3(mlpRes.cx / 2, -15));
  if (t5_cleanup.t > 0.4) {
    mlp1Blk.access.disable = true;
    mlp2Blk.access.disable = true;
    mlpRes.access.disable = true;
    mlpResid.access.disable = true;
  }
  if (t6_processAll.t > 0) {
    let prevInfo = startProcessBefore(state, inputBlk);
    processUpTo(state, t6_processAll, mlpResid, prevInfo);
  }
  if (t4_process.active) {
    setMathCue(state, "mlp_residual");
  } else if (t3_process.active) {
    setMathCue(state, "mlp_project");
  } else if (t2_process.active) {
    setMathCue(state, "mlp_gelu");
  } else if (t1_process.active) {
    setMathCue(state, "mlp_expand");
  } else if (t0_fadeOut.active) {
    setMathCue(state, "mlp_norm");
  }
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloOutput.ts
function runDeveloOutput(args) {
  let { walkthrough: wt, state, layout, tools: { afterTime: afterTime2 } } = args;
  setInitialCamera(state, new Vec3(-20.203, 0, -1642.819), new Vec3(281.6, -7.9, 2.298));
  let t_finalNorm = afterTime2(null, 0.8);
  let t_logits = afterTime2(null, 0.8);
  let t_probabilities = afterTime2(null, 1.2);
  let t_nextToken = afterTime2(null, 1.2);
  let processInfo = startProcessBefore(state, layout.ln_f.lnResid);
  if (t_finalNorm.active) {
    processUpTo(state, t_finalNorm, layout.ln_f.lnResid, processInfo);
    setMathCue(state, "output_final_norm");
    emphasizeBlock(layout.ln_f.lnResid, t_finalNorm, 0.28);
  }
  if (t_logits.active) {
    processUpTo(state, t_logits, layout.logits, processInfo);
    setMathCue(state, "output_logits");
    emphasizeBlock(layout.logits, t_logits, 0.32);
  }
  if (t_probabilities.active) {
    processUpTo(state, t_probabilities, layout.logitsSoftmax, processInfo);
    setMathCue(state, "output_probabilities");
    emphasizeBlock(layout.logitsSoftmax, t_probabilities, 0.38);
  }
  if (t_nextToken.active) {
    setMathCue(state, "output_argmax");
    let phaseLocal = wt.phaseData.get(wt.phase) ?? {};
    if (!phaseLocal.outputSelection) {
      const model = state.jsGptModel;
      if (model && model.sortedBuf) {
        const vocabSize = model.shape.vocabSize;
        const tIdx = Math.max(0, model.inputLen - 1);
        const sortedIndex = tIdx * vocabSize * 2;
        const tokenId = Math.round(model.sortedBuf[sortedIndex]);
        phaseLocal.outputSelection = { tIdx, tokenId };
        wt.phaseData.set(wt.phase, phaseLocal);
      }
    }
    const selection = phaseLocal.outputSelection;
    if (selection) {
      const pulse = Math.sin(Math.PI * Math.min(1, Math.max(0, t_nextToken.t)));
      const splitAmount = 1.2 * pulse;
      const probabilityColumn = splitGrid(
        layout,
        layout.logitsSoftmax,
        0 /* X */,
        selection.tIdx + 0.5,
        splitAmount
      );
      if (probabilityColumn) {
        const selectedCell = splitGrid(
          layout,
          probabilityColumn,
          1 /* Y */,
          selection.tokenId + 0.5,
          splitAmount * 0.8
        );
        if (selectedCell) {
          selectedCell.highlight = Math.max(selectedCell.highlight ?? 0, 0.55 + 0.35 * pulse);
        }
        probabilityColumn.highlight = Math.max(probabilityColumn.highlight ?? 0, 0.25 + 0.2 * pulse);
      }
    }
    if (t_nextToken.t >= 0.72 && !phaseLocal.predictionStepped) {
      phaseLocal.predictionStepped = true;
      wt.phaseData.set(wt.phase, phaseLocal);
      state.stepModel = true;
    }
  }
}
function emphasizeBlock(block, timer, strength = 0.32) {
  if (!timer.active) {
    return;
  }
  const t = Math.min(1, Math.max(0, timer.t));
  const pulse = Math.sin(Math.PI * t);
  block.highlight = Math.max(block.highlight ?? 0, 0.12 + pulse * strength);
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloProjection.ts
function runDeveloProjection(args) {
  let { walkthrough: wt, state, layout, tools: { afterTime: afterTime2, cleanup: cleanup2 } } = args;
  setInitialCamera(state, new Vec3(-73.167, 0, -270.725), new Vec3(293.606, 2.613, 1.366));
  let block = layout.blocks[0];
  wt.dimHighlightBlocks = [...block.heads.map((h) => h.vOutBlock), block.projBias, block.projWeight, block.attnOut];
  let t_fadeOut = afterTime2(null, 1, 0.5);
  let t_stack = afterTime2(null, 1);
  let t_process = afterTime2(null, 3);
  let t_zoomOut = afterTime2(null, 1, 0.5);
  let t_processResid = afterTime2(null, 3);
  cleanup2(t_zoomOut, [t_fadeOut, t_stack]);
  if (t_fadeOut.active) {
    for (let head of block.heads) {
      for (let blk of head.cubes) {
        if (blk !== head.vOutBlock) {
          blk.opacity = lerpSmoothstep(1, 0, t_fadeOut.t);
        }
      }
    }
  }
  if (t_stack.active) {
    let targetZ = block.attnOut.z;
    for (let headIdx = 0; headIdx < block.heads.length; headIdx++) {
      let head = block.heads[headIdx];
      let targetY = head.vOutBlock.y + head.vOutBlock.dy * (headIdx - block.heads.length + 1);
      head.vOutBlock.y = lerp(head.vOutBlock.y, targetY, t_stack.t);
      head.vOutBlock.z = lerp(head.vOutBlock.z, targetZ, t_stack.t);
    }
  }
  let processInfo = startProcessBefore(state, block.attnOut);
  if (t_process.active) {
    processUpTo(state, t_process, block.attnOut, processInfo);
  }
  moveCameraTo(state, t_zoomOut, new Vec3(-8.304, 0, -175.482), new Vec3(293.606, 2.623, 2.618));
  if (t_processResid.active) {
    processUpTo(state, t_processResid, block.attnResidual, processInfo);
  }
  if (t_processResid.active) {
    setMathCue(state, "projection_residual");
  } else if (t_process.active) {
    setMathCue(state, "projection_linear");
  } else if (t_stack.active) {
    setMathCue(state, "projection_concat");
  }
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloSelfAttention.ts
var Black = new Vec4(0, 0, 0);
function runDeveloSelfAttention(args) {
  let { walkthrough: wt, layout, state, tools: { afterTime: afterTime2, cleanup: cleanup2 } } = args;
  let { C, A, nHeads } = layout.shape;
  let block0 = layout.blocks[0];
  let head2 = block0.heads[2];
  setInitialCamera(state, new Vec3(-125.258, 0, -178.805), new Vec3(294, 12.8, 2.681));
  wt.dimHighlightBlocks = [layout.residual0, block0.ln1.lnResid, ...head2.cubes];
  let t_moveCamera = afterTime2(null, 1);
  let t_highlightHeads = afterTime2(null, 2);
  let t_moveCamera2 = afterTime2(null, 1);
  let t_focusHeads = focusSelfAttentionHeadTimers(args, 3);
  let t_focusQCol = afterTime2(null, 1);
  let t_qIterColDot = afterTime2(null, 3);
  let t_moveDotCells = afterTime2(null, 2, 0.5);
  let t_dotCellsZoomClose = afterTime2(null, 1, 0.5);
  let t_collapseDotCellsA = afterTime2(null, 2);
  let t_collapseDotCellsB = afterTime2(null, 2, 0.5);
  let t_dotCellsZoomOut = afterTime2(null, 1, 0.5);
  let t_addBias = afterTime2(null, 2, 0.5);
  let t_moveToDest = afterTime2(null, 0.5);
  let t_revertFocusCol = afterTime2(null, 0.25, 0.5);
  cleanup2(t_revertFocusCol, [t_focusQCol]);
  let t_processQkv = afterTime2(null, 5);
  let t_focusQKVCols = afterTime2(null, 1);
  let t_processAttnRow = afterTime2(null, 3);
  let t_processAttnSmAggRow = afterTime2(null, 1);
  let t_processAttnSmRow = afterTime2(null, 2);
  let t_zoomVOutput = afterTime2(null, 0.4, 0.5);
  let t_expandVCols = afterTime2(null, 1, 0.5);
  let t_moveAttnVals = afterTime2(null, 1, 0.5);
  let t_applyMultiplies = afterTime2(null, 1, 0.5);
  let t_applyAdds = afterTime2(null, 1, 0.5);
  let t_placeVOutput = afterTime2(null, 1, 0.5);
  let t_finalizeVOutput = afterTime2(null, 0.5, 0.5);
  let t_processRemainZoom = afterTime2(null, 0.5, 0.5);
  cleanup2(t_processRemainZoom, [t_focusQKVCols]);
  let t_processRemain = afterTime2(null, 8);
  moveCameraTo(state, t_moveCamera, new Vec3(-192.1, 0, -214.8), new Vec3(293.5, 49, 2.3));
  moveCameraTo(state, t_moveCamera2, new Vec3(-92.7, 0, -219), new Vec3(286, 12.8, 1.4));
  if (t_highlightHeads.t > 0) {
    block0.selfAttendLabel.visible = lerp(0, 1, t_highlightHeads.t * 10);
    let headPos = t_highlightHeads.t * nHeads;
    let headIdx = clamp(Math.floor(headPos), 0, nHeads - 1);
    let headFrac = headPos - headIdx;
    let labelOpacity = lerp(0, 1, headFrac / 0.3);
    let head = block0.heads[headIdx];
    head.headLabel.visible = labelOpacity;
    for (let blk of head.headLabel.cubes) {
      blk.highlight = labelOpacity * 0.4;
    }
  }
  if (t_focusHeads.t0_dissolveHeads.t > 0) {
    let head = block0.heads[2];
    let t = t_focusHeads.t0_dissolveHeads.t;
    for (let blk of head.headLabel.cubes) {
      blk.highlight = lerp(1, 0, t * 4) * 0.4;
    }
    head2.qBlock.access.disable = true;
    head2.kBlock.access.disable = true;
    head2.vBlock.access.disable = true;
  }
  focusSelfAttentionHead(args, t_focusHeads);
  moveCameraTo(state, t_dotCellsZoomClose, new Vec3(-53, 0, -155.5), new Vec3(274.1, 8.5, 0.4));
  moveCameraTo(state, t_dotCellsZoomOut, new Vec3(-92.7, 0, -219), new Vec3(286, 12.8, 1.4));
  let exampleIdx = 3;
  if (t_focusQCol.t > 0) {
    let otherOpacity = lerp(1, 0.2, t_focusQCol.t);
    head2.qBlock.opacity = otherOpacity;
    head2.kBlock.opacity = otherOpacity;
    head2.vBlock.opacity = otherOpacity;
    block0.ln1.lnResid.opacity = otherOpacity;
    let splitAmt = lerp(0, 2, t_focusQCol.t);
    let qCol = splitGrid(layout, head2.qBlock, 0 /* X */, exampleIdx + 0.5, splitAmt);
    let inputCol = splitGrid(layout, block0.ln1.lnResid, 0 /* X */, exampleIdx + 0.5, splitAmt);
    qCol.opacity = 1;
    inputCol.opacity = 1;
    if (t_qIterColDot.t > 0) {
      let aPos = t_qIterColDot.t * A;
      let aIdx = clamp(Math.floor(aPos), 0, A - 1);
      let destIdx = new Vec3(exampleIdx, aIdx, 0);
      let pinIdx = new Vec3(exampleIdx, 0, 0);
      drawDependences(state, head2.qBlock, destIdx);
      drawDataFlow(state, head2.qBlock, destIdx, pinIdx);
      splitGrid(layout, qCol, 1 /* Y */, aIdx + 0.5, 0);
      for (let b of findSubBlocks(qCol, 1 /* Y */, null, aIdx)) {
        b.access.disable = false;
      }
      inputCol.highlight = 0.3;
    }
    let targetTop = new Vec3(inputCol.x - 26, inputCol.y, inputCol.z + 5);
    let addTarget = new Vec3(targetTop.x + layout.cell, targetTop.y - layout.cell * 12, targetTop.z);
    let biasTarget = new Vec3(addTarget.x - layout.cell * 3, addTarget.y, addTarget.z);
    if (t_moveDotCells.t > 0 && t_moveToDest.t === 0) {
      let qWeightRow = findSubBlocks(head2.qWeightBlock, 1 /* Y */, A - 1, null)[0];
      let qCells = splitGridAll(layout, qWeightRow, 0 /* X */);
      let inCells = splitGridAll(layout, inputCol, 1 /* Y */);
      let cellMovePct = 0.5;
      let prevCY = 0;
      for (let c = 0; c < C; c++) {
        let cPos = c / (C - 1);
        let startT = (1 - cellMovePct) * (1 - cPos);
        let cellMoveT = inverseLerp(startT, startT + cellMovePct, t_moveDotCells.t);
        let qInitial = getBlkDimensions(qCells[c]);
        let qFinal = targetTop.add(new Vec3(0, c * layout.cell * 1.2));
        let inInitial = getBlkDimensions(inCells[c]);
        let inFinal = targetTop.add(new Vec3(layout.cell * 2, c * layout.cell * 1.2));
        if (t_dotCellsZoomOut.t > 0) {
          qFinal = inFinal = new Vec3(targetTop.x + layout.cell, targetTop.y - layout.cell * 12, qFinal.z);
        }
        setBlkPosition(qCells[c], qInitial.tl.lerp(qFinal, cellMoveT));
        setBlkPosition(inCells[c], inInitial.tl.lerp(inFinal, cellMoveT));
        let transitionPt = 0.15;
        let collapsDotCellsT = lerp(0, transitionPt, t_collapseDotCellsA.t) + lerp(0, 1 - transitionPt, t_collapseDotCellsB.t);
        let startT2 = 0.9 * cPos;
        let cellTimesSymT = inverseLerp(startT2, startT2 + 0.1, collapsDotCellsT);
        if (cellTimesSymT > 0 && t_dotCellsZoomOut.t == 0) {
          let qCurr = getBlkDimensions(qCells[c]);
          let inCurr = getBlkDimensions(inCells[c]);
          let qCellPos = new Vec3(
            lerp(qCurr.tl.x, addTarget.x, cellTimesSymT * 2),
            lerp(qCurr.tl.y, addTarget.y, cellTimesSymT),
            qCurr.tl.z
          );
          let inCellPos = new Vec3(
            lerp(inCurr.tl.x, addTarget.x, cellTimesSymT * 2),
            lerp(inCurr.tl.y, addTarget.y, cellTimesSymT),
            qCurr.tl.z
          );
          setBlkPosition(qCells[c], qCellPos);
          setBlkPosition(inCells[c], inCellPos);
          if (c > 0 && cellTimesSymT > 0) {
            let midPt = new Vec3(
              lerp(qCurr.br.x, inCurr.tl.x, 0.5),
              lerp(prevCY, qCellPos.y, 0.5),
              qCurr.tl.z + layout.cell / 2
            );
            let mtx = Mat4f.fromTranslation(midPt);
            let fontOpts = { color: Black, size: 1.5, mtx };
            let w = measureText(state.render.modelFontBuf, "+", fontOpts);
            drawText(state.render.modelFontBuf, "+", -w / 2, -fontOpts.size / 2, fontOpts);
          }
          prevCY = qCellPos.y + layout.cell;
        }
        if (cellMoveT >= 1) {
          drawSymbolBetweenBlocks(args, qCells[c], inCells[c], 0 /* X */, "x", { size: 1.5, color: Black });
        }
      }
      if (t_addBias.t >= 0) {
        let qBiasCell = findSubBlocks(head2.qBiasBlock, 1 /* Y */, A - 1, null)[0];
        let qBiasInitial = getBlkDimensions(qBiasCell);
        let qBiasPos = qBiasInitial.tl.lerp(biasTarget, inverseLerp(0, 0.4, t_addBias.t));
        setBlkPosition(qBiasCell, qBiasPos);
        let moveTogetherT = inverseLerp(0.6, 1, t_addBias.t);
        qBiasInitial = getBlkDimensions(qBiasCell);
        qBiasPos = qBiasInitial.tl.lerp(addTarget, moveTogetherT);
        setBlkPosition(qBiasCell, qBiasPos);
        if (t_addBias.t > 0.4) {
          drawSymbolBetweenBlocks(args, qBiasCell, qCells[qCells.length - 1], 0 /* X */, "+", { size: 1.5, color: Black });
        }
      }
    }
    if (t_moveToDest.t > 0) {
      let qWeightRow = findSubBlocks(head2.qWeightBlock, 1 /* Y */, A - 1, null)[0];
      let qBiasCell = findSubBlocks(head2.qBiasBlock, 1 /* Y */, A - 1, null)[0];
      qBiasCell.opacity = t_moveToDest.t;
      qWeightRow.opacity = t_moveToDest.t;
      inputCol.opacity = t_moveToDest.t;
      let qResultCell = findSubBlocks(qCol, 1 /* Y */, A - 1, null)[0];
      let qResultInitial = getBlkDimensions(qResultCell);
      let qResultPos = qResultInitial.tl.lerp(addTarget, 1 - t_moveToDest.t);
      setBlkPosition(qResultCell, qResultPos);
    }
  }
  if (t_processQkv.t > 0) {
    let processStart = startProcessBefore(state, head2.qBlock);
    processUpTo(state, t_processQkv, head2.vBlock, processStart);
  }
  let attnExampleIdx = 5;
  if (t_focusQKVCols.t > 0 && t_processRemain.t <= 0) {
    let ignoreOpacity = lerp(1, 0.2, t_focusQKVCols.t);
    head2.qBlock.opacity = ignoreOpacity;
    head2.kBlock.opacity = ignoreOpacity;
    head2.vBlock.opacity = ignoreOpacity;
    let qCol = splitGrid(layout, head2.qBlock, 0 /* X */, attnExampleIdx + 0.5, 0);
    splitGrid(layout, head2.kBlock, 0 /* X */, attnExampleIdx + 0.5, 0);
    splitGrid(layout, head2.vBlock, 0 /* X */, attnExampleIdx + 0.5, 0);
    let kBeforeCols = findSubBlocks(head2.kBlock, 0 /* X */, null, attnExampleIdx);
    let vBeforeCols = findSubBlocks(head2.vBlock, 0 /* X */, null, attnExampleIdx);
    for (let col of [...kBeforeCols, ...vBeforeCols, qCol]) {
      col.opacity = 1;
    }
    head2.attnMtx.access.disable = true;
    head2.attnMtxSm.access.disable = true;
    head2.attnMtxAgg1.access.disable = true;
    head2.attnMtxAgg2.access.disable = true;
    head2.qBlock.opacity = 1;
    head2.kBlock.opacity = 1;
    head2.vBlock.opacity = 1;
  }
  moveCameraTo(state, t_focusQKVCols, new Vec3(-91.5, 0, -227.9), new Vec3(270.1, -38.4, 0.8));
  if (t_processAttnRow.t > 0 && t_processRemain.t <= 0) {
    let aIdx = clamp(Math.floor(t_processAttnRow.t * (attnExampleIdx + 1)), 0, attnExampleIdx);
    let destIdx = new Vec3(aIdx, attnExampleIdx, 0);
    let pinIdx = new Vec3(attnExampleIdx, 0, 0);
    if (t_processAttnSmAggRow.t <= 0) {
      drawDependences(state, head2.attnMtx, destIdx);
      drawDataFlow(state, head2.attnMtx, destIdx, pinIdx);
    }
    let attnRow = splitGrid(layout, head2.attnMtx, 1 /* Y */, attnExampleIdx, 0);
    splitGrid(layout, attnRow, 0 /* X */, aIdx, 0);
    let attnRowStart = findSubBlocks(attnRow, 0 /* X */, null, aIdx);
    for (let blk of attnRowStart) {
      blk.access.disable = false;
    }
  }
  if (t_processAttnSmAggRow.t > 0 && t_processRemain.t <= 0) {
    let agg0T = inverseLerp(0, 0.5, t_processAttnSmAggRow.t);
    let agg1T = inverseLerp(0.5, 1, t_processAttnSmAggRow.t);
    let hidePopup = t_processAttnSmRow.t > 0;
    processDim(state, head2.attnMtxAgg2, 1 /* Y */, attnExampleIdx, agg0T, { pinIdx: new Vec3(5, 0, 0), clamp: true, hidePopup });
    if (agg1T > 0) {
      processDim(state, head2.attnMtxAgg1, 1 /* Y */, attnExampleIdx, agg1T, { pinIdx: new Vec3(-12, 0, 0), clamp: true, hidePopup });
    }
  }
  if (t_processAttnSmRow.t > 0 && t_processRemain.t <= 0) {
    let hidePopup = t_zoomVOutput.t > 0;
    processDim(state, head2.attnMtxSm, 1 /* Y */, attnExampleIdx, t_processAttnSmRow.t, { pinIdx: new Vec3(5, 0, 0), clamp: true, maxIdx: attnExampleIdx + 1, hidePopup });
  }
  if (t_zoomVOutput.t > 0 && t_processRemain.t <= 0) {
    head2.vOutBlock.access.disable = true;
  }
  {
    moveCameraTo(state, t_zoomVOutput, new Vec3(-91.9, 0, -267.9), new Vec3(270.1, -7.5, 0.7));
    let topLeftPos = getBlkDimensions(head2.vBlock).tl.add(new Vec3(0, 4, 5));
    let midLeftPos = topLeftPos.add(new Vec3(0, layout.cell * (A / 2 - 0.5)));
    if (t_expandVCols.t > 0 && t_placeVOutput.t <= 0) {
      let allVCols = [];
      let vBeforeCols = findSubBlocks(head2.vBlock, 0 /* X */, null, attnExampleIdx);
      for (let col of vBeforeCols) {
        allVCols.push(...splitGridAll(layout, col, 0 /* X */));
      }
      let allAttnCells = [];
      let attnRow = findSubBlocks(head2.attnMtxSm, 1 /* Y */, attnExampleIdx, attnExampleIdx)[0];
      let attnCellsBefore = findSubBlocks(attnRow, 0 /* X */, null, attnExampleIdx);
      for (let cell of attnCellsBefore) {
        for (let subCell of splitGridAll(layout, cell, 0 /* X */)) {
          allAttnCells.push(duplicateGrid(layout, subCell));
        }
      }
      for (let i = 0; i < attnExampleIdx + 1; i++) {
        let attnVal = getBlockValueAtIdx(head2.attnMtxSm, new Vec3(i, attnExampleIdx, 0)) ?? 0.2;
        let initColPos = getBlkDimensions(allVCols[i]).tl;
        let destColPos = topLeftPos.add(new Vec3(i * layout.cell * 5, 0, 0));
        setBlkPosition(allVCols[i], initColPos.lerp(destColPos, t_expandVCols.t));
        let initAttnPos = getBlkDimensions(allAttnCells[i]).tl;
        let destAttnPos = midLeftPos.add(new Vec3(i * layout.cell * 5 - 2 * layout.cell, 0));
        setBlkPosition(allAttnCells[i], initAttnPos.lerp(destAttnPos, t_moveAttnVals.t));
        if (t_applyMultiplies.t > 0) {
          initAttnPos = destAttnPos;
          destAttnPos = initAttnPos.add(new Vec3(layout.cell * 2, 0));
          setBlkPosition(allAttnCells[i], initAttnPos.lerp(destAttnPos, t_applyMultiplies.t));
          allAttnCells[i].opacity = 1 - t_applyMultiplies.t;
          allVCols[i].highlight = lerp(0, attnVal * 1.5, t_applyMultiplies.t);
        }
        if (t_moveAttnVals.t > 0.8 && t_applyMultiplies.t < 0.7) {
          drawSymbolBetweenBlocks(args, allVCols[i], allAttnCells[i], 0 /* X */, "x", { color: Black, size: 1.5 });
        }
        if (t_applyAdds.t > 0) {
          initColPos = destColPos;
          destColPos = topLeftPos.add(new Vec3(0, 0, attnVal * 1));
          setBlkPosition(allVCols[i], initColPos.lerp(destColPos, t_applyAdds.t));
        }
        if (t_applyMultiplies.t > 0.6 && i > 0 && t_applyAdds.t < 0.7) {
          drawSymbolBetweenBlocks(args, allVCols[i - 1], allVCols[i], 0 /* X */, "+", { color: Black, size: 1.5 });
        }
      }
    }
    if (t_placeVOutput.t > 0 && t_finalizeVOutput.t <= 0) {
      let prepareT = inverseLerp(0, 0.5, t_placeVOutput.t);
      let vOutCol = splitGrid(layout, head2.vOutBlock, 0 /* X */, attnExampleIdx + 0.5, prepareT * 2);
      vOutCol.access.disable = true;
      vOutCol.opacity = lerp(1, 0, prepareT);
      for (let col of findSubBlocks(head2.vBlock, 0 /* X */, null, attnExampleIdx)) {
        col.opacity = t_placeVOutput.t;
      }
      let vOutColDupe = duplicateGrid(layout, vOutCol);
      vOutColDupe.access.disable = false;
      vOutColDupe.opacity = 1;
      let colInitialPos = topLeftPos;
      let colFinalPos = getBlkDimensions(vOutCol).tl;
      setBlkPosition(vOutColDupe, colInitialPos.lerp(colFinalPos, t_placeVOutput.t));
    }
    if (t_finalizeVOutput.t > 0) {
      let splitAmt = lerp(1, 0, t_finalizeVOutput.t) * 2;
      let vOutCol = splitGrid(layout, head2.vOutBlock, 0 /* X */, attnExampleIdx + 0.5, splitAmt);
      vOutCol.access.disable = false;
    }
  }
  moveCameraTo(state, t_processRemainZoom, new Vec3(-99.7, 0, -230.1), new Vec3(275.6, -4.4, 1.2));
  if (t_processRemain.t > 0) {
    for (let blk of [head2.attnMtx, head2.attnMtxSm, head2.attnMtxAgg1, head2.attnMtxAgg2, head2.vOutBlock]) {
      blk.access.disable = true;
    }
    let processStart = startProcessBefore(state, head2.attnMtx);
    processUpTo(state, t_processRemain, head2.vOutBlock, processStart);
  }
  if (t_zoomVOutput.active || t_expandVCols.active || t_applyMultiplies.active || t_applyAdds.active || t_placeVOutput.active) {
    setMathCue(state, "attention_weighted_value");
  } else if (t_processAttnSmAggRow.active || t_processAttnSmRow.active) {
    setMathCue(state, "attention_softmax");
  } else if (t_processAttnRow.active) {
    setMathCue(state, "attention_score");
  } else if (t_focusQKVCols.active) {
    setMathCue(state, "attention_mask");
  } else if (t_moveDotCells.active || t_collapseDotCellsA.active || t_collapseDotCellsB.active || t_addBias.active) {
    setMathCue(state, "attention_dot");
  } else if (t_focusQCol.active || t_qIterColDot.active || t_processQkv.active) {
    setMathCue(state, "attention_qkv");
  }
}
function inverseLerp(edge0, edge1, t) {
  return (clamp(t, edge0, edge1) - edge0) / (edge1 - edge0);
}
function processDim(state, block, dim, destIdx, t, options = {}) {
  let { layout } = state;
  let { pinIdx, clamp: keep, maxIdx, hidePopup } = options;
  let otherDim = dim === 0 /* X */ ? 1 /* Y */ : 0 /* X */;
  let { cx: cxOther } = dimProps(block, otherDim);
  pinIdx || (pinIdx = new Vec3(0, 0, 0));
  let rowCol = splitGrid(layout, block, dim, destIdx, 0);
  if (!rowCol) {
    return;
  }
  let maxPos = maxIdx ?? cxOther;
  let cellPos = t * maxPos;
  if (keep) {
    cellPos = clamp(cellPos, 0, maxPos - 1);
  }
  let cellIdx = Math.floor(cellPos);
  if (cellIdx >= maxPos) {
    return;
  }
  splitGrid(layout, rowCol, otherDim, cellIdx + 0.5, 0);
  let destIdxVec = new Vec3(0, 0, 0);
  destIdxVec.setAt(dim, destIdx);
  destIdxVec.setAt(otherDim, cellIdx);
  if (rowCol && !hidePopup) {
    drawDependences(state, block, destIdxVec);
    drawDataFlow(state, block, destIdxVec, pinIdx);
  }
  for (let blk of findSubBlocks(rowCol, otherDim, null, cellIdx)) {
    blk.access.disable = false;
  }
}
function focusSelfAttentionHeadTimers(args, duration) {
  let afterTime2 = args.tools.afterTime;
  let totalTime = 1.5 * 2;
  let timeScale = duration / totalTime;
  let t0_dissolveHeads = afterTime2(null, 1 * timeScale, 0.5 * timeScale);
  let t2_alignqkv = afterTime2(null, 1 * timeScale, 0.5 * timeScale);
  return { t0_dissolveHeads, t2_alignqkv };
}
function focusSelfAttentionHead(args, timers) {
  let { layout } = args;
  let { t0_dissolveHeads, t2_alignqkv } = timers;
  let targetHeadIdx = 2;
  let targetHead = layout.blocks[0].heads[targetHeadIdx];
  let block = layout.blocks[0];
  {
    for (let headIdx = 0; headIdx < block.heads.length; headIdx++) {
      if (headIdx == targetHeadIdx) {
        continue;
      }
      for (let cube of block.heads[headIdx].cubes) {
        cube.opacity = lerpSmoothstep(1, 0, t0_dissolveHeads.t);
      }
    }
  }
  {
    let headZ = targetHead.attnMtx.z;
    let targetHeadZ = block.ln1.lnResid.z;
    let deltaZ = lerpSmoothstep(0, targetHeadZ - headZ, t2_alignqkv.t);
    for (let cube of targetHead.cubes) {
      cube.z += deltaZ;
    }
  }
  {
    let qkv = [
      [targetHead.qBlock, targetHead.qWeightBlock, targetHead.qBiasBlock],
      [targetHead.kBlock, targetHead.kWeightBlock, targetHead.kBiasBlock],
      [targetHead.vBlock, targetHead.vWeightBlock, targetHead.vBiasBlock]
    ];
    let targetZ = block.ln1.lnResid.z;
    let strideY = targetHead.qBlock.dy + layout.margin;
    let baseY = targetHead.qBlock.y;
    let qkvYPos = [-strideY * 2, -strideY, 0];
    for (let i = 0; i < 3; i++) {
      let y = lerpSmoothstep(qkv[i][0].y, baseY + qkvYPos[i], t2_alignqkv.t);
      let z = lerpSmoothstep(qkv[i][0].z, targetZ, t2_alignqkv.t);
      for (let cube of qkv[i]) {
        cube.y = y;
        cube.z = z;
      }
    }
    let blockMidY = (blk) => blk.y + blk.dy / 2;
    let resid0Idx = layout.cubes.indexOf(block.ln1.lnResid);
    let yDelta = lerpSmoothstep(0, blockMidY(block.ln1.lnResid) - blockMidY(targetHead.kBlock), t2_alignqkv.t);
    for (let i = 0; i < resid0Idx; i++) {
      let targetOpacity = 0.2;
      layout.cubes[i].opacity = lerpSmoothstep(1, targetOpacity, t2_alignqkv.t);
    }
    let afterAttn = false;
    for (let i = resid0Idx + 1; i < layout.cubes.length; i++) {
      let cube = layout.cubes[i];
      cube.y += yDelta;
      if (afterAttn) {
        cube.opacity = Math.min(lerpSmoothstep(1, 0.2, t2_alignqkv.t), cube.opacity ?? 1);
      }
      afterAttn = afterAttn || cube === targetHead.vOutBlock;
    }
  }
}
function drawSymbolBetweenBlocks(args, block1, block2, dim, symbol, opts) {
  let { color, size } = opts;
  let block1Dim = getBlkDimensions(block1);
  let block2Dim = getBlkDimensions(block2);
  let midPt;
  if (dim === 0 /* X */) {
    midPt = new Vec3(
      lerp(block1Dim.br.x, block2Dim.tl.x, 0.5),
      (block1Dim.tl.y + block1Dim.br.y + block2Dim.tl.y + block2Dim.br.y) * 0.25,
      block1Dim.tl.z + args.layout.cell / 2
    );
  } else {
    midPt = new Vec3(
      (block1Dim.tl.x + block1Dim.br.x + block2Dim.tl.x + block2Dim.br.x) * 0.25,
      lerp(block1Dim.br.y, block2Dim.tl.y, 0.5),
      block1Dim.tl.z + args.layout.cell / 2
    );
  }
  let mtx = Mat4f.fromTranslation(midPt);
  let fontOpts = { color, size, mtx };
  let w = measureText(args.state.render.modelFontBuf, symbol, fontOpts);
  drawText(args.state.render.modelFontBuf, symbol, -w / 2, -fontOpts.size / 2, fontOpts);
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloSoftmax.ts
function runDeveloSoftmax(args) {
  let { state, layout, tools: { afterTime: afterTime2 } } = args;
  setInitialCamera(state, new Vec3(-24.35, 0, -1702.195), new Vec3(283.1, 0.6, 1.556));
  let t_max = afterTime2(null, 0.85, 0.1);
  let t_expSum = afterTime2(t_max, 0.95, 0.1);
  let t_normalize = afterTime2(t_expSum, 1, 0.2);
  let processInfo = startProcessBefore(state, layout.logitsAgg2);
  processInfo = processUpTo(state, t_max, layout.logitsAgg2, processInfo);
  processInfo = processUpTo(state, t_expSum, layout.logitsAgg1, processInfo);
  processUpTo(state, t_normalize, layout.logitsSoftmax, processInfo);
  if (t_max.active) {
    setMathCue(state, "softmax_max");
  }
  if (t_expSum.active) {
    setMathCue(state, "softmax_exp_sum");
  }
  if (t_normalize.active) {
    setMathCue(state, "softmax_stable");
  }
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloTransformer.ts
function runDeveloTransformer(args) {
  let { state, layout, tools: { afterTime: afterTime2 } } = args;
  setInitialCamera(state, new Vec3(-135.531, 0, -353.905), new Vec3(291.1, 13.6, 5.706));
  setMathCue(state, "transformer_block");
  let t_block0 = afterTime2(null, 0.85, 0.1);
  let t_block1 = afterTime2(t_block0, 0.85, 0.1);
  let t_block2 = afterTime2(t_block1, 0.85, 0.25);
  let processInfo = startProcessBefore(state, layout.blocks[0].ln1.lnResid);
  processInfo = processUpTo(state, t_block0, layout.blocks[0].mlpResidual, processInfo);
  processInfo = processUpTo(state, t_block1, layout.blocks[1].mlpResidual, processInfo);
  processUpTo(state, t_block2, layout.blocks[2].mlpResidual, processInfo);
  emphasizeTransformerBlock(layout.blocks[0], t_block0);
  emphasizeTransformerBlock(layout.blocks[1], t_block1);
  emphasizeTransformerBlock(layout.blocks[2], t_block2);
}
function emphasizeTransformerBlock(block, timer) {
  if (!timer.active) {
    return;
  }
  const pulse = Math.sin(Math.PI * Math.min(1, Math.max(0, timer.t)));
  const highlight = 0.08 + pulse * 0.16;
  for (const cube of block.cubes) {
    cube.highlight = Math.max(cube.highlight ?? 0, highlight);
  }
}

// features/llm-visualization/upstream/src/llm/walkthrough-develo/DeveloWalkthrough.ts
var DEVELO_WALKTHROUGH_PHASES = [
  "intro",
  "embedding",
  "layerNorm",
  "selfAttention",
  "projection",
  "mlp",
  "transformer",
  "softmax",
  "output"
];
function createDeveloWalkthrough(markDirty) {
  return {
    phase: "intro",
    phaseIndex: 0,
    time: 0,
    prevTime: 0,
    dt: 0,
    viewDt: 0,
    running: false,
    speed: 1,
    phaseLength: 0,
    times: [],
    phaseData: /* @__PURE__ */ new Map(),
    phaseTransitiveData: null,
    cameraInitial: null,
    mathCue: "",
    complete: false,
    dimHighlightBlocks: null,
    markDirty
  };
}
function startDeveloWalkthrough(state) {
  state.inWalkthrough = true;
  state.walkthrough.running = true;
  state.walkthrough.complete = false;
  state.walkthrough.markDirty();
}
function pauseDeveloWalkthrough(state) {
  state.walkthrough.running = false;
  state.walkthrough.markDirty();
}
function resetDeveloWalkthrough(state) {
  let wt = state.walkthrough;
  wt.phase = "intro";
  wt.phaseIndex = 0;
  wt.time = 0;
  wt.prevTime = 0;
  wt.dt = 0;
  wt.running = false;
  wt.complete = false;
  wt.phaseLength = 0;
  wt.times = [];
  wt.phaseData.clear();
  wt.phaseTransitiveData = null;
  wt.cameraInitial = null;
  wt.mathCue = "";
  wt.dimHighlightBlocks = null;
  wt.markDirty();
}
function getDeveloWalkthroughSnapshot(state) {
  let wt = state.walkthrough;
  return {
    phase: wt.phase,
    phaseIndex: wt.phaseIndex,
    time: wt.time,
    phaseLength: wt.phaseLength,
    running: wt.running,
    complete: wt.complete,
    speed: wt.speed,
    mathCue: wt.mathCue
  };
}
function setDeveloWalkthroughSpeed(state, speed) {
  state.walkthrough.speed = speed;
}
function setMathCue(state, cue) {
  state.walkthrough.mathCue = cue;
}
function advancePhase(wt) {
  if (wt.phaseIndex >= DEVELO_WALKTHROUGH_PHASES.length - 1) {
    wt.running = false;
    wt.complete = true;
    return;
  }
  wt.phaseIndex += 1;
  wt.phase = DEVELO_WALKTHROUGH_PHASES[wt.phaseIndex];
  wt.time = 0;
  wt.prevTime = 0;
  wt.phaseData.delete(wt.phase);
  wt.phaseTransitiveData = null;
  wt.mathCue = "";
}
function runDeveloWalkthrough(view, state) {
  let wt = state.walkthrough;
  let dtMs = view.dt || 16;
  wt.viewDt = dtMs;
  wt.dt = 0;
  if (wt.running) {
    let dtSeconds = dtMs * wt.speed / 1e3;
    wt.time += dtSeconds;
    wt.dt = dtSeconds;
    view.markDirty();
  }
  wt.times = [];
  wt.phaseLength = 0;
  wt.dimHighlightBlocks = null;
  let args = {
    state,
    layout: state.layout,
    walkthrough: wt,
    tools: phaseTools(state)
  };
  switch (wt.phase) {
    case "intro":
      runDeveloIntro(args);
      break;
    case "embedding":
      runDeveloEmbedding(args);
      break;
    case "layerNorm":
      runDeveloLayerNorm(args);
      break;
    case "selfAttention":
      runDeveloSelfAttention(args);
      break;
    case "projection":
      runDeveloProjection(args);
      break;
    case "mlp":
      runDeveloMlp(args);
      break;
    case "transformer":
      runDeveloTransformer(args);
      break;
    case "softmax":
      runDeveloSoftmax(args);
      break;
    case "output":
      runDeveloOutput(args);
      break;
  }
  if (wt.running && wt.phaseLength > 0 && wt.time >= wt.phaseLength) {
    advancePhase(wt);
  }
  wt.prevTime = wt.time;
}

// features/llm-visualization/upstream/src/llm/render/blockRender.ts
function initBlockRender(ctx) {
  if (!ctx) {
    return null;
  }
  let gl = ctx.gl;
  let blockUboText = (
    /*glsl*/
    `
    layout (std140) uniform BlockUbo {
        uniform vec3 u_offset;
        uniform vec3 u_size;
        uniform vec3 u_nCells;
        uniform mat4 u_localPosMtx;
        uniform vec4 u_baseColor;
        uniform float u_highlight;
    };`
  );
  let blockAccessUboText = (
    /*glsl*/
    `
    layout (std140) uniform BlockAccessUbo {
        layout(row_major) uniform mat4x2 u_accessMtx;
        uniform float u_accessTexChannel;
        uniform float u_accessTexScale;
    };`
  );
  let numBlocks = 1024;
  let blockSize = (1 + 1 + 1 + 4 + 1 + 1) * 4 * 4;
  let blockUbo = createFloatBuffer(gl, gl.UNIFORM_BUFFER, gl.createBuffer(), numBlocks, blockSize, null);
  let blockAccessSize = (2 + 1 + 1 + 1) * 4 * 4;
  let blockAccessUbo = createFloatBuffer(gl, gl.UNIFORM_BUFFER, gl.createBuffer(), numBlocks, blockAccessSize, null);
  let cubeGeom = genCubeGeom(gl);
  let instancedVao = gl.createVertexArray();
  gl.bindVertexArray(instancedVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeGeom.vbo);
  bindFloatAttribs(gl, cubeGeom.vbo, {}, [
    { name: "a_position", size: 3 },
    { name: "a_normal", size: 3 }
  ]);
  let instancedVbo = gl.createBuffer();
  let instancedStrideBytes = bindFloatAttribs(gl, instancedVbo, { locOffset: 2, divisor: 1 }, [
    { name: "a_offset", size: 4 },
    { name: "a_size", size: 4 },
    { name: "a_nCells", size: 4 },
    { name: "a_localPosMtx0", size: 4 },
    { name: "a_localPosMtx1", size: 4 },
    { name: "a_localPosMtx2", size: 4 },
    { name: "a_localPosMtx3", size: 4 },
    { name: "a_baseColor", size: 4 },
    { name: "a_highlight", size: 1 }
  ]);
  let instancedFloatBuf = createFloatBuffer(gl, gl.ARRAY_BUFFER, instancedVbo, 1024, instancedStrideBytes, null);
  let dummyTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, dummyTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  function createVertShader(instanced) {
    return (
      /*glsl*/
      `#version 300 es
        precision highp float;

        ${modelViewUboText}

        ${instanced ? "" : blockUboText}

        ${blockAccessUboText}

        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec3 a_normal;
        out vec3 v_normal;
        out vec3 v_modelPos;
        out vec3 v_blockPos;
        out vec2 v_accessPos;
        out vec3 v_cubePos;

        ${instanced ? `
            layout(location = 2) in vec4 a_offset;
            layout(location = 3) in vec4 a_size;
            layout(location = 4) in vec4 a_nCells;
            layout(location = 5) in vec4 a_localPosMtx0;
            layout(location = 6) in vec4 a_localPosMtx1;
            layout(location = 7) in vec4 a_localPosMtx2;
            layout(location = 8) in vec4 a_localPosMtx3;
            layout(location = 9) in vec4 a_baseColor;
            layout(location = 10) in float a_highlight;

            out vec4 u_baseColor;
            out float u_highlight;
        ` : ""}

        void main() {
            ${instanced ? `
                vec3 u_offset = a_offset.xyz;
                vec3 u_size = a_size.xyz;
                vec3 u_nCells = a_nCells.xyz;
                mat4 u_localPosMtx = mat4(a_localPosMtx0, a_localPosMtx1, a_localPosMtx2, a_localPosMtx3);
                u_baseColor = a_baseColor;
                u_highlight = a_highlight;
            ` : ""}

            vec3 localPos = (u_localPosMtx * vec4(a_position, 1.0)).xyz;
            vec3 model_pos = a_position * u_size + u_offset;
            gl_Position = u_view * u_model * vec4(model_pos, 1);
            v_normal = a_normal;
            v_modelPos = model_pos;
            v_blockPos = localPos * u_nCells;
            v_accessPos = u_accessMtx * vec4(v_blockPos, 1.0);
            v_cubePos = localPos;
            ${instanced ? ` ` : ""}
        }`
    );
  }
  function createFragShader(instanced) {
    return (
      /*glsl*/
      `#version 300 es
        precision highp float;
        in vec3 v_normal;
        out vec4 o_color;
        in vec3 v_blockPos;
        in vec3 v_cubePos;
        in vec3 v_modelPos;
        in vec2 v_accessPos;
        uniform vec3 u_camPos; // in model space

        ${instanced ? `
            in vec4 u_baseColor;
            in float u_highlight;
        ` : blockUboText}

        ${blockAccessUboText}

        uniform sampler2D u_accessSampler;

        void main() {
            ivec3 blockPos = ivec3(v_blockPos - v_normal * 0.1);

            bool cellDark = (blockPos.x + blockPos.y + blockPos.z) % 2 == 0;

            float maxDist = 4000.0;
            float minDist = 600.0;
            float dist = distance(u_camPos, v_modelPos);
            float t = clamp((dist - minDist) / (maxDist - minDist), 0.0, 1.0);

            vec3 baseColor = mix(u_baseColor.rgb, vec3(0.5, 0.5, 0.5), 0.5);
            if (cellDark) {
                baseColor *= mix(0.9, 1.0, t);
            }

            if (u_accessTexScale > 0.0 && dist < maxDist) { // have access texture
                vec3 texBaseColor = mix(baseColor, vec3(0.5, 0.5, 0.5), 0.8);

                vec3 d = fract(v_blockPos) - 0.5;
                float r2 = 0.3*0.3;
                bool insideX = d.y * d.y + d.z * d.z < r2;
                bool insideY = d.x * d.x + d.z * d.z < r2;
                bool insideZ = d.x * d.x + d.y * d.y < r2;
                bool insideAny = insideX || insideY || insideZ;

                if (insideAny) {
                    ivec2 accessPos = ivec2(u_accessMtx * vec4(blockPos, 1.0));
                    vec4 valVec = texelFetch(u_accessSampler, accessPos, 0) * u_accessTexScale;
                    float val = u_accessTexChannel == 0.0 ? valVec.r : u_accessTexChannel == 1.0 ? valVec.g : valVec.b;

                    float weight = clamp(abs(val), 0.0, 1.0);

                    vec3 negColor = vec3(0.0, 0.0, 0.0);
                    vec3 posColor = u_baseColor.rgb; // vec3(0.0, 1.0, 0.0);
                    vec3 zeroColor = vec3(0.5, 0.5, 0.5);
                    texBaseColor = mix(mix(zeroColor, negColor, weight), mix(zeroColor, posColor, weight), step(0.0, val));
                }

                baseColor = mix(texBaseColor, baseColor, t);
            }

            if (true) {
                vec3 block16 = v_blockPos / 16.0;
                vec3 pxPerBlock16 = 1.0 / fwidth(block16);
                float strength16 = min(min(pxPerBlock16.x, pxPerBlock16.y), pxPerBlock16.z);
                vec3 colorEdge = vec3(1.0, 1.0, 1.0);
                vec3 color16 = vec3(1.0, 1.0, 1.0) * 0.7;
                vec3 color256 = vec3(1.0, 1.0, 1.0);

                // if we're zoomed out enough, show 256 & (256 * 16) grid lines
                // the 16 grid lines are faded out by this point (fade out between 10px -> 1px)
                if (strength16 < 2.0) {
                    block16 = block16 / 16.0;
                    pxPerBlock16 = 1.0 / fwidth(block16);
                    strength16 = min(min(pxPerBlock16.x, pxPerBlock16.y), pxPerBlock16.z);
                    color16 = color256;
                    // orange
                    color256 = vec3(1.0, 0.7, 0.4);
                }

                float visibility16 = smoothstep(2.0, 10.0, strength16); // below 10px between lines, fade out
                vec3 block16Grid = 1.0 - abs(fract(block16 - 0.5) - 0.5) * pxPerBlock16;
                float line16 = max(max(block16Grid.x, block16Grid.y), block16Grid.z) * visibility16;

                vec3 block256 = block16 / 16.0;
                vec3 block256Grid = 1.0 - abs(fract(block256 - 0.5) - 0.5) / fwidth(block256);
                float line256 = max(max(block256Grid.x, block256Grid.y), block256Grid.z);

                vec3 cube = v_cubePos - v_normal * 0.1;
                vec3 cubeGrid = 1.0 - abs(fract(cube - 0.5) - 0.5) / fwidth(cube);
                float lineCube = max(max(cubeGrid.x, cubeGrid.y), cubeGrid.z);

                float bestPxPerBlock = min(min(pxPerBlock16.x, pxPerBlock16.y), pxPerBlock16.z);
                float edgeWeight = smoothstep(0.0, 1.0, max(max(line16, lineCube), line256));
                vec3 color = lineCube > 0.0 ? colorEdge : (line256 > 0.0 ? color256 : color16);
                baseColor = mix(baseColor, color, edgeWeight);
            }

            vec3 color = mix(baseColor * 0.7, u_baseColor.rgb, u_highlight);

            o_color = vec4(color, 1) * u_baseColor.a;
        }`
    );
  }
  let shader = createShaderProgram(
    ctx,
    "block",
    createVertShader(false),
    createFragShader(false),
    ["u_camPos", "u_accessSampler"],
    { uboBindings: { "ModelViewUbo": UboBindings.ModelView, "BlockUbo": UboBindings.Block, "BlockAccessUbo": UboBindings.BlockAccess } }
  );
  let instancedShader = createShaderProgram(
    ctx,
    "block-instanced",
    createVertShader(true),
    createFragShader(true),
    ["u_camPos", "u_accessSampler"],
    { uboBindings: { "ModelViewUbo": UboBindings.ModelView, "BlockAccessUbo": UboBindings.BlockAccess } }
  );
  let simpleShader = createShaderProgram(
    ctx,
    "block-simple",
    /*glsl*/
    `#version 300 es
        precision highp float;
        ${modelViewUboText}
        uniform vec3 u_size;
        uniform vec3 u_offset;

        layout(location = 0) in vec3 a_position;
        void main() {
            vec3 model_pos = a_position * u_size + u_offset;
            gl_Position = u_view * u_model * vec4(model_pos, 1);
        }
    `,
    /*glsl*/
    `#version 300 es
        precision highp float;
        out vec4 o_color;
        uniform vec4 u_baseColor;

        void main() {
            o_color = u_baseColor;
        }
    `,
    [
      "u_size",
      "u_offset",
      "u_baseColor"
    ],
    { uboBindings: { "ModelViewUbo": UboBindings.ModelView } }
  );
  return {
    gl,
    cubeGeom,
    shader,
    simpleShader,
    blockUbo,
    blockAccessUbo,
    dummyTexture,
    /* specific to instanced rendering of the blocks. */
    instancedShader,
    instancedVao,
    instancedFloatBuf,
    instancedDataStale: true,
    instancedNumBlocks: 0
  };
}
function genCubeGeom(gl) {
  let faceVerts = [-1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1];
  let faces = [
    new Mat4f(),
    Mat4f.fromAxisAngle(new Vec3(1, 0), Math.PI / 2),
    Mat4f.fromAxisAngle(new Vec3(1, 0), Math.PI),
    Mat4f.fromAxisAngle(new Vec3(1, 0), -Math.PI / 2),
    Mat4f.fromAxisAngle(new Vec3(0, 1), Math.PI / 2),
    Mat4f.fromAxisAngle(new Vec3(0, 1), -Math.PI / 2)
  ];
  let transform = Mat4f.fromTranslation(new Vec3(0.5, 0.5, 0.5)).mul(Mat4f.fromScale(new Vec3(0.5, 0.5, 0.5)));
  let arr = new Float32Array(6 * 6 * 3 * 2);
  let j = 0;
  for (let faceMtx of faces) {
    for (let i = 0; i < 6; i++) {
      let v = transform.mulVec3Proj(faceMtx.mulVec3Proj(new Vec3(faceVerts[i * 2], faceVerts[i * 2 + 1], -1)));
      let n = faceMtx.mulVec3Proj(new Vec3(0, 0, -1));
      arr[j++] = Math.round(v.x);
      arr[j++] = Math.round(v.y);
      arr[j++] = Math.round(v.z);
      arr[j++] = n.x;
      arr[j++] = n.y;
      arr[j++] = n.z;
    }
  }
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  let vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
  bindFloatAttribs(gl, vbo, {}, [
    { name: "a_position", size: 3 },
    { name: "a_normal", size: 3 }
  ]);
  return { name: "cube", vao, vbo, type: gl.TRIANGLES, numVerts: 36 };
}
function renderBlocksSimple(blockRender, cubes) {
  let gl = blockRender.gl;
  if (!blockRender.simpleShader.ready) {
    return;
  }
  let locs = blockRender.simpleShader.locs;
  let geom = blockRender.cubeGeom;
  gl.useProgram(blockRender.simpleShader.program);
  gl.bindVertexArray(geom.vao);
  for (let cube of cubes) {
    gl.uniform3f(locs.u_size, cube.dx, cube.dy, cube.dz);
    gl.uniform3f(locs.u_offset, cube.x, cube.y, cube.z);
    let baseColor = (cube.t === "w" ? new Vec4(0.3, 0.3, 1, 1) : new Vec4(0.4, 0.8, 0.4, 1)).mul(cube.highlight);
    gl.uniform4f(locs.u_baseColor, baseColor.x, baseColor.y, baseColor.z, baseColor.w);
    gl.drawArrays(geom.type, 0, geom.numVerts);
  }
}
function renderAllBlocks(blockRender, layout, modelMtx, camPos, lightPosArr, lightColorArr) {
  let gl = blockRender.gl;
  let locs = blockRender.shader.locs;
  let geom = blockRender.cubeGeom;
  if (!blockRender.shader.ready) {
    return;
  }
  gl.useProgram(blockRender.shader.program);
  let camPosModel = modelMtx.mulVec3Proj(camPos);
  gl.uniform3f(locs.u_camPos, camPosModel.x, camPosModel.y, camPosModel.z);
  gl.uniform1i(locs.u_accessSampler, 0);
  gl.enable(gl.BLEND);
  gl.enable(gl.CULL_FACE);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindVertexArray(geom.vao);
  let cubes = [];
  let transparentCubes = [];
  function addCube(c) {
    if (c.subs) {
      c.subs.forEach(addCube);
    } else {
      if (c.opacity < 0.8 && c.opacity > 0) {
        transparentCubes.push(c);
      } else if (c.opacity > 0) {
        cubes.push(c);
      }
    }
  }
  layout.cubes.forEach(addCube);
  let allCubes = [...cubes, ...transparentCubes];
  let firstTransparent = cubes.length;
  let blockUbo = blockRender.blockUbo.localBufs[0];
  let blockAccessUbo = blockRender.blockAccessUbo.localBufs[0];
  {
    resetFloatBufferMap(blockRender.blockUbo);
    ensureFloatBufferSize(blockUbo, cubes.length);
    let blockBuf = blockUbo.buf;
    for (let cube of allCubes) {
      let baseOff = blockUbo.usedEls * blockUbo.strideFloats;
      blockBuf[baseOff + 0] = cube.x;
      blockBuf[baseOff + 1] = cube.y;
      blockBuf[baseOff + 2] = cube.z;
      blockBuf[baseOff + 4] = cube.dx;
      blockBuf[baseOff + 5] = cube.dy;
      blockBuf[baseOff + 6] = cube.dz;
      blockBuf[baseOff + 8] = cube.cx;
      blockBuf[baseOff + 9] = cube.cy;
      blockBuf[baseOff + 10] = cube.cz;
      blockBuf.set(cube.localMtx ?? new Mat4f(), baseOff + 12);
      let color = cube.t === "w" ? Colors.Weights : cube.t === "i" ? Colors.Intermediates : Colors.Aggregates;
      let baseColor = new Vec4(color.x, color.y, color.z, cube.opacity);
      baseColor.writeToBuf(blockBuf, baseOff + 28);
      blockBuf[baseOff + 32] = cube.highlight;
      blockUbo.usedEls += 1;
    }
    uploadFloatBuffer(gl, blockRender.blockUbo);
  }
  {
    resetFloatBufferMap(blockRender.blockAccessUbo);
    ensureFloatBufferSize(blockAccessUbo, cubes.length);
    let blockBuf = blockAccessUbo.buf;
    for (let cube of allCubes) {
      let baseOff = blockAccessUbo.usedEls * blockAccessUbo.strideFloats;
      if (cube.access && cube.access.disable !== true) {
        blockBuf.set(cube.access.mat.slice(0, 8), baseOff);
        let c = cube.access.channel;
        blockBuf[baseOff + 8] = c === "r" ? 0 : c === "g" ? 1 : c === "b" ? 2 : 3;
        blockBuf[baseOff + 9] = cube.access.scale;
      } else {
        blockBuf[baseOff + 9] = 0;
      }
      blockAccessUbo.usedEls += 1;
    }
    uploadFloatBuffer(gl, blockRender.blockAccessUbo);
  }
  let prevHasAccess = true;
  let idx = 0;
  for (let cube of allCubes) {
    if (idx === firstTransparent) {
      gl.depthMask(false);
    }
    gl.bindBufferRange(gl.UNIFORM_BUFFER, UboBindings.Block, blockRender.blockUbo.buf, idx * blockUbo.strideBytes, blockUbo.strideBytes);
    let hasAccess = !!cube.access && cube.access.disable !== true;
    if (prevHasAccess || hasAccess) {
      gl.bindBufferRange(gl.UNIFORM_BUFFER, UboBindings.BlockAccess, blockRender.blockAccessUbo.buf, idx * blockAccessUbo.strideBytes, blockAccessUbo.strideBytes);
      gl.bindTexture(gl.TEXTURE_2D, hasAccess && cube.access ? cube.access.src.texture : blockRender.dummyTexture);
      prevHasAccess = hasAccess;
    }
    gl.drawArrays(geom.type, 0, geom.numVerts);
    idx++;
  }
  gl.depthMask(true);
}
function renderAllBlocksInstanced(blockRender, layout, modelMtx, camPos) {
  if (!blockRender.instancedShader.ready) {
    return;
  }
  let gl = blockRender.gl;
  let locs = blockRender.instancedShader.locs;
  let blockAccessUbo = blockRender.blockAccessUbo.localBufs[0];
  gl.useProgram(blockRender.instancedShader.program);
  let modelMtxInv = modelMtx.invert();
  let camPosModel = modelMtxInv.mulVec3Proj(camPos);
  gl.uniform3f(locs.u_camPos, camPosModel.x, camPosModel.y, camPosModel.z);
  gl.uniform1i(locs.u_accessSampler, 0);
  gl.enable(gl.BLEND);
  gl.enable(gl.CULL_FACE);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, blockRender.dummyTexture);
  gl.bindVertexArray(blockRender.instancedVao);
  if (blockRender.instancedDataStale) {
    blockRender.instancedDataStale = false;
    {
      resetFloatBufferMap(blockRender.instancedFloatBuf);
      let vboBuf = blockRender.instancedFloatBuf.localBufs[0];
      ensureFloatBufferSize(vboBuf, layout.cubes.length);
      let buf = vboBuf.buf;
      for (let cube of layout.cubes) {
        if (cube.small) {
          continue;
        }
        let baseOff = vboBuf.usedEls * vboBuf.strideFloats;
        buf[baseOff + 0] = cube.x;
        buf[baseOff + 1] = cube.y;
        buf[baseOff + 2] = cube.z;
        buf[baseOff + 4] = cube.dx;
        buf[baseOff + 5] = cube.dy;
        buf[baseOff + 6] = cube.dz;
        buf[baseOff + 8] = cube.cx;
        buf[baseOff + 9] = cube.cy;
        buf[baseOff + 10] = cube.cz;
        buf.set(cube.localMtx ?? new Mat4f(), baseOff + 12);
        let color = cube.t === "w" ? Colors.Weights : cube.t === "i" ? Colors.Intermediates : Colors.Aggregates;
        let baseColor = new Vec4(color.x, color.y, color.z, cube.opacity);
        baseColor.writeToBuf(buf, baseOff + 28);
        buf[baseOff + 32] = cube.highlight;
        vboBuf.usedEls += 1;
      }
      uploadFloatBuffer(gl, blockRender.instancedFloatBuf);
      blockRender.instancedNumBlocks = vboBuf.usedEls;
    }
    {
      resetFloatBufferMap(blockRender.blockAccessUbo);
      ensureFloatBufferSize(blockAccessUbo, 1);
      let blockBuf = blockAccessUbo.buf;
      blockBuf[0 + 9] = 0;
      blockAccessUbo.usedEls += 1;
      uploadFloatBuffer(gl, blockRender.blockAccessUbo);
    }
  }
  gl.bindBufferRange(gl.UNIFORM_BUFFER, UboBindings.BlockAccess, blockRender.blockAccessUbo.buf, 0, blockAccessUbo.strideBytes);
  gl.drawArraysInstanced(blockRender.cubeGeom.type, 0, blockRender.cubeGeom.numVerts, blockRender.instancedNumBlocks);
  gl.depthMask(true);
}

// features/llm-visualization/upstream/src/llm/render/blurRender.ts
function initBlurRender(ctx, quadVao) {
  let gl = ctx.gl;
  let w = Math.max(gl.canvas.width, 1);
  let h = Math.max(gl.canvas.height, 1);
  let initialFbo = gl.createFramebuffer();
  let initialTex = gl.createTexture();
  gl.bindFramebuffer(gl.FRAMEBUFFER, initialFbo);
  gl.bindTexture(gl.TEXTURE_2D, initialTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, initialTex, 0);
  function createBlurFbo() {
    let fbo = gl.createFramebuffer();
    let tex = gl.createTexture();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    {
      let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.log(`Blur framebuffer not complete: ${status.toString(16)}`);
      }
    }
    return { fbo, tex };
  }
  let blurFbos = [createBlurFbo(), createBlurFbo()];
  let radiusPx = 4;
  let blurPixelStride = 2;
  let blurWeights = new Float32Array((radiusPx * 2 + 1) * 4);
  let blurWeightsSum = 0;
  let blurSigma = radiusPx / 2;
  for (let i = -radiusPx; i <= radiusPx; i++) {
    let x = i / blurSigma;
    let w2 = Math.exp(-x * x * 0.5);
    let wIdx = i + radiusPx;
    blurWeights[wIdx * 4] = w2;
    blurWeightsSum += w2;
  }
  for (let i = 0; i < radiusPx * 2 + 1; i++) {
    blurWeights[i * 4] /= blurWeightsSum;
  }
  let blurUbo = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, blurUbo);
  gl.bufferData(gl.UNIFORM_BUFFER, blurWeights.buffer, gl.STATIC_DRAW);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, UboBindings.blur, blurUbo);
  function createBlurShader(name, dim) {
    return createShaderProgram(
      ctx.shaderManager,
      name,
      /*glsl*/
      `#version 300 es
            precision highp float;
            layout(location = 0) in vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
            }
        `,
      /*glsl*/
      `#version 300 es
            precision highp float;

            layout(std140) uniform BlurWeights {
                float weights[${radiusPx * 2 + 1}];
            };

            uniform sampler2D u_texture;
            out vec4 o_color;

            void main() {
                ivec2 pos = ivec2(gl_FragCoord.xy);
                vec4 color = vec4(0);
                vec4 center = texelFetch(u_texture, pos, 0);
                for (int i = -${radiusPx}; i <= ${radiusPx}; i++) {
                    int wId = i + ${radiusPx};
                    color += texelFetch(u_texture, pos + ivec2(${dim === 0 /* X */ ? "i, 0" : "0, i"}) * ${blurPixelStride}, 0) * weights[wId];
                }
                o_color = max(color, center);
            }
        `,
      ["u_texture"],
      { uboBindings: { "BlurWeights": UboBindings.blur } }
    );
  }
  let horizShader = createBlurShader("blurHoriz", 0 /* X */);
  let vertShader = createBlurShader("blurVert", 1 /* Y */);
  let overlayShader = createShaderProgram(
    ctx.shaderManager,
    "blurOverlay",
    /*glsl*/
    `#version 300 es
            precision highp float;
            layout(location = 0) in vec2 a_position;
            out vec2 v_uv;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
                v_uv = a_position * 0.5 + 0.5;
            }
        `,
    /*glsl*/
    `#version 300 es
            precision highp float;
            uniform sampler2D u_texture;
            uniform sampler2D u_initTexture;
            in vec2 v_uv;
            out vec4 o_color;

            void main() {
                ivec2 pos = ivec2(gl_FragCoord.xy);
                vec4 blurColor = texture(u_texture, v_uv);
                // vec4 initColor = texture(u_initTexture, v_uv);

                vec4 base = vec4(0.9, 0.9, 0.9, 0.1);
                // if (blurColor.a == 0.0) {
                //     blurColor = vec4(0.1, 0.1, 0.1, 1.0);
                // }
                o_color = blurColor; // + initColor * (1.0 - blurColor.a);
                // o_color = initColor;
            }
        `,
    ["u_texture"]
  );
  return {
    gl,
    quadVao,
    // stencilRenderBuf,
    initialFbo,
    initialTex,
    blurFbos,
    horizShader,
    vertShader,
    overlayShader,
    currViewSize: new Vec3(0, 0),
    blurFactor: 0.3
  };
}
function setupBlurTarget(blur) {
  let gl = blur.gl;
  let w = gl.canvas.width;
  let h = gl.canvas.height;
  let blurW = Math.floor(w * blur.blurFactor);
  let blurH = Math.floor(h * blur.blurFactor);
  if (blur.currViewSize.x !== w || blur.currViewSize.y !== h) {
    gl.bindTexture(gl.TEXTURE_2D, blur.initialTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, blurW, blurH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    for (let fbo of blur.blurFbos) {
      gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, blurW, blurH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    blur.currViewSize = new Vec3(w, h);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, blur.initialFbo);
  gl.viewport(0, 0, blurW, blurH);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
function renderBlur(blur, destFbo) {
  let gl = blur.gl;
  let w = gl.canvas.width;
  let h = gl.canvas.height;
  let blurW = Math.floor(w * blur.blurFactor);
  let blurH = Math.floor(h * blur.blurFactor);
  gl.bindVertexArray(blur.quadVao);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  gl.disable(gl.STENCIL_TEST);
  gl.activeTexture(gl.TEXTURE0);
  {
    gl.bindTexture(gl.TEXTURE_2D, blur.initialTex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, blur.blurFbos[0].fbo);
    gl.viewport(0, 0, blurW, blurH);
    gl.useProgram(blur.horizShader.program);
    gl.uniform1i(blur.horizShader.locs.u_texture, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  {
    gl.bindTexture(gl.TEXTURE_2D, blur.blurFbos[0].tex);
    gl.bindFramebuffer(gl.FRAMEBUFFER, blur.blurFbos[1].fbo);
    gl.viewport(0, 0, blurW, blurH);
    gl.useProgram(blur.vertShader.program);
    gl.uniform1i(blur.vertShader.locs.u_texture, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  {
    gl.enable(gl.BLEND);
    gl.viewport(0, 0, w, h);
    gl.bindFramebuffer(gl.FRAMEBUFFER, destFbo);
    gl.bindTexture(gl.TEXTURE_2D, blur.blurFbos[1].tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, blur.initialTex);
    gl.useProgram(blur.overlayShader.program);
    gl.uniform1i(blur.overlayShader.locs.u_texture, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
}

// features/llm-visualization/upstream/src/llm/render/threadRender.ts
function initThreadRender(ctx) {
  let gl = ctx.gl;
  let quadVbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0,
    1,
    0,
    1,
    1,
    0,
    1,
    0,
    0,
    0,
    0,
    0
  ]), gl.STATIC_DRAW);
  let vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  let instanceVbo = gl.createBuffer();
  let instanceStride = bindFloatAttribs(gl, instanceVbo, { divisor: 1, locOffset: 2 }, [
    { name: "a_offset", size: 3 },
    { name: "a_size", size: 3 },
    { name: "a_nCells", size: 2 },
    { name: "a_threadDir", size: 2, nCols: 3 }
  ]);
  let instanceBuf = createFloatBuffer(gl, gl.ARRAY_BUFFER, instanceVbo, 1024, instanceStride, null);
  let shader = createShaderProgram(
    ctx,
    "thread",
    /*glsl*/
    `#version 300 es
        precision highp float;
        ${modelViewUboText}
        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec3 a_normal;

        uniform vec3 u_offset;
        uniform vec3 u_size;
        uniform vec2 u_nCells;
        uniform mat3x2 u_threadDir;
        out vec3 v_normal;
        out vec3 v_modelPos;
        out vec2 v_blockPos;
        out vec2 v_squarePos;
        void main() {
            vec2 localPos = u_threadDir * vec3(a_position.xy, 1);
            vec3 model_pos = a_position * u_size + u_offset;
            gl_Position = u_view * u_model * vec4(model_pos, 1);
            v_normal = a_normal;
            v_modelPos = model_pos;
            v_blockPos = localPos * abs(u_threadDir * vec3(u_nCells, 0));
            v_squarePos = localPos;
        }
    `,
    /*glsl*/
    `#version 300 es
        precision highp float;
        in vec3 v_normal;
        in vec3 v_modelPos;
        in vec2 v_blockPos;
        in vec2 v_squarePos;
        out vec4 o_color;
        uniform vec2 u_nCells;
        uniform vec3 u_camPos; // in model space
        uniform vec3 u_baseColor;

        void main() {
            ivec2 blockPos = ivec2(v_blockPos - v_normal.xy * 0.0);

            vec2 pxPerCell = 1.0 / fwidth(v_blockPos);
            float maxPxPerCell = max(pxPerCell.x, pxPerCell.y);

            vec4 color = vec4(0);

            if (v_blockPos.y < 0.0) {
                discard;
            }

            if (blockPos.y == 0) {
                // draw head
                vec2 d = fract(v_blockPos) - 0.5;
                float d2 = sqrt(d.x * d.x + d.y * d.y);

                // fwidth(d);
                float deltad2_per_px = fwidth(d2); // fwidth(d2);

                float t = 1.0 - smoothstep(0.45, 0.45 + 1.0 * deltad2_per_px, d2);

                float t2 = smoothstep(0.35, 0.35 + 1.0 * deltad2_per_px, d2);

                // if (d2 > 0.35 && d2 < 0.45) {
                color = mix(color, vec4(u_baseColor, 1), min(t, t2));
                // }
            }

            if (v_blockPos.y > (0.5 + 0.45)) {
                float falloffY = 1.0 - clamp(v_blockPos.y / 10.0, 0.0, 1.0);

                float cellPosX = fract(v_blockPos.x);
                float distFromX = abs(cellPosX - 0.5);
                // small side-to-side falloff based on distFromX for a glow effect
                float falloffX = 1.0 - smoothstep(0.0, min(0.3, 5.0 * fwidth(v_blockPos.x)), distFromX);

                color = mix(color, vec4(u_baseColor, 1), falloffX * falloffY);
            }

            // color = vec4(1, 0, 0, 1);

            o_color = color;
        }
    `,
    [
      "u_size",
      "u_offset",
      "u_baseColor",
      "u_nCells",
      "u_threadDir"
    ],
    { uboBindings: { "ModelViewUbo": UboBindings.ModelView } }
  );
  return {
    gl,
    vao,
    quadVbo,
    instanceVbo,
    instanceBuf,
    numInstances: 0,
    shader,
    threadInfos: []
  };
}
function renderAllThreads(threadRender) {
  let { gl, shader, vao: threadVao } = threadRender;
  gl.enable(gl.POLYGON_OFFSET_FILL);
  gl.disable(gl.CULL_FACE);
  gl.depthMask(false);
  gl.polygonOffset(-1, -2);
  let locs = shader.locs;
  gl.useProgram(shader.program);
  gl.bindVertexArray(threadVao);
  for (let a of threadRender.threadInfos) {
    let color = a.baseColor;
    gl.uniform3f(locs.u_offset, a.pos.x, a.pos.y, a.pos.z);
    gl.uniform3f(locs.u_size, a.size.x, a.size.y, a.size.z);
    gl.uniform2f(locs.u_nCells, a.nCells.x, a.nCells.y);
    gl.uniform3f(locs.u_baseColor, color.x, color.y, color.z);
    gl.uniformMatrix3x2fv(locs.u_threadDir, false, a.threadDir);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  threadRender.threadInfos = [];
  gl.disable(gl.POLYGON_OFFSET_FILL);
  gl.depthMask(true);
}

// features/llm-visualization/upstream/src/llm/render/queryManager.ts
function createQueryManager(ctx) {
  return {
    ctx,
    queries: /* @__PURE__ */ new Map(),
    TIME_ELAPSED_EXT: ctx.ext.disjointTimerQuery?.TIME_ELAPSED_EXT
  };
}
function beginQueryAndGetPrevMs(manager, name) {
  if (!manager.ctx.ext.disjointTimerQuery) {
    return null;
  }
  let existing = manager.queries.get(name);
  if (!existing) {
    let query = manager.ctx.gl.createQuery();
    manager.queries.set(name, existing = { query, hasRun: false, hasStarted: false });
  }
  let resultAvailable = false;
  if (existing.hasRun) {
    resultAvailable = manager.ctx.gl.getQueryParameter(existing.query, manager.ctx.gl.QUERY_RESULT_AVAILABLE);
  }
  let resultMs = null;
  if (resultAvailable) {
    let timeElapsed = manager.ctx.gl.getQueryParameter(existing.query, manager.ctx.gl.QUERY_RESULT);
    resultMs = timeElapsed / 1e6;
  }
  if (!existing.hasRun || resultAvailable) {
    manager.ctx.gl.beginQuery(manager.TIME_ELAPSED_EXT, existing.query);
    existing.hasRun = true;
    existing.hasStarted = true;
  }
  return resultMs;
}
function endQuery(manager, name) {
  if (!manager.ctx.ext.disjointTimerQuery) {
    return;
  }
  let existing = manager.queries.get(name);
  if (existing && existing.hasRun && existing.hasStarted) {
    manager.ctx.gl.endQuery(manager.TIME_ELAPSED_EXT);
    existing.hasStarted = false;
  }
}

// features/llm-visualization/upstream/src/llm/render/modelRender.ts
function initRender(canvasEl, fontAtlasData) {
  let gl = canvasEl.getContext("webgl2", { antialias: true, alpha: true });
  if (!gl) {
    return null;
  }
  let ext = {
    colorBufferFloat: gl.getExtension("EXT_color_buffer_float"),
    disjointTimerQuery: gl.getExtension("EXT_disjoint_timer_query_webgl2")
  };
  if (!ext.colorBufferFloat) {
    console.log("initRender: EXT_color_buffer_float not supported: floating point textures will not work.");
  }
  if (!ext.disjointTimerQuery) {
    console.log("initRender: EXT_disjoint_timer_query_webgl2 not supported: GPU timing will not work.");
  }
  let shaderManager = createShaderManager(gl);
  let ctx = { gl, shaderManager, ext };
  let quadVbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,
    -1,
    1,
    -1,
    1,
    1,
    -1,
    1
  ]), gl.STATIC_DRAW);
  let quadVao = gl.createVertexArray();
  gl.bindVertexArray(quadVao);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  let sharedRender = initSharedRender(ctx);
  let fontAtlas = setupFontAtlas(ctx, fontAtlasData);
  let modelFontBuf = createFontBuffers(fontAtlas, sharedRender);
  let threadRender = initThreadRender(ctx);
  let lineRender = createLineRender(ctx, sharedRender);
  let blockRender = initBlockRender(ctx);
  let triRender = initTriRender(ctx, sharedRender);
  let blurRender = initBlurRender(ctx, quadVao);
  let queryManager = createQueryManager(ctx);
  ensureShadersReady(shaderManager);
  return {
    canvasEl,
    gl,
    ctx,
    blockRender,
    threadRender,
    lineRender,
    blurRender,
    triRender,
    sharedRender,
    fontAtlas,
    modelFontBuf,
    quadVao,
    queryManager,
    syncObjects: [],
    size: new Vec3(1, 1),
    lastGpuMs: 0,
    lastJsMs: 0,
    renderTiming: false
  };
}
function resetRenderBuffers(args) {
  resetLineRender(args.lineRender);
  resetFontBuffers(args.modelFontBuf);
  resetTriRender(args.triRender);
}
function renderModel(state) {
  let { layout, render: args, camera } = state;
  let { gl, blockRender, size } = args;
  let { modelMtx, viewMtx } = camera;
  let { camPos } = cameraToMatrixView(camera);
  let lightPos = [
    new Vec3(100, 400, 600),
    new Vec3(-200, -300, -300),
    new Vec3(200, -100, 0)
  ];
  let lightColor = [
    new Vec3(1, 0.2, 0.2),
    new Vec3(1, 0.2, 0.2),
    new Vec3(1, 0.2, 0.2)
  ];
  let lightPosArr = new Float32Array(3 * 3);
  let lightColorArr = new Float32Array(3 * 3);
  for (let i = 0; i < 3; i++) {
    modelMtx.mulVec3Proj(lightPos[i]).writeToBuf(lightPosArr, i * 3);
    modelMtx.mulVec3Proj(lightColor[i]).writeToBuf(lightColorArr, i * 3);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, size.x, size.y);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.FRONT);
  gl.frontFace(gl.CW);
  if (args.renderTiming) {
    let text = `GPU: ${args.lastGpuMs.toFixed(1)}ms JS: ${args.lastJsMs.toFixed(1)}ms`;
    let w = size.x;
    let fontSize = 14;
    args.sharedRender.activePhase = 3 /* Overlay2D */;
    let tw = measureTextWidth(args.modelFontBuf, text, fontSize);
    writeTextToBuffer(args.modelFontBuf, text, new Vec4(0, 0, 0, 1), w - tw - 4, 4, fontSize, new Mat4f());
  }
  writeModelViewUbo(args.sharedRender, modelMtx, viewMtx);
  {
    let blurBlocks = layout.cubes.filter((a) => a.highlight > 0);
    setupBlurTarget(args.blurRender);
    renderBlocksSimple(blockRender, blurBlocks);
    renderBlur(args.blurRender, null);
  }
  gl.enable(gl.DEPTH_TEST);
  uploadAllLines(args.lineRender);
  uploadAllTris(args.triRender);
  uploadAllText(args.modelFontBuf);
  renderAllBlocks(blockRender, layout, modelMtx, camPos, lightPosArr, lightColorArr);
  args.sharedRender.activePhase = 0 /* Opaque */;
  for (let example of state.examples) {
    if (example.enabled && example.layout) {
      let { modelMtx: modelMtx2, viewMtx: viewMtx2 } = camera;
      let { camPos: camPos2 } = cameraToMatrixView(camera);
      var modelMtxLocal = modelMtx2.mul(Mat4f.fromTranslation(example.offset));
      writeModelViewUbo(args.sharedRender, modelMtxLocal, viewMtx2);
      renderAllBlocksInstanced(example.blockRender, example.layout, modelMtxLocal, camPos2);
    }
  }
  writeModelViewUbo(args.sharedRender, modelMtx, viewMtx);
  renderAllThreads(args.threadRender);
  gl.polygonOffset(-1, -2);
  let phaseOrder = [0 /* Opaque */, 1 /* Arrows */, 2 /* Overlay */, 3 /* Overlay2D */];
  for (let phase of phaseOrder) {
    if (phase === 3 /* Overlay2D */) {
      let w = size.x;
      let h = size.y;
      gl.clear(gl.DEPTH_BUFFER_BIT);
      writeModelViewUbo(args.sharedRender, new Mat4f(), Mat4f.fromOrtho(0, w, h, 0, -1, 1));
    }
    if (phase === 2 /* Overlay */ || phase === 3 /* Overlay2D */) {
      gl.enable(gl.POLYGON_OFFSET_FILL);
    } else {
      gl.disable(gl.POLYGON_OFFSET_FILL);
    }
    renderAllTris(args.triRender, phase);
    renderAllText(args.modelFontBuf, phase);
    renderAllLines(args.lineRender, phase);
  }
  gl.disable(gl.POLYGON_OFFSET_FILL);
}

// features/llm-visualization/upstream/src/utils/tensor.ts
var TensorF32 = class _TensorF32 {
  constructor(shape, buffer, stride = []) {
    this.shape = shape;
    this.buffer = buffer;
    this.stride = stride;
    let totalEls = shape.reduce((a, b) => a * b, 1);
    if (totalEls > buffer.length) {
      throw new Error(`Shape ${shape.join(", ")} requires ${totalEls} buffer, but buffer has size ${buffer.length}`);
    }
    let strideContiguous = new Array(shape.length);
    let s = 1;
    for (let i = shape.length - 1; i >= 0; i--) {
      strideContiguous[i] = s;
      s *= shape[i];
    }
    if (stride.length === 0) {
      this.stride = strideContiguous;
    } else if (stride.length !== shape.length) {
      throw new Error(`Stride length ${stride.length} does not match shape length ${shape.length}`);
    }
    this.isContiguous = true;
    for (let i = 0; i < stride.length; i++) {
      if (stride[i] !== strideContiguous[i]) {
        this.isContiguous = false;
        break;
      }
    }
  }
  view(shape) {
    let size = shape.reduce((a, b) => a * b, 1);
    let existingSize = this.shape.reduce((a, b) => a * b, 1);
    if (size !== existingSize) {
      throw new Error(`Invalid reshape: new size ${size} (${shape.join(", ")}) does not match existing size ${existingSize} (${this.shape.join(", ")})`);
    }
    if (!this.isContiguous) {
      throw new Error(`Cannot view non-contiguous tensor (or at least, there are potential cases where it would work, but we don't support them yet)`);
    }
    return new _TensorF32(shape, this.buffer);
  }
  transpose(a, b) {
    if (a < 0 || a >= this.shape.length || b < 0 || b >= this.shape.length || a === b) {
      throw new Error(`Invalid transpose indices: ${a}, ${b} over shape ${this.shape.join(", ")}`);
    }
    let shape = [...this.shape];
    let stride = [...this.stride];
    let temp = shape[a];
    shape[a] = shape[b];
    shape[b] = temp;
    let temp2 = stride[a];
    stride[a] = stride[b];
    stride[b] = temp2;
    return new _TensorF32(shape, this.buffer, stride);
  }
  permute(...axes) {
    let setItems = new Set(new Array(this.shape.length).fill(0).map((_, i) => i));
    axes.forEach((a) => setItems.delete(a));
    if (axes.length !== this.shape.length || setItems.size !== 0) {
      throw new Error(`Invalid permute axes: ${axes.join(", ")} over shape ${this.shape.join(", ")}`);
    }
    let shape = axes.map((a) => this.shape[a]);
    let stride = axes.map((a) => this.stride[a]);
    return new _TensorF32(shape, this.buffer, stride);
  }
  g(index) {
    return this.buffer[this.indexToOffset(index)];
  }
  s(index, a) {
    this.buffer[this.indexToOffset(index)] = a;
  }
  indexToOffset(index) {
    if (index.length !== this.shape.length) {
      throw new Error(`Index length ${index.length} does not match shape length ${this.shape.length}`);
    }
    let offset = 0;
    for (let i = 0; i < index.length; i++) {
      if (index[i] >= this.shape[i]) {
        throw new Error(`Index ${index[i]} out of bounds for shape ${this.shape[i]}`);
      }
      offset += index[i] * this.stride[i];
    }
    return offset;
  }
  *indexIterator() {
    let index = new Array(this.shape.length).fill(0);
    while (true) {
      yield index;
      let i = this.shape.length - 1;
      while (i >= 0) {
        index[i]++;
        if (index[i] < this.shape[i]) {
          break;
        }
        index[i] = 0;
        i--;
      }
      if (i < 0) {
        break;
      }
    }
  }
  contiguous() {
    if (this.isContiguous) {
      return this;
    }
    return new _TensorF32(this.shape, this.toFloat32Array());
  }
  // always returns a copy of a contiguous array
  toFloat32Array() {
    let size = this.shape.reduce((a, b) => a * b, 1);
    let array = new Float32Array(size);
    if (this.isContiguous) {
      array.set(this.buffer);
    } else {
      let index = new Array(this.shape.length).fill(0);
      let destIdx = 0;
      let offset = 0;
      while (true) {
        array[destIdx++] = this.buffer[offset];
        let i = this.shape.length - 1;
        while (i >= 0) {
          index[i]++;
          offset += this.stride[i];
          if (index[i] < this.shape[i]) {
            break;
          }
          offset -= index[i] * this.stride[i];
          index[i] = 0;
          i--;
        }
        if (i < 0) {
          break;
        }
      }
    }
    return array;
  }
  static fromJson(obj) {
    if (!obj.shape || !obj.dtype || !obj.data) {
      console.error("Invalid tensor json", obj);
      throw new Error("Invalid tensor json");
    }
    if (obj.dtype !== "torch.float32") {
      console.error("Invalid tensor dtype", obj);
      throw new Error("Invalid tensor dtype");
    }
    let buf = base64ToArrayBuffer(obj.data);
    let array = new Float32Array(buf);
    return new _TensorF32(obj.shape, array);
  }
  copyFrom(source) {
    if (source.shape.length !== this.shape.length || !source.contiguous || !this.contiguous) {
      throw new Error(`Invalid copy: source shape length ${source.shape.length} does not match target shape length ${this.shape.length}`);
    }
    for (let i = 0; i < this.shape.length; i++) {
      if (source.shape[i] !== this.shape[i]) {
        throw new Error(`Invalid copy: source shape ${source.shape[i]} does not match target shape ${this.shape[i]}`);
      }
    }
    this.buffer.set(source.buffer);
  }
};

// features/llm-visualization/upstream/src/llm/NativeBindings.ts
async function loadNativeBindings(signal) {
  let lineStr = "";
  let memory = new WebAssembly.Memory({ initial: 1, maximum: 256 });
  let importObject = {
    env: {
      memory
    },
    odin_env: {
      write: (fd, ptr, len) => {
        let mem = new Uint8Array(importObject.env.memory.buffer, ptr, len);
        let strPart = new TextDecoder().decode(mem);
        let lines = strPart.split("\n");
        for (let i = 0; i < lines.length - 1; i++) {
          console.log(lineStr + lines[i]);
          lineStr = "";
        }
        lineStr += lines[lines.length - 1];
      },
      // Odin multiplies by 1e6 itself (time_js.odin); JS should return ms.
      time_now: () => BigInt(Date.now()),
      tick_now: () => performance.now(),
      time_sleep: (_duration_ms) => {
      },
      trap: () => {
        throw new Error("odin trap");
      },
      // Odin passes []byte as (ptr, len); fill with CSPRNG bytes.
      rand_bytes: (ptr, len) => {
        let view = new Uint8Array(importObject.env.memory.buffer, ptr, len);
        crypto.getRandomValues(view);
      }
    },
    odin_dom: {
      init_event_raw: (ptr) => {
        console.log("ODIN: init_event_raw", ptr);
      }
    }
  };
  let wasmModule = await instantiateLlmWasm(
    `${LLM_VIZ_ASSET_BASE}/native.wasm`,
    importObject,
    signal
  );
  let exports = wasmModule.instance.exports;
  exports.init_allocator(exports.__heap_base);
  let nativeFuncs = new NativeFunctions(wasmModule, exports, memory);
  return nativeFuncs;
}
var NativeFunctions = class {
  constructor(module, exports, memory) {
    this.module = module;
    this.exports = exports;
    this.memory = memory;
    this.viewBuf = memory.buffer;
    this.int32View = new Int32Array(memory.buffer);
    this.ptrView = new Uint32Array(memory.buffer);
  }
  createModel(config) {
    let model = this.exports.wasm_create_model(config.B ?? 1, config.block_size, config.n_embd, config.n_layer, config.n_head, config.vocab_size);
    return model;
  }
  runModel(model) {
    this.exports.wasm_run_model(model);
  }
  getModelTensor(model, tensor, index = 0) {
    let ptr = this.exports.wasm_get_model_tensor(model, tensor, index);
    this.checkViews();
    let bufNElem = this.int32View[ptr / 4];
    let ndimsSize = this.int32View[ptr / 4 + 1];
    let dataPtr = this.ptrView[ptr / 4 + 2];
    let shapeArrPtr = this.ptrView[ptr / 4 + 3];
    let strideArrPtr = this.ptrView[ptr / 4 + 4];
    let shape = new Int32Array(this.memory.buffer, shapeArrPtr, ndimsSize);
    let stride = new Int32Array(this.memory.buffer, strideArrPtr, ndimsSize);
    let data = new Float32Array(this.memory.buffer, dataPtr, bufNElem);
    return new TensorF32([...shape], data, [...stride]);
  }
  checkViews() {
    if (this.viewBuf === this.memory.buffer) {
      return;
    }
    this.viewBuf = this.memory.buffer;
    this.int32View = new Int32Array(this.memory.buffer);
    this.ptrView = new Uint32Array(this.memory.buffer);
  }
};
var TensorType = /* @__PURE__ */ ((TensorType2) => {
  TensorType2[TensorType2["Wte"] = 0] = "Wte";
  TensorType2[TensorType2["Wpe"] = 1] = "Wpe";
  TensorType2[TensorType2["LmHeadW"] = 2] = "LmHeadW";
  TensorType2[TensorType2["AttnQkvW"] = 3] = "AttnQkvW";
  TensorType2[TensorType2["AttnQkvB"] = 4] = "AttnQkvB";
  TensorType2[TensorType2["AttnProjW"] = 5] = "AttnProjW";
  TensorType2[TensorType2["AttnProjB"] = 6] = "AttnProjB";
  TensorType2[TensorType2["MlpW"] = 7] = "MlpW";
  TensorType2[TensorType2["MlpB"] = 8] = "MlpB";
  TensorType2[TensorType2["MlpProjW"] = 9] = "MlpProjW";
  TensorType2[TensorType2["MlpProjB"] = 10] = "MlpProjB";
  TensorType2[TensorType2["Ln1Gamma"] = 11] = "Ln1Gamma";
  TensorType2[TensorType2["Ln1Beta"] = 12] = "Ln1Beta";
  TensorType2[TensorType2["Ln2Gamma"] = 13] = "Ln2Gamma";
  TensorType2[TensorType2["Ln2Beta"] = 14] = "Ln2Beta";
  TensorType2[TensorType2["LnFGamma"] = 15] = "LnFGamma";
  TensorType2[TensorType2["LnFBeta"] = 16] = "LnFBeta";
  TensorType2[TensorType2["InputTokens"] = 17] = "InputTokens";
  TensorType2[TensorType2["InputTokenEmbed"] = 18] = "InputTokenEmbed";
  TensorType2[TensorType2["InputEmbed"] = 19] = "InputEmbed";
  TensorType2[TensorType2["Ln1Agg"] = 20] = "Ln1Agg";
  TensorType2[TensorType2["Ln1Norm"] = 21] = "Ln1Norm";
  TensorType2[TensorType2["AttnQkv"] = 22] = "AttnQkv";
  TensorType2[TensorType2["Attn"] = 23] = "Attn";
  TensorType2[TensorType2["AttnSmAgg"] = 24] = "AttnSmAgg";
  TensorType2[TensorType2["AttnSm"] = 25] = "AttnSm";
  TensorType2[TensorType2["AttnVOut"] = 26] = "AttnVOut";
  TensorType2[TensorType2["AttnProj"] = 27] = "AttnProj";
  TensorType2[TensorType2["AttnResidual"] = 28] = "AttnResidual";
  TensorType2[TensorType2["Ln2Agg"] = 29] = "Ln2Agg";
  TensorType2[TensorType2["Ln2Norm"] = 30] = "Ln2Norm";
  TensorType2[TensorType2["MlpMlp"] = 31] = "MlpMlp";
  TensorType2[TensorType2["MlpAct"] = 32] = "MlpAct";
  TensorType2[TensorType2["MlpProj"] = 33] = "MlpProj";
  TensorType2[TensorType2["MlpResidual"] = 34] = "MlpResidual";
  TensorType2[TensorType2["LnFAgg"] = 35] = "LnFAgg";
  TensorType2[TensorType2["LnFNorm"] = 36] = "LnFNorm";
  TensorType2[TensorType2["Logits"] = 37] = "Logits";
  TensorType2[TensorType2["LogitsSmAgg"] = 38] = "LogitsSmAgg";
  TensorType2[TensorType2["LogitsSm"] = 39] = "LogitsSm";
  return TensorType2;
})(TensorType || {});
var pi = Math.PI;
var piOver2 = pi / 2;
var piOver4 = pi / 4;
var twoPi = 2 * pi;
var threePiOver2 = 3 * pi / 2;
var testValues = [
  -10,
  -pi,
  -piOver2,
  -piOver4,
  -1e-7,
  -1e-6,
  0,
  1e-6,
  1e-7,
  piOver4,
  piOver2,
  pi,
  threePiOver2,
  twoPi,
  10
];

// features/llm-visualization/upstream/src/utils/renderPhases.ts
function createRenderPhase(gl, program, dest, src, names) {
  if (names) {
    if (names.length !== src.length) {
      throw new Error(`Number of texture names (${names.length}) does not match number of src textures (${src.length})`);
    }
  }
  let fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  for (let i = 0; i < dest.length; i++) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, dest[i].texture, 0);
  }
  gl.drawBuffers(dest.map((_, i) => gl.COLOR_ATTACHMENT0 + i));
  let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.log("createRenderPhase: framebuffer not complete: " + status);
  }
  return {
    destBuffers: dest,
    srcBuffers: src,
    fbo,
    program,
    uniformNames: names,
    uniformsSet: false
  };
}
function createBufferTex(gl, width, height, channels) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  let [format, iformat] = channelsToFormat(gl, channels);
  gl.texImage2D(gl.TEXTURE_2D, 0, iformat, width, height, 0, format, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return {
    width,
    height,
    texture,
    channels
  };
}
function writeToBufferTex(gl, buffer, data) {
  if (data.length !== buffer.width * buffer.height * buffer.channels) {
    throw new Error("Data length does not match buffer size");
  }
  gl.bindTexture(gl.TEXTURE_2D, buffer.texture);
  let [format] = channelsToFormat(gl, buffer.channels);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, buffer.width, buffer.height, format, gl.FLOAT, data);
}
function channelsToFormat(gl, channels) {
  switch (channels) {
    case 1:
      return [gl.RED, gl.R32F];
    case 2:
      return [gl.RG, gl.RG32F];
    case 3:
      return [gl.RGB, gl.RGB32F];
    case 4:
      return [gl.RGBA, gl.RGBA32F];
    default:
      throw new Error(`Invalid number of channels: ${channels}. Must be 1, 2, 3, or 4.`);
  }
}

// features/llm-visualization/upstream/src/llm/GptModelWasm.ts
function createBufferTex2(gl, height, width, channels) {
  return createBufferTex(gl, width, height, channels);
}
function createGpuModelForWasm(gl, config) {
  let B = 1;
  let C = config.n_embd;
  let nHeads = config.n_head;
  let T = config.block_size;
  let nBlocks = config.n_layer;
  let vocabSize = config.vocab_size;
  let A = C / nHeads;
  let shape = { B, C, nHeads, T, A, nBlocks, vocabSize };
  let layerBuilder = { gl, shape };
  let inputTokens = createBufferTex2(gl, B * T, 1, 1);
  let softmaxFinal = createSoftmaxLayer(layerBuilder);
  return {
    gl,
    add: createAddLayer(layerBuilder),
    inputBuf: new Float32Array(),
    inputLen: 6,
    ln_f: createLayerNormLayer(layerBuilder),
    inputTokens,
    lm_head: createLinearLayer(layerBuilder, T, C, vocabSize),
    blocks: makeArray(nBlocks).map(() => createBlockLayer(layerBuilder)),
    output: softmaxFinal.output,
    posEmbed: createEmbedLayer(layerBuilder, inputTokens, T),
    // fix source?
    vocabEmbed: createEmbedLayer(layerBuilder, inputTokens, vocabSize),
    shape,
    softmaxFinal,
    resultBuf: null,
    sortedBuf: null
  };
}
function createAddLayer(builder) {
  let { gl, shape: { B, T, C } } = builder;
  return {
    output: createBufferTex2(gl, B * T, C, 1)
  };
}
function createEmbedLayer(builder, input, size) {
  let { gl, shape: { B, T, C } } = builder;
  return {
    weight: createBufferTex2(gl, size, C, 1),
    output: createBufferTex2(gl, B * T, C, 1)
  };
}
function createLinearLayer(builder, t, cIn, cOut) {
  let { gl, shape: { B, T } } = builder;
  return {
    weight: createBufferTex2(gl, cOut, cIn, 1),
    bias: createBufferTex2(gl, cOut, 1, 1),
    output: createBufferTex2(gl, B * T, cOut, 1)
  };
}
function createLayerNormLayer(builder) {
  let { gl, shape: { B, T, C } } = builder;
  return {
    normWeight: createBufferTex2(gl, C, 1, 1),
    normBias: createBufferTex2(gl, C, 1, 1),
    normAgg: createBufferTex2(gl, B * T, 1, 2),
    output: createBufferTex2(gl, B * T, C, 1)
  };
}
function createSoftmaxLayer(builder) {
  let { gl, shape: { B, T, vocabSize } } = builder;
  return {
    agg: createBufferTex2(gl, B * T, 1, 2),
    output: createBufferTex2(gl, B * T, vocabSize, 1)
  };
}
function createBlockLayer(builder) {
  let mlp = createMlpLayer(builder);
  return {
    ln_1: createLayerNormLayer(builder),
    attn: createAttentionLayer(builder),
    ln_2: createLayerNormLayer(builder),
    mlp,
    output: mlp.output
  };
}
function createAttentionLayer(builder) {
  let { gl, shape: { B, T, C, nHeads, A } } = builder;
  let add = createAddLayer(builder);
  return {
    qkvWeight: createBufferTex2(gl, 3 * nHeads * A, C, 1),
    qkvBias: createBufferTex2(gl, 3 * nHeads * A, 1, 1),
    attnMatrix: createBufferTex2(gl, B * nHeads * T, T, 1),
    attnMatrixAgg: createBufferTex2(gl, B * nHeads * T, 1, 2),
    attnMatrixSoftmax: createBufferTex2(gl, B * nHeads * T, T, 1),
    qkvOutput: createBufferTex2(gl, B * T, 3 * nHeads * A, 1),
    add: createAddLayer(builder),
    proj: createLinearLayer(builder, T, C, C),
    scaledVectors: createBufferTex2(gl, B * T, nHeads * A, 1),
    output: add.output
  };
}
function createMlpLayer(builder) {
  let { gl, shape: { B, T, C } } = builder;
  let add = createAddLayer(builder);
  return {
    fcLayer: createLinearLayer(builder, T, C, C * 4),
    mlpGelu: createBufferTex2(gl, B * T, C * 4, 1),
    projLayer: createLinearLayer(builder, T, C * 4, C),
    addLayer: add,
    output: add.output
  };
}
function constructModel(model, config, native) {
  let nativeModel = native.createModel(config);
  copyFrom("transformer.wte.weight", 0 /* Wte */);
  copyFrom("transformer.wpe.weight", 1 /* Wpe */);
  copyFrom("lm_head.weight", 2 /* LmHeadW */);
  copyWeightBias("transformer.ln_f", 15 /* LnFGamma */, 16 /* LnFBeta */);
  for (let i = 0; i < config.n_layer; i++) {
    let layerPrefix = `transformer.h.${i}`;
    copyWeightBias(layerPrefix + ".ln_1", 11 /* Ln1Gamma */, 12 /* Ln1Beta */, i);
    copyWeightBias(layerPrefix + ".ln_2", 13 /* Ln2Gamma */, 14 /* Ln2Beta */, i);
    copyWeightBias(layerPrefix + ".attn.c_attn", 3 /* AttnQkvW */, 4 /* AttnQkvB */, i);
    copyWeightBias(layerPrefix + ".attn.c_proj", 5 /* AttnProjW */, 6 /* AttnProjB */, i);
    copyWeightBias(layerPrefix + ".mlp.c_fc", 7 /* MlpW */, 8 /* MlpB */, i);
    copyWeightBias(layerPrefix + ".mlp.c_proj", 9 /* MlpProjW */, 10 /* MlpProjB */, i);
  }
  function copyWeightBias(prefix, weightType, biasType, idx = 0) {
    copyFrom(prefix + ".weight", weightType, idx);
    copyFrom(prefix + ".bias", biasType, idx);
  }
  function copyFrom(name, type, idx = 0) {
    let m = model[name];
    if (!m) {
      console.log("ERROR: missing tensor name:", name);
    } else {
      native.getModelTensor(nativeModel, type, idx).copyFrom(model[name]);
    }
  }
  let inputTokens = native.getModelTensor(nativeModel, 17 /* InputTokens */);
  inputTokens.buffer.set([2, 1, 0, 1, 1, 2, 0, 0, 0, 0, 0]);
  {
    let sw = performance.now();
    native.runModel(nativeModel);
    console.log("runModel", (performance.now() - sw).toFixed(2) + "ms");
  }
  return {
    native,
    modelPtr: nativeModel,
    lastMemoryBuffer: null,
    weightsDirty: true,
    intersDirty: true
  };
}
function resetWasmModelInput(wasmModel, jsModel) {
  const inputTokensTensor = wasmModel.native.getModelTensor(wasmModel.modelPtr, 17 /* InputTokens */);
  inputTokensTensor.buffer.set([2, 1, 0, 1, 1, 2, 0, 0, 0, 0, 0]);
  jsModel.inputLen = 6;
  wasmModel.native.runModel(wasmModel.modelPtr);
  wasmModel.intersDirty = true;
  syncWasmDataWithJsAndGpu(wasmModel, jsModel);
}
function stepWasmModel(wasmModel, jsModel) {
  let { native, modelPtr } = wasmModel;
  let { shape: { B, T, vocabSize } } = jsModel;
  let tIdx = jsModel.inputLen - 1;
  if (!jsModel.sortedBuf || tIdx >= T - 1) {
    return;
  }
  let inputTokensTensor = native.getModelTensor(modelPtr, 17 /* InputTokens */);
  for (let b = 0; b < B; b++) {
    let topSortedIdx = jsModel.sortedBuf[b * T * vocabSize * 2 + tIdx * vocabSize * 2 + 0];
    inputTokensTensor.buffer[b * T + tIdx + 1] = topSortedIdx;
  }
  jsModel.inputLen += 1;
  native.runModel(modelPtr);
  wasmModel.intersDirty = true;
  syncWasmDataWithJsAndGpu(wasmModel, jsModel);
}
function syncWasmDataWithJsAndGpu(wasmModel, jsModel) {
  let needsSync = wasmModel.weightsDirty || wasmModel.intersDirty;
  if (wasmModel.lastMemoryBuffer !== wasmModel.native.memory.buffer) {
    wasmModel.lastMemoryBuffer = wasmModel.native.memory.buffer;
    needsSync = true;
  }
  if (needsSync) {
    readLocalBuffersFromWasm(wasmModel, jsModel, wasmModel.intersDirty, wasmModel.weightsDirty);
    wasmModel.weightsDirty = false;
    wasmModel.intersDirty = false;
  }
}
function readLocalBuffersFromWasm(wasmModel, jsModel, writeIntersToGpu = false, writeWeightsToGpu = false) {
  readFromWasmToBufferTex(0 /* Wte */, 0, jsModel.vocabEmbed.weight, true);
  readFromWasmToBufferTex(1 /* Wpe */, 0, jsModel.posEmbed.weight, true);
  readFromWasmToBufferTex(17 /* InputTokens */, 0, jsModel.inputTokens);
  readFromWasmToBufferTex(19 /* InputEmbed */, 0, jsModel.add.output);
  for (let i = 0; i < jsModel.blocks.length; i++) {
    let block = jsModel.blocks[i];
    readFromWasmToBufferTex(11 /* Ln1Gamma */, i, block.ln_1.normWeight, true);
    readFromWasmToBufferTex(12 /* Ln1Beta */, i, block.ln_1.normBias, true);
    readFromWasmToBufferTex(20 /* Ln1Agg */, i, block.ln_1.normAgg);
    readFromWasmToBufferTex(21 /* Ln1Norm */, i, block.ln_1.output);
    readFromWasmToBufferTex(3 /* AttnQkvW */, i, block.attn.qkvWeight, true);
    readFromWasmToBufferTex(4 /* AttnQkvB */, i, block.attn.qkvBias, true);
    readFromWasmToBufferTex(22 /* AttnQkv */, i, block.attn.qkvOutput);
    readFromWasmToBufferTex(23 /* Attn */, i, block.attn.attnMatrix);
    readFromWasmToBufferTex(24 /* AttnSmAgg */, i, block.attn.attnMatrixAgg);
    readFromWasmToBufferTex(25 /* AttnSm */, i, block.attn.attnMatrixSoftmax);
    readFromWasmToBufferTex(26 /* AttnVOut */, i, block.attn.scaledVectors);
    readFromWasmToBufferTex(5 /* AttnProjW */, i, block.attn.proj.weight, true);
    readFromWasmToBufferTex(6 /* AttnProjB */, i, block.attn.proj.bias, true);
    readFromWasmToBufferTex(27 /* AttnProj */, i, block.attn.proj.output);
    readFromWasmToBufferTex(28 /* AttnResidual */, i, block.attn.output);
    readFromWasmToBufferTex(13 /* Ln2Gamma */, i, block.ln_2.normWeight, true);
    readFromWasmToBufferTex(14 /* Ln2Beta */, i, block.ln_2.normBias, true);
    readFromWasmToBufferTex(29 /* Ln2Agg */, i, block.ln_2.normAgg);
    readFromWasmToBufferTex(30 /* Ln2Norm */, i, block.ln_2.output);
    readFromWasmToBufferTex(7 /* MlpW */, i, block.mlp.fcLayer.weight, true);
    readFromWasmToBufferTex(8 /* MlpB */, i, block.mlp.fcLayer.bias, true);
    readFromWasmToBufferTex(9 /* MlpProjW */, i, block.mlp.projLayer.weight, true);
    readFromWasmToBufferTex(10 /* MlpProjB */, i, block.mlp.projLayer.bias, true);
    readFromWasmToBufferTex(31 /* MlpMlp */, i, block.mlp.fcLayer.output);
    readFromWasmToBufferTex(32 /* MlpAct */, i, block.mlp.mlpGelu);
    readFromWasmToBufferTex(33 /* MlpProj */, i, block.mlp.projLayer.output);
    readFromWasmToBufferTex(34 /* MlpResidual */, i, block.mlp.addLayer.output);
  }
  readFromWasmToBufferTex(15 /* LnFGamma */, 0, jsModel.ln_f.normWeight, true);
  readFromWasmToBufferTex(16 /* LnFBeta */, 0, jsModel.ln_f.normBias, true);
  readFromWasmToBufferTex(35 /* LnFAgg */, 0, jsModel.ln_f.normAgg);
  readFromWasmToBufferTex(36 /* LnFNorm */, 0, jsModel.ln_f.output);
  readFromWasmToBufferTex(2 /* LmHeadW */, 0, jsModel.lm_head.weight, true);
  readFromWasmToBufferTex(37 /* Logits */, 0, jsModel.lm_head.output);
  readFromWasmToBufferTex(38 /* LogitsSmAgg */, 0, jsModel.softmaxFinal.agg);
  readFromWasmToBufferTex(39 /* LogitsSm */, 0, jsModel.softmaxFinal.output);
  let { T, vocabSize } = jsModel.shape;
  let resultBuf = jsModel.softmaxFinal.output.localBuffer;
  let sortedBuf = new Float32Array(resultBuf.length * 2);
  for (let t = 0; t < T; t++) {
    let options = [...resultBuf.slice(t * vocabSize, (t + 1) * vocabSize)].map((v, i) => ({ v, i }));
    options.sort((a, b) => b.v - a.v);
    for (let i = 0; i < options.length; i++) {
      sortedBuf[(t * vocabSize + i) * 2 + 0] = options[i].i;
      sortedBuf[(t * vocabSize + i) * 2 + 1] = options[i].v;
    }
  }
  jsModel.sortedBuf = sortedBuf;
  function readFromWasmToBufferTex(type, idx, tex, isWeight) {
    let t = wasmModel.native.getModelTensor(wasmModel.modelPtr, type, idx);
    readToBufferTex(`${TensorType[type]}${idx}`, t, tex);
    let writeToGpu = isWeight ? writeWeightsToGpu : writeIntersToGpu;
    if (writeToGpu) {
      writeToBufferTex(jsModel.gl, tex, tex.localBuffer);
    }
  }
  function readToBufferTex(name, t, tex) {
    let texSize = tex.height * tex.width * tex.channels;
    if (t.buffer.length !== texSize) {
      throw new Error(`readToBufferTex: buffer size mismatch for ${name}. bufferTex: ${texSize} [h: ${tex.height}, w: ${tex.width}, c: ${tex.channels}], wasmBuffer:  ${t.buffer.length} [${t.shape.join(", ")}]`);
    }
    tex.localBuffer = t.buffer;
  }
}

// features/llm-visualization/upstream/src/utils/hooks.ts
var Subscriptions = class {
  constructor() {
    this.subs = /* @__PURE__ */ new Set();
    this.subscribe = (fn) => {
      this.subs.add(fn);
      return () => this.subs.delete(fn);
    };
    this.notify = () => {
      for (let sub of this.subs) {
        sub();
      }
    };
  }
};

// features/llm-visualization/upstream/src/llm/Program.ts
var NANO_SHAPE = {
  B: 1,
  T: 11,
  C: 48,
  nHeads: 3,
  A: 16,
  nBlocks: 3,
  vocabSize: 3
};
function initProgramState(canvasEl, fontAtlasData) {
  let render = initRender(canvasEl, fontAtlasData);
  let camera = {
    angle: new Vec3(284.959, 26.501, 12.867),
    center: new Vec3(42.771, 0, -569.287),
    transition: {},
    modelMtx: new Mat4f(),
    viewMtx: new Mat4f(),
    lookAtMtx: new Mat4f(),
    camPos: new Vec3(),
    camPosModel: new Vec3()
  };
  let shape = { ...NANO_SHAPE };
  let walkthrough = createDeveloWalkthrough(() => {
  });
  let state = {
    native: null,
    wasmGptModel: null,
    render,
    inWalkthrough: false,
    walkthrough,
    camera,
    shape,
    layout: genGptModelLayout(shape),
    currExampleId: -1,
    mainExample: {
      name: "nano-gpt",
      enabled: true,
      shape,
      offset: new Vec3(),
      modelCardOffset: new Vec3(),
      blockRender: null,
      camera: { center: new Vec3(42.771, 0, -569.287), angle: new Vec3(284.959, 26.501, 12.867) }
    },
    examples: [],
    gptGpuModel: null,
    jsGptModel: null,
    stepModel: false,
    markDirty: () => {
    },
    htmlSubs: new Subscriptions(),
    mouse: {
      mousePos: new Vec3()
    },
    movement: {
      action: null,
      actionHover: null,
      target: [0, 0],
      depth: 1,
      cameraLerp: null
    },
    display: {
      tokenColors: null,
      tokenIdxColors: null,
      tokenOutputColors: null,
      lines: [],
      hoverTarget: null,
      dimHover: null,
      blkIdxHover: null
    },
    pageLayout: {
      height: 0,
      width: 0,
      isDesktop: true,
      isPhone: false
    },
    stage: "idle",
    stageProgress: 0,
    visible: false,
    interactive: false,
    reducedMotion: false,
    inputLength: 6,
    generatedLength: 0
  };
  walkthrough.markDirty = () => state.markDirty();
  return state;
}
function runProgram(view, state) {
  let timer0 = performance.now();
  if (!state.render) {
    return;
  }
  resetRenderBuffers(state.render);
  state.render.sharedRender.activePhase = 0 /* Opaque */;
  state.display.lines = [];
  state.display.hoverTarget = null;
  if (!state.display.tokenColors) state.display.tokenColors = null;
  if (!state.display.tokenIdxColors) state.display.tokenIdxColors = null;
  if (state.wasmGptModel && state.jsGptModel) {
    syncWasmDataWithJsAndGpu(state.wasmGptModel, state.jsGptModel);
  }
  if (state.stepModel && state.wasmGptModel && state.jsGptModel) {
    state.stepModel = false;
    stepWasmModel(state.wasmGptModel, state.jsGptModel);
    state.generatedLength = Math.max(0, (state.jsGptModel.inputLen || 6) - 6);
  }
  state.layout = genGptModelLayout(state.shape, state.jsGptModel);
  runDeveloWalkthrough(view, state);
  genModelViewMatrices(state, state.layout);
  let queryRes = beginQueryAndGetPrevMs(state.render.queryManager, "render");
  if (isNotNil(queryRes)) {
    state.render.lastGpuMs = queryRes;
  }
  state.render.renderTiming = false;
  updateCamera(state, view);
  drawAllArrows(state.render, state.layout);
  drawTokens(state.render, state.layout, state.display, void 0, 6);
  state.render.sharedRender.activePhase = 0 /* Opaque */;
  drawBlockLabels(state.render, state.layout);
  renderModel(state);
  endQuery(state.render.queryManager, "render");
  state.render.gl.flush();
  state.render.lastJsMs = performance.now() - timer0;
}

// features/llm-visualization/upstream/src/utils/basic.ts
function nonNil(value) {
  return value !== null && value !== void 0;
}

// features/llm-visualization/upstream/src/llm/GptModel.ts
function initModel(state, dataAndModel, B) {
  return createGptModel(state.ctx.shaderManager, dataAndModel.model, B);
}
function setModelInputData(renderState, gptModel) {
  let { gl } = renderState;
  let { inputTokens, shape: { B, T } } = gptModel;
  let buf = new Float32Array(B * T);
  buf.set([2, 1, 0, 1, 1, 2, 0, 0, 0, 0, 0]);
  gptModel.inputBuf = buf;
  gptModel.inputLen = 6;
  writeToBufferTex(gl, inputTokens, buf);
}
var basicVertexShader = (
  /*glsl*/
  `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0, 1);
}
`
);
function createGptModel(shaderManager, model, B) {
  let gl = shaderManager.gl;
  let prefix = "transformer";
  let config = model.config;
  let C = config.n_embd;
  let nHeads = config.n_head;
  let T = config.block_size;
  let nBlocks = config.n_layer;
  let vocabSize = config.vocab_size;
  let A = C / nHeads;
  let shape = { B, C, nHeads, T, A, nBlocks, vocabSize };
  let layerBuilder = { gl, model, shape, shaderManager };
  let inputBuf = new Float32Array(B * T);
  let inputTokens = createBufferTex(gl, 1, B * T, 1);
  let posArr = new Float32Array(B * T);
  for (let i = 0; i < B; i++) {
    for (let j = 0; j < T; j++) {
      posArr[i * T + j] = j;
    }
  }
  let pos = createBufferTex(gl, 1, B * T, 1);
  writeToBufferTex(gl, pos, posArr);
  let vocabEmbed = createEmbeddingLayer(layerBuilder, prefix + ".wte", vocabSize, C, inputTokens);
  let posEmbed = createEmbeddingLayer(layerBuilder, prefix + ".wpe", T, C, pos);
  let add = createAddLayer2(layerBuilder, vocabEmbed.output, posEmbed.output);
  let blocks = [];
  let x = add.output;
  for (let i = 0; i < nBlocks; i++) {
    let block = createBlockLayer2(layerBuilder, prefix + ".h." + i, x);
    blocks.push(block);
    x = block.output;
  }
  let ln_f = createLayerNorm(layerBuilder, prefix + ".ln_f", x);
  let lm_head = createLinearLayer2(layerBuilder, "lm_head", C, vocabSize, ln_f.output, void 0, false);
  let softmaxFinal = createSoftmaxLayer2(layerBuilder, lm_head.output);
  let copyOutputToInput = createCopyOutputToInputLayer(layerBuilder, softmaxFinal.output, inputTokens);
  ensureShadersReady(shaderManager);
  return {
    gl,
    inputBuf,
    inputTokens,
    vocabEmbed,
    posEmbed,
    add,
    blocks,
    ln_f,
    lm_head,
    shape,
    softmaxFinal,
    copyOutputToInput,
    output: softmaxFinal.output,
    inputLen: 6,
    resultBuf: null,
    sortedBuf: null,
    readbackSync: null
  };
}
function createBlockLayer2(layerBuilder, prefix, input) {
  let ln_1 = createLayerNorm(layerBuilder, prefix + ".ln_1", input);
  let attn = createAttnLayer(layerBuilder, prefix + ".attn", ln_1.output, input);
  let ln_2 = createLayerNorm(layerBuilder, prefix + ".ln_2", attn.output);
  let mlp = createMLP(layerBuilder, prefix + ".mlp", ln_2.output, attn.output);
  return {
    attn,
    ln_1,
    ln_2,
    mlp,
    output: mlp.output
  };
}
function createAttnLayer(layerBuilder, prefix, input, residual) {
  let { gl, model, shape: { B, T, C, nHeads, A }, shaderManager } = layerBuilder;
  let tAttnWeight = model[prefix + ".c_attn.weight"].view([3, nHeads, A, C]).permute(1, 2, 3, 0);
  let tAttnBias = model[prefix + ".c_attn.bias"].view([3, nHeads, A]).permute(1, 2, 0);
  let qkvWeight = createBufferTex(gl, C, nHeads * A, 3);
  let qkvBias = createBufferTex(gl, 1, nHeads * A, 3);
  let qkvOutput = createBufferTex(gl, A, B * nHeads * T, 4);
  let attnMatrix = createBufferTex(gl, T, B * nHeads * T, 1);
  let attnMatrixAgg = createBufferTex(gl, 1, B * nHeads * T, 2);
  let attnMatrixSoftmax = createBufferTex(gl, T, B * nHeads * T, 1);
  let scaledVectors = createBufferTex(gl, nHeads * A, B * T, 1);
  writeToBufferTex(gl, qkvWeight, tAttnWeight.toFloat32Array());
  writeToBufferTex(gl, qkvBias, tAttnBias.toFloat32Array());
  let qkvProg = createShaderProgram(
    shaderManager,
    "qkv",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D attnInput; // (B, T)         (C)
        uniform sampler2D qkvWeight; // (nHeads, A)    (C) [3]
        uniform sampler2D qkvBias;   // (nHeads, A)    (1) [3]
        out vec4 qkvOutput;          // (B, nHeads, T) (A)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            int headIdx = pos.y / ${T};
            int tIdx = pos.y % ${T};
            int bIdx = headIdx / ${nHeads};
            headIdx = headIdx % ${nHeads};

            vec3 a = texelFetch(qkvBias, ivec2(0, headIdx * ${A} + pos.x), 0).rgb;
            for (int i = 0; i < ${C}; i++) {
                float inVal = texelFetch(attnInput, ivec2(i, tIdx + bIdx * ${T}    ), 0).r;
                vec3 qkvW   = texelFetch(qkvWeight,  ivec2(i, headIdx * ${A} + pos.x), 0).rgb;
                a += inVal * qkvW;
            }

            qkvOutput = vec4(a, 1);
        }
    `
  );
  let selfAttendProg = createShaderProgram(
    shaderManager,
    "selfAttend",
    basicVertexShader,
    /* glsl */
    `#version 300 es
        precision highp float;
        uniform sampler2D qkvOutput; // (B, nHeads, T) (A)
        out float attnMatrix;        // (B, nHeads, T) (T)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxK = pos.x;
            int tIdxQ = pos.y % ${T};
            int yOffset = pos.y - tIdxQ;

            if (tIdxK > tIdxQ) { // # forward attention only
                discard;
            }

            float a = 0.0;
            for (int i = 0; i < ${A}; i++) {
                float q = texelFetch(qkvOutput, ivec2(i, yOffset + tIdxQ), 0).r;
                float k = texelFetch(qkvOutput, ivec2(i, yOffset + tIdxK), 0).g;
                a += q * k;
            }

            attnMatrix = a / sqrt(float(${A}));
        }
    `
  );
  let attnMatrixAggProg = createShaderProgram(
    shaderManager,
    "attnMatrixAgg",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D attnMatrix; // (B, nHeads, T) (T)
        out vec2 attnMatrixAgg;       // (B, nHeads, T) (1) [2]

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxY = pos.y % ${T};

            // Pass 1 finds the max
            float m = 0.0;
            for (int i = 0; i <= tIdxY; i++) {
                float p = texelFetch(attnMatrix, ivec2(i, pos.y), 0).r;
                m = max(m, p);
            }

            // Pass 2 finds the exp sum (shifted by max)
            float a = 0.0;
            for (int i = 0; i <= tIdxY; i++) {
                float p = texelFetch(attnMatrix, ivec2(i, pos.y), 0).r;
                a += exp(p - m);
            }

            // Store sufficient information to compute/apply the softmax
            attnMatrixAgg = vec2(1.0 / a, m);
        }
    `
  );
  let attnMatrixSoftmaxProg = createShaderProgram(
    shaderManager,
    "attnMatrixSoftmax",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D attnMatrix;    // (B, nHeads, T) (T)
        uniform sampler2D attnMatrixAgg; // (B, nHeads, T) (1) [2]
        out float attnMatrixSoftmax;     // (B, nHeads, T) (T)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxX = pos.x;
            int tIdxY = pos.y % ${T};

            if (tIdxX > tIdxY) { // # forward attention only
                attnMatrixSoftmax = 0.0;
                discard;
            }

            vec2 agg = texelFetch(attnMatrixAgg, ivec2(0, pos.y), 0).rg;
            float expSumInv = agg.r;
            float maxVal = agg.g;

            float p = texelFetch(attnMatrix, pos, 0).r;
            attnMatrixSoftmax = exp(p - maxVal) * expSumInv;
        }
    `
  );
  let scaledVectorsProg = createShaderProgram(
    shaderManager,
    "scaledVectors",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D qkvOutput;         // (B, nHeads, T) (A)
        uniform sampler2D attnMatrixSoftmax; // (B, nHeads, T) (T)
        out float scaledVectors;             // (B, T)         (A * nHeads)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int aIdx = pos.x % ${A};
            int headIdx = pos.x / ${A};

            int tIdxY = pos.y % ${T};
            int bIdx = pos.y / ${T};

            int yOffset = bIdx * ${T} * ${nHeads} + headIdx * ${T};

            float res = 0.0;
            for (int i = 0; i <= tIdxY; i++) {
                float sm = texelFetch(attnMatrixSoftmax, ivec2(i, yOffset + tIdxY), 0).r;
                float v = texelFetch(qkvOutput, ivec2(aIdx, yOffset + i), 0).b;
                res += sm * v;
            }

            scaledVectors = res;
        }
    `
  );
  if (!qkvProg || !selfAttendProg || !attnMatrixAggProg || !attnMatrixSoftmaxProg || !scaledVectorsProg) {
    throw new Error("Failed to create shader program");
  }
  let qkvPhase = createRenderPhase(gl, qkvProg, [qkvOutput], [input, qkvWeight, qkvBias], ["attnInput", "qkvWeight", "qkvBias"]);
  let selfAttendPhase = createRenderPhase(gl, selfAttendProg, [attnMatrix], [qkvOutput], ["qkvOutput"]);
  let attnMatrixAggPhase = createRenderPhase(gl, attnMatrixAggProg, [attnMatrixAgg], [attnMatrix], ["attnMatrix"]);
  let attnMatrixSoftmaxPhase = createRenderPhase(gl, attnMatrixSoftmaxProg, [attnMatrixSoftmax], [attnMatrix, attnMatrixAgg], ["attnMatrix", "attnMatrixAgg"]);
  let scaledVectorsPhase = createRenderPhase(gl, scaledVectorsProg, [scaledVectors], [qkvOutput, attnMatrixSoftmax], ["qkvOutput", "attnMatrixSoftmax"]);
  let proj = createLinearLayer2(layerBuilder, prefix + ".c_proj", C, C, scaledVectors);
  let add = createAddLayer2(layerBuilder, proj.output, residual);
  return {
    qkvWeight,
    qkvBias,
    qkvOutput,
    attnMatrix,
    attnMatrixAgg,
    attnMatrixSoftmax,
    scaledVectors,
    qkvPhase,
    selfAttendPhase,
    attnMatrixAggPhase,
    attnMatrixSoftmaxPhase,
    scaledVectorsPhase,
    proj,
    add,
    output: add.output
  };
}
function createMLP(layerBuilder, prefix, input, residual) {
  let { gl, shape: { B, T, C }, shaderManager } = layerBuilder;
  let mlpGelu = createBufferTex(gl, C * 4, B * T, 1);
  let geluProg = createShaderProgram(
    shaderManager,
    "mlpGelu",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D geluInput;  // (B, T) (C * 4)
        out float geluOutput; // (B, T) (C * 4)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            float x = texelFetch(geluInput, pos, 0).r;
            geluOutput = x * 0.5 * (1.0 + tanh(sqrt(2.0 / 3.14159265358) * (x + 0.044715 * x * x * x)));
        }
    `
  );
  let fcLayer = createLinearLayer2(layerBuilder, prefix + ".c_fc", C, C * 4, input);
  let geluPhase = createRenderPhase(gl, geluProg, [mlpGelu], [fcLayer.output], ["geluInput"]);
  let projLayer = createLinearLayer2(layerBuilder, prefix + ".c_proj", C * 4, C, mlpGelu);
  let addLayer = createAddLayer2(layerBuilder, projLayer.output, residual);
  return {
    fcLayer,
    mlpGelu,
    geluPhase,
    projLayer,
    addLayer,
    output: addLayer.output
  };
}
function createLayerNorm(layerBuilder, layerPrefix, input) {
  let { gl, model, shape: { B, T, C }, shaderManager } = layerBuilder;
  let tWeight = model[layerPrefix + ".weight"];
  let tBias = model[layerPrefix + ".bias"];
  let normWeight = createBufferTex(gl, 1, C, 1);
  let normBias = createBufferTex(gl, 1, C, 1);
  let normAgg = createBufferTex(gl, 1, B * T, 2);
  let output = createBufferTex(gl, C, B * T, 1);
  writeToBufferTex(gl, normWeight, tWeight.toFloat32Array());
  writeToBufferTex(gl, normBias, tBias.toFloat32Array());
  let normEps = 1e-5;
  let normAggProg = createShaderProgram(
    shaderManager,
    "normAgg",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D normInput; // (B, T) (C)
        out vec2 normAgg;            // (B, T) (1) [2]

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            // Use Welford's algorithm to compute mean and variance
            float mean = 0.0;
            float M2 = 0.0;
            for (int i = 0; i < ${C}; i++) {
                float x = texelFetch(normInput, ivec2(i, pos.y), 0).r;
                float delta = x - mean;
                mean += delta / float(i + 1);
                M2 += delta * (x - mean);
            }

            normAgg = vec2(mean, 1.0 / sqrt(M2 / float(${C}) + ${normEps}));
        }
    `
  );
  let normApply = createShaderProgram(
    shaderManager,
    "normApply",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D normInput;  // (B, T) (C)
        uniform sampler2D normAgg;    // (B, T) (1) [2]
        uniform sampler2D normWeight; // (C)    (1)
        uniform sampler2D normBias;   // (C)    (1)
        out float normOutput;         // (B, T) (C)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            vec2 agg = texelFetch(normAgg, ivec2(0, pos.y), 0).rg;
            float mean = agg.r;
            float stdInv = agg.g;

            float x = texelFetch(normInput, pos, 0).r;

            float weight = texelFetch(normWeight, ivec2(0, pos.x), 0).r;
            float bias   = texelFetch(normBias,   ivec2(0, pos.x), 0).r;

            normOutput = (x - mean) * stdInv * weight + bias;
        }
    `
  );
  let aggPhase = createRenderPhase(gl, normAggProg, [normAgg], [input], ["normInput"]);
  let applyPhase = createRenderPhase(
    gl,
    normApply,
    [output],
    [input, normAgg, normWeight, normBias],
    ["normInput", "normAgg", "normWeight", "normBias"]
  );
  return {
    normAgg,
    normWeight,
    normBias,
    aggPhase,
    applyPhase,
    output
  };
}
function createLinearLayer2(layerBuilder, prefix, nIn, nOut, input, residual, bias) {
  let { gl, model, shape: { B, T }, shaderManager } = layerBuilder;
  bias = bias ?? true;
  let tWeight = model[prefix + ".weight"];
  let tBias = bias ? model[prefix + ".bias"] : null;
  let linearWeight = createBufferTex(gl, nIn, nOut, 1);
  let linearBias = bias ? createBufferTex(gl, 1, nOut, 1) : null;
  let output = createBufferTex(gl, nOut, B * T, 1);
  writeToBufferTex(gl, linearWeight, tWeight.buffer);
  tBias && linearBias && writeToBufferTex(gl, linearBias, tBias.buffer);
  let linearProg = createShaderProgram(
    shaderManager,
    "linear",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;          //    y     x
        uniform sampler2D linearInput;  // (B, T) (nIn)
        uniform sampler2D linearWeight; // (nOut) (nIn)
        ${bias ? "uniform sampler2D linearBias;" : ""}   // (nOut) (1)
        ${residual ? "uniform sampler2D linearResidual;" : ""}
        out float linearOutput;         // (B, T) (nOut)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            float res = ${bias ? "texelFetch(linearBias, ivec2(0, pos.x), 0).r" : "0.0"};
            for (int i = 0; i < ${nIn}; i++) {
                float x = texelFetch(linearInput, ivec2(i, pos.y), 0).r;
                float w = texelFetch(linearWeight, ivec2(i, pos.x), 0).r;
                res += x * w;
            }

            ${residual ? "res += texelFetch(linearResidual, pos, 0).r;" : ""}
            linearOutput = res;
        }
    `
  );
  let linearPhase = createRenderPhase(
    gl,
    linearProg,
    [output],
    [input, linearWeight, linearBias, residual].filter(nonNil),
    ["linearInput", "linearWeight", bias ? "linearBias" : null, residual ? "linearResidual" : null].filter(nonNil)
  );
  return {
    weight: linearWeight,
    bias: linearBias,
    linearPhase,
    output
  };
}
function createEmbeddingLayer(layerBuilder, prefix, nEmbed, nDims, input) {
  let { gl, model, shape: { B, T }, shaderManager } = layerBuilder;
  let tWeight = model[prefix + ".weight"];
  let weight = createBufferTex(gl, nDims, nEmbed, 1);
  let output = createBufferTex(gl, nDims, B * T, 1);
  writeToBufferTex(gl, weight, tWeight.buffer);
  let embedProg = createShaderProgram(
    shaderManager,
    "embed",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;          //    y     x
        uniform sampler2D embedInput;  // (B, T)   (1)
        uniform sampler2D embedWeight; // (nEmbed) (nDims)
        out float embedOutput;         // (B, T)   (nDims)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            int y = int(texelFetch(embedInput, ivec2(0, pos.y), 0).r);
            float res = texelFetch(embedWeight, ivec2(pos.x, y), 0).r;

            embedOutput = res;
        }
    `
  );
  let phase = createRenderPhase(gl, embedProg, [output], [input, weight], ["embedInput", "embedWeight"]);
  return {
    weight,
    phase,
    output
  };
}
function createAddLayer2(layerBuilder, inputA, inputB) {
  let { gl, shape: { B, T, C }, shaderManager } = layerBuilder;
  let output = createBufferTex(gl, C, B * T, 1);
  let addProg = createShaderProgram(
    shaderManager,
    "add",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;     //    y    x
        uniform sampler2D inputA;  // (B, T) (C)
        uniform sampler2D inputB;  // (B, T) (C)
        out float addOutput;       // (B, T) (C)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            float a = texelFetch(inputA, pos, 0).r;
            float b = texelFetch(inputB, pos, 0).r;
            addOutput = a + b;
        }
    `
  );
  let addPhase = createRenderPhase(gl, addProg, [output], [inputA, inputB], ["inputA", "inputB"]);
  return {
    addPhase,
    output
  };
}
function createSoftmaxLayer2(layerBuilder, input) {
  let { gl, shape: { B, T, C, vocabSize }, shaderManager } = layerBuilder;
  let agg = createBufferTex(gl, 1, B * T, 2);
  let output = createBufferTex(gl, vocabSize, B * T, 1);
  let softmaxAggProg = createShaderProgram(
    shaderManager,
    "softmaxAgg",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;       //    y      x
        uniform sampler2D smInput;   // (B, T) (nVocab)
        out vec2 smAgg;              // (B)    (nVocab) [2]

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxY = pos.y % ${T};

            // Pass 1 finds the max
            float m = 0.0;
            for (int i = 0; i < ${vocabSize}; i++) {
                float p = texelFetch(smInput, ivec2(i, pos.y), 0).r;
                m = max(m, p);
            }

            // Pass 2 finds the exp sum (shifted by max)
            float a = 0.0;
            for (int i = 0; i < ${vocabSize}; i++) {
                float p = texelFetch(smInput, ivec2(i, pos.y), 0).r;
                a += exp(p - m);
            }

            // Store sufficient information to compute/apply the softmax
            smAgg = vec2(1.0 / a, m);
        }
    `
  );
  let softmaxProg = createShaderProgram(
    shaderManager,
    "softmax",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;
        uniform sampler2D smInput;    // (B, T) (nVocab)
        uniform sampler2D smAgg;      // (B)    (nVocab) [2]
        out float smOutput;           // (B, T) (nVocab)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxX = pos.x;
            int tIdxY = pos.y % ${T};

            vec2 agg = texelFetch(smAgg, ivec2(0, pos.y), 0).rg;
            float expSumInv = agg.r;
            float maxVal = agg.g;

            float p = texelFetch(smInput, pos, 0).r;
            smOutput = exp(p - maxVal) * expSumInv;
        }
    `
  );
  let aggPhase = createRenderPhase(gl, softmaxAggProg, [agg], [input], ["smInput"]);
  let softmaxPhase = createRenderPhase(gl, softmaxProg, [output], [input, agg], ["smInput", "smAgg"]);
  return {
    bufs: [agg, output],
    progs: [softmaxAggProg, softmaxProg],
    phases: [aggPhase, softmaxPhase],
    agg,
    aggPhase,
    softmaxPhase,
    output
  };
}
function createCopyOutputToInputLayer(layerBuilder, prevOutput, currInput) {
  let { gl, shape: { T, vocabSize }, shaderManager } = layerBuilder;
  let copyProg = createShaderProgram(
    shaderManager,
    "copy",
    basicVertexShader,
    /*glsl*/
    `#version 300 es
        precision highp float;         //    y    x
        uniform sampler2D prevOutput;  // (B, T) (n_vocab)
        uniform int u_targetTIdx;
        out float currInput;           // (B, T) (1)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            int tIdx = pos.y % ${T};

            if (tIdx != u_targetTIdx) {
                discard;
            }

            int maxVocabI = 0;
            float maxVocabP = 0.0;
            for (int i = 0; i < ${vocabSize}; i++) {
                float p = texelFetch(prevOutput, ivec2(i, pos.y), 0).r;
                if (p > maxVocabP) {
                    maxVocabP = p;
                    maxVocabI = i;
                }
            }

            currInput = float(maxVocabI);
        }
    `
  );
  let copyPhase = createRenderPhase(gl, copyProg, [currInput], [prevOutput], ["prevOutput"]);
  return {
    copyPhase
  };
}
export {
  BASE_VERTICAL_FOV_DEG,
  LLM_VIZ_ASSET_BASE,
  NANO_SHAPE,
  REFERENCE_CAMERA_ASPECT,
  TensorF32,
  Vec3,
  Vec4,
  cameraToMatrixView,
  computeProjectionParams,
  constructModel,
  createGpuModelForWasm,
  fetchFontAtlasData,
  fetchJsonAsset,
  fetchRequiredAsset,
  getDeveloWalkthroughSnapshot,
  initModel,
  initProgramState,
  initRender,
  instantiateLlmWasm,
  loadNativeBindings,
  pauseDeveloWalkthrough,
  resetDeveloWalkthrough,
  resetWasmModelInput,
  runProgram,
  setDeveloWalkthroughSpeed,
  setModelInputData,
  startDeveloWalkthrough,
  stepWasmModel,
  syncWasmDataWithJsAndGpu,
  updateCamera
};
