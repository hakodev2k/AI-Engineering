# Code Review and Change Safety

## Purpose
Apply senior review discipline to kernel-adjacent changes with disproportionate blast radius.

## Scope
Program source, loaders, schemas, maps, hooks, build configuration, dependencies, deployment, and policy changes.

## MUST
- Reviews MUST identify changed kernel assumptions, attach semantics, map/event ABI, privilege, overhead, and rollback impact.
- Public or persistent schemas MUST receive explicit compatibility review.
- Security/enforcement changes MUST include negative tests and failure-mode analysis.
- Performance-sensitive changes MUST include measurement when overhead could materially change.
- High-risk production changes MUST have explicit approval and reversible execution plan.

## MUST NOT
- MUST NOT approve solely because the verifier accepts the program.
- MUST NOT combine unrelated high-risk migrations when separation materially improves rollback.
- MUST NOT bypass required review to resolve ordinary delivery pressure.

## SHOULD
- Keep diffs small enough to reason about verifier and runtime effects.
- Document non-obvious kernel semantics near the relevant boundary.

## Exceptions
Emergency review shortcuts require incident authority, bounded scope, recorded rationale, and follow-up review.

## Verification
Inspect PR evidence, compatibility tests, benchmark/security results, approvals, and deployment/rollback plan.