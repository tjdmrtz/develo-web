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
  let dist = 200 * camera.angle.z;
  let persp = Mat4f.fromPersp(40, state.render.size.x / state.render.size.y, 100, 1e7);
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
var Colors = {
  Weights: DEVELO_LLM_VIZ_THEME.embedding,
  Intermediates: DEVELO_LLM_VIZ_THEME.mlp,
  Aggregates: DEVELO_LLM_VIZ_THEME.attention
};

// features/llm-visualization/upstream/src/llm/Annotations.ts
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
  cubes.push(lmHeadWeight, logits, logitsAgg1, logitsAgg2, logitsSoftmax);
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

// features/llm-visualization/upstream/src/llm/components/ModelCard.ts
function withAlpha(color, alpha) {
  return new Vec4(color.x, color.y, color.z, alpha);
}
function lineHeight(fontOpts) {
  return fontOpts.size * 1.2;
}
function drawModelCard(state, layout, title, offset) {
  let { render } = state;
  let { camPos } = cameraToMatrixView(state.camera);
  let dist = camPos.dist(new Vec3(0, 0, -30));
  let scale = clamp(dist / 500, 1, 800);
  let pinY = -60;
  let mtx = Mat4f.fromScaleTranslation(new Vec3(scale, scale, scale), new Vec3(0, pinY, 0).add(offset)).mul(Mat4f.fromTranslation(new Vec3(0, -pinY, 0)));
  let thick = 1 / 10 * scale;
  let borderColor = withAlpha(DEVELO_LLM_VIZ_THEME.border, 0.8);
  let backgroundColor = withAlpha(DEVELO_LLM_VIZ_THEME.panel, 0.55);
  let titleColor = DEVELO_LLM_VIZ_THEME.text;
  let n = new Vec3(0, 0, 1);
  let lineOpts = { color: borderColor, mtx, thick, n };
  let tl = new Vec3(-45, -97, 0);
  let br = new Vec3(45, -70, 0);
  drawLineRect(render, tl, br, lineOpts);
  addQuad(render.triRender, new Vec3(tl.x, tl.y, -0.1), new Vec3(br.x, br.y, -0.1), backgroundColor, mtx);
  let { B, C, T, A, nBlocks, nHeads, vocabSize } = layout.shape;
  let midX = (tl.x + br.x) / 2;
  let paramLeft = br.x - 50;
  let paramOff = tl.y + 2;
  let paramLineHeight = 1.3;
  let paramFontScale = 4;
  let numWidth = paramFontScale * 0.6;
  let allNums = [B, C, T, A, nBlocks, nHeads];
  let maxLen = Math.max(...allNums.map((n2) => n2.toString().length));
  let paramHeight = 2 + paramLineHeight * paramFontScale * 3 + 1;
  let titleFontScale = 13;
  let titleW = measureTextWidth(render.modelFontBuf, title, titleFontScale);
  let titleHeight = titleFontScale * paramLineHeight;
  writeTextToBuffer(render.modelFontBuf, title, titleColor, midX - titleW / 2, tl.y + 2, titleFontScale, mtx);
  let nParamsText = `n_params = `;
  let weightCountText = numberToCommaSep(layout.weightCount);
  let weightSize = 8;
  let weightTitleW = measureTextWidth(render.modelFontBuf, nParamsText, paramFontScale);
  let weightCountW = measureTextWidth(render.modelFontBuf, weightCountText, weightSize);
  paramOff = tl.y + titleHeight + 4;
  let weightX = midX - (weightCountW + weightTitleW) / 2;
  writeTextToBuffer(render.modelFontBuf, nParamsText, titleColor, weightX, paramOff - paramFontScale / 2, paramFontScale, mtx);
  writeTextToBuffer(render.modelFontBuf, weightCountText, titleColor, weightX + weightTitleW, paramOff - weightSize / 2, weightSize, mtx);
  renderOutputAtBottom(state);
  renderInputAtTop(state);
}
function sortABCInputTokenToString(a) {
  return String.fromCharCode("A".charCodeAt(0) + a);
}
function renderInputBoxes(state, layout, tl, br, cellW, fontSize, lineOpts, opts) {
  let render = state.render;
  let { T } = layout.shape;
  let inCellH = br.y - tl.y;
  let tokTextOpts = { color: DEVELO_LLM_VIZ_THEME.text, mtx: lineOpts.mtx, size: fontSize };
  let idxTextOpts = { color: DEVELO_LLM_VIZ_THEME.muted, mtx: lineOpts.mtx, size: fontSize * 0.6 };
  let dimmedTokTextOpts = { ...tokTextOpts, color: tokTextOpts.color.mul(0.3) };
  let dimmedIdxTextOpts = { ...idxTextOpts, color: idxTextOpts.color.mul(0.3) };
  drawLineRect(render, tl, br, lineOpts);
  let tokens = layout.model?.inputTokens.localBuffer;
  for (let i = 0; i < T; i++) {
    if (i > 0) {
      let lineX = tl.x + i * cellW;
      addLine2(render.lineRender, new Vec3(lineX, tl.y, 0), new Vec3(lineX, br.y, 0), lineOpts);
    }
    if (tokens && i < layout.model.inputLen) {
      let cx = tl.x + (i + 0.5) * cellW;
      let tokOpts = { ...tokTextOpts, color: mixColorValues(opts?.tokMixes ?? null, tokTextOpts.color, i) };
      let tokIdxOpts = { ...idxTextOpts, color: mixColorValues(opts?.idxMixes ?? null, idxTextOpts.color, i) };
      let tokStr = sortABCInputTokenToString(tokens[i]);
      let tokW = measureText(render.modelFontBuf, tokStr, tokTextOpts);
      let idxW = measureText(render.modelFontBuf, tokens[i].toString(), idxTextOpts);
      let totalH = tokTextOpts.size + idxTextOpts.size;
      let top = tl.y + (inCellH - totalH) / 2;
      drawText(render.modelFontBuf, tokStr, cx - tokW / 2, top, tokOpts);
      drawText(render.modelFontBuf, tokens[i].toString(), cx - idxW / 2, top + tokTextOpts.size, tokIdxOpts);
    }
  }
}
function renderOutputBoxes(state, layout, tl, br, cellW, fontSize, lineOpts, opts) {
  let render = state.render;
  let { T, vocabSize } = layout.shape;
  let outCellH = br.y - tl.y;
  let opacity = opts?.opacity ?? 1;
  let boldLast = opts?.boldLast ?? true;
  lineOpts = { ...lineOpts, color: lineOpts.color.mul(opacity ?? 1) };
  let tokTextOpts = { color: withAlpha(DEVELO_LLM_VIZ_THEME.text, opacity), mtx: lineOpts.mtx, size: fontSize };
  let idxTextOpts = { color: withAlpha(DEVELO_LLM_VIZ_THEME.muted, opacity), mtx: lineOpts.mtx, size: fontSize * 0.6 };
  let dimmedTokTextOpts = { ...tokTextOpts, color: tokTextOpts.color.mul(0.3) };
  let dimmedIdxTextOpts = { ...idxTextOpts, color: idxTextOpts.color.mul(0.3) };
  drawLineRect(render, tl, br, lineOpts);
  let sortedOutput = layout.model?.sortedBuf;
  for (let i = 0; i < T; i++) {
    if (i > 0) {
      let lineX = tl.x + i * cellW;
      addLine2(render.lineRender, new Vec3(lineX, tl.y, 0), new Vec3(lineX, br.y, 0), lineOpts);
    }
    if (sortedOutput && i < layout.model.inputLen) {
      let usedSoFar = 0;
      let cx = tl.x + (i + 0.5) * cellW;
      for (let j = 0; j < vocabSize; j++) {
        let tokIdx = sortedOutput[(i * vocabSize + j) * 2 + 0];
        let tokProb = sortedOutput[(i * vocabSize + j) * 2 + 1];
        let partTop = tl.y + usedSoFar * outCellH;
        let partH = tokProb * outCellH;
        let dimmed = i < layout.model.inputLen - 1 || !boldLast;
        let color = mixColorValues(opts?.tokMixes ?? null, tokTextOpts.color, i);
        if (dimmed) {
          color = color.mul(0.3);
        }
        let tokOpts = { ...tokTextOpts, color };
        let idxOpts = { ...idxTextOpts, color: color.mul(0.6) };
        let tokStr = sortABCInputTokenToString(tokIdx);
        let tokW = measureText(render.modelFontBuf, tokStr, tokOpts);
        let idxW = measureText(render.modelFontBuf, tokIdx.toString(), idxOpts);
        let textH = tokOpts.size + idxOpts.size;
        let top = partTop + (partH - textH) / 2;
        if (partH > textH) {
          drawText(render.modelFontBuf, tokStr, cx - tokW / 2, top, tokOpts);
          drawText(render.modelFontBuf, tokIdx.toString(), cx - idxW / 2, top + tokOpts.size, idxOpts);
        }
        usedSoFar += tokProb;
        addLine2(render.lineRender, new Vec3(cx - cellW / 2, partTop + partH, 0), new Vec3(cx + cellW / 2, partTop + partH, 0), lineOpts);
        if (usedSoFar >= 1 - 1e-4) {
          break;
        }
      }
    }
  }
}
function mixColorValues(mixes, baseColor, idx) {
  if (!mixes) {
    return baseColor;
  }
  let mix = mixes.mixes[idx] ?? 0;
  return Vec4.lerp(mixes.color1 ?? baseColor, mixes.color2, mix);
}
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
function numberToCommaSep(a) {
  let s = a.toString();
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 == 0) {
      out += ",";
    }
    out += s[i];
  }
  return out;
}
function renderInputAtTop(state) {
  let layout = state.layout;
  let render = state.render;
  let inputTokBlk = layout.idxObj;
  let topMid = new Vec3(inputTokBlk.x + inputTokBlk.dx / 2, inputTokBlk.y - layout.margin);
  let inCellH = 10;
  let inCellW = 6;
  let nCells = layout.shape.T;
  let tl = new Vec3(topMid.x - inCellW * nCells / 2, topMid.y - inCellH);
  let br = new Vec3(topMid.x + inCellW * nCells / 2, topMid.y);
  let outputOpacity = state.display.topOutputOpacity ?? 1;
  let lineOpts = makeLineOpts({ color: withAlpha(DEVELO_LLM_VIZ_THEME.border, 0.6), mtx: new Mat4f(), thick: 1.5 });
  let titleTextOpts = { color: DEVELO_LLM_VIZ_THEME.muted, mtx: lineOpts.mtx, size: 1.9 };
  renderInputBoxes(state, layout, tl, br, inCellW, 4, lineOpts, { tokMixes: state.display.tokenColors, idxMixes: state.display.tokenIdxColors });
  let inputTitle = "Input";
  drawText(render.modelFontBuf, inputTitle, tl.x, tl.y - lineHeight(titleTextOpts), titleTextOpts);
  {
    let outCellH = 12;
    let outBr = new Vec3(br.x, tl.y - 4);
    let outTl = new Vec3(tl.x, outBr.y - outCellH);
    renderOutputBoxes(state, layout, outTl, outBr, inCellW, 4, lineOpts, { opacity: outputOpacity, boldLast: outputOpacity < 1, tokMixes: state.display.tokenOutputColors });
    let outputTitle = "Output";
    let outputTextOpts = { ...titleTextOpts, color: titleTextOpts.color.mul(outputOpacity) };
    drawText(render.modelFontBuf, outputTitle, outTl.x, outTl.y - lineHeight(titleTextOpts), outputTextOpts);
  }
  for (let i = 0; i < nCells; i++) {
    let mixes = state.display.tokenIdxColors;
    let lineOptsLocal = { ...lineOpts, color: mixColorValues(mixes, lineOpts.color, i) };
    let tx = tl.x + (i + 0.5) * inCellW;
    let ty = tl.y + layout.cell + inCellH;
    let bx = cellPosition(layout, inputTokBlk, 0 /* X */, i) + 0.5 * layout.cell;
    let by = inputTokBlk.y - 0.5 * layout.cell;
    let midY1 = lerp(by, ty, 1 / 6);
    let midY2 = lerp(by, ty, 3 / 4);
    addLine2(state.render.lineRender, new Vec3(bx, by), new Vec3(bx, midY1), lineOptsLocal);
    addLine2(state.render.lineRender, new Vec3(bx, midY1), new Vec3(tx, midY2), lineOptsLocal);
    addLine2(state.render.lineRender, new Vec3(tx, midY2), new Vec3(tx, ty), lineOptsLocal);
    let arrLen = 0.6;
    let arrowLeft = new Vec3(bx - arrLen, by - arrLen);
    let arrowRight = new Vec3(bx + arrLen, by - arrLen);
    addLine2(state.render.lineRender, arrowLeft, new Vec3(bx, by), lineOptsLocal);
    addLine2(state.render.lineRender, arrowRight, new Vec3(bx, by), lineOptsLocal);
  }
}
function renderOutputAtBottom(state) {
  let layout = state.layout;
  let softmax = layout.logitsSoftmax;
  let topMid = new Vec3(softmax.x + softmax.dx / 2, softmax.y + softmax.dy + layout.margin);
  let outCellH = 10;
  let outCellW = 6;
  let nCells = layout.shape.T;
  let tl = new Vec3(topMid.x - outCellW * nCells / 2, topMid.y);
  let br = new Vec3(topMid.x + outCellW * nCells / 2, topMid.y + outCellH);
  let lineOpts = makeLineOpts({ color: withAlpha(DEVELO_LLM_VIZ_THEME.border, 0.6), mtx: new Mat4f(), thick: 1.5 });
  renderOutputBoxes(state, layout, tl, br, outCellW, 4, lineOpts, { boldLast: true, tokMixes: state.display.tokenOutputColors });
  for (let i = 0; i < nCells; i++) {
    let tx = cellPosition(layout, softmax, 0 /* X */, i) + 0.5 * layout.cell;
    let ty = softmax.y + softmax.dy + 0.5 * layout.cell;
    let bx = tl.x + (i + 0.5) * outCellW;
    let by = tl.y - layout.cell;
    let midY1 = lerp(ty, by, 1 / 6);
    let midY2 = lerp(ty, by, 3 / 4);
    addLine2(state.render.lineRender, new Vec3(tx, ty), new Vec3(tx, midY1), lineOpts);
    addLine2(state.render.lineRender, new Vec3(tx, midY1), new Vec3(bx, midY2), lineOpts);
    addLine2(state.render.lineRender, new Vec3(bx, midY2), new Vec3(bx, by), lineOpts);
    let arrLen = 0.6;
    let arrowLeft = new Vec3(bx - arrLen, by - arrLen);
    let arrowRight = new Vec3(bx + arrLen, by - arrLen);
    addLine2(state.render.lineRender, arrowLeft, new Vec3(bx, by), lineOpts);
    addLine2(state.render.lineRender, arrowRight, new Vec3(bx, by), lineOpts);
  }
}

// features/llm-visualization/upstream/src/llm/components/Tokens.ts
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
    let str = tokenIndexToString(a);
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
  return {
    native: null,
    wasmGptModel: null,
    render,
    inWalkthrough: false,
    walkthrough: { markDirty: () => {
    }, running: false, time: 0, phaseLength: 0 },
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
}
function applyDeveloStage(state) {
  let layout = state.layout;
  if (!layout) return;
  let p = state.stageProgress;
  let stage = state.stage;
  for (let c of layout.cubes) {
    c.opacity = 0.28;
    c.highlight = 0;
  }
  state.display.tokenIdxModelOpacity = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
  function raise(cubes, hl = 0.65) {
    if (!cubes) return;
    for (let c of cubes) {
      if (!c) continue;
      c.opacity = 1;
      c.highlight = hl;
    }
  }
  if (stage === "tokens") {
    raise([layout.idxObj], 0.9);
    layout.idxObj.opacity = 1;
  } else if (stage === "embedding") {
    raise([layout.tokEmbedObj, layout.posEmbedObj, layout.residual0], 0.7);
  } else if (stage === "qkv") {
    let block = layout.blocks[0];
    let headCount = p < 0.55 ? 1 : 3;
    if (block && block.heads) {
      for (let i = 0; i < Math.min(headCount, block.heads.length); i++) {
        let h = block.heads[i];
        raise([h.qBlock, h.kBlock, h.vBlock, h.qWeightBlock, h.kWeightBlock, h.vWeightBlock], i === 0 ? 0.85 : 0.55);
      }
    }
  } else if (stage === "attention") {
    let block = layout.blocks[0];
    if (block && block.heads) {
      for (let h of block.heads) {
        raise([h.attnMtx, h.attnMtxSm, h.attnMtxAgg1, h.attnMtxAgg2, h.vOutBlock], 0.9);
      }
    }
  } else if (stage === "transformer") {
    for (let b of layout.blocks) {
      raise(b.cubes, 0.45);
      raise([b.attnResidual, b.mlpResidual].filter(Boolean), 0.7);
    }
  } else if (stage === "output") {
    raise([layout.ln_f.lnResid, layout.lmHeadWeight, layout.logits, layout.logitsSoftmax].filter(Boolean), 0.85);
  } else if (stage === "prediction") {
    raise([layout.logitsSoftmax, layout.idxObj].filter(Boolean), 0.8);
  } else {
    for (let c of layout.cubes) {
      c.opacity = 1;
      c.highlight = 0;
    }
  }
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
  applyDeveloStage(state);
  genModelViewMatrices(state, state.layout);
  let queryRes = beginQueryAndGetPrevMs(state.render.queryManager, "render");
  if (isNotNil(queryRes)) {
    state.render.lastGpuMs = queryRes;
  }
  state.render.renderTiming = false;
  updateCamera(state, view);
  drawAllArrows(state.render, state.layout);
  drawModelCard(state, state.layout, "nano-gpt", new Vec3());
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
  LLM_VIZ_ASSET_BASE,
  NANO_SHAPE,
  TensorF32,
  Vec3,
  Vec4,
  applyDeveloStage,
  cameraToMatrixView,
  constructModel,
  createGpuModelForWasm,
  fetchFontAtlasData,
  fetchJsonAsset,
  fetchRequiredAsset,
  initModel,
  initProgramState,
  initRender,
  instantiateLlmWasm,
  loadNativeBindings,
  runProgram,
  setModelInputData,
  stepWasmModel,
  syncWasmDataWithJsAndGpu,
  updateCamera
};
