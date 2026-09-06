# Model Change and Regression Research

## Purpose
Determine whether a model, prompt, retrieval, policy, or orchestration change alters user experience, workflow performance, mental models, or risk in ways offline evaluations alone may miss.

## When to use
Use before or after model migrations, major prompt changes, tool additions, retrieval changes, safety-policy changes, or material inference configuration changes.

## Inputs
Old and new system versions, release notes, offline evaluations, target tasks, user segments, known failure cases, and product metrics.

## Context to inspect
Inspect model IDs, system prompts, tools, retrieval sources, latency, token limits, output formatting, safety behavior, cost constraints, and prior user-research baselines.

## Core knowledge
A technically better model can worsen interaction through verbosity, latency, changed refusal behavior, different initiative, unstable formatting, or altered error patterns. Regression evaluation should preserve realistic tasks and compare joint outcomes.

## Procedure
1. Inventory material changes between versions.
2. Identify user behaviors and workflows likely to be sensitive to those changes.
3. Select representative tasks and previously observed failure cases.
4. Define primary human-centered metrics and qualitative checks.
5. Compare versions under controlled conditions where possible.
6. Include repeated trials for stochastic behaviors that affect conclusions.
7. Examine changes in prompting effort, verification, trust, recovery, and task success.
8. Segment regressions by task and user expertise.
9. Review telemetry after staged deployment for unanticipated shifts.
10. Decide whether to ship, mitigate, stage, or roll back based on impact and uncertainty.

## Decision points
Use controlled comparative studies for attributable differences; staged production observation for ecological effects; targeted qualitative sessions when behavior changes are hard to explain.

## Common failure patterns
Relying only on benchmark gains, mixing versions unknowingly, ignoring latency and refusal changes, testing only canonical prompts, and accepting aggregate improvement despite severe workflow regressions.

## Verification
Confirm the tested configuration matches deployment and that critical regressions have explicit acceptance, mitigation, or rollback decisions.

## Expected output
A human-centered regression report with version differences, affected workflows, evidence, severity, uncertainty, and release recommendation.

## Stop conditions
Stop when versions cannot be reliably identified, deployment configuration differs materially from the test system, or a severe unmitigated regression crosses an established launch boundary.