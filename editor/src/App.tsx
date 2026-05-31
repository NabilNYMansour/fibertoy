import { useContext, useEffect, useRef, useState } from "react"
import { LiveProvider, LivePreview, LiveContext } from "react-live"
import CodeEditor from "./components/code-editor"
import * as THREE from "three"
import * as R3F from "@react-three/fiber"
import * as DREI from "@react-three/drei"
import * as ZUSTAND from "zustand"
import * as LEVA from "leva"
import {
  ArrowDownToLine,
  ArrowLeftToLine,
  ArrowRightFromLine,
  ArrowUpFromLine,
  Loader2,
} from "lucide-react"
import { cn } from "./lib/utils"
import { Button } from "./components/ui/button"

const SCOPE = {
  ...THREE,
  ...R3F,
  ...DREI,
  ...ZUSTAND,
  ...LEVA,
  glsl: (x: string) => x[0],
}

export function App() {
  const [initialized, setInitialized] = useState(false)
  const [fork, setFork] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [code, setCode] = useState("")
  const [noCodeView, setNoCodeView] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    window.parent.postMessage({ type: "code", code: newCode }, "*")
  }

  const handleCompile = (newCode: string) => {
    setCode(newCode)
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "code") {
        setCode(event.data.code)
      } else if (event.data.type === "initialize") {
        setInitialized(true)
        setCode(event.data.code)
        setUserExists(event.data.userExists)
        setFork(event.data.fork)
      } else if (event.data.type === "screenshot") {
        requestAnimationFrame(() => {
          const canvas = previewRef.current?.querySelector("canvas")
          if (!(canvas instanceof HTMLCanvasElement)) {
            window.parent.postMessage(
              { type: "screenshot", error: "No canvas found" },
              "*"
            )
            return
          }
          try {
            const dataUrl = canvas.toDataURL("image/png")
            window.parent.postMessage({ type: "screenshot", dataUrl }, "*")
          } catch (error) {
            window.parent.postMessage(
              {
                type: "screenshot",
                error: error instanceof Error ? error.message : String(error),
              },
              "*"
            )
          }
        })
      }
    }
    window.addEventListener("message", handleMessage)
    window.parent.postMessage({ type: "ready" }, "*")
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  // get url params and see if embed=true
  const embed =
    new URLSearchParams(window.location.search).get("embed") === "true"

  return (
    <div className="flex h-svh">
      {!initialized && (
        <div className="flex w-full items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {initialized && (
        <LiveProvider noInline code={code} scope={SCOPE}>
          {embed ? (
            <LivePreview className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full flex-col sm:flex-row">
              <div
                className={cn(
                  "h-full",
                  noCodeView ? "h-0 w-0" : "border-b sm:w-1/2 sm:border-r"
                )}
              >
                <CodeEditor
                  value={code}
                  onSave={userExists ? handleCodeChange : undefined}
                  onCompile={handleCompile}
                  fork={fork}
                />
                <Button
                  className={cn(
                    "absolute bottom-2.5 z-100",
                    noCodeView ? "left-2" : "left-1/2"
                  )}
                  size="icon"
                  variant="secondary"
                  onClick={() => setNoCodeView(!noCodeView)}
                  title={noCodeView ? "Show code" : "Hide code"}
                >
                  <div className="hidden md:block">
                    {noCodeView ? <ArrowRightFromLine /> : <ArrowLeftToLine />}
                  </div>
                  <div className="block md:hidden">
                    {noCodeView ? <ArrowDownToLine /> : <ArrowUpFromLine />}
                  </div>
                </Button>
              </div>
              <div className={cn("h-full", noCodeView ? "w-full" : "sm:w-1/2")}>
                <LivePreviewWrapper
                  previewRef={previewRef}
                  setNoCodeView={setNoCodeView}
                  noCodeView={noCodeView}
                />
              </div>
            </div>
          )}
        </LiveProvider>
      )}
    </div>
  )
}

interface LivePreviewWrapperProps {
  previewRef: React.RefObject<HTMLDivElement | null>
  setNoCodeView: React.Dispatch<React.SetStateAction<boolean>>
  noCodeView: boolean
}

function LivePreviewWrapper({ previewRef }: LivePreviewWrapperProps) {
  const { error } = useContext(LiveContext)
  return (
    <div ref={previewRef} className="relative flex h-full w-full">
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
