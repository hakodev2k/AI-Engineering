# Shared Agent Artifact Authorization Parity Guard

**Category:** Security

## Problem
A platform can correctly mark a shared/template agent read-only through one API or UI while another upload/import/tool path still mutates the same artifact. When reusable agent bundles contain executable MCP configuration, an authorization mismatch can become cross-session compromise or runner code execution.

## Evidence
See `evidence/research.md`. Current evidence includes Omnigent GHSA-jrrm-9hc7-2v3h / CVE-2026-62674 (updated 2026-09-02), Grackle GHSA-f9ff-5x35-7gfw, and n8n GHSA-h44j-f5r5-ph73 / CVE-2026-59207.

## Existing approach
Common controls include read-only UI state, route-specific guards, session edit permission, scoped MCP identities and broad backend service credentials.

## Existing limitations
Those controls fail when authorization is attached to one route rather than the protected resource/effect, when alternate mutation paths drift, or when downstream services execute with broader authority than the initiating caller.

## Proposed improvement
Maintain an explicit mutation-path matrix and require identical controls for every path touching a protected shared artifact: authentication, resource-scope check, shared immutability guard, downstream re-authorization and audit. Verify parity deterministically and back it with negative authorization tests.

## Architecture
- `evidence/research.md` — current advisories, gap and root causes.
- `config/mutation-paths.json` — protected path/control matrix.
- `scripts/policy_parity_check.py` — dependency-free parity validator.
- `tests/test_policy_parity_check.py` — deterministic alternate-path regression tests.
- `rules/authorization-parity.md` — enforceable least-privilege invariants.
- `skills/protected-mutation-review.md` — reusable threat/review procedure.
- `subagents/security-verifier.md` — independent verifier role.
- `workflows/inventory-enforce-verify.md` — bounded remediation workflow.
- `hooks/pre-release-parity-gate.md` — blocking release gate.

## Package tree
```text
shared-agent-artifact-authorization-parity-guard/
├── README.md
├── config/mutation-paths.json
├── evidence/research.md
├── hooks/pre-release-parity-gate.md
├── rules/authorization-parity.md
├── scripts/policy_parity_check.py
├── skills/protected-mutation-review.md
├── subagents/security-verifier.md
├── tests/test_policy_parity_check.py
└── workflows/inventory-enforce-verify.md
```

## Installation
Python 3.9+; no third-party dependencies.

## Configuration
Replace the example paths in `config/mutation-paths.json` with every real direct and indirect mutation path. Do not omit import, upload, restore, clone, migration, bulk or tool-mediated paths.

## Usage
```bash
python scripts/policy_parity_check.py config/mutation-paths.json --output parity-report.json
python -m unittest tests/test_policy_parity_check.py
```

Product-specific negative tests must additionally attempt every protected path using a caller who owns/edits only a session but not the shared artifact.

## Workflow
Use `workflows/inventory-enforce-verify.md`: inventory effects → baseline parity → diagnose authorization gap → remediate → repeat negative tests → independent verification.

## Metrics
Mutation-path inventory coverage, parity violations, blocked unauthorized mutations, downstream re-authorization coverage, audit coverage.

## Verification
**Implemented:** policy matrix, deterministic checker, rules, workflow and tests exist.

**Measured:** the real application is measured when all actual mutation paths are represented and scoped-caller negative tests are executed.

**Verified:** every unauthorized path is blocked, authorized admin behavior remains functional, audit evidence exists, no secret is exposed, and the independent Security Verifier returns `verified`.

## Safety
Secure-by-default. Do not run untrusted bundles on production runners. Do not weaken sandboxing, caller scope, approval or audit to preserve compatibility. Dangerous or irreversible test actions require explicit human approval and isolation.

## Failure handling
Detection: parity violation, successful unauthorized mutation, lost caller scope, or missing audit event. Evidence: preserve route/control matrix and sanitized test output. Retry: maximum two remediation attempts per gap. Fallback: block or disable the unsafe mutation capability when operationally safe. Escalation: platform/security owner. Stop: unresolved authorization architecture, unsafe test environment, or two failed remediation attempts.

## Definition of Done
Evidence documented; all mutation paths inventoried; required controls enforced; parity checker passes; negative security tests pass; authorized behavior preserved; audit verified; no secrets exposed; independent verification complete; no blocking issue remains.

## Customization
Add controls for tenant isolation, immutable revision signatures, artifact provenance or stronger human approval when the platform's risk model requires them. Required controls may become stricter; they should not be relaxed merely to make a route pass.
