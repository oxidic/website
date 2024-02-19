export const DEFAULT_CONTENT = `fn main() {
    println!("Hello, world!");
}
` as const;

export const NOT_IMPLEMENTED_TEXT =
  "This feature is not implemented yet. This will allow you to compile Oxido code to WebAssembly in the future." as const;

export const RELEASES_API = "https://api.github.com/repos/oxidic/oxido/releases" as const;

export const README_URL = "https://raw.githubusercontent.com/oxidic/oxido/main/README.md" as const;

export const PLAYGROUND_DEBOUNCE_MS = 1_000 as const;
