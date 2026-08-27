# Destructive Action and Approval Rules

## Purpose
Prevent forensic personnel or agents from silently exceeding authority when actions can destroy evidence, alter production, or weaken security.

## Scope
Covers deletion, shutdown, wiping, remediation, account changes, credential rotation, decryption attempts, production configuration, and evidence disposition.

## MUST
- Analysis, recommendation, preparation, and execution MUST be treated as distinct authority levels.
- Human approval MUST precede destructive or materially state-changing production actions unless an established emergency authority explicitly permits them.
- Approval requests MUST state target, intended action, evidence impact, operational impact, reversibility, rollback, and alternatives.
- Executed actions MUST be logged with actor, time, authorization, result, and unexpected effects.
- Evidence preservation requirements MUST be considered before remediation.

## MUST NOT
- MUST NOT delete evidence, wipe media, rotate secrets, disable controls, shut down systems, or change production access merely because the action appears beneficial.
- MUST NOT force actions through failed approval or safety controls.
- MUST NOT rewrite history to conceal an unauthorized action.

## SHOULD
- Prefer reversible containment and staged remediation.
- Separate forensic access from remediation privileges.

## Exceptions
Emergency authority must be predefined, narrowly scoped, time-bounded, and followed by immediate documentation and review.

## Verification
Inspect approval records, privilege logs, change records, command history, rollback evidence, and before/after system state.