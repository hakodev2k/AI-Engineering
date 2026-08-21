# Playwright Resilience Rules

## MUST
- Reproduce or inspect concrete failure evidence before changing a failing locator.
- Prefer semantic/user-facing locators over DOM-structure selectors.
- Run the selector gate after locator/test edits.
- Run the affected test at least twice after a resilience fix.
- Preserve meaningful assertions after interactions.
- Separate product defects from test defects.
- Require explicit approval before changing public UI/API contracts, production config, security controls, or shared behavior solely to satisfy tests.

## MUST NOT
- Use `nth-child`, `nth-of-type`, XPath, or generated CSS chains to bypass ambiguity.
- Add `waitForTimeout` or arbitrary sleeps as a synchronization fix.
- Increase retries/timeouts solely to hide a deterministic failure.
- Replace a precise assertion with a weaker one just to obtain a pass.
- Use `.first()`, `.last()`, or `.nth()` without documented evidence that positional identity is a product invariant.
- Catch and ignore Playwright errors.
- Modify unrelated production code during a selector-only repair.
- Claim success from one green run when the task concerns flakiness/resilience.

## SHOULD
- Scope locators through stable semantic containers.
- Prefer web-first Playwright assertions over manual polling.
- Reuse existing page-object/helpers when they encode stable semantics.
- Introduce test IDs only when semantic locators are insufficient and project conventions support them.
- Keep trace/screenshot evidence for unresolved failures without committing sensitive artifacts by default.
