import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const NOISE = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
vec3 sculpt(vec3 p){
  vec3 n = normalize(p);
  float d = snoise(n * uFreq + vec3(0.0, uTime * 0.22, uTime * 0.12)) * uAmp;
  d += snoise(n * uFreq * 2.3 - uTime * 0.1) * uAmp * 0.1;
  return n * (1.0 + d);
}
`

export interface HeroSceneOptions {
  canvas: HTMLCanvasElement
  reducedMotion: boolean
  lowPower: boolean
}

export interface HeroScene {
  setPointer: (x: number, y: number) => void
  setActive: (active: boolean) => void
  destroy: () => void
}

/** A molten pebble with an orbiting ring — sculptural, slow and pointer-aware. */
export function createHeroScene({ canvas, reducedMotion, lowPower }: HeroSceneOptions): HeroScene {
  const renderer = new WebGLRenderer({ canvas, antialias: !lowPower, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.75))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env

  const camera = new PerspectiveCamera(32, 1, 0.1, 50)
  camera.position.set(0, 0, 7.5)

  scene.add(new HemisphereLight(new Color('#f1ffd0'), new Color('#5c5f5b'), 0.9))
  const key = new DirectionalLight(new Color('#fff1e6'), 2.4)
  key.position.set(3, 4, 5)
  const rim = new DirectionalLight(new Color('#00c805'), 2.2)
  rim.position.set(-4, -2, -3)
  scene.add(key, rim)

  const uniforms = { uTime: { value: 0 }, uAmp: { value: 0.2 }, uFreq: { value: 0.85 } }

  const pebbleMat = new MeshPhysicalMaterial({
    color: new Color('#f5e7df'),
    roughness: 0.22,
    metalness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    iridescence: 0.65,
    iridescenceIOR: 1.4,
    sheen: 0.6,
    sheenColor: new Color('#ccff00'),
  })
  pebbleMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${NOISE}`)
      .replace(
        '#include <beginnormal_vertex>',
        /* glsl */ `
        vec3 n0 = normalize(position);
        vec3 tng = normalize(cross(n0, abs(n0.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        vec3 btg = normalize(cross(n0, tng));
        vec3 sp0 = sculpt(position);
        vec3 sp1 = sculpt(position + tng * 0.01);
        vec3 sp2 = sculpt(position + btg * 0.01);
        vec3 objectNormal = normalize(cross(sp1 - sp0, sp2 - sp0));
        if (dot(objectNormal, n0) < 0.0) objectNormal = -objectNormal;
        `,
      )
      .replace('#include <begin_vertex>', 'vec3 transformed = sp0;')
  }

  const detail = lowPower ? 40 : 96
  const pebble = new Mesh(new IcosahedronGeometry(1, detail), pebbleMat)

  const ring = new Mesh(
    new TorusGeometry(1.75, 0.035, 24, 160),
    new MeshPhysicalMaterial({ color: new Color('#1e1d1d'), roughness: 0.3, metalness: 0.6, clearcoat: 1 }),
  )
  ring.rotation.set(Math.PI / 2.3, 0.3, 0)

  const satellite = new Mesh(
    new IcosahedronGeometry(0.14, 8),
    new MeshPhysicalMaterial({ color: new Color('#00c805'), roughness: 0.35, clearcoat: 1 }),
  )

  const group = new Group()
  group.add(pebble, ring, satellite)
  group.scale.setScalar(0.62)
  scene.add(group)

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Keep the object small and centred regardless of viewport shape.
    camera.position.z = w / h < 0.8 ? 10 : 7.5
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const pointer = { x: 0, y: 0 }
  const smooth = { x: 0, y: 0 }
  let active = true
  let raf = 0
  let last = performance.now()
  let time = 0

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    if (!active) {
      last = now
      return
    }
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    if (!reducedMotion) time += dt
    uniforms.uTime.value = time

    smooth.x += (pointer.x - smooth.x) * 0.045
    smooth.y += (pointer.y - smooth.y) * 0.045

    group.position.y = Math.sin(time * 0.6) * 0.12
    group.rotation.y = time * 0.12 + smooth.x * 0.5
    group.rotation.x = Math.sin(time * 0.35) * 0.12 + smooth.y * 0.35
    group.rotation.z = Math.sin(time * 0.25) * 0.06
    ring.rotation.z = time * 0.18
    satellite.position.set(Math.cos(time * 0.5) * 1.75, Math.sin(time * 0.5) * 0.55, Math.sin(time * 0.5) * 1.6)

    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(frame)

  return {
    setPointer(x, y) {
      pointer.x = x
      pointer.y = y
    },
    setActive(next) {
      active = next
    },
    destroy() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      scene.traverse((obj) => {
        if (obj instanceof Mesh) {
          obj.geometry.dispose()
          ;(obj.material as MeshPhysicalMaterial).dispose()
        }
      })
      env.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
