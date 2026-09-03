# Research to Production Handoff

## Purpose
Transfer a validated AI research result into engineering without losing the assumptions, evidence, constraints, and failure modes that made the result valid. This skill prevents production teams from receiving an impressive checkpoint or notebook without the operational knowledge required to reproduce and safely use it.

## When to use
Use when a research method is selected for productization, platform integration, inference optimization, continued model training, or ownership transfer to an engineering team.

## Inputs
- Validated research artifacts
- Code and resolved experiment configs
- Checkpoints and data references
- Evaluation suite and raw results
- Known limitations and failure analysis
- Target production requirements
- Latency, cost, reliability, privacy, and safety constraints

## Preconditions
The research result must have a clear supported claim and a reproducible reference implementation. Do not hand off unresolved exploratory results as production-ready technology.

## Context to inspect
Inspect target system architecture, interface contracts, deployment environment, model format, inference runtime, throughput/latency budget, scaling assumptions, safety controls, data dependencies, licensing, observability, rollback needs, and engineering ownership.

## Core knowledge
Research and production optimize different dimensions. A method can win offline while failing because it requires unavailable data, unstable kernels, excessive memory, hidden preprocessing, nondeterministic tool access, or unacceptable latency. Productionization should preserve a reference path and acceptance suite so optimizations can be proven equivalent rather than assumed.

## Procedure
1. State the validated research claim and evidence boundaries.
2. Identify the exact reference checkpoint, code revision, data revision, and configuration.
3. Package a minimal reproducible inference or training path.
4. Document preprocessing, tokenization, feature, retrieval, or tool dependencies.
5. Define functional acceptance metrics and allowable tolerance from the reference.
6. Define nonfunctional budgets for latency, throughput, memory, cost, availability, and startup where relevant.
7. Transfer the evaluation suite and representative regression set.
8. Document known failure modes, unsupported populations, and safety limits.
9. Identify components that may be optimized and components whose semantics must remain fixed.
10. Define compatibility requirements for model formats, checkpoints, and APIs.
11. Specify observability needed to detect quality and operational regressions.
12. Define rollout, canary, fallback, and rollback expectations with the receiving team.
13. Run the reference implementation in an environment representative of production.
14. Compare the first productionized implementation against the reference on quality and systems metrics.
15. Record ownership for unresolved technical debt, data dependencies, and model updates.
16. Capture changes that invalidate or require rerunning the research evidence.

## Decision points
- Keep a slower reference implementation when it is valuable for equivalence testing.
- Retrain only when production constraints cannot be met through semantics-preserving optimization.
- Reject productization when the method depends on data, licenses, hardware, or permissions unavailable in production.
- Use staged rollout when online behavior may differ materially from offline evaluation.

## Common failure patterns
- Handing off only a checkpoint.
- Omitting preprocessing or tokenizer versions.
- Letting inference optimization silently change model semantics.
- Assuming offline benchmark gains guarantee user value.
- Failing to transfer hard negative and failure-case tests.
- No rollback path for a model update.
- No owner for recurring data, retraining, or evaluation dependencies.
- Production team reconstructing undocumented prompts or decoding settings.

## Verification
Handoff is implemented when engineering can build and run the reference path. It is verified when an independent production-oriented implementation meets predefined quality tolerances and nonfunctional budgets, regression suites pass, known limitations are preserved, observability exists, and receiving owners accept ongoing responsibilities.

## Expected output
A handoff package containing reference artifacts, acceptance criteria, dependencies, regression evaluations, performance budgets, known limitations, optimization boundaries, rollout/rollback expectations, and ownership map.

## Stop conditions
Stop and escalate when the research result is not reproducible, production cannot legally or operationally satisfy required dependencies, quality falls outside agreed tolerance, safety controls are missing, or no team owns critical ongoing maintenance.