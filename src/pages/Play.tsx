import { useEffect, useState } from "react"
import ControlledEditor, { useMonaco } from "@monaco-editor/react"

import { DEFAULT_CONTENT, NOT_IMPLEMENTED_TEXT, pinkCandyDark } from "../util"
import Releases from "../components/Releases"

export default function Play() {
  const [content, setContent] = useState<string>(DEFAULT_CONTENT)
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)
  const monaco = useMonaco()

  useEffect(() => {
    if (!monaco) return

    monaco.editor.defineTheme("pink-candy-dark", pinkCandyDark)
    setIsThemeLoaded(true)
  }, [monaco])

  const handleEditorChange = (value?: string) => {
    console.log(value)
    setContent(value ?? DEFAULT_CONTENT)
  }

  const handleRun = () => {
    alert([NOT_IMPLEMENTED_TEXT, content].join("\n\n"))
  }

  return (
    <>
      <nav className="flex h-8 w-screen items-center">
        <Releases />
        <button className="min-w-max bg-[#2b2a33] px-4 py-2 font-semibold" onClick={handleRun}>
          Run
        </button>
      </nav>
      <ControlledEditor
        height="95vh"
        language="rust"
        onChange={handleEditorChange}
        theme={isThemeLoaded ? "pink-candy-dark" : "vs-dark"}
        value={content}
        width="100vw"
      />
    </>
  )
}
