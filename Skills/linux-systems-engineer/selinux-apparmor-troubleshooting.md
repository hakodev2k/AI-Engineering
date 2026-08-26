# SELinux and AppArmor Troubleshooting

## Purpose
Resolve mandatory access-control denials without weakening system-wide security.

## When to use
Use when services fail due to SELinux/AppArmor policy, after path/port changes, or while hardening applications.

## Inputs
Denied operation, service identity, resource path/type, policy mode/profile, audit logs, and intended security boundary.

## Context to inspect
Inspect enforcing mode, labels/profiles, audit events, file contexts, booleans, capabilities, service unit sandboxing, and recent changes.

## Core knowledge
Understand MAC as additional to DAC; SELinux types/domains/contexts/booleans and AppArmor path profiles; policy should encode intended access, not merely silence denials.

## Procedure
1. Confirm ordinary Unix permissions first.
2. Capture the exact MAC denial.
3. Identify subject, object, requested operation, and expected policy.
4. Determine whether labeling/profile, application behavior, or policy is wrong.
5. Restore standard labels or supported booleans when appropriate.
6. Create minimal local policy/profile changes only for legitimate access.
7. Keep enforcing mode during testing when feasible.
8. Test required and prohibited operations.

## Decision points
Relabel when resource type is incorrect; use supported boolean for recognized behavior; add local policy only for justified nonstandard access.

## Common failure patterns
Disabling SELinux/AppArmor, blanket allow rules, using audit-generated policy without review, confusing DAC with MAC, and persistent custom labels not managed correctly.

## Verification
Service works in enforcing mode, expected denials disappear, unrelated access remains denied, and policy persists across reboot/relabel/deployment.

## Expected output
Minimal policy correction with rationale and positive/negative test evidence.

## Stop conditions
Stop if requested access breaks the threat model, policy generation cannot be reviewed, or security approval is required for boundary expansion.