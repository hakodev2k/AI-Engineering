# Refusal Boundary Rules

## Scope
Applies to user-visible denials, safety refusals, policy explanations, blocked tool-call messages, and API responses that reveal why a request was denied.

- The system MUST treat every refusal as externally observable security output.
- The model MUST NOT receive non-public endpoint names, hidden parameter names, private feature flags, detector thresholds, secret routing logic, or bypass instructions unless they are strictly required for the task.
- Refusal text MUST NOT reproduce configured sensitive identifiers.
- Refusal text MUST NOT explain a sequence that would materially enable bypassing the control that generated the refusal.
- The product SHOULD explain the user-facing policy category and safe alternatives when doing so does not expose protected implementation detail.
- Enforcement layers SHOULD avoid unnecessarily distinguishable error/status shapes for semantically equivalent denials when normalization is operationally safe.
- A release MUST include multi-turn reconnaissance regression tests, not only single-turn harmful-completion tests.
- A newly discovered leakage pattern MUST be added to deterministic scanning or the adversarial corpus before the issue is considered verified fixed.
- Automated scanners MUST NOT be the sole verifier of ambiguous natural-language leakage.
- A security reviewer other than the implementer MUST verify high-severity fixes.
- Failures MUST NOT be hidden by removing useful safety explanations wholesale; minimize only exploit-relevant internal detail.
- Retry of adversarial probes MUST be bounded to the configured corpus and maximum attempts.
