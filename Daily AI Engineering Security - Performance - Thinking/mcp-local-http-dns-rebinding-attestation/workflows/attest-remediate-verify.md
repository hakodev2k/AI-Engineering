# Workflow: Attest → Remediate → Verify

## Trigger
Run for a new local HTTP MCP server, transport/SDK upgrade, proxy change, bind change, authentication change, or new high-impact tool exposure.

## Goal
Demonstrate with runtime evidence that prohibited browser-origin requests cannot cross the local MCP boundary.

## Inputs
Endpoint, `config/policy.json`, server/proxy config, listener metadata, capability list, and change diff.

## Baseline
Record current positive-control response, bind scope, foreign Host/Origin behavior, unauthenticated behavior, SDK version, and capability risk before changes.

## Context
Threat model includes browser DNS rebinding, unsafe wildcard binds, parser inconsistencies, proxy rewriting, missing authentication, and credential-bearing tools.

## Stages
1. **Observe** — capture effective topology and current behavior.
2. **Measure baseline** — run `scripts/attest_mcp_http.py` against the safe endpoint.
3. **Diagnose** — classify failure as bind, Host policy, Origin policy, auth, proxy, or ambiguous network path.
4. **Form hypothesis** — choose one smallest security-preserving correction.
5. **Implement improvement** — update SDK/config/middleware/proxy policy without expanding privileges.
6. **Measure again** — rerun the exact same probe set.
7. **Independent verify** — MCP Transport Security Reviewer validates evidence and diff.
8. **Complete** only when all blocking controls pass.

## Responsible agent
Implementation owner performs stages 1–6. `subagents/security-reviewer.md` performs independent stage 7 for security-sensitive changes.

## Tools
HTTP attestation script, listener inspection, dependency tooling, test runner, and read-only config inspection.

## Outputs
Baseline report, remediation diff, post-change report, reviewer decision, residual-risk notes.

## Checkpoints
- Baseline captured before remediation.
- No state-changing tool was called.
- Authentication and least privilege preserved.
- Post-change probe matrix is identical to baseline matrix.
- Independent reviewer signs verification status.

## Metrics
Foreign Host/Origin rejection rate, auth rejection rate, wildcard-bind violations, sensitive unauthenticated capability count, remediation attempts.

## Retry policy
Transient connection failures: maximum 2 retries per probe. Remediation hypotheses: maximum 3 implementation cycles. Each retry must add new evidence or change the hypothesis.

## Stop conditions
- Stop and block immediately if a foreign Host/Origin reaches MCP processing.
- Stop and block if unauthenticated access succeeds where auth is required.
- Stop after 3 unsuccessful remediation cycles and escalate with evidence.
- Never relax controls to force a pass.

## Failure path
Capture non-secret evidence, revert unsafe experimental changes when applicable, preserve the known-safe state, and escalate to the transport/security owner.

## Verification
`Implemented` means a candidate control change exists. `Measured` means the post-change probe matrix was executed. `Verified` requires the independent review plus all policy assertions passing.

## Definition of Done
Evidence file exists; baseline and post-change reports exist; prohibited probes fail closed; positive control works; auth and bind policy pass; security reviewer verifies; no secrets are recorded; no blocking issue remains.
