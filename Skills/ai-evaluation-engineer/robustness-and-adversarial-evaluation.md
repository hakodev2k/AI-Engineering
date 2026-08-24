# Robustness and Adversarial Evaluation

## Purpose
Measure how AI systems behave under perturbations, ambiguity, malformed inputs, distribution shifts, and deliberate attempts to trigger brittle behavior.

## When to use
Use before high-impact releases, after architecture changes, when known prompt brittleness appears, or when production failures cluster around edge cases.

## Inputs
- Baseline evaluation cases
- Threat and failure taxonomy
- Candidate system
- Perturbation rules
- Historical incidents

## Context to inspect
Inspect preprocessing, system prompts, parsers, retrieval, tool schemas, safety layers, and known assumptions about input shape or language.

## Core knowledge
Robust systems should preserve intended behavior under irrelevant transformations while changing behavior when semantics materially change. Adversarial testing should be risk-based, reproducible, and separated from unsafe real-world actions.

## Procedure
1. Identify assumptions that could make the system brittle.
2. Generate controlled paraphrase, formatting, typo, ordering, distractor, and context-length variants.
3. Add semantically meaningful edge cases and contradictory instructions.
4. Test malformed structured inputs and partial context.
5. Add adversarial cases tied to known failure categories.
6. Measure invariance where outputs should remain stable.
7. Measure sensitivity where changed semantics should change behavior.
8. Compare failure rates against the unperturbed baseline.
9. Cluster new failure modes and convert severe ones into regressions.
10. Re-run after mitigations without deleting the original adversarial cases.

## Decision points
Use automated perturbation for broad coverage and expert-authored attacks for high-risk behaviors. Do not count nonsensical perturbations as meaningful robustness failures unless production can generate them.

## Common failure patterns
- Random fuzzing without a risk model
- Conflating harmless wording variation with semantic changes
- Testing only one attack template
- Removing difficult cases after mitigation
- Unsafe testing against live side-effecting systems

## Verification
Verify perturbations preserve or intentionally alter semantics as designed, reproduce failures, and confirm mitigations improve the affected slice without unacceptable regressions elsewhere.

## Expected output
A robustness report with perturbation families, adversarial failures, severity, invariance metrics, and retained regression cases.

## Stop conditions
Stop when testing could cause uncontrolled external side effects, attack scope is not authorized, or perturbation validity cannot be established.