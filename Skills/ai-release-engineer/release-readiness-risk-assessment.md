# Release Readiness and Risk Assessment

## Purpose
Evaluate whether an AI-system change is safe and operationally ready for release by combining product impact, model uncertainty, dependency risk, reversibility, security, privacy, cost, and observability.

## When to use
Use before production releases involving models, prompts, retrieval, agents, tools, routing, data pipelines, or AI infrastructure. Do not use as a substitute for specialist security or legal approval when required.

## Inputs
Change description, architecture, affected users, evaluation results, dependency changes, rollback plan, SLOs, risk register, incident history.

## Preconditions
The intended behavior, release scope, owner, and production target are known.

## Context to inspect
Recent incidents, model/provider constraints, feature flags, deployment topology, data sensitivity, tool permissions, monitoring, fallback paths, and release policy.

## Core knowledge
AI release risk is multidimensional. A technically successful deployment may still create semantic regressions, unsafe outputs, data exposure, cost spikes, or irreversible tool actions. Risk depends on blast radius and reversibility as much as probability.

## Procedure
1. Define the user-visible and system-level change.
2. Identify affected AI components and external dependencies.
3. Classify potential failure modes: correctness, safety, security, privacy, latency, cost, availability, and side effects.
4. Estimate blast radius and reversibility.
5. Review evidence from offline evaluations and production-like tests.
6. Confirm rollback or containment controls.
7. Confirm observability can detect expected regressions.
8. Verify owners and incident escalation paths.
9. Record release blockers and residual risks.
10. Approve, constrain, defer, or reject the release based on evidence.

## Decision points
Prefer a constrained canary when uncertainty is material but containable. Defer when critical risks are unobservable or irreversible. Require human approval for high-impact autonomous actions.

## Common failure patterns
Treating test pass as release readiness, ignoring provider/model drift, missing cost risk, assuming rollback is trivial, and approving releases without measurable success criteria.

## Verification
Confirm every critical risk has evidence, an owner, a detection signal, and a containment or rollback mechanism.

## Expected output
A release-readiness decision with risk classification, blockers, constraints, residual risks, and required monitoring.

## Stop conditions
Stop and escalate when safety, security, privacy, regulatory, or irreversible-action risk exceeds the release authority of the engineer.