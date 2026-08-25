# Workflow: Research and Diagnose

## Trigger
New A2A integration, new external agent, card revision, or suspected instruction/SSRF behavior.

## Goal
Produce an evidence-backed trust-boundary diagnosis before changing code.

## Inputs
Raw Agent Card, retrieval URL, client implementation, observed model request.

## Baseline
Capture current behavior: whether card prose enters model input, its role, bytes/chars, URLs contacted, and authorization checks performed.

## Stages
1. Observe and preserve raw evidence.
2. Measure baseline sinks and sizes.
3. Run deterministic preflight.
4. Form hypotheses about prompt-role confusion, URL trust, and authorization coupling.
5. Test hypotheses with benign and adversarial fixtures without external side effects.
6. Produce a remediation decision.

## Responsible agent
Risk assessor; security reviewer validates conclusions.

## Tools
JSON/URL parsers, `scripts/agent_card_guard.py`, source inspection, unit tests.

## Outputs
Baseline, root cause, selected remediation, verification plan.

## Checkpoints
After evidence capture; after sink tracing; before remediation selection.

## Metrics
Privileged-role sinks, blocked URLs, remote prose chars, findings/card.

## Retry policy
Maximum two hypothesis-test cycles per unchanged implementation.

## Stop conditions
Confirmed boundary violation; or all hypotheses falsified with evidence and no blocking finding.

## Failure path
Insufficient observability → block production enablement and add request-role logging that excludes secrets.

## Verification
Independent reviewer reproduces at least one adversarial fixture and the expected block.

## Definition of Done
Root cause and baseline are documented with evidence; no conclusion relies only on model behavior.
