# Skill: Implement Redaction

## Purpose
Implement the smallest control that prevents sensitive values from reaching observability sinks while preserving useful diagnostics.

## Process
1. Prefer eliminating unnecessary logging over masking it.
2. Redact at a shared boundary when multiple sinks consume the same payload.
3. Use allowlisted safe fields instead of denylisting entire rich objects when practical.
4. Preserve stable non-sensitive correlation identifiers only when policy permits.
5. Never partially mask credentials or bearer tokens; replace them completely.
6. Add regression tests for raw and structured logging paths.
7. Run deterministic scanner against generated sample output.
8. Run host build/tests/static analysis.
9. Inspect the diff for new logging surfaces or policy bypasses.
10. Allow at most two fix/retest cycles before escalation.

## Expected output
Minimal code/config changes, tests, redaction evidence, unresolved risks.

## Verification
Tests must prove forbidden raw values are absent and expected diagnostic structure remains usable.

## Stop conditions
Required change weakens security, needs production configuration, changes secrets, or intentionally exposes sensitive data without explicit approval.