# Automation Architecture Rules

## Purpose
Define architecture constraints for maintainable browser automation systems.

## Scope
Applies to browser-driven testing, workflow automation, scraping where authorized, and browser-based operational tooling.

## MUST
- Automation MUST separate business intent, browser interaction, test/workflow orchestration, data setup, and assertions or outcome validation.
- Shared browser abstractions MUST expose stable user-level capabilities rather than leaking selector details throughout callers.
- Browser, context, page, session, and fixture lifecycles MUST have explicit ownership and deterministic cleanup.
- Architecture changes that affect concurrency, isolation, authentication, or execution environments MUST document operational and security impact.
- Project-specific conventions MUST be inspected before introducing a new abstraction layer.

## MUST NOT
- Core workflows MUST NOT depend on hidden global mutable browser state.
- Test or workflow logic MUST NOT duplicate low-level interaction sequences across many callers when a stable domain capability exists.
- Automation architecture MUST NOT couple all execution to one environment without a documented constraint.

## SHOULD
- Reusable capabilities SHOULD be composable and independently testable.
- Dependency boundaries SHOULD allow browser engines, execution providers, and test runners to evolve without broad rewrites.

## Exceptions
Exceptions require documented context, rationale, alternatives, risk, and verification evidence. Security or production-impacting deviations require accountable human approval.

## Verification
Review module boundaries, dependency direction, lifecycle ownership, representative workflows, architecture tests where practical, and failure cleanup behavior.