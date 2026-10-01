# Repository Guidelines

## Project Overview

Russian-language teaching materials for a frontend web-development course: Slidev presentations, instructor scripts, and runnable HTML/CSS examples. This is a static educational site, not a backend application. Preserve the teaching progression, audience exercises, and accessibility of examples.

## Architecture & Data Flow

- Each `slides/NN-topic.md` is an independent Slidev entry point. YAML headmatter selects `slidev-theme-tahta`; subsequent frontmatter supplies layout data. Slidev/Vite compiles Markdown and Vue into static presentation SPAs.
- Slide Markdown uses automatically discovered components from `slides/components/`. Click-sequenced demos derive state from `useSlideContext().$clicks` and reserve steps with `VClickGap`; playground controls use local Vue `ref`/`computed` state. There is no application-wide store or dependency-injection layer.
- `MarkdownText.vue` renders through `slides/markdown.ts` with raw HTML disabled. `HighlightedCode.vue` lazily loads Shiki languages/themes and guards against stale asynchronous renders.
- Public examples are standalone browser pages, separate from Vue demos. Lecture 5's generator transforms authored Sass/CSS into local CSS artifacts consumed by its example page.
- Pages publication: `scripts/build-pages.mjs` discovers decks, builds `slides/dist/<slug>/` with `/<repository>/<slug>/` base URLs, and copies README into `slides/dist/index.md`. GitHub Actions renders this through Jekyll into `_site` and deploys it. Root `index.html` is a teaching sample, not the published homepage.

## Key Directories

- `slides/`: presentation source, `components/` for interactive demos, `layouts/` for local layouts, and `styles/` for shared presentation CSS.
- `slides/public/examples/<slug>/`: runnable teaching assets. In `05-css-organization/`, edit `source/`, then regenerate `generated/`; generated CSS is committed and should not be hand-edited.
- `notes/`: long-form instructor scripts, distinct from slide-local presenter notes.
- `scripts/`: Pages assembly and CSS-example generation. `.agents/skills/slidev/` contains Slidev authoring references.

## Development Commands

Run from the repository root:

```bash
npm ci                              # Reproducible dependency install
npm run dev:05                      # Serve/open lecture 5; also dev:01–dev:04
npm run build:05                    # Build one deck; also build:01–build:04
npm run build                       # All decks; delegates to build:all
npm run build:css-examples           # Regenerate lecture 5's CSS artifacts
npx tahta-lint slides/05-css-organization.md
npx slidev export-notes slides/05-css-organization.md --output /tmp/lecture-05-notes.pdf
GITHUB_REPOSITORY=owner/repository npm run build:pages
```

Per-deck `--out dist/<slug>` resolves under the Slidev entry directory, e.g. `slides/dist/05-css-organization/`. The Pages and CSS generators delete/recreate their respective output directories. CSS-example generation is **not** automatically run by the deck build or CI; regenerate after changing its inputs.

## Code Conventions & Common Patterns

- Use zero-padded lecture slugs (`05-css-organization`), PascalCase Vue filenames, and descriptive kebab-case CSS classes. Instructional prose is Russian; identifiers and code retain conventional English names.
- Match nearby formatting: scripts/TypeScript generally use two-space indentation, single quotes, and no semicolons. No formatter configuration is established. Vue uses `<script setup>`, often `lang="ts"`, scoped CSS, typed props, and local reactive state.
- Prefer Tahta frontmatter layouts over ad hoc slide HTML/CSS. Read `node_modules/slidev-theme-tahta/AGENTS.md` and the relevant layout implementation before changing its data shape. For example, `vs` takes `left`/`right` panels; `compare` rows use `metric`, `before`, `after`, and optional `delta`.
- Named slots only work when the selected layout exposes them: local `code-visual.vue` exposes `::visual::`; do not insert `::right::` into arbitrary layouts. Preserve valid `---` boundaries, avoid duplicate headmatter keys, and quote YAML values containing colons or commas.
- HTML comments at slide ends are presenter notes. Layout `notes:` arrays can be visible explanations; they are not interchangeable. Keep deck content, instructor scripts, README links, and numbered npm scripts synchronized when adding or renaming a lecture.
- Reuse theme tokens such as `--fg`, `--accent`, and `--surface-bg`. Shared chrome belongs in `slides/styles/index.css` and `slides/global-bottom.vue`; avoid duplicate footers and preserve `full-area-component` sizing behavior.
- Preserve native controls, labels, keyboard focus, ARIA state, and reduced-motion behavior. For animations, account for Slidev retaining slide instances; clean up timers/frames and use slide enter/leave hooks when activation matters.
- Preserve highlighting's stale-result guard and escaped fallback. Build scripts use top-level ESM `await`, propagate failures, and stop on failed child builds; do not swallow errors or add unnecessary services/stores to deterministic demos.

## Important Files

- `package.json` / `package-lock.json`: command and dependency contracts.
- `slides/markdown.ts`, `slides/components/MarkdownText.vue`, `slides/components/HighlightedCode.vue`: shared text/code rendering.
- `slides/layouts/code-visual.vue`: local code-plus-visual layout using Tahta `SlideFrame` and `takeaway` frontmatter.
- `README.md`: published lecture catalog; links use `./<slug>/`. `.github/workflows/deploy-pages.yml`: authoritative deployment pipeline.

## Runtime/Tooling Preferences

Use **Node.js and npm**; CI uses Node 22 and `npm ci`. The root package does not declare an `engines` range or `packageManager`. Do not replace npm with Bun/pnpm based on generic skill examples; retain the npm lockfile when dependencies change. Playwright Chromium supports Slidev exports, not an established browser-test suite. Reference public assets as `/examples/<slug>/...` following existing decks, and verify resolution under the deployed base path. Do not edit `node_modules` or generated presentation output.

## Testing & QA

No automated test suite, test-runner configuration, coverage threshold, or repository `test`, `lint`, or `typecheck` script exists. Tahta supplies `tahta-lint`; Stylelint examples in lecture content are not repository-wide lint configuration.

For deck/demo changes, lint and build the affected deck, then open its dev presentation and exercise the actual surface: navigation, click reveals, controls, code rendering, iframe/example assets, narrow layouts, and keyboard interaction. For CSS-source changes, regenerate and inspect the standalone example and generated declarations. Build success alone does not prove visual correctness. CI currently builds/deploys on `main` pushes or manual dispatch; it does not run tests or browser QA. Do not claim coverage or test results that were not exercised.

Tahta's linter validates its bundled layout manifest, not locally discovered layouts. It currently reports lecture 4's valid `code-visual` layout as unknown. Report this limitation and verify the local layout through Slidev build/browser checks; do not rewrite valid slides or filter diagnostics just to make the linter pass.
