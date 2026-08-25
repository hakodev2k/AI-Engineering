# Tool Advertisement–Dispatch Authorization Parity Guard

**Category:** Security

## Problem
Agent frameworks can advertise a request-scoped subset of tools to the model while dispatch still resolves a broader application-wide tool set. A model-induced call to an unadvertised tool can then cross the intended authorization boundary.

## Evidence
Spring published CVE-2026-59318 on 2026-08-20 for exactly this failure mode in `DefaultToolCallingManager`: a tool absent from the current request could still be resolved and executed through a global resolver. Spring AI 2.0.1 changes fallback behavior to disabled by default and documents that enabling it makes resolver-visible tools executable even when not attached to the request. A July 2026 Spring AI governance request independently asks for deterministic per-call authorization rather than relying on the model-visible tool list.

See `evidence/research.md`.

## Existing approach and limitation
Request-level tool lists, resolver registries, HITL approval, and framework upgrades all help. The residual weakness is architectural: teams frequently treat *advertised to the model* as equivalent to *authorized at dispatch*. Custom managers, wrappers, older versions, explicit fallback settings, or future regressions can reintroduce the mismatch.

## Proposed improvement
Treat dispatch authorization as a separate deterministic invariant. Every tool call MUST be checked against the effective request allow-set immediately before execution. Resolver discovery is not authorization. The decision record is suitable for audit without storing secret arguments.

## Architecture
`request tools -> model -> requested tool -> pre-dispatch parity gate -> execute/block`

## Package tree
```text
README.md
evidence/research.md
config/policy.example.json
skills/dispatch-parity-audit.md
rules/authorization-boundary.md
subagents/security-verifier.md
workflows/measure-diagnose-enforce.md
hooks/pre-dispatch-parity.md
scripts/verify_dispatch_policy.py
tests/test_verify_dispatch_policy.py
```

## Installation
Python 3.9+; no third-party dependencies.

## Configuration
Copy `config/policy.example.json`. Prefer `resolver_fallback_enabled=false`.

## Usage
```bash
python scripts/verify_dispatch_policy.py --event call.json --policy config/policy.example.json
python -m unittest tests/test_verify_dispatch_policy.py
```

## Workflow
Observe → measure baseline → diagnose widening layer → enforce at final dispatch → measure again → independent verification. Maximum two remediation loops.

## Metrics
`unadvertised_dispatch_attempts`, `blocked_unadvertised_dispatches`, `authorized_dispatches`, `fallback_resolver_dispatches`, false-positive rate, covered dispatch paths.

## Verification
**Implemented**: guard runs on every dispatch path. **Measured**: baseline/post-change mismatch counts recorded. **Verified**: unadvertised fixtures blocked, advertised tools pass, fallback cannot widen authority without explicit policy, independent verifier confirms no bypass.

## Safety
The checker never executes tools or requires arguments. Do not log raw secrets. Human approval, sandboxing, identity checks and tool-local authorization remain required where applicable.

## Failure handling
Malformed events or missing policy fail closed. Maximum two remediation retries. Unknown paths are disabled or escalated rather than bypassed.

## Definition of Done
Evidence documented; baseline captured; limitations identified; guard active; tests pass; before/after metrics recorded; fallback policy explicit; approvals preserved; independent verification complete; no blocking bypass remains.

## Customization
Only add global exceptions that have separate authorization. Discovery MUST NOT become authority.