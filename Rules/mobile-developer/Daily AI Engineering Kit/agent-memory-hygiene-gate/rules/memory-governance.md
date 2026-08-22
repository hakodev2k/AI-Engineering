# Memory Governance Rules

## MUST
- Persist only atomic claims with provenance, observed-at time, scope, confidence and expiry.
- Validate every candidate with `scripts/validate-memory.py` before persistence.
- Re-check active records with `scripts/sweep-memory.py` before retrieval.
- Treat current explicit instructions and fresh authoritative evidence as higher priority than memory.
- Record conflicts instead of silently overwriting contradictory memories.
- Require human approval before a memory is used as an operational instruction for production changes, authorization, security controls, financial actions, infrastructure, secrets, destructive Git/database actions, or breaking public APIs.
- Remove or revalidate expired memories before they can be used again.

## MUST NOT
- Persist secrets, passwords, API keys, tokens, private keys, connection strings containing credentials, raw customer payloads, or authentication cookies.
- Persist temporary task state such as retry counters, stack traces, current branch status, transient incident IDs, or speculative hypotheses as durable facts.
- Treat a previously persisted memory as proof that the claim is still true.
- Auto-resolve contradictory memories by confidence score alone.
- Extend expiry merely to silence validation failures.
- Let memory override repository policy, current user instructions, security boundaries, or fresh evidence.
- Store high-impact approvals themselves as permanent authorization for future unrelated actions.

## SHOULD
- Prefer short TTLs for volatile technical or organizational facts.
- Prefer project/repository scope over global scope when applicability is uncertain.
- Consolidate duplicates while preserving the strongest provenance.
- Retain superseded record IDs or references for auditability rather than rewriting history invisibly.
- Retrieve the smallest relevant memory set to reduce stale-context bias and token cost.