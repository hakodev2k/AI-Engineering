# Skill: Discover Selector Risk

## Purpose
Inventory Playwright selectors, identify structurally fragile selectors, and determine which selectors require runtime uniqueness/visibility evidence before they can support a verification claim.

## When to use
Use when adding or modifying Playwright tests, after UI refactors, after flaky locator failures, after localization changes, or before relying on newly generated selectors in CI/release evidence.

## Inputs
- Repository root.
- Current repository revision.
- `config/selector-policy.json`.
- Playwright test files.
- Optional test/staging URL for runtime probing.

## Preconditions
- Repository state to be assessed is stable enough to identify a revision.
- Test files are readable.
- Runtime probing, when used, is read-only and points to an approved non-destructive environment.

## Required context
Inspect only relevant test files and nearby page objects/helpers. Expand context when a finding cannot be interpreted from the selector expression alone.

## Allowed tools
- Read-only repository/Git inspection.
- Node.js standard library.
- Playwright browser navigation and locator read operations for runtime probing.

## Constraints
- Do not click, fill, submit, delete, or mutate application state during selector probing.
- Do not treat test execution success as selector resilience evidence.
- Do not infer uniqueness from a selector's appearance.

## Procedure
1. Capture the repository revision.
2. Run `scripts/scan-playwright-selectors.mjs` to produce an inventory.
3. Run `scripts/validate-selector-inventory.mjs`.
4. Inspect high/critical selectors and their evidence reasons.
5. If policy requires dynamic evidence, run `scripts/probe-selectors.mjs` against an approved page state.
6. Re-run `scripts/evaluate-selector-resilience.mjs` using the probed inventory.
7. Separate facts (match count, visibility, selector kind) from hypotheses (why the selector may have become brittle).
8. Hand high-risk unresolved findings to `skills/remediate-selector-risk.md`.

## Expected output
- Valid selector inventory.
- Deterministic evaluation.
- Concrete findings with file, line, selector id, risk and evidence.

## Verification
The inventory revision must match the repository state under review. Runtime evidence must come from the page state intended for that selector and must not be reused after material UI changes without re-probing.

## Failure handling
- Scanner/read failure: retry once only if clearly transient.
- Invalid inventory: no automatic retry; fix the producing input/script/config.
- Runtime navigation/tool failure: retry at most once, preserve the first error.
- Permission/environment failure: stop; do not increase permissions.

## Stop conditions
Stop when deterministic evaluation is `blocked`, when required runtime evidence cannot be obtained safely, when repository revision changes materially, or when the selector cannot be connected to an intended user-observable target.
