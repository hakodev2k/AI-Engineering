# Workflow: Playwright Selector Resilience Gate

## Trigger
- New/modified Playwright selector.
- UI/component/accessibility/localization refactor.
- Flaky locator timeout/strict-mode violation.
- Pre-release verification where Playwright evidence matters.

## Entry conditions
- Repository revision is identifiable.
- Relevant Playwright tests exist.
- Policy is available.
- Runtime probe target, when required, is approved and safe for read-only navigation.

## Inputs
Repository root/revision, `config/selector-policy.json`, Playwright tests/page objects, affected test command, optional probe URL, implementation owner.

## Context
Start with changed tests and selector helpers. Expand to nearby component markup/accessibility semantics only when the selector intent or ambiguity cannot be proven locally.

## Stages
1. **Scope** — Selector Analyst identifies affected test files and intended targets.
2. **Static inventory** — run:
   `node scripts/scan-playwright-selectors.mjs --repo . --policy config/selector-policy.json --output artifacts/selector-inventory.json`
3. **Validate** — run:
   `node scripts/validate-selector-inventory.mjs --inventory artifacts/selector-inventory.json --output artifacts/selector-validation.json`
4. **Initial evaluate** — run evaluator on inventory.
5. **Runtime probe when required** — against approved non-destructive page state:
   `node scripts/probe-selectors.mjs --inventory artifacts/selector-inventory.json --base-url <url> --output artifacts/selector-inventory.probed.json`
6. **Re-evaluate** — use probed inventory.
7. **Remediate** — replace brittle selectors without weakening test intent; maximum two remediation cycles.
8. **Affected tests** — run repository-native Playwright tests for changed scope.
9. **Independent review** — required for residual `review-required` findings; reviewer must differ from implementation owner.
10. **Final gate** — run `scripts/evaluate-selector-gate.mjs`. Only `verified` supports completion.
11. **Task-specific verification** — retain Playwright test result separately from selector gate evidence.

## Responsible agents
- Selector Analyst: stages 1–8.
- Selector Reviewer: stage 9.
- Workflow owner/verifier: stage 10–11; high-risk implementation agent cannot be sole verifier.

## Produced artifacts
- `artifacts/selector-inventory.json` or `.probed.json`
- `artifacts/selector-validation.json`
- `artifacts/selector-evaluation.json`
- optional `artifacts/selector-review.json`
- `artifacts/selector-gate.json`
- affected Playwright test output/reference

## Checkpoints
- Inventory validation must pass before evaluation.
- Required probe must complete before high-risk selector can be accepted.
- Deterministic blockers must be remediated, not reviewer-overridden.
- Review must match exact revision/fingerprint.
- Final gate must be `verified` before selector resilience is claimed verified.

## Retry rules
- Transient repository read/probe/browser startup failure: maximum 1 retry; preserve first failure.
- Validation/semantic/duplicate/zero-match failures: 0 automatic retries.
- Selector remediation: maximum 2 scan→probe→evaluate cycles.
- Failed affected tests: use project test-fix-retest workflow; do not loop indefinitely here.

## Stop conditions
- Deterministic blocker remains after two remediation cycles.
- Intended target is ambiguous.
- Required runtime evidence cannot be gathered safely.
- Repository revision changes materially after review.
- Permission/environment failure requires elevation.
- Approval-required action is reached without explicit human approval.

## Approval points
Stop before production deployment, breaking public/API/accessibility contracts, security-control weakening, force push/history rewrite, production configuration or other policy-defined dangerous actions.

## Failure paths
- **Zero match**: confirm intended UI state; repair selector/fixture rather than extending waits blindly.
- **Duplicate match**: scope using stable semantics; do not default to positional selection.
- **Probe failure**: one transient retry; then block with evidence.
- **Flaky rerender**: use Playwright locator/actionability semantics and stable target contract; avoid arbitrary sleeps.
- **Localization conflict**: prefer role/label/test-id contracts appropriate to product intent.
- **Stale review**: regenerate inventory/evaluation and obtain new review.

## Definition of Done
- Current revision inventoried.
- Inventory validates.
- Required runtime probes are current and safe.
- No deterministic blockers remain.
- Required independent review is approved and fingerprint-bound.
- Affected Playwright tests pass.
- Final selector gate returns `verified`.
- Remaining risks are explicit and non-blocking.
- No dangerous action or permission boundary was bypassed.
