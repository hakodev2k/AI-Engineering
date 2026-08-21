# Selector Resilience Governance

## MUST
- Bind selector inventory and review to the exact repository revision under assessment.
- Preserve selector intent and the assertion semantics of the test being changed.
- Prefer stable user-observable semantics or an intentional test-id contract over DOM position.
- Re-run deterministic scan/evaluation after selector edits.
- Obtain runtime uniqueness/visibility evidence for policy-defined high/critical selectors before using them as release-quality verification evidence.
- Treat zero matches, duplicate matches beyond policy, probe failures, and deterministic blockers as unresolved evidence.
- Require an independent reviewer for high/critical selector risk where policy requires it.
- Re-review after the inventory fingerprint or repository revision changes.
- Keep retries bounded: one retry for transient probe/tool failures, zero automatic retries for validation/security/semantic failures.
- Stop before production deployment, breaking public contracts, security weakening, force-push, or production configuration changes until explicit human approval exists.

## MUST NOT
- Use `nth()`, `nth-child`, `nth-of-type`, long descendant chains, or indexed XPath as a default fix for ambiguity.
- Add sleeps/timeouts merely to conceal rerender or locator instability.
- Approve a deterministic blocker through reviewer judgment alone.
- Treat a green test suite as proof that selectors are unique or resilient.
- Treat text selectors as universally stable when localization/content changes are expected.
- Silence selector findings by lowering policy thresholds in the same change without separate review.
- Let the implementation owner be the sole reviewer for policy-defined high/critical findings.
- Perform mutating browser actions in the runtime probe.
- Increase permissions to obtain probe access.
- expose secrets, credentials, tokens, cookies, private payloads, or sensitive DOM content in inventory/review artifacts.

## SHOULD
- Centralize repeated selectors in page objects/components when that improves ownership without hiding intent.
- Prefer role plus accessible name for interactive elements when accessibility semantics are correct.
- Use stable test ids for application-specific widgets whose accessible/text contract is intentionally variable.
- Scope repeated elements through stable semantic containers before considering positional fallback.
- Keep selector policy project-specific but versioned and reviewed.
- Preserve failed probe output and affected test evidence for debugging.
- Re-probe after meaningful DOM/accessibility/localization changes.
