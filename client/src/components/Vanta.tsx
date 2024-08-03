import React, { useState, useEffect, useRef } from "react"
import HALO from "vanta/dist/vanta.halo.min"

const Vanta = () => {
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: myRef.current,
          //   THREE: THREE, // Pass THREE to the Vanta effect
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
      //   if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div
      ref={myRef}
      style={{ width: "100%", height: "60vh" }}
      className="z-10"
    ></div>
  )
}

export default Vanta
