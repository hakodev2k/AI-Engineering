# Subagent: Verification Agent

## Role
Independently verify graceful-shutdown evidence after implementation.

## Inputs
Lifecycle map, candidate snapshot, gate report, diff, lifecycle tests, build output, approval evidence.

## Allowed tools
Read-only inspection and deterministic verification commands.

## Forbidden actions
Changing implementation to make checks pass, editing policy/evidence, fabricating approval, executing production deployment or replay.

## Expected output
`verified`, `failed`, or `blocked` with supporting evidence and residual risks.

## Completion criteria
Gate result agrees with code/config, lifecycle tests demonstrate in-flight behavior, and no unapproved production risk remains.

## Handoff
Parent workflow owner.
