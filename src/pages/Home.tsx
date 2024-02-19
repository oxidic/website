import { useDocumentTitle } from "@uidotdev/usehooks";
import highlight from "highlight.js";
import { marked } from "marked";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { README_URL } from "../util";

export default function Home() {
  const [readme, setReadme] = useState("");

  const scroll = () => document.getElementById("readme")?.scrollIntoView({ behavior: "smooth" });

  useDocumentTitle("Oxido");

  useEffect(() => {
    const fetchReadme = async () => {
      const response = await fetch(README_URL);
      const text = await response.text();
      setReadme(
        marked(text, {
          highlight: code => highlight.highlight(code, { language: "rust" }).value,
        }),
      );
    };

    fetchReadme();
  });

  return (
    <main className="scroll-smooth">
      <div className="navbar shadow-2xl">
        <div className="navbar-start mx-2 pl-1">
          <a className="text-lg font-bold text-base-content" href="/">
            Oxido
          </a>
        </div>
        <div className="navbar-end mr-3 flex gap-3">
          <Link to="/play" className="btn-base-content btn btn-primary">
            Playground
          </Link>
          <a href="https://github.com/oxidite/oxido">
            <FaGithub size={32} />
          </a>
        </div>
      </div>
      <div className="hero min-h-screen bg-base-300">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-primary">Oxido</h1>
            <p className="py-6">Dynamic, interpreted programming language written and inspired from Rust.</p>
            <div className="tooltip" data-tip="oxup install">
              <button className="btn-base-content btn" onClick={scroll}>
                Download now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div
        className="prose max-w-none bg-base-300 p-2 prose-h1:my-4 prose-h2:my-4 prose-p:m-1 prose-a:text-primary prose-a:no-underline prose-pre:overflow-x-auto prose-pre:rounded prose-pre:p-3 prose-img:m-1 prose-img:inline"
        dangerouslySetInnerHTML={{ __html: readme }}
        id="readme"
      ></div>
    </main>
  );
}
