import { useContext, useEffect, useState } from "react"
import { LiveProvider, LivePreview, LiveContext } from "react-live"
import CodeEditor from "./components/code-editor"
import * as THREE from "three"
import * as R3F from "@react-three/fiber"
import * as DREI from "@react-three/drei"
import * as ZUSTAND from "zustand"
import { Loader2 } from "lucide-react"

const SCOPE = { ...THREE, ...R3F, ...DREI, ...ZUSTAND }

export function App() {
  const [initialized, setInitialized] = useState(false)
  const [code, setCode] = useState("")

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    window.parent.postMessage({ type: "code", code: newCode }, "*")
  }

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type === "code") {
        setCode(event.data.code)
      } else if (event.data.type === "initialize") {
        setInitialized(true)
      }
    })
  }, [])

  return (
    <div className="flex h-svh">
      {!initialized && (
        <div className="flex w-full items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {initialized && (
        <LiveProvider noInline code={code} scope={SCOPE}>
          <div className="w-1/2">
            <CodeEditor value={code} onSave={handleCodeChange} />
          </div>
          <div className="w-1/2">
            <LivePreviewWrapper />
          </div>
        </LiveProvider>
      )}
    </div>
  )
}

function LivePreviewWrapper() {
  const { error } = useContext(LiveContext)
  return (
    <div className="relative flex h-full w-full">
      <LivePreview className="h-full w-full" />
      {error && (
        <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center border-8 border-red-500 bg-black/50 p-2">
          <div className="flex flex-col justify-center gap-2">
            <div className="text-2xl font-bold text-red-500">Error</div>
            <div className="text-sm text-white">{error}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
