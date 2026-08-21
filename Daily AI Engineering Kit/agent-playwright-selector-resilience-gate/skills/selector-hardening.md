# Selector Hardening Skill

## Purpose
Replace brittle Playwright locators with stable, user-facing or explicitly supported locators without masking product defects.

## When to use
Use when adding or changing Playwright tests, after locator failures, during UI refactors, or when AI-generated tests contain CSS/XPath tied to DOM structure.

## Inputs
Failing test path, target behavior, rendered page evidence, accessibility tree/roles, existing test conventions, and repository policy.

## Preconditions
The expected user behavior is known; the test environment is reproducible; the agent can inspect page/test source but cannot alter production behavior merely to satisfy the test without evidence.

## Allowed tools
Repository search, Playwright trace/screenshot/DOM inspection, test runner, static selector gate.

## Constraints
- Prefer `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`, `getByAltText`, or `getByTitle` when semantically correct.
- Do not introduce generated CSS chains, `nth-child`, XPath, or positional `.nth()` merely to make a failure disappear.
- A locator must identify the intended element under realistic page states, not only the captured DOM.
- Test IDs may be introduced only when user-facing semantics are insufficient and repository conventions permit them.

## Process
1. Reproduce the locator failure once and preserve trace/screenshot/error evidence.
2. Identify the intended interaction from acceptance criteria and nearby tests.
3. Inspect the accessible role/name and stable attributes of the target.
4. Search for existing page objects/helpers before creating new abstractions.
5. Draft the narrowest semantic locator.
6. If multiple elements match, improve semantic scope with container roles/names before using position.
7. Run `python scripts/scan_selectors.py --root . --policy config/policy.yaml`.
8. Run the affected test at least twice in the same environment.
9. If the change touches shared locators/page objects, run directly dependent tests.
10. Inspect the diff for unrelated product-code or timeout changes.
11. Record remaining environmental or product risks.

## Expected output
Changed test/locator paths, original failure evidence, locator rationale, gate result, test results, unresolved risks.

## Verification
Static gate has no blocking finding; target test passes repeatedly; the locator maps to the intended UI semantics; no unrelated timeout/retry inflation was added.

## Failure handling
If the element lacks stable semantics, stop and recommend a narrowly scoped product/test-id change with rationale. If behavior itself is broken, classify it as a product defect instead of hardening the test around the defect.

## Stop conditions
Unknown expected behavior, inaccessible target with no approved stable attribute, two failed locator revisions, or a required product/API contract change without approval.
