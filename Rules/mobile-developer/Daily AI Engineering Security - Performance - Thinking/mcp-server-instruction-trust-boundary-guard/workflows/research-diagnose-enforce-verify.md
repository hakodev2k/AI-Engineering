# Workflow: Research → Diagnose → Enforce → Verify

## Trigger
New MCP server, changed server instructions, or a security review of an existing integration.

## Goal
Preserve useful MCP metadata while preventing server-controlled instructions from becoming unreviewed control-plane authority.

## Inputs
Raw instructions, server identity, prior hash, trust policy, user goal, requested capabilities, approval record.

## Baseline
Measure whether provenance exists, whether instructions are currently merged into privileged prompt context, and whether high-impact actions are guarded.

## Stages
1. **Observe** — collect exact instruction bytes and provenance.
2. **Measure baseline** — record hash, byte length, current trust handling, and action path.
3. **Diagnose** — identify where untrusted text crosses into privileged context or influences tools.
4. **Form hypothesis** — state the smallest deterministic boundary that would block the observed path.
5. **Implement** — integrate the gate without changing unrelated permissions.
6. **Measure again** — run benign, malicious, changed-hash, and stale-approval fixtures.
7. **Independent verify** — security reviewer confirms results.

## Responsible agents
Implementation owner for integration; `subagents/security-reviewer.md` for independent verification.

## Tools
`python scripts/instruction_gate.py`, code/test runner, hashes, read-only logs.

## Outputs
Baseline, policy decision records, test evidence, reviewer verdict.

## Checkpoints
- Provenance captured before prompt insertion.
- Policy decision occurs before high-impact action.
- Approval is bound to current hash.
- Malicious fixture blocked.
- Benign fixture passes.

## Metrics
Provenance coverage, block rate for malicious fixtures, false-positive rate for benign fixtures, stale-approval rejection rate.

## Retry policy
Maximum 2 implementation iterations. Each retry must cite the failed fixture or policy condition. No retries by weakening trust rules.

## Stop conditions
Stop on verified pass, unresolved blocker after two iterations, missing required provenance, or inability to test safely.

## Failure path
Record exact failing case, disable affected high-impact integration path if necessary, and escalate to a human security owner.

## Definition of Done
Evidence documented, gate implemented, deterministic tests pass, reviewer independent, no secret exposure, no stale approval accepted, and README accurately describes the package.