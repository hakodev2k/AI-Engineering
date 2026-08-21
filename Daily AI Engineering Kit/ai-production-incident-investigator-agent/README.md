# AI Production Incident Investigator Agent

Reusable agent package for investigating production incidents with evidence-first workflows.

## Problem
Reduce unreliable AI debugging by forcing collection of logs, metrics, traces, code evidence, hypotheses, and verification steps.

## Use when
- Production errors occur
- Root cause is unclear
- Multiple services are involved
- Logs and telemetry need correlation

## Architecture
```mermaid
flowchart TD
A[Incident Trigger] --> B[Context Collector]
B --> C[Investigation Planner]
C --> D[Evidence Agents]
D --> E[Root Cause Analysis]
E --> F[Verification]
```

## Package
- skills/incident-investigation.md
- skills/evidence-collection.md
- rules/incident-safety.md
- subagents/root-cause-analyst.md
- subagents/verification-agent.md
- workflows/incident-response.md
- hooks/pre-investigation.md
- scripts/collect-context.py
- schemas/investigation-result.json

## Safety
Agents must not change production data, deploy fixes, or modify infrastructure without approval.

## Definition of Done
- Evidence collected
- Hypotheses validated
- Root cause separated from symptoms
- Verification completed
- Risks documented
