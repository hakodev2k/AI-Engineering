# Repository Case Safety Rules

## MUST

- Run the portability gate after adding, renaming, moving, or regenerating files that can affect paths or imports.
- Treat `path-case-collision`, `directory-case-collision`, and `relative-import-case-mismatch` findings as blocking.
- Preserve the JSON report as evidence when a defect is found.
- Re-run the scanner after every repair; do not infer success from a visually correct diff.
- Run the parent repository's normal build and tests after a casing repair.
- Use Git-aware rename procedures for case-only renames so the index records the intended path.
- Require explicit approval before destructive file deletion, history rewriting, force push, or broad generated-file rewrites.

## MUST NOT

- Mark a task complete while the gate reports `fail`, `invalid`, or `error`.
- Suppress a case collision by adding it to ignored directories unless the directory is genuinely generated/vendor output and repository policy permits exclusion.
- Change import casing without first verifying the canonical tracked path.
- Delete one side of a collision merely because filenames appear duplicated on the current operating system.
- Use `git push --force`, `git reset --hard`, or history rewriting to repair a casing issue unless an explicit human-approved repository process requires it.
- Treat successful local execution on a case-insensitive filesystem as portability evidence.

## SHOULD

- Prefer a two-step temporary Git rename for case-only changes when the host filesystem cannot represent the change directly.
- Keep import spelling identical to the canonical tracked path.
- Run this gate in Linux CI even when developers use Windows or macOS.
- Review unresolved-relative-import warnings when custom bundler aliases or generated modules are involved.