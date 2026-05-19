"use client"

import { useEffect, useState } from "react"

const BASE_CODE = `
const Main = () => {
  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  )
}

render(<Main />)
`.trim()

export default function Page() {
  const [code, setCode] = useState(BASE_CODE)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type !== "code") return
      setCode(event.data.code)
    }
    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div className="flex flex-1">
      <iframe
        src="http://localhost:5173"
        className="flex-1 bg-transparent"
        sandbox="allow-scripts"
        onLoad={(event) => {
          const win = event.currentTarget.contentWindow
          if (!win) return
          win.postMessage({ type: "initialize" }, "*")
          win.postMessage({ type: "code", code }, "*")
        }}
      />
    </div>
  )
}
