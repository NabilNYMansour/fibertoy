import ReactCodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { keymap } from "@uiw/react-codemirror"
import { useMemo, useRef, useState } from "react"
import { Button } from "./ui/button"
import { auraInit } from "@uiw/codemirror-theme-aura"
import { Save } from "lucide-react"

interface CodeEditorProps {
  value: string
  onSave: (value: string) => void
}

const CodeEditor = ({ value, onSave }: CodeEditorProps) => {
  const ref = useRef<ReactCodeMirrorRef>(null)

  const [currentValue, setCurrentValue] = useState(value)

  const isCodeChanged = useMemo(
    () => currentValue !== value,
    [currentValue, value]
  )

  const extensions = useMemo(
    () => [
      javascript({ jsx: true }),
      keymap.of([
        {
          key: "Mod-s",
          preventDefault: true,
          run: () => {
            onSave(currentValue)
            return true
          },
        },
      ]),
    ],
    [currentValue, onSave]
  )

  const theme = useMemo(
    () =>
      auraInit({
        settings: {
          fontFamily: "monospace",
          fontSize: "15px",
        },
      }),
    []
  )

  const onChange = (value: string) => {
    setCurrentValue(value)
  }

  return (
    <div className="h-full w-full">
      {isCodeChanged && (
        <div className="pointer-events-none absolute top-0 z-10 h-full w-full border-5 border-gray-500" />
      )}
      <ReactCodeMirror
        ref={ref}
        value={currentValue}
        onChange={onChange}
        basicSetup={{
          completionKeymap: false,
          autocompletion: false,
        }}
        extensions={extensions}
        style={{ height: "100%", fontSize: "16px" }}
        height="100%"
        theme={theme}
      />
      <div className="absolute bottom-0 left-0 z-10 flex flex-col gap-2 p-2 text-sm">
        <Button
          onClick={() => onSave(currentValue)}
          disabled={!isCodeChanged}
          title={isCodeChanged ? "Save changes (ctrl+s)" : "No changes to save"}
        >
          <Save />
          Save
        </Button>
      </div>
    </div>
  )
}

export default CodeEditor
