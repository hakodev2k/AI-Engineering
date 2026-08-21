# Workflows

## Workflow 1 — Discovery URL Boundary Audit

**Trigger:** remote MCP OAuth is introduced or upgraded.

**Goal:** identify and guard every URL derived from remote metadata.

**Inputs:** client source, protocol version, policy.

**Baseline:** count metadata URL sinks, current validation coverage, redirect behavior, browser-launch behavior.

**Context:** deployment network, development exceptions, HTTP client capabilities.

**Stages:**
1. Research Agent records current specification guidance and recent incident/issue signals.
2. Security Implementation Agent enumerates URL sinks and classifies fetch vs browser usage.
3. Run `scripts/url_policy.py` against representative candidates.
4. Route each sink through the common validator.
5. Disable implicit redirects and add per-hop revalidation.
6. Add browser-scheme checks before OAuth authorization launch.
7. Run adversarial tests.
8. Verification Agent reviews coverage independently.

**Checkpoints:** sink inventory complete; common validator integrated; tests passing; residual peer-IP limitation documented if applicable.

**Metrics:** guarded sinks/total sinks; adversarial block rate; allowed public endpoint pass rate; policy decision latency.

**Retry policy:** maximum two implementation/test cycles. Policy failures are not retried as network operations.

**Stop conditions:** success when all sinks are guarded and verification passes; stop after two failed remediation cycles and escalate with exact failing fixture.

**Failure path:** preserve strict policy, capture failing interoperability endpoint and require explicit scoped exception review.

**Definition of Done:** evidence current, baseline recorded, all sinks mapped, implementation complete, adversarial tests pass, exceptions documented, independent verification complete.

## Workflow 2 — Safe OAuth Metadata Fetch

**Trigger:** client needs to fetch protected-resource, authorization-server or OIDC metadata.

**Goal:** fetch metadata without allowing SSRF through URL or redirects.

**Inputs:** candidate URL, policy.

**Baseline:** none; every call starts untrusted.

**Stages:**
1. Preflight URL using `scripts/url_policy.py` or equivalent library implementation.
2. If denied, stop with reason code.
3. Resolve address set and retain approved set for connection-time verification when supported.
4. Fetch with redirects disabled, bounded timeout and bounded response bytes.
5. If 3xx, resolve `Location`, increment redirect count, restart at stage 1.
6. On 2xx, validate content type/size and parse expected metadata schema.
7. Validate every nested endpoint before its later use; do not assume parent metadata approval transfers trust.
8. Record sanitized metrics.

**Responsible agent:** Security Implementation Agent; Verification Agent validates fixtures.

**Outputs:** parsed metadata plus decision audit, or a deny/error.

**Retry policy:** one retry maximum for transient DNS/network failure if policy passed; zero retries for policy/schema failure.

**Stop conditions:** valid bounded metadata returned, or explicit deny/error.

**Verification:** no mock server representing a private destination receives a request in deny fixtures.

## Workflow 3 — Security Regression Response

**Trigger:** a new MCP/OAuth URL-handling issue, spec change or SSRF advisory appears.

**Goal:** determine whether the existing policy covers the newly observed attack path.

**Stages:** Observe → reproduce safely with local mocks → map missing invariant → add failing test → implement minimal policy change → rerun full suite → independent review.

**Metrics:** time to failing regression test; number of policy exceptions added; regression suite pass rate.

**Retry policy:** two fix attempts maximum before escalation.

**Stop conditions:** regression blocked without breaking approved public fixtures, or escalation with preserved failing test.

**Definition of Done:** new attack class documented in evidence, deterministic test added, implementation and full regression suite verified.
