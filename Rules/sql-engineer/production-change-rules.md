# Production Change Rules

## Purpose
Control SQL actions that can affect live availability, data, security, or public behavior.

## Scope
Production DDL, DML, configuration-adjacent SQL, maintenance, repairs, and emergency scripts.

## MUST
- Every production change MUST identify intent, target, blast radius, prerequisites, validation, and recovery.
- Destructive SQL, irreversible migrations, bulk data deletion, privilege escalation, and security weakening MUST receive explicit human approval before execution.
- Operators MUST distinguish analysis, recommendation, preparation, and execution authority.
- Production scripts MUST include safeguards against wrong environment or unintended scope where practical.

## MUST NOT
- MUST NOT execute production changes merely because a script was generated or reviewed by an AI agent.
- MUST NOT bypass change controls to save time outside an authorized incident process.
- MUST NOT force continuation after unexpected row counts, locks, errors, or validation failures.

## SHOULD
- Prefer reversible, staged, observable changes with stop conditions.
- Use peer review for high-impact scripts.

## Exceptions
Emergency execution requires authorized incident leadership, bounded action, evidence capture, and subsequent review.

## Verification
Review approvals, environment identity, script diff, dry-run/read-only scope checks, affected-row expectations, monitoring, and post-change invariants.