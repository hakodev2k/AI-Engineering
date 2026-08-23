# Eradication and Recovery Rules

## Purpose
Remove attacker footholds and restore systems without reintroducing compromise.

## Scope
Credential reset, malware removal, rebuilds, configuration repair, patching, service restoration, and post-containment validation.

## MUST
- Root cause or a defensible bounded hypothesis MUST guide eradication actions.
- Recovery MUST verify that persistence, stolen credentials, exposed trust paths, and vulnerable entry points are addressed.
- Restored systems MUST meet defined security and operational validation criteria before normal service resumes.
- Recovery evidence MUST include what changed, who approved it, and how compromise recurrence was checked.

## MUST NOT
- MUST NOT restore from backups without considering whether the backup contains the same compromise or vulnerable state.
- MUST NOT declare eradication complete solely because alerts stopped.

## SHOULD
- Recovery SHOULD stage restoration and increase monitoring on recently affected assets.

## Exceptions
Business-critical expedited recovery requires documented residual risk and accountable approval.

## Verification
Review rebuild records, credential actions, patch status, validation tests, monitoring evidence, and incident closure criteria.