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
- `compare` requires object rows, not positional arrays; arrays produce empty cells even when lint passes. Without `delta`, use three column headings matching `metric`, `before`, and `after`.
- Named slots only work when the selected layout exposes them: local `code-visual.vue` exposes `::visual::`; do not insert `::right::` into arbitrary layouts. Preserve valid `---` boundaries, avoid duplicate headmatter keys, and quote YAML values containing colons or commas.
- HTML comments at slide ends are presenter notes. Layout `notes:` arrays can be visible explanations; they are not interchangeable. Keep deck content, instructor scripts, and numbered npm scripts synchronized when adding or renaming a lecture.
- `README.md` MUST NOT be modified under any circumstances except to add a link to a new presentation. Limit that exception to the smallest change needed to add the link; do not update lecture descriptions, formatting, or any other content.
- Reuse theme tokens such as `--fg`, `--accent`, and `--surface-bg`. Shared chrome belongs in `slides/styles/index.css` and `slides/global-bottom.vue`; avoid duplicate footers and preserve `full-area-component` sizing behavior.
- Full-slide interactive demos on `default` need `class="full-area-component"` so Tahta's Fit does not shrink them. Give iframe previews a sized, positioned stage and fill that stage; do not rely on an unresolved chain of percentage heights.
- Preserve native controls, labels, keyboard focus, ARIA state, and reduced-motion behavior. For animations, account for Slidev retaining slide instances; clean up timers/frames and use slide enter/leave hooks when activation matters.
- Preserve highlighting's stale-result guard and escaped fallback. Build scripts use top-level ESM `await`, propagate failures, and stop on failed child builds; do not swallow errors or add unnecessary services/stores to deterministic demos.
- Lecture 5's Tailwind input explicitly scans both the standalone HTML and `CssFrameworkCompareDemo.vue`. Keep native disabled styling in authored Sass/utility classes, restrict hover to enabled buttons, and regenerate artifacts with `npm run build:css-examples`; never patch generated CSS.

## Presentation & Speaker-Note Style

Use `slides/04-modern-css.md` and `slides/05-css-organization.md` as the reference for new lectures and substantial revisions. Match their teaching approach, not a fixed slide count or an identical sequence of layouts.

### Narrative & Scope

- Write teaching material in natural Russian for students learning frontend development. Keep API names and code identifiers intact; introduce terminology through a concrete problem before relying on it.
- Build a connected argument: prior knowledge → observable problem → explanation of the mechanism → choice of solution → demonstration → student application → takeaway and the next lecture. Do not turn the lecture into a catalog of properties, tools, or fashionable approaches.
- Continue the Frontend Meetup example where it fits: the same event card, schedule, registration area, and actions expose different problems. Change one relevant condition at a time so students can explain the result rather than memorize a screenshot.
- Plan a 90-minute main route including demonstrations, audience discussion, exercises, and questions. Label appendices explicitly as outside the main 90 minutes; they are optional reference material, not required prerequisites hidden after the closing slide.
- Lecture 05 currently uses lecturer-led demonstrations and prediction/discussion questions, with no student exercises in either the main route or appendices. Preserve that format when revising its slides and speaker notes.
- Teach decisions and their boundaries. Separate mechanism from condition, CSS from HTML/JavaScript behavior, source from build artifact, and browser rules from team conventions. State when a solution applies and what it does not solve; avoid universal claims such as “the last rule always wins” or “a framework provides accessibility automatically.”

### Visible Slides

- Give each slide one main idea. Prefer a short explanatory title or a focused diagnostic question over a bare topic label: “CSS управляет рамкой, но не выбирает загружаемый файл” communicates more than “Изображения”. Use the kicker for the topic or place in the narrative.
- Keep the screen compact: a claim, a small code example, a meaningful comparison, a diagram, or a demonstration. Put the fuller explanation in speaker notes, not paragraphs of text competing with the example.
- Preserve the established light Tahta `soft` visual direction, shared frame/footer, restrained emphasis, and readable code. Use `<em>` or `accent2` selectively to emphasize the conceptual distinction; do not invent per-lecture chrome or decorative styling.
- Choose layouts by content shape and vary them with purpose: `statement` for a thesis, `steps` for an algorithm, `reference` for a diagnostic checklist, `compare`/`vs` for a distinction, `code-explain` for a mechanism, and local `code-visual` when a rendered result must sit beside code.
- Keep code minimal but sufficient to explain the actual behavior. Reuse the example's selectors and names. Show the relevant relationship, condition, or change, not unrelated setup or a whole application.
- Use interactive components, isolated browser examples, and progressive reveals when they support observation or prediction. Ask students to predict the outcome, change a named condition, observe the real result, and explain its cause. Do not substitute a hardcoded winner label for browser behavior.
- Give exercises a bounded task, a time allocation, and an observable success criterion. Ask for the reason behind the result, not only a particular color, class name, or visual match. Preserve content, native interaction, keyboard focus, and accessibility when demonstrating changes.

### Speaker Notes

- Store slide-local speaker notes in the end-of-slide HTML comment. Frontmatter `notes:` in layouts such as `code-explain` is visible slide content, not a substitute for the spoken explanation. Keep a separate `notes/` instructor script consistent where one exists.
- Write notes as usable spoken Russian: connected, conversational paragraphs, concrete examples, and questions to the audience. They must help the lecturer explain the slide, not merely repeat its heading and bullets or list “рассказать про…” reminders.
- For substantive slides, explain the problem, why the shown mechanism produces the result, a relevant limitation or likely misconception, and the connection to the next idea. Use these as coverage criteria, not mandatory repeated subheadings or a rigid template on every slide.
- Ground the explanation in the code or visual currently on screen. Name the actual selector, declaration, component, or artifact and walk through its effect. Qualify shortcuts and exceptions; distinguish what the demo proves from what remains outside its scope.
- For demonstrations, name the real controls and their order, the initial state, the audience prediction, the expected visible change, and the causal explanation. Include the observation to discuss afterward; “показать демо” alone is not enough.
- For exercises, specify what students change, how they work, the allotted time, what a plausible answer looks like, and how to check it. Include a short debrief that connects the result back to the lecture's principle.
- Use brief presenter cues in brackets when useful, but keep them separate from spoken prose. Opening notes recall the previous lecture and pose the new problem; closing notes consolidate the decision model and bridge to the next lecture.
- Scale detail to the slide's role: explanations and demonstrations need more support than a section divider or closing question. Do not pad notes to a word quota, repeat boilerplate transitions, or introduce a second curriculum in the notes. Appendix notes must preserve their optional status.

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
