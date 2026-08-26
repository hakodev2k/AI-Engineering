# Agent Tool Allowlist Dispatch Integrity Gate

**Category:** Security

## Problem
Tool/subagent allowlists can be visible to the model or present in configuration while the runtime dispatcher still resolves and executes a broader global capability set.

## Evidence
Current evidence is documented in `evidence/research.md`, including Spring AI CVE-2026-59318 (2026-08-20), VS Code issue #331002 (2026-08-15), and ZeroClaw issue #7063 (2026-06-01).

## Existing approach
Framework upgrades, model-visible schema filtering, per-agent allowlists, human approval and argument/output guardrails.

## Existing limitations
Discovery filtering is not execution authorization; alternate lanes and global fallback paths can widen authority; nested delegation can lose scope.

## Proposed improvement
Enforce a fail-closed capability-membership check at the final dispatch boundary using an explicit principal/request/scope envelope. Delegation may only narrow authority.

## Architecture
```
agent-tool-allowlist-dispatch-integrity-gate/
├── README.md
├── evidence/research.md
├── hooks/pre-dispatch.md
├── rules/dispatch-boundary.md
├── scripts/dispatch_guard.py
├── skills/authorization-integrity-audit.md
├── subagents/security-verifier.md
├── tests/test_dispatch_guard.py
└── workflows/diagnose-implement-verify.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Integrate the guard with your framework's final tool/subagent dispatch path. Supply an envelope containing `principal`, `request_id`, `capability`, and `effective_allowlist`; optionally include delegated scope and whether global fallback was attempted.

## Usage
Run a unit test suite with `python -m unittest tests/test_dispatch_guard.py`. Evaluate a captured envelope with `python scripts/dispatch_guard.py envelope.json`.

## Workflow
Observe → capture baseline → diagnose resolution path → form one bypass hypothesis → implement final-boundary enforcement → rerun negative fixtures → independent verification.

## Metrics
- Unauthorized dispatch count: 0
- Dispatch-path enforcement coverage: 100%
- Hidden-capability negative-fixture block rate: 100%
- Delegated-scope subset violations: 0

## Verification
The implementer is not the final verifier. The verifier must reproduce a globally registered but request-hidden capability attempt and a nested-delegation widening attempt.

## Safety
Use non-destructive fixtures. Never add broad permissions to make a test pass. Missing scope fails closed. Do not include secrets in envelopes or logs.

## Failure handling
Detection: nonzero guard exit, negative fixture executes, or unverified dispatcher lane. Evidence: reason codes and test output. Maximum retries: 2. Fallback: disable the affected privileged capability/lane. Escalation: security owner. Stop on secret exposure, production mutation, or unresolved scope ambiguity.

## Definition of Done
**Implemented:** final dispatcher enforces effective scope.  
**Measured:** all negative fixtures and dispatch lanes are exercised.  
**Verified:** independent reviewer confirms 100% block rate for forbidden capabilities and no authority widening.

## Customization
Extend the authorization envelope with tenant, workspace or resource constraints, but preserve fail-closed semantics and final-dispatch enforcement.
