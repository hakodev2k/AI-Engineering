# Incident Coordination Rules

## Purpose
Balance forensic preservation with containment, recovery, business continuity, and incident command.

## Scope
Applies when forensic work occurs during active security or operational incidents.

## MUST
- Forensic objectives MUST be coordinated with incident command and system owners when actions can affect containment or recovery.
- Evidence-preservation recommendations MUST state operational cost and time sensitivity.
- Containment actions expected to destroy volatile evidence MUST be documented before execution when time permits.
- Analysts MUST communicate confidence and evidence gaps promptly when decisions depend on findings.
- Case evidence MUST remain separate from operational working data where required.

## MUST NOT
- MUST NOT delay urgent safety or containment actions solely to achieve ideal evidence preservation.
- MUST NOT execute isolation, shutdown, credential rotation, or destructive remediation without authority.
- MUST NOT present provisional triage findings as final forensic conclusions.

## SHOULD
- Predefine evidence priorities for common incident classes.
- Capture decision logs linking preservation trade-offs to incident objectives.

## Exceptions
Immediate threat containment may precede forensic coordination; document the action, authority, evidence impact, and compensating collection afterward.

## Verification
Review incident timelines, decision logs, approvals, preservation requests, containment records, and whether final reporting distinguishes provisional findings.