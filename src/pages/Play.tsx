import ControlledEditor, { useMonaco } from "@monaco-editor/react";
import { useDebounce, useDocumentTitle, useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

import { DEFAULT_CONTENT, NOT_IMPLEMENTED_TEXT, PLAYGROUND_DEBOUNCE_MS, pinkCandyDark } from "../util";
import Releases from "../components/Releases";

export default function Play() {
  const [playgroundHistory, setPlaygroundHistory] = useLocalStorage<string>("playgroundHistory", DEFAULT_CONTENT);
  const [content, setContent] = useState(playgroundHistory);
  const debouncedContent = useDebounce(content, PLAYGROUND_DEBOUNCE_MS);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const monaco = useMonaco();

  useDocumentTitle("Oxido | Playground");

  useEffect(() => {
    if (!monaco) return;

    monaco.editor.defineTheme("pink-candy-dark", pinkCandyDark);
    setIsThemeLoaded(true);
  }, [monaco]);

  setPlaygroundHistory(debouncedContent);

  const handleRun = () => {
    alert([NOT_IMPLEMENTED_TEXT, content].join("\n\n"));
  };

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
        onChange={value => setContent(value ?? playgroundHistory)}
        theme={isThemeLoaded ? "pink-candy-dark" : "vs-dark"}
        value={content}
        width="100vw"
      />
    </>
  );
}
