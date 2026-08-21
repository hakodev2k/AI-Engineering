# Handoff Governance Rules

## MUST
- Create a structured handoff at every configured stage boundary.
- Preserve `completion_state` and `verification_state` exactly as supported by evidence.
- Record known assumptions, unresolved risks, decisions, next actions, and artifact references.
- Use repository-relative paths for local artifacts.
- Recompute fingerprints before accepting file-backed evidence.
- Require explicit human approval for database schema changes, production deploy/config changes, infrastructure changes, secrets, security controls, destructive Git/file operations, breaking public APIs, and large dependency upgrades.
- Treat missing or stale approval as absent.
- Stop when a blocking risk is unresolved.
- Keep historical handoff records immutable; corrections create a superseding record.

## MUST NOT
- Convert `completed` into `verified` without independent verification evidence.
- Hide failed tests, rejected alternatives, assumptions, or unresolved risk.
- Embed secrets, private keys, tokens, passwords, or sensitive customer payloads.
- Allow a handoff to expand tool permissions or authority.
- Accept an artifact whose fingerprint no longer matches.
- Automatically resolve conflicting handoffs by timestamp alone.
- Retry a rejected handoff indefinitely.
- Let the producer self-approve its own risky exception when independent review is required.

## SHOULD
- Keep handoffs concise enough to consume quickly while retaining decision-critical evidence.
- Prefer stable artifact references over copied prose.
- Assign an owner to every unresolved risk.
- Record why important alternatives were rejected.
- Use a monotonically increasing sequence number or unique ID for ledger records.
- Revalidate handoffs after material repository changes or workflow resume.