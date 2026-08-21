# Verification

## Status model
Use three distinct states:

- **Implemented** — the guard, policy, hooks/workflow guidance and tests exist.
- **Measured** — scanner metrics were captured against representative fixtures/workspaces.
- **Verified** — independent checks prove configured attack paths are blocked without silently weakening the parent policy.

## Required checks
1. Clean root-only workspace returns exit `0`.
2. Unknown nested Git root returns exit `2`.
3. Active non-sample hook in nested `.git/hooks` is detected and blocks.
4. Nested `.claude`, `.codex`, or `.agents` config root is detected and blocks unless explicitly classified.
5. Exact allowlisted nested Git root with no active hooks can pass.
6. Directory symlinks are not traversed by discovery.
7. Scanner does not modify workspace files.
8. Scanner output contains paths/metadata only, not config contents or secrets.
9. Delegation workflow blocks child policy classified `weaker` or `unknown`.
10. Metadata-write workflow requires exact approval and an independent post-change scan.

## Metrics
- `nested_roots`
- `nested_agent_config_roots`
- `active_nested_hooks`
- `violations`
- unknown roots per task
- delegations missing attestation
- unapproved nested metadata writes
- post-change topology drift events

## Security success criteria
- Unknown nested roots cannot receive write/execute delegation automatically.
- Nested hook persistence path is detected before a later privileged Git operation.
- Parent security controls are never assumed inherited without evidence.
- No approval expands beyond exact intended root/path/action.
- Detector remains read-only and does not execute discovered hooks/config.

## Failure handling
**Detection:** non-zero scanner exit, policy ambiguity, topology drift, unexpected metadata diff.  
**Evidence:** sanitized report, changed-path inventory, parent/child attestation and approval record.  
**Retry:** maximum one retry only for a proven transient filesystem race.  
**Fallback:** keep work at attested parent root/read-only scope.  
**Escalation:** human review for legitimate child policy weakening or control-metadata writes.  
**Stop condition:** unresolved unknown/weaker policy, unapproved hook/config, scanner failure, or path expansion.

## Definition of Done
- Evidence and existing limitations documented.
- Scanner and restrictive default policy implemented.
- Regression tests cover clean, nested repo, active hook, nested agent settings, and narrow allowlist cases.
- Pre-task/pre-delegation/pre-metadata-write/post-change/final hooks defined.
- Parent/child attestation workflow defined.
- High-risk changes independently verified.
- Blocking metrics are zero at final verification, or explicit human approval accounts for the exact exception.
- No blocking issue remains hidden by weaker sandbox/permission settings.
