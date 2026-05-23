"use client"

import useMessageHandler from "@/hooks/use-message-handler"
import { useRef } from "react"

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
  const iframeRef = useRef<HTMLIFrameElement>(null)
  useMessageHandler({ iframeRef, code: BASE_CODE })

  return (
    <div className="flex flex-1">
      <iframe
        ref={iframeRef}
        src="http://localhost:5173"
        className="flex-1 bg-transparent"
        sandbox="allow-scripts"
      />
    </div>
  )
}
