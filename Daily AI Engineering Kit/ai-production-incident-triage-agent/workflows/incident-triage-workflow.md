# Incident Triage Workflow

## Flow
Trigger -> Context -> Plan -> Investigate -> Review -> Verify

## Stages
1. Trigger: receive incident details.
2. Context: gather approved evidence.
3. Plan: define investigation steps.
4. Investigate: run bounded analysis.
5. Review: independent verification.
6. Verify: confirm outcome.

## Retry
Maximum 3 retries for transient tool failures only.
Preserve evidence after each attempt.

## Stop
Stop for missing permissions, destructive actions, or unresolved evidence gaps.
