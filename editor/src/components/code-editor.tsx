import ReactCodeMirror, {
  keymap,
  type ReactCodeMirrorRef,
} from "@uiw/react-codemirror"
import { parser as javascriptParser } from "@lezer/javascript"
import { cppLanguage } from "@codemirror/lang-cpp"
import { LRLanguage, LanguageSupport } from "@codemirror/language"
import { parseMixed } from "@lezer/common"
import { useMemo, useRef, useState } from "react"
import { Button } from "./ui/button"
import { auraInit } from "@uiw/codemirror-theme-aura"
import { GitFork, Save, SquareChevronRight } from "lucide-react"

const jsxWithGlsl = () => {
  const language = LRLanguage.define({
    parser: javascriptParser.configure({
      dialect: "jsx ts",
      wrap: parseMixed((node, input) => {
        if (node.name !== "TemplateString") return null

        const parent = node.node.parent

        if (!parent || parent.name !== "TaggedTemplateExpression") {
          return null
        }

        const tag = parent.getChild("VariableName")
        if (!tag) return null

        const tagName = input.read(tag.from, tag.to)
        if (tagName !== "glsl") return null

        return {
          parser: cppLanguage.parser,
          overlay: [
            {
              from: node.from + 1,
              to: node.to - 1,
            },
          ],
        }
      }),
    }),
    languageData: {
      commentTokens: {
        line: "//",
        block: {
          open: "/*",
          close: "*/",
        },
      },
      closeBrackets: {
        brackets: ["(", "[", "{", "'", '"', "`"],
      },
    },
  })

  return new LanguageSupport(language)
}

interface CodeEditorProps {
  value: string
  onSave?: (value: string) => void
  onCompile: (value: string) => void
  fork: boolean
}

const CodeEditor = ({ value, onSave, onCompile, fork }: CodeEditorProps) => {
  const ref = useRef<ReactCodeMirrorRef>(null)
  const [currentValue, setCurrentValue] = useState<string>(value)

  const isCodeChanged = useMemo(() => {
    return currentValue !== value
  }, [currentValue, value])

  const extensions = useMemo(() => {
    return [
      jsxWithGlsl(),
      keymap.of([
        {
          key: "Mod-s",
          preventDefault: true,
          run: () => {
            if (onSave) {
              onSave(currentValue)
            } else {
              onCompile(currentValue)
            }
            return true
          },
        },
        {
          key: "Alt-s",
          preventDefault: true,
          run: () => {
            onCompile(currentValue)
            return true
          },
        },
      ]),
    ]
  }, [currentValue, onSave, onCompile])

  const theme = useMemo(() => {
    return auraInit({
      settings: {
        fontFamily: "monospace",
        fontSize: "15px",
        background: "transparent",
        gutterBackground: "transparent",
      },
    })
  }, [])

  const onChange = (value: string) => {
    setCurrentValue(value)
  }

  return (
    <>
      {isCodeChanged && (
        <div className="pointer-events-none absolute top-0 z-10 h-full w-full border-5 border-gray-500" />
      )}

      <div className="relative h-full w-full">
        <ReactCodeMirror
          ref={ref}
          value={currentValue}
          onChange={onChange}
          basicSetup={{
            completionKeymap: false,
            autocompletion: false,
          }}
          extensions={extensions}
          style={{
            height: "100%",
            fontSize: "16px",
          }}
          height="100%"
          theme={theme}
        />

        <div className="absolute right-0 bottom-0 z-10 flex flex-col gap-2 p-2 text-sm">
          {onSave && (
            <Button
              onClick={() => onSave(currentValue)}
              title="Save and compile changes (ctrl+s)"
              size="icon"
            >
              {fork ? (
                <>
                  <GitFork />
                </>
              ) : (
                <>
                  <Save />
                </>
              )}
            </Button>
          )}
          <Button
            onClick={() => onCompile(currentValue)}
            className="flex items-center"
            size="icon"
            title={
              onSave
                ? "Compile changes (alt+s)"
                : "Compile changes (alt+s) or (ctrl+s)"
            }
          >
            <SquareChevronRight />
          </Button>
        </div>
      </div>
    </>
  )
}

export default CodeEditor
