# Local Inference DNS Rebinding Poisoning Guard

**Category:** Security

## Problem
Local inference servers are often treated as inherently trusted. Current NemoClaw research shows that widening an unauthenticated Ollama listener to `0.0.0.0:11434` for container reachability can create browser/LAN access paths and permit persistent model-template poisoning that survives client-supplied system prompts.

## Evidence
See `evidence/research.md`. The package is grounded in Cyera/Oasis research published 2026-08-25, independent reporting, NVIDIA/NemoClaw public issue signals, and an earlier NemoClaw security advisory demonstrating access-control risk in the same agent infrastructure.

## Existing approach
Loopback binding, host firewalls, container networking, DNS-rebinding protections, sandboxing, and least-privilege agent tooling.

## Existing limitations
Container setups often widen listeners for convenience; users may see `localhost` while services bind all interfaces; management and inference APIs can share one unauthenticated listener; model template integrity is usually not attested by the agent; sandboxing does not protect organizational resources delegated to a compromised agent.

## Proposed improvement
Block agent startup unless the effective listener/authentication state matches policy and the model template matches an approved fingerprint. Treat model management as a security control plane rather than a local implementation detail.

## Architecture
```text
local-inference-dns-rebinding-poisoning-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-agent-start.md
├── rules/
│   └── inference-boundary.md
├── scripts/
│   └── inference_guard.py
├── skills/
│   └── inference-trust-analysis.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_inference_guard.py
└── workflows/
    └── startup-integrity-verification.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
`config/policy.json` defaults to loopback-only listeners and requires template fingerprints. Any exception for non-loopback access requires a separate authenticated/constrained transport design and security review.

## Usage
```bash
python scripts/inference_guard.py --state runtime-state.json --policy config/policy.json
python -m unittest tests/test_inference_guard.py
```

The runtime-state document should report `bind_address`, `authenticated`, `management_endpoints_exposed`, `declared_network_scope`, `effective_network_scope`, `current_template`, and `expected_template_sha256`.

## Workflow
Follow `workflows/startup-integrity-verification.md`: measure actual network state → compare declared/effective scope → verify management exposure/authentication → attest template → remediate once if needed → measure again → independent verification.

## Metrics
- non-loopback unauthenticated listener count
- management-endpoint exposure count
- declared/effective policy mismatches
- template-fingerprint drift events
- blocked agent startups
- regression-test pass rate

## Verification
Unit tests cover safe loopback operation, all-interface exposure, unauthenticated management APIs, poisoned template drift, and declared/effective network-policy mismatch.

## Safety
Do not silently rebaseline a changed template. Do not expose prompt or secret contents in logs. Blocking startup is preferable to granting a possibly poisoned model access to repositories, CI/CD, internal APIs, cloud resources, or MCP tools.

## Failure handling
**Detection:** guard reason code, listener mismatch, unauthenticated management exposure, fingerprint drift.  
**Evidence:** listener snapshot, policy snapshot, template SHA-256, test result.  
**Retry policy:** maximum 1 remediation attempt and 1 rerun.  
**Fallback:** stop the agent and isolate the model runtime.  
**Escalation:** security/runtime owner for unexplained exposure or model drift.  
**Stop condition:** integrity cannot be established or retries are exhausted.

## Definition of Done
**Implemented:** pre-agent hook and guard integrated.  
**Measured:** actual listener/network state and template hash captured.  
**Verified:** tests pass; independent reviewer confirms safe effective scope and matching template fingerprint; no unsafe management endpoint remains reachable.

## Customization
Adapt the state collector to Ollama or other local inference servers, but preserve fail-closed startup, effective-policy measurement, management/inference separation, and explicit model-integrity baselines.
