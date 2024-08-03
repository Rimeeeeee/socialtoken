import React, { useState, useEffect, useRef } from "react"
import HALO from "vanta/dist/vanta.halo.min"
import * as THREE from "three" // Import THREE.js as it's required by Vanta

const Vanta: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const myRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: myRef.current,
          THREE, // Pass THREE to the Vanta effect
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          backgroundColor: 0x0,
          baseColor: 0x40059,
          amplitudeFactor: 3.0,
          xOffset: -0.0,
          yOffset: 0.0,
          size: 1.4,
        }),
      )
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div
      ref={myRef}
      style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: -1 }}
    ></div>
  )
}

export default Vanta
