# Workflow: Research and Diagnose

**Trigger:** new MCP HTTP transport, new DNS-rebinding advisory, or ingress-policy regression.  
**Goal:** establish a measurable attack path or prove it is blocked.

## Inputs
Runtime config, dependency versions, proxy config, exposed tools, policy and hostile-request fixtures.

## Baseline
Record bind address, allowed hosts/origins, authentication requirements, tool consequence classes and current unit-test results.

## Stages
1. **Observe** actual ingress configuration and versions.
2. **Measure baseline** with benign and hostile host/origin fixtures.
3. **Diagnose** which layer accepts an unsafe request.
4. **Form hypothesis** naming the missing or bypassed boundary.
5. **Implement improvement** in policy/config/code without weakening authentication.
6. **Measure again** using identical fixtures.
7. If not improved, re-evaluate the hypothesis; maximum 2 retries.
8. **Verify** with the independent security verifier.

## Responsible agent
Implementation owner performs stages 1–7; `subagents/security-verifier.md` performs final verification.

## Tools
Dependency/advisory lookup, configuration inspection, `scripts/ingress_guard.py`, unit tests.

## Outputs
Baseline evidence, root cause, changed control, before/after results, verification status.

## Checkpoints
After baseline; before enabling network exposure; after tests; before release.

## Metrics
Host/origin rejection coverage, authentication coverage for consequential tools, vulnerable-version count, test pass rate.

## Retry policy
Maximum 2 remediation cycles.

## Stop conditions
Secret exposure, untrusted-origin privileged invocation, ambiguous public exposure, or exhausted retries.

## Failure path
Disable affected HTTP transport or consequential tools and escalate for security review.

## Verification
Independent reviewer reproduces hostile fixtures.

## Definition of Done
Baseline captured, root cause documented, hostile paths blocked, security tests pass, no secrets exposed, and independent verification passes.
