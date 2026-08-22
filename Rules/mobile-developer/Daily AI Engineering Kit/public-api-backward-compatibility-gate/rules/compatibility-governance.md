# Compatibility Governance

## MUST
- Resolve and record exact baseline and candidate refs.
- Treat public contract changes as compatibility-sensitive until classified.
- Preserve a machine-readable diff and human-readable review decision.
- Require explicit human approval for intentional breaking changes.
- Require deprecation/migration evidence when policy mandates a transition window.
- Keep `executed`, `reviewed`, and `verified` as separate states.
- Re-run compatibility checks after any contract-affecting edit.
- Fail closed when a contract surface cannot be parsed or compared reliably.

## MUST NOT
- Remove, rename, narrow, or repurpose public contracts merely to simplify implementation.
- Silence a detected breaking change by changing the baseline.
- Mark a breaking change compatible because tests happen to pass.
- Assume all consumers ignore unknown response fields or tolerate enum growth.
- Treat internal implementation types as public without evidence, or public types as internal without evidence.
- publish/deploy an unapproved breaking contract.
- expose secrets, tokens, connection strings, or production data in contract artifacts.

## SHOULD
- Prefer additive evolution, versioning, compatibility shims, and staged deprecation.
- Keep compatibility policy repository-local and reviewed.
- Add consumer-oriented compatibility tests for historically fragile surfaces.
- Include generated SDK/client behavior when relevant.
