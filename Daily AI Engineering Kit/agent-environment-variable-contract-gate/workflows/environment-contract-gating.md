# Workflow: Environment Contract Gating

## Trigger

A task adds, removes, renames, changes, or depends on environment-driven configuration.

## Entry conditions

Repository context is available and no production mutation has occurred.

## Inputs

Requested behavior, target environments, repository code, current contract, sample files, CI/deployment configuration, and acceptance criteria.

## Stages

1. **Context — Config Discovery Agent**: locate configuration entry points and affected variables.
2. **Plan — implementation owner**: define exact contract/sample/code changes and verification commands.
3. **Execute — implementation owner**: make the smallest repository-safe changes.
4. **Post-change hook**: run `hooks/post-config-change.md` actions.
5. **Test — implementation owner**: run validator plus relevant repository tests/build.
6. **Independent verify — Verification Agent**: inspect contract coverage, secret hygiene, stale references, and test evidence.
7. **Approval checkpoint**: stop before production configuration, secret rotation, deployment, infrastructure changes, or weakening production requirements.
8. **Pre-release hook**: execute final gate for the target release environment.
9. **Complete**: report repository task separately from external operational readiness.

## Retry rules

- Validation/build/test failure caused by the proposed repository change: maximum 2 repair cycles.
- Transient tooling failure: maximum 2 retries with captured stderr/stdout.
- Permission failure: no privilege escalation; stop and escalate.
- Approval rejection or missing approval: no retry; stop.

Preserve contract diff, validator JSON, failing command output, and verification findings across retries.

## Failure paths

Secret exposure, unknown production requirement, stale rename references, or an invalid contract are blocking. Do not bypass by enabling undocumented variables or making production fields optional.

## Definition of Done

- Required context was gathered.
- Contract/sample/test artifacts reflect the actual repository change.
- Deterministic validation passes for affected environments.
- Applicable build/tests pass.
- Independent verification is complete.
- Required production-impact approval is obtained before external mutation.
- Remaining risks are documented.
- No blocking failure remains.