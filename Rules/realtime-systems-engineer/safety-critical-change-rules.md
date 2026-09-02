# Safety-Critical Change Rules

## Purpose
Control changes that can alter timing, safety, or physical behavior.

## Scope
Code, configuration, hardware, compiler, scheduler, timing parameters, and deployment changes.

## MUST
- Any change that can affect safety or deadline behavior MUST identify impacted hazards, timing assumptions, and verification evidence.
- Safety-critical changes MUST receive independent review appropriate to the assurance level.
- Production or field execution of irreversible or high-risk changes MUST require explicit human approval.
- Rollback or safe-state handling MUST be prepared before execution when technically possible.

## MUST NOT
- MUST NOT weaken safety mechanisms, watchdogs, limits, or interlocks merely to unblock delivery.
- MUST NOT treat refactoring as timing-neutral without evidence when execution paths or generated code can change.

## SHOULD
- Keep safety-affecting changes small, isolated, and traceable.

## Exceptions
Exceptions require documented hazard rationale, evidence, residual risk, and accountable approval.

## Verification
Review hazard traceability, diffs, timing regressions, test evidence, approvals, and release records.