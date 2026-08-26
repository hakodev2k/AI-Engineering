# Prompt Debugging

## Purpose
Diagnose prompt failures systematically and identify whether the root cause is instructions, context, model capability, tooling, data, or runtime configuration.

## When to use
Use for regressions, inconsistent outputs, unexplained refusals, hallucinations, format failures, and production incidents.

## Inputs
Failing input/output, exact prompt/messages, model/version, parameters, tool traces, retrieved context, and expected behavior.

## Context to inspect
Reconstruct the exact runtime request. Compare successful and failing cases and inspect recent changes.

## Core knowledge
A visible output is downstream of multiple interacting components. Prompt edits made before isolating the failing layer create accidental regressions.

## Procedure
1. Reproduce the failure with the exact request.
2. Classify the failure against the prompt contract.
3. Diff prompt, model, parameters, context, tools, and runtime.
4. Reduce the case to the smallest reproducer.
5. Test hypotheses one variable at a time.
6. Determine whether evidence was absent, contradictory, or ignored.
7. Check schema/tool errors separately from language behavior.
8. Apply the smallest fix at the correct layer.
9. Add the case to regression tests.
10. Re-run broad evals before release.

## Decision points
Fix retrieval when evidence is missing; prompt when instructions are ambiguous; deterministic code when invariants can be enforced externally; model choice when capability is insufficient.

## Common failure patterns
Blind wording tweaks; debugging from screenshots rather than exact payloads; changing temperature and prompt together; fixing one example with an over-specific rule; ignoring model-version changes.

## Verification
The minimal reproducer passes, adjacent cases remain correct, full evals do not regress, and production telemetry can detect recurrence.

## Expected output
Root-cause statement, minimal fix, regression case, and verification evidence.

## Stop conditions
Stop when the exact request cannot be reconstructed, the issue requires restricted production data, or evidence indicates a provider/runtime defect requiring escalation.