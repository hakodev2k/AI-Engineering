# Workflow: Orphaned Feature Flag Cleanup

## Trigger
A feature flag is marked retired/expired, rollout is complete, or repository maintenance identifies a stale flag path.

## Entry conditions
Exact flag key is known; registry/policy are readable; repository tests can be discovered.

## Inputs
Flag key, repository root, `config/flag-policy.json`, project flag registry, acceptance constraints, approvals when required.

## Flow
```text
Trigger
  ↓
Flag Explorer
  ↓
Lifecycle evidence complete?
  ├─ no → blocked
  └─ yes
      ↓
Cleanup Agent
      ↓
Format/build/targeted tests
      ↓
Re-scan references
      ↓
Independent Verification Agent
      ↓
verified | blocked | failed
```

## Stages
1. **Context** — discover registry entry, runtime decision point, tests, configuration, telemetry, and all exact references.
2. **Plan** — classify permanent behavior and assign a disposition to each reference.
3. **Execute** — keep the selected branch, remove dead flag-only code, update tests/config locally.
4. **Test** — run repository-native format/build/targeted tests.
5. **Scan** — run deterministic repository scan; zero non-allowlisted references are required.
6. **Review** — inspect diff for security/validation/telemetry loss and unrelated changes.
7. **Verify** — independent verifier runs scan + verify and checks approvals.

## Responsible agents
- Discovery: `subagents/flag-explorer.md`
- Implementation: `subagents/cleanup-agent.md`
- Final verification: `subagents/verification-agent.md`

## Tools
Repository search/read/edit, Git diff/status, native test/build tools, `scripts/flag_cleanup_gate.py`, `scripts/run_checks.sh`.

## Produced artifacts
`.flag-cleanup/scan.json`, `.flag-cleanup/verification.json`, test/build output, final diff, approval evidence if applicable.

## Checkpoints
- Registry evidence and repository behavior do not conflict.
- Permanent behavior is explicit.
- Dangerous actions are not performed without approval.
- Tests pass after edits.
- Scan reports zero non-allowlisted references.
- Verification status is `verified`.

## Retry rules
- Transient tool/environment failure: max 2 retries with logs preserved.
- Implementation/test-fix cycle: max 3.
- Deterministic verification failure: no blind retry; form a new evidenced hypothesis or stop.
- Permission failure: stop; never escalate privileges silently.

## Approval points
Explicit human approval is required before production flag/provider mutation, production configuration changes, deletion of remote flag state, breaking API changes, data deletion, secrets/infrastructure changes, security weakening, or large dependency upgrades.

## Failure paths
- Missing/contradictory lifecycle evidence → `blocked`.
- Build/test regression → return to Cleanup Agent within the 3-cycle cap.
- Remaining active reference → classify and remediate or block.
- Provider/production action needed → stop for approval.
- Repeated deterministic failure → `failed` with evidence preserved.

## Definition of Done
Lifecycle context is complete; permanent behavior is evidenced; scoped cleanup exists; targeted tests/build pass; zero non-allowlisted references remain; final diff has no unrelated changes; approvals are valid; independent verification is `verified`; remaining risks are documented and non-blocking.
