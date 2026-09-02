# Debugging and Root Cause Rules

## Purpose
Drive production investigation from evidence and prevent speculative fixes from creating secondary failures.

## Scope
Applies to incident diagnosis, performance investigation, intermittent failures, regressions, and recurring production defects.

## MUST
- Investigations MUST separate observed facts, hypotheses, tests, and conclusions.
- A suspected root cause MUST be supported by evidence that explains the observed failure and relevant timing or state.
- Broad corrective changes MUST NOT be made before the failure mechanism is identified or bounded sufficiently to assess risk.
- Fix verification MUST demonstrate both symptom resolution and absence of known critical regressions.

## MUST NOT
- MUST NOT treat correlation as causation without validating the mechanism.
- MUST NOT delete or overwrite diagnostic evidence unnecessarily during investigation.
- MUST NOT silence alerts or exceptions as a substitute for resolving the underlying failure.

## SHOULD
- Prefer minimally invasive experiments that can falsify competing hypotheses.
- Preserve representative failure artifacts for regression testing when safe.

## Exceptions
Emergency mitigation may precede root-cause confirmation when user or data harm is active, but the action and uncertainty MUST be recorded and investigation continued afterward.

## Verification
Review incident timelines, telemetry, hypotheses, reproduction steps, diagnostic artifacts, fix tests, and post-fix production evidence.
