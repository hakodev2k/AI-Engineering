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

## Run

Requires Git and Bash. From the target repository root:

```bash
bash path/to/production-root-cause-agent/scripts/validate-repository.sh
```

Exit `0` confirms a Git working tree and a clean `git diff --check`; exit `1` means no repository and exit `2` means diff validation failed. This is not an incident collector and does not verify the RCA. Follow `workflows/rca-workflow.md`, validate the final report against `schemas/rca-report.json`, and require independently reproducible evidence before accepting a root cause or remediation.

## Verification

Exercise repository and diff-failure paths in a disposable fixture, validate the final RCA against `schemas/rca-report.json`, and independently reproduce its supporting evidence. The Git preflight alone is not incident verification.
