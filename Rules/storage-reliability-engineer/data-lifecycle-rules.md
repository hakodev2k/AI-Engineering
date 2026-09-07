# Data Lifecycle Rules

## Purpose
Control retention, archival, tiering, expiration, and deletion without violating recovery or compliance needs.

## Scope
Applies to storage classes, lifecycle policies, archival tiers, retention locks, and deletion workflows.

## MUST
- Define lifecycle states, ownership, retention requirements, and deletion authority for managed data.
- Validate that tiering and archival preserve required recovery objectives.
- Require human approval for destructive deletion or retention-policy reduction affecting protected data.

## MUST NOT
- Apply lifecycle deletion to unknown or unclassified data sets.
- Assume archived data is recoverable without periodic restore evidence.
- Bypass legal, compliance, or retention holds.

## SHOULD
- Automate stale-data identification while separating recommendation from execution.
- Track retrieval cost and latency for archival tiers.

## Exceptions
Emergency retention changes require documented authority, scope, evidence, and post-action review.

## Verification
Inspect lifecycle policy, retention metadata, approvals, archive-restore tests, deletion logs, and compliance controls.