# Workflows

## Workflow A — Baseline and Diagnose Audience Binding
**Trigger:** new MCP OAuth integration, 401 after consent, IdP migration, or security review.

**Goal:** determine exactly where resource binding fails.

**Inputs:** endpoint, metadata, sanitized request captures, decoded test claims, policy.

**Baseline:** record current authorize/token/refresh parameters, token audience, server acceptance behavior, and upstream credential behavior before changes.

**Context:** canonical external MCP URL, issuer, provider, proxy topology.

**Stages:**
1. Evidence Analyst resolves protected-resource and authorization-server metadata.
2. Capture authorize request and classify resource-binding intent.
3. Capture token request and refresh request.
4. Decode test token claims and compare `iss`, `aud`, `exp`, scope to policy.
5. Send wrong-audience fixture to local/integration validator.
6. If gateway calls upstream API, compare inbound/outbound token fingerprints.
7. Produce root-cause classification: client request, issuer behavior, server validation, refresh drift, passthrough, or ambiguous metadata.

**Responsible agent:** Authorization Evidence Analyst.

**Tools:** `scripts/mcp_oauth_guard.py`, request capture, provider docs.

**Outputs:** baseline report and root-cause class.

**Checkpoints:** after metadata resolution; after token claim inspection; after negative test.

**Metrics:** negative rejection rate, metadata consistency, audience mismatch count.

**Retry policy:** one retry only for transient capture failure.

**Stop conditions:** canonical resource ambiguous; real credential would need to be exposed; wrong-audience token is accepted.

**Failure path:** fail closed and escalate configuration issue.

**Verification:** baseline evidence is reproducible from sanitized artifacts.

**Definition of Done:** root cause assigned with evidence and no security control weakened.

## Workflow B — Implement and Verify Resource Binding
**Trigger:** diagnosed configuration or code gap.

**Goal:** make the end-to-end flow audience-restricted and prove it.

**Inputs:** baseline, policy, provider adapter requirements.

**Baseline:** Workflow A results.

**Stages:**
1. Implementer fixes request construction or validator configuration.
2. Run valid fixture: correct issuer/audience/expiry/scope must pass.
3. Run sibling-audience fixture: must fail.
4. Run missing-audience fixture: must fail when policy requires audience.
5. Run expired and issuer-mismatch fixtures.
6. Run insufficient-scope fixture separately.
7. Verify refresh preserves effective audience.
8. Verify outbound upstream token fingerprint differs from inbound token.
9. Independent Verifier reruns tests from clean state.

**Responsible agent:** Implementer, then Independent Verifier.

**Tools:** conformance script, framework tests, sanitized traces.

**Outputs:** JSON report and verification record.

**Checkpoints:** no rollout until negative cases pass; implementation agent cannot self-approve final state.

**Metrics:** false accepts = 0; valid fixture success = 100%; passthrough = 0; mandatory fixture coverage = 100%.

**Retry policy:** maximum two implementation/test cycles. A third failure requires human investigation.

**Stop conditions:** any wrong-resource token accepted; provider semantics cannot prove resource restriction; passthrough remains possible.

**Failure path:** rollback auth change or keep deployment blocked.

**Verification:** verifier records Implemented, Measured, Verified separately.

**Definition of Done:** all mandatory fixtures pass, no secrets logged, and canonical resource matches deployment metadata.

## Workflow C — Authorization Regression Gate
**Trigger:** CI on auth, proxy, endpoint, OAuth library, metadata, scope, or IdP changes.

**Goal:** prevent silent audience validation regression.

**Inputs:** fixtures and policy.

**Stages:** validate fixture schema → run token claims checks → run request resource checks → run passthrough fingerprint test → emit report.

**Responsible agent:** deterministic CI hook; verifier reviews failures.

**Outputs:** exit code and JSON report.

**Retry policy:** zero logical retries; rerun once only for infrastructure failure.

**Stop conditions:** any mandatory invariant fails.

**Failure path:** block merge/deploy.

**Definition of Done:** report passes and is retained as build evidence.
