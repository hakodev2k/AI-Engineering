# Agent Sandbox Host-Object Membrane Verifier

## Topic
Detect and prevent live host capability leakage across in-process sandboxes used to execute untrusted/model-generated agent code.

## Category
Security

## Problem
Embedded code sandboxes often expose selected host objects for tool discovery, errors, schemas, or runtime bridges. A single host-realm object can invalidate the intended isolation boundary by exposing constructors, prototype chains, bridge modules, filesystem/network authority, or process secrets.

## Evidence
Current evidence is documented in `evidence/research.md`. The package is motivated by independent 2026 advisories including FrontMCP CVE-2026-67531, enclave-vm CVE-2026-22686, and mcp-run-python CVE-2026-25905.

## Existing approach
Frameworks commonly combine AST validation, Proxy/membrane wrappers, in-process VM libraries, Pyodide/WASM runtimes, and selective host APIs.

## Existing limitations
Wrapping is not capability elimination. Proxy invariants, host Error objects, cross-realm prototypes, non-configurable properties, language bridges, and exceptional paths can reveal raw host authority. Passing tests for expected code paths does not cover future object types introduced by dependency/runtime changes.

## Proposed improvement
Use a data-only crossing contract, reject capability-bearing values deterministically, test success and error paths, and require process/container isolation for high-risk general code. The reference verifier consumes normalized observations; it is a release guard, not a substitute for OS isolation.

## Architecture
```text
agent-sandbox-host-object-membrane-verifier/
├── README.md
├── config/
│   └── boundary-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-exposure-boundary-check.md
├── rules/
│   └── sandbox-boundary-rules.md
├── scripts/
│   └── boundary_verifier.py
├── skills/
│   └── sandbox-boundary-audit.md
├── subagents/
│   └── independent-boundary-verifier.md
├── tests/
│   └── test_boundary_verifier.py
└── workflows/
    └── audit-remediate-verify.md
```

## Installation
Python 3.10+; standard library only. Copy the package directory intact.

## Configuration
Edit `config/boundary-policy.json` only to add stricter environment-specific markers or depth limits. Keep `mode` as `fail_closed`. Do not permit live host objects merely to make integration easier.

## Usage
Prepare a **normalized** JSON observation from the host-to-sandbox adapter. Mark recognized capability-bearing values with `__host_type__`, for example `{"__host_type__":"error"}`; never serialize production secrets into the observation.

```bash
python scripts/boundary_verifier.py observation.json --policy config/boundary-policy.json
python -m unittest tests/test_boundary_verifier.py
```

Exit codes: `0` pass, `2` blocked, `3` input/policy error.

## Workflow
Follow `workflows/audit-remediate-verify.md`: Observe → measure baseline → diagnose crossing → form one remediation hypothesis → implement → measure again → independently verify. Remediation loops are bounded to two revisions.

## Metrics
Track forbidden crossings, error-path probe coverage, regression pass rate, high-risk execution isolation rate, and sensitive host capabilities visible to the sandbox process.

## Verification
- **Implemented**: adapter enforces the data-only contract and the pre-exposure check exists.
- **Measured**: before/after boundary inventories and probe results exist for the real runtime.
- **Verified**: deterministic and integration probes pass, error paths are covered, residual risks are documented, and `subagents/independent-boundary-verifier.md` returns Verified.

Package unit tests validate the reference contract only; they do not independently prove a third-party sandbox is secure.

## Safety
Never probe unauthorized systems, include real secrets in fixtures, or treat a passing membrane test as license to weaken sandbox/process isolation. General model-controlled code with high-value host credentials SHOULD run in a separate least-privilege process/container with restricted network and filesystem access.

## Failure handling
Detection: verifier block/error, test failure, unknown boundary type, or unexpected live capability. Evidence: preserve normalized finding data without secrets. Retry: at most two remediation revisions. Fallback: remove the crossing, disable the bridge, or move execution to a separate process/container. Escalation: security/runtime owner. Stop condition: unresolved host-capability reachability or failed independent verification.

## Definition of Done
Current evidence documented; baseline captured; limitations identified; data-only boundary implemented; normal and error paths measured; forbidden fixtures blocked; allowed fixtures pass; high-risk process-isolation decision recorded; tests pass; no secrets in artifacts; independent verification complete; no blocking security finding remains.

## Customization
Add environment-specific normalized markers and integration fixtures, but preserve fail-closed behavior. Prefer converting richer objects to inert records rather than expanding the allowlist.
