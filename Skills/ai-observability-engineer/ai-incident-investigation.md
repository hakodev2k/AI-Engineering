# AI Incident Investigation

## Purpose
Provide a repeatable evidence-driven method for diagnosing production incidents in AI applications.

## When to use
Use during elevated errors, latency, quality complaints, cost spikes, agent failures, or provider incidents.

## Inputs
Incident symptoms, timeline, dashboards, traces, logs, deployments, configuration changes, provider status, and evaluation evidence.

## Context to inspect
Inspect recent code/config/model/index changes, traffic shifts, quotas, retries, routing, dependencies, and telemetry health itself.

## Core knowledge
AI incidents can originate in conventional infrastructure, providers, prompts/configuration, retrieval data, model behavior, tools, or telemetry. Correlation is not causation; responders should preserve evidence and test competing hypotheses.

## Procedure
1. Define user impact, affected cohorts, and start time.
2. Check telemetry pipeline health before trusting absence of signals.
3. Compare healthy and affected cohorts by model, provider, region, route, config, and index version.
4. Inspect representative traces from both cohorts.
5. Review changes around the onset time.
6. Separate operational failures from semantic-quality failures.
7. Quantify retries, fallbacks, queueing, token changes, and cost amplification.
8. Form ranked hypotheses and seek disconfirming evidence.
9. Apply the lowest-risk mitigation and measure impact.
10. Preserve a timeline and evidence for post-incident review.

## Decision points
Rollback when a recent reversible change strongly correlates with impact. Fail over only when compatibility and policy are proven. Prefer containment over speculative optimization during active incidents.

## Common failure patterns
Blaming the model first, changing multiple variables, relying on screenshots rather than queryable evidence, ignoring telemetry loss, and treating quality complaints as infrastructure errors.

## Verification
Confirm user-impact metrics recover, the hypothesized cause is supported by evidence, and mitigation does not create hidden cost or quality regression.

## Expected output
Incident timeline, evidence, root-cause confidence, mitigation, and follow-up actions.

## Stop conditions
Escalate when production changes exceed authority, sensitive data access is required, or evidence remains contradictory after bounded investigation.