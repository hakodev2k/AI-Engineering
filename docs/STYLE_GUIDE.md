# Documentation Style Guide

This guide keeps repository documentation consistent, reviewable, and useful to both people and AI-assisted workflows.

Use this guide for writing conventions and the [content quality standard](CONTENT_QUALITY.md) for readiness, overlap, verification, lifecycle, and deprecation decisions.

## Language and tone

- Write repository content in English for consistency with existing packages.
- Use direct, specific language and define uncommon terms.
- Separate facts, assumptions, interpretation, recommendations, and requirements.
- Avoid unsupported claims such as “safe,” “production-ready,” or “fully verified.”
- Use `MUST`, `SHOULD`, and `MAY` only when their strength is intentional and consistent.

## Structure

Every standalone document should have exactly one descriptive H1. Use a short introduction before detailed sections. For executable packages, document:

1. purpose and intended use;
2. prerequisites and dependencies;
3. installation or setup;
4. configuration and secret handling;
5. commands and expected outputs;
6. tests and verification;
7. permissions and approval boundaries;
8. limitations, failure behavior, and stop conditions.

Guidance-only packages should say explicitly that they have no install or run step.

## Standalone adoption contract

Developers may copy content without the parent collection. Write every role, kit, guard, and connector as a self-contained child package:

- use its `README.md` as the entry point;
- keep required schemas, examples, templates, configuration, tests, and scripts inside the package;
- declare third-party dependencies inside the package or provide exact package-local install commands;
- avoid required relative links to a parent collection or sibling package;
- state whether referenced content is required or optional;
- make commands runnable from a clearly named working directory;
- provide a harmless verification path when executable assets exist.

Rules and skills should retain enough purpose, inputs, constraints, procedure, verification, and escalation context to be useful when their individual Markdown file is copied alone.

## Links and navigation

- Use relative links for repository files.
- Link to an authoritative page instead of copying large sections.
- Use descriptive link text rather than “click here.”
- Update the nearest index when adding, moving, or renaming a document.
- Verify anchors and paths with `npm run audit`.

## Commands and examples

- Add a language identifier to fenced code blocks.
- State the directory from which a command should run.
- Use placeholders that cannot be mistaken for live credentials.
- Explain meaningful exit codes and side effects.
- Keep destructive, privileged, production, and externally visible commands out of copy-paste quick starts.
- Mark illustrative output as an example rather than a guaranteed result.

## Security and privacy

Never include real tokens, secrets, personal data, customer data, internal URLs, or proprietary prompts. Sanitize logs and screenshots. Use provider documentation for permission and authentication claims, and state the date or version when behavior is time-sensitive.

## Formatting

- Prefer short paragraphs and lists that improve scanning.
- Use tables for comparisons, not for long prose.
- Keep filenames lowercase with hyphens unless an established convention requires otherwise.
- Use UTF-8 and a final newline.
- Preserve intentional Markdown hard breaks; otherwise avoid trailing whitespace.

## Review checklist

- [ ] The title and purpose are clear.
- [ ] Commands, paths, and links are valid.
- [ ] Requirements and examples are distinguishable.
- [ ] Security and approval boundaries are explicit.
- [ ] Claims have evidence or are qualified appropriately.
- [ ] Related navigation and changelog entries are updated.
