# Production Root Cause Agent Kit

Reusable AI workflow for investigating production incidents with evidence-first reasoning.

## Purpose
Reduce time spent debugging incidents by separating facts, hypotheses, validation steps, and remediation.

## Workflow
```text
Incident Trigger
 -> Collect Evidence
 -> Analyze Signals
 -> Form Hypotheses
 -> Validate
 -> Review Risk
 -> Produce RCA
```

## Components
- skills/incident-investigation.md: investigation procedure
- rules/safety-rules.md: execution boundaries
- subagents/: specialized responsibilities
- workflows/rca-workflow.md: end-to-end flow
- scripts/: deterministic evidence collection
- schemas/rca-report.json: output contract

## Safety
The agent must request approval before production changes, database writes, infrastructure changes, or rollback actions.

## Definition of Done
- Evidence collected
- Root cause supported by evidence
- Validation completed
- Risks documented
- Remediation approved
