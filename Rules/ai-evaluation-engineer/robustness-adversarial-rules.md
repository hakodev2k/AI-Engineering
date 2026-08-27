# Robustness and Adversarial Evaluation Rules

## Purpose
Measure whether AI systems preserve required behavior under perturbation, ambiguity, and adversarial pressure.

## Scope
Applies to malformed inputs, prompt injection, jailbreaks, distribution shift, tool misuse, noisy context, multilingual variation, and other stress conditions.

## MUST
- Robustness tests MUST target realistic failure mechanisms derived from architecture and threat analysis.
- Adversarial suites MUST distinguish harmless challenge cases from security- or safety-critical attacks.
- Equivalent semantic inputs with superficial perturbations MUST be tested when invariance is an expected property.
- Failures involving unauthorized tool use, instruction hierarchy violations, or policy bypass MUST be severity-classified and triaged.
- Robustness claims MUST specify the tested perturbation range and MUST NOT imply untested generalization.

## MUST NOT
- MUST NOT rely exclusively on static attack prompts when the threat can adapt to defenses.
- MUST NOT expose sensitive internal prompts, secrets, or restricted attack artifacts unnecessarily in shared evaluation outputs.
- MUST NOT mark adversarial failures as irrelevant solely because they are uncommon if impact is severe.

## SHOULD
- Suites SHOULD evolve from production incidents and newly discovered attack patterns.
- Multi-turn and stateful adversarial testing SHOULD be used when system behavior depends on conversation or tool history.

## Exceptions
Narrow deterministic systems may use smaller adversarial scope when attack surfaces are demonstrably constrained.

## Verification
Inspect threat coverage, perturbation generators, severity labels, reproduction steps, secret-handling controls, and regression tests for previously discovered failures.