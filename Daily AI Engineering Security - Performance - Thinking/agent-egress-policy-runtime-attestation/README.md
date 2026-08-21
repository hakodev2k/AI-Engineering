# Agent Egress Policy Runtime Attestation

## Topic
Runtime verification that an AI coding agent's effective outbound network access matches the declared allow/deny policy.

## Category
**Security**

## Problem
Agent platforms increasingly expose sandbox and proxy allowlists, but recent reports show the desired/configured policy can diverge from what the active runtime actually enforces. A UI or config file may show restricted egress while a non-listed domain is still reachable, or a newly allowed domain may remain blocked because an active task retained stale proxy state.

This creates two failure classes:
- **over-permissive:** destinations expected to be denied are reachable;
- **over-restrictive:** required destinations expected to be allowed are blocked.

The first is a security-boundary failure; the second is an availability/integration failure. Both indicate control-plane/data-plane drift.

## Evidence
`evidence/research.md` documents recent public signals, including:
- Claude Code issue #84833 (2026-08-07): sandbox config displayed an allowlist while non-listed domains remained reachable;
- Codex issue #35243 (2026-07-24): project-scoped network allowlist changes were ignored by an already-running task;
- Claude Code issue #71629 (2026-06-26): trusted web egress allowlists were out of sync with actual tooling destinations;
- official platform documentation that models outbound policy as an infrastructure/runtime control.

## Existing approach
Common approaches are to trust config/UI state, troubleshoot reactively after a network failure, or broaden allowlists until tooling works.

## Existing limitations
Those approaches do not prove effective enforcement. Configuration can be stale, different execution paths can bypass the intended proxy, and broadening access can hide the underlying defect while increasing attack surface.

## Proposed improvement
Use a deterministic runtime attestation step before network-dependent agent work:
1. declare small explicit `allow` and `deny` probe sets;
2. hash the policy manifest;
3. run the attestor from the same execution boundary used by agent tools;
4. classify mismatch as over-permissive or over-restrictive;
5. invalidate verification whenever policy/runtime identity changes;
6. remediate with bounded retries and no automatic privilege expansion;
7. independently verify the final state.

## Architecture

```text
Declared policy
     |
     v
Policy validator + SHA-256
     |
     v
Active agent runtime/sandbox
     |
     v
Bounded HTTP(S) probes
     |
     +--> required allow endpoints
     +--> required deny controls
     |
     v
Machine-readable report
     |
     +--> over-permissive -> STOP / remediate
     +--> over-restrictive -> diagnose / remediate
     +--> pass -> independent verification
```

The LLM does not decide whether a probe passed. `scripts/egress_attest.py` performs the deterministic measurement.

## Package structure

```text
agent-egress-policy-runtime-attestation/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.example.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   └── egress_attest.py
└── tests/
    └── test_egress_attest.py
```

## Installation
Requires Python 3.10+ and no third-party packages.

```bash
python -m unittest tests/test_egress_attest.py -v
```

For integration, copy `config/policy.example.json` to a consumer-owned, ignored path and review every destination. Set `EGRESS_POLICY_PATH` to that path; the generated file is intentionally not committed in this package.

## Configuration
Edit the file named by `EGRESS_POLICY_PATH`:

```json
{
  "version": 1,
  "timeout_seconds": 3,
  "max_probes": 20,
  "allow": [
    {"name": "required-api", "url": "https://example.com/", "method": "HEAD"}
  ],
  "deny": [
    {"name": "blocked-control", "url": "https://blocked.invalid/", "method": "HEAD"}
  ]
}
```

Use organization-owned harmless endpoints for deny controls when possible. Never put credentials in URLs or requests.

## Usage
Run inside the same sandbox/container/VM boundary used by the agent:

```bash
python scripts/egress_attest.py "$EGRESS_POLICY_PATH" --output .agent/egress-attestation.json
```

Exit codes:
- `0` — policy matches measured behavior;
- `2` — mismatch;
- `3` — invalid input/policy;
- `4` — runtime/output failure.

The host should store runtime/session identity beside the report. The report's `policy_sha256` is not enough by itself to prove that two runs used the same runtime.

## Workflow
The principal workflow in `workflows/workflows.md` is:

**Observe → Validate → Measure → Classify → Diagnose → Remediate → Measure again → Independent Verify → Complete**

Loops are bounded to two remediation cycles. A full matrix is rerun after remediation; testing only the previously failing endpoint is insufficient because a fix could make another boundary over-permissive.

## Metrics
Track:
- required-allow pass rate;
- required-deny pass rate;
- over-permissive mismatch count;
- over-restrictive mismatch count;
- attestation duration;
- remediation attempts;
- policy expansion count;
- stale-policy detections;
- policy propagation time;
- age of latest verified attestation.

## Verification
Status must distinguish:

### Implemented
Policy manifest, attestor, hooks, and workflow are installed.

### Measured
A report was produced for a known runtime and policy hash.

### Verified
All allow probes succeeded, all deny probes were blocked, policy hash is current, runtime identity matches the agent execution environment, no security control was weakened during remediation, and an independent verifier accepted the result.

Never collapse these three states into one success label.

## Safety
- Do not use wildcard domains or disable the sandbox/proxy to obtain a passing test.
- Do not automatically expand allowlists from observed failures.
- Do not send credentials, cookies, auth headers, private payloads, or secrets in probes.
- Redirects are disabled to avoid silently probing undeclared destinations.
- Probe count and timeout are bounded.
- Prefer operator-owned deny controls; do not scan arbitrary third-party infrastructure.
- Any over-permissive result blocks sensitive network automation until resolved.
- Dangerous or irreversible remediation requires explicit human approval.

## Failure handling
### Detection
Any failed probe, invalid policy, stale hash, runtime mismatch, or missing deny evidence invalidates verification.

### Evidence
Preserve policy hash, runtime identity, per-probe result, elapsed time, and mismatch classification. Do not log secrets.

### Retry policy
One re-attestation after each concrete remediation, maximum two remediation cycles.

### Fallback
If runtime identity or policy state cannot be established, status is `Indeterminate`; stop sensitive network actions.

### Escalation
Provide the exact policy hash, runtime identity, failing controls, prior/current reports, and suspected stale/bypass execution path.

### Stop conditions
Stop on unresolved over-permissive egress, two failed remediation cycles, or any proposed fix that requires weakening policy without approval.

## Definition of Done
A deployment is complete only when:
- current public evidence and problem rationale are documented;
- declared policy is explicit and versioned;
- executable attestor is installed;
- unit tests pass;
- a baseline is captured inside the target runtime;
- both allow and deny controls are measured;
- current policy hash is recorded;
- runtime identity is recorded by the host;
- mismatch classification is empty;
- no wildcard/bypass was introduced;
- independent verification is complete;
- remaining risks and legitimate approved exceptions are documented;
- no blocking security issue remains.

## Customization
Adapt probe endpoints, attestation freshness TTL, runtime identity metadata, and orchestration hooks to your environment. Preserve the core invariants: explicit least-privilege policy, deterministic runtime measurement, both positive and negative controls, bounded retries, policy-hash invalidation, runtime binding, no secret-bearing probes, and independent verification after security remediation.

See `guide-intergration.md` for integration steps and `evidence/research.md` for source-backed rationale.
