# Verification

## Scope
This verification covers the reusable package itself: evidence consistency, threat model, policy invariants, deterministic guard behavior, cache rules, approval rules, and artifact consistency. It does not claim that an external MCP client has already integrated the package.

## Implemented
- Deterministic MCP instruction validator.
- Configurable hard limits and suspicious/hard-block patterns.
- Explicit trust classes and taint output.
- Policy that forbids public caching for untrusted instructions.
- Sensitive-tool classification.
- Host-side approval requirements defined in rules/workflows.
- Regression test runner with benign and adversarial fixtures.
- Threat model covering assets, actors, trust boundaries, taint, cache, approval, detection, and response.
- Integration, recovery, and audit guidance.

## Current evidence verification
Current-source review during package generation confirmed:
- MCP issue #3213 was opened on 2026-08-07 and remained open at verification time; it describes `server/discover.instructions` / legacy `initialize.instructions` as a server-controlled prompt-injection surface and describes shared-cache amplification.
- MCP's tool-annotation guidance states that annotations from untrusted servers are hints rather than enforcement and that hard guarantees belong in host/runtime/network/authorization controls.
- OpenAI Lockdown Mode guidance states that restricting outbound access reduces prompt-injection exfiltration risk but does not prevent injected content from affecting model behavior or response accuracy.

These sources support the package's central design decision: remote MCP instruction text is untrusted data, and enforcement must remain host-side.

## Generator-side behavioral verification
The current `instruction_guard.py` decision logic and `config/policy.json` were checked against the same scenarios encoded in `tests/run_tests.py`. Expected behavior matched for all eight verification groups:

1. benign untrusted content → `allow-data-envelope`, tainted;
2. override + approval-bypass content → `block`;
3. secret/exfiltration content → `block`;
4. suspicious non-hardblock directive → `allow-with-approval-taint`;
5. trusted-managed benign content → `allow-data-envelope`, not tainted;
6. oversized content → `block` with size reason code;
7. disallowed control character → `block` with control-character reason code;
8. policy invariants → public untrusted cache disabled, network/repository mutation sensitive classes present, raw audit payload storage disabled.

The repository includes `tests/run_tests.py` so an integrating environment can execute the same scenarios directly with its supported Python runtime.

## Measured
The package defines measurable controls:
- instruction classification coverage;
- raw untrusted content entering trusted instruction channels;
- allow/taint/block rates;
- untrusted public-cache hits;
- sensitive tainted calls;
- approval/denial counts;
- unauthorized sensitive executions;
- regression false positives/false negatives;
- audit coverage and policy-version drift.

Production values require integration into a specific MCP host and are therefore not claimed as production measurements in this package.

## Verified package invariants
1. `config/policy.json` sets `publicCacheForUntrustedInstructions` to `false`.
2. The policy includes repository mutation and network egress among sensitive classes.
3. Audit defaults do not store raw instruction payloads.
4. `instruction_guard.py` uses strict UTF-8 decoding, Unicode normalization, byte/character limits, control-character checks, deterministic reason codes, SHA-256 hashing, and non-zero exit codes on blocks/errors.
5. The guard never emits normalized content for a `block` decision.
6. Remote/unknown trust classes produce taint.
7. Workflow/rules explicitly prohibit model self-approval.
8. Cache workflow requires server identity, tenant, trust class, protocol version, policy version, and payload hash.
9. Tests cover benign content, override attempt, secret/exfiltration attempt, suspicious directive, managed source, oversized payload, control characters, and policy invariants.
10. Failure paths fail closed rather than reverting to unguarded instruction ingestion.
11. `architecture/threat-model.md` defines remote instructions as data rather than authority and identifies cache, model context, tool execution, and human approval as distinct trust boundaries.
12. README references only package artifacts confirmed to exist.

## Required runtime verification after integration
An integrating project must additionally prove:
- all MCP instruction ingestion paths invoke the guard before prompt assembly;
- no remote payload reaches system/developer authority;
- taint survives in host-managed metadata and derived planning state;
- sensitive tool calls under taint cannot execute without valid host authorization;
- argument changes invalidate prior approval;
- two tenants cannot share untrusted instruction cache entries;
- validator/policy upgrades force revalidation;
- regression tests pass in the project's supported runtime;
- audit logging does not expose secrets;
- failure/recovery paths never restore unguarded ingestion.

## Acceptance threshold
The reusable package is complete when all package artifacts exist, current evidence supports the problem, package invariants are internally consistent, and references point only to real package files. A downstream integration is complete only after all runtime verification items above pass.

## Security status
The reusable package is verified as an internally consistent defensive implementation package. No production safety claim is made without downstream integration evidence. The design intentionally distinguishes **Implemented**, **Measured**, and **Verified** states.