# Workflow: OpenAPI Generated Client Drift Gate

## Trigger
OpenAPI spec change, generated SDK change, generator/config change, CI drift failure, or release preparation.

## Entry conditions
Repository readable; authoritative spec and generated roots can be investigated; Git is available.

## Inputs
`config/gate-config.json`, repository root, API acceptance constraints, repository build/test commands.

## Stages
1. **Context** — Generation Contract Explorer identifies authoritative spec, generator version/command, generated roots, transformations, and consumers.
2. **Baseline** — run `python scripts/gate.py snapshot --config config/gate-config.json --out .openapi-drift/before.json`.
3. **Plan** — classify drift and select one evidence-backed hypothesis.
4. **Execute** — Remediation Agent applies the smallest safe non-generated source/config correction and regenerates through the documented command.
5. **Test** — run repository compile/build plus focused client/API tests.
6. **Regeneration gate** — from a clean worktree/candidate state run `python scripts/gate.py regenerate --config config/gate-config.json --out .openapi-drift/regenerate.json`.
7. **Independent verification** — Verification Agent reruns deterministic checks and records status.
8. **Complete** — only `verified` is success.

## Responsible agents
Explorer owns discovery; Remediation Agent owns changes; Verification Agent alone owns the final decision.

## Tools
Git, Python 3, configured generator/toolchain, repository build/test tools.

## Produced artifacts
`.openapi-drift/before.json`, `.openapi-drift/regenerate.json`, optional before/after snapshots, generator logs, build/test evidence.

## Checkpoints
- Authoritative spec is evidenced.
- Generator command and version are known.
- No forbidden manual edit exists in generated roots.
- Relevant build/tests pass.
- Final regeneration creates no unexpected generated diff.

## Retry rules
Transient generator/network/tool failure: maximum 2 retries with logs preserved. Remediation/test-fix cycles: maximum 3. Deterministic drift is not blindly retried. At the limit, stop as `blocked` or `failed`.

## Approval points
Explicit approval is required before breaking API contract changes, generator major upgrades, large dependency upgrades, secret changes, infrastructure/production changes, deletion of generated surface, or weakening drift policy.

## Failure paths
Ambiguous spec/generator → blocked. Generator failure → classify and bounded retry only if transient. Build/test failure → return to one bounded remediation hypothesis. Permission failure → stop without escalating privileges. Unexpected generated diff → failed until explained and verified.

## Stop conditions
Stop on missing required context, approval-required change, retry exhaustion, secret exposure risk, or inability to reproduce the generator environment.

## Definition of Done
Generation contract complete; expected files exist; regeneration is deterministic and clean; relevant build/tests pass; approval requirements are satisfied; independent verification returns `verified`; no blocking risk remains.
