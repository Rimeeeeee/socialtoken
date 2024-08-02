// src/vanta.d.ts
declare module "vanta/dist/vanta.halo.min" {
  const HALO: (options: any) => any
  export default HALO
}
// src/vanta.d.ts
declare module "vanta/dist/vanta.rings.min" {
  import * as THREE from "three"
  interface VantaEffect {
    destroy(): void
  }
  function RINGS(options: {
    el: HTMLElement
    // THREE: typeof THREE
    mouseControls?: boolean
    touchControls?: boolean
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    scale?: number
    scaleMobile?: number
    backgroundColor?: number
    color?: number
  }): VantaEffect
  export default RINGS
}
