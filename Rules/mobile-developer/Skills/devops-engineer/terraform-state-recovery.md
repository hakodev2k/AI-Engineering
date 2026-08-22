# Terraform State Recovery

## Purpose
Diagnose and recover Terraform state or drift issues without corrupting managed infrastructure.

## When to use
Use for state-lock failures, missing resources, accidental state removal, import needs, drift, or failed applies.

## Inputs
State backend, workspace, Terraform version, plan, provider config, infrastructure inventory, state backups.

## Context to inspect
Remote state history, locks, recent commits/applies, provider versions, actual cloud resources, import IDs.

## Core knowledge
Terraform state maps configuration to real resources. Manipulating state changes management metadata, not necessarily infrastructure. Back up first; never guess resource IDs.

## Procedure
1. Freeze concurrent applies.
2. Back up current remote state.
3. Inspect plan and state list/show.
4. Compare real resource identity.
5. Determine config drift vs state drift.
6. Use import/moved blocks where appropriate.
7. Use state rm only with explicit ownership intent.
8. Resolve locks only after confirming no active apply.
9. Generate a no-surprise plan.
10. Apply and verify clean plan afterward.

## Decision points
Import existing resource when it should be managed; recreate only when safe; restore prior state snapshot when recent corruption is proven and infrastructure matches it.

## Common failure patterns
Force-unlock active run, editing state manually, deleting resource to fix state, applying before backup, wrong workspace.

## Verification
State maps to real resources, plan is expected, final plan is clean, and no unintended resources changed.

## Expected output
Recovered state with documented cause and prevention action.

## Stop conditions
Stop if state ownership is unclear or recovery could destroy production resources.