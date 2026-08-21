# Skill: Remediate Selector Risk

## Purpose
Replace or constrain brittle Playwright selectors without weakening test intent or masking a real ambiguity in the UI.

## When to use
Use after the resilience evaluator reports `review-required` or `blocked`, or when a selector is flaky because the DOM rerenders, localization changes text, repeated elements appear, or structural CSS/XPath changes.

## Inputs
- Selector inventory and evaluation.
- Relevant page/component markup and accessibility semantics.
- Existing test intent and assertions.
- Page objects/helpers where selectors are centralized.

## Preconditions
- The intended target behavior is known.
- The UI state producing the selector is reproducible enough to inspect.

## Allowed tools
Repository inspection/editing, Playwright locator reads, project tests, formatting/linting tools.

## Constraints
- Preserve test intent; do not simply weaken assertions.
- Prefer user-facing semantics (`getByRole`, `getByLabel`) when stable and meaningful.
- Use `getByTestId` when the application intentionally exposes a stable test contract.
- Do not add positional selectors merely to make uniqueness pass.
- Do not add arbitrary sleeps to hide rerender timing problems.

## Procedure
1. Read the exact finding and selector id.
2. Reproduce the page state and confirm whether zero, duplicate, invisible, or structural fragility is present.
3. Identify the narrowest stable contract: role+accessible name, label, placeholder, stable test id, or scoped parent/child semantics.
4. If multiple identical controls are valid, scope through a stable semantic container instead of `nth()` where possible.
5. If the UI lacks a stable observable contract, propose the smallest application markup/test-id change; do not invent unstable DOM paths.
6. Update the selector/page object.
7. Run affected Playwright tests.
8. Re-scan and re-probe selectors.
9. Inspect the diff for unintended test weakening.
10. Produce fresh evaluation and review evidence when required.

## Expected output
A selector whose intent, uniqueness and visibility are evidence-backed, plus fresh test and resilience results.

## Verification
- Affected test passes.
- Selector resolves to the intended target in the approved page state.
- Required uniqueness/visibility probe passes.
- New inventory no longer contains the prior blocking finding.
- Diff does not replace meaningful assertions with weaker ones.

## Failure handling
If semantic ambiguity is a product/UI issue, stop and report it rather than selecting an arbitrary element. If a stable contract requires application changes, use the normal implementation/review workflow and obtain approval if the change affects public/accessibility/security behavior.

## Stop conditions
Stop after two remediation cycles without verified improvement, on unresolved ambiguity, or before any approval-required production/security/public-contract action.
