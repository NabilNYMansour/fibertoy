"use client"

import useMessageHandler from "@/hooks/use-message-handler"
import { useState } from "react"

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
  // this is needed to avoid the iframe not receiving any code
  const [code] = useState(BASE_CODE)

  useMessageHandler()

  return (
    <div className="flex flex-1">
      <iframe
        src="http://localhost:5173"
        className="flex-1 bg-transparent"
        sandbox="allow-scripts"
        onLoad={(event) => {
          const win = event.currentTarget.contentWindow
          if (!win) return
          win.postMessage({ type: "initialize", code }, "*")
          win.postMessage({ type: "code", code }, "*")
        }}
      />
    </div>
  )
}
