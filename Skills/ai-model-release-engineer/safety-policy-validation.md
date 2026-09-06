# Safety Policy Validation

## Purpose
Verify that a release satisfies defined AI safety and usage-policy requirements across expected and adversarial interactions.

## When to use
Use for model or policy changes that can alter generated behavior, tool use, refusal behavior, or exposure to harmful requests.

## Inputs
Policy requirements, risk taxonomy, red-team cases, safety evaluations, system configuration, and candidate outputs.

## Preconditions
Applicable policies and escalation owners are identified.

## Context to inspect
Inspect system prompts, classifiers, tool permissions, moderation layers, retrieval sources, known bypasses, and prior safety incidents.

## Core knowledge
Safety is defense in depth. A model-level behavior can be weakened or strengthened by surrounding orchestration, tools, retrieval, and policy enforcement. Severity matters more than simple failure counts.

## Procedure
1. Translate applicable policies into testable behaviors.
2. Identify high-severity abuse and misuse scenarios.
3. Test normal, adversarial, multilingual, obfuscated, and multi-turn variants where relevant.
4. Validate tool-use and data-access boundaries.
5. Compare candidate failures with the production baseline.
6. Triage failures by severity and exploitability.
7. Confirm mitigations do not create unacceptable utility regressions.
8. Re-run affected suites after mitigation.
9. Record residual risks, coverage gaps, and required monitoring.

## Decision points
Block on severe exploitable regressions even when aggregate safety improves. Prefer layered controls when model behavior alone is not sufficiently reliable.

## Common failure patterns
Only testing canonical prompts, averaging severe failures with benign cases, ignoring tool-mediated harm, stale policy mappings, and accepting mitigations without regression testing.

## Verification
Reproduce critical cases on the exact release candidate and verify policy enforcement across the deployed stack, not only the base model.

## Expected output
A safety validation record with severity-ranked findings, mitigations, evidence, residual risk, and approval status.

## Stop conditions
Stop and escalate on severe unresolved safety failures, unclear policy interpretation, unauthorized testing scope, or controls requiring specialist approval.
