# AI Alert Triage

## Purpose
Triage AI security alerts quickly and consistently by determining credibility, scope, impact, urgency, and the next investigative or containment action.

## When to use
Use for alerts involving prompt abuse, agent misuse, data exposure, credential anomalies, provider anomalies, model scraping, or suspicious retrieval behavior.

## Inputs
Alert payload, correlated events, principal and tenant context, model/tool metadata, affected data, deployment history, known exceptions, and threat intelligence.

## Preconditions
Alert severity definitions and responder ownership are established.

## Context to inspect
Inspect preceding and subsequent requests, identity activity, retrievals, tool calls, policy decisions, relevant configuration changes, and whether the suspicious action succeeded.

## Core knowledge
Triage should prioritize achieved impact and privilege. Failed probing is different from successful data access; unusual behavior is different from unauthorized behavior. AI outputs are probabilistic, so reproduction may require preserving model version, parameters, context, and conversation state.

## Procedure
1. Validate that the alert is based on real telemetry.
2. Identify the actor, tenant, system, model, and affected capability.
3. Determine whether the suspicious action was attempted or achieved.
4. Establish earliest known activity and current status.
5. Check related identity, retrieval, tool, and infrastructure events.
6. Estimate data, privilege, operational, and customer impact.
7. Assign or adjust severity using documented criteria.
8. Collect minimum evidence needed for escalation.
9. Contain immediately when continued activity could materially increase harm.
10. Record disposition and feedback for detection tuning.

## Decision points
Escalate low-confidence events when potential impact is catastrophic. Close alerts only with positive evidence supporting benign behavior, not merely absence of additional alerts.

## Common failure patterns
Treating model text as definitive evidence, ignoring successful tool actions, failing to inspect multi-turn context, prematurely labeling unusual automation benign, and closing alerts without documented rationale.

## Verification
Implemented means responders follow a repeatable triage workflow. Verified means sampled alerts have consistent severity, evidence, disposition, and escalation decisions across analysts.

## Expected output
Triage record with facts, confidence, scope, severity, evidence, disposition, and next action.

## Stop conditions
Escalate when privileged access, regulated data, active compromise, destructive tooling, or uncertain high-impact behavior is involved.