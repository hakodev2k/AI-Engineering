# Adversarial Evaluation Design

## Purpose
Design evaluations that reveal safety failures under realistic malicious, ambiguous, and edge-case inputs.

## When to use
Use for pre-release safety testing, regression suites, new model versions, tool-enabled agents, and high-risk domains.

## Inputs
Threat model, safety requirements, model/system interface, historical incidents, known attack classes.

## Context to inspect
Prompt layers, retrieval, tools, memory, identity, rate limits, content filters, post-processing, and user-visible behavior.

## Core knowledge
Adversarial evaluation must test the complete system, not only base-model behavior. Coverage should span attack diversity, adaptive attempts, multi-turn behavior, indirect inputs, and control bypasses.

## Procedure
1. Derive test objectives from concrete hazards.
2. Build attack families rather than isolated prompts.
3. Include direct, indirect, multi-turn, encoded, multilingual, and tool-mediated variants when relevant.
4. Define scoring rubrics before running tests.
5. Separate exploratory red teaming from reproducible regression cases.
6. Run against representative configurations.
7. Triage failures by severity and root cause.
8. Add confirmed failures to regression suites.
9. Measure mitigation regressions and utility impact.

## Decision points
Prefer adaptive human testing for novel attack surfaces and automated suites for repeatability and scale.

## Common failure patterns
Benchmark overfitting; prompt-only testing; changing rubrics after seeing outputs; ignoring false positives and utility degradation.

## Verification
Re-run fixed seeds/cases where possible, independently review severe findings, and confirm mitigations on unseen variants.

## Expected output
A reproducible adversarial evaluation suite, scored results, failure taxonomy, and mitigation evidence.

## Stop conditions
Escalate severe exploitable failures, unsafe testing environments, or insufficient authorization for adversarial actions.