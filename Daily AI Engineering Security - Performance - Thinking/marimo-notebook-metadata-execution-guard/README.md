# Marimo Notebook Metadata Execution Guard

**Category:** Security

## Problem
Untrusted notebook metadata can become runtime configuration before a user executes notebook code. CVE-2026-75149 showed a concrete path where an attacker-controlled MCP command in marimo notebook configuration could launch as a local subprocess when the notebook was opened in edit mode.

## Evidence
See `evidence/research.md`. The package is grounded in CVE-2026-75149, marimo PR #10281 and the associated fix, plus independent technical reporting published in August 2026.

## Existing approach
Upgrade affected marimo releases, sanitize embedded configuration, allowlist safe sections, and treat external notebooks as untrusted.

## Existing limitations
The patched product-specific fix does not automatically protect other artifact-driven developer tools; blocklists age poorly; trust prompts may occur after configuration parsing; teams often lack deterministic pre-open policy enforcement.

## Proposed improvement
Move the trust decision before runtime initialization. Extract metadata without executing the notebook, classify side-effect-capable configuration, fail closed on unknown sections, and require explicit trust elevation for risky metadata.

## Architecture
```text
marimo-notebook-metadata-execution-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-open.md
├── rules/
│   └── metadata-boundary.md
├── scripts/
│   └── metadata_guard.py
├── skills/
│   └── artifact-trust-analysis.md
├── subagents/
│   └── security-verifier.md
├── tests/
│   └── test_metadata_guard.py
└── workflows/
    └── preopen-verification.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Edit `config/policy.json` only through security review. Keep the safe-section list positive and narrow. New capability-bearing keys should remain denied until classified.

## Usage
```bash
python scripts/metadata_guard.py --metadata artifact-metadata.json --policy config/policy.json
python -m unittest tests/test_metadata_guard.py
```

Use `--trusted` only after an explicit, attributable trust decision.

## Workflow
Follow `workflows/preopen-verification.md`: observe provenance → extract without execution → classify → gate → test → independent verification.

## Metrics
- malicious-fixture block rate
- safe-metadata pass rate
- unknown-section count
- pre-open gate coverage
- false-positive review rate

## Verification
The guard must block MCP/process/network/secret/server metadata in untrusted artifacts and fail closed on unknown top-level sections. Unit tests cover benign cosmetic metadata, MCP command injection, attacker-defined base URLs, unknown future sections, and explicit trust elevation.

## Safety
Analysis MUST NOT import or execute the notebook. Secrets MUST NOT be exposed to artifact-defined endpoints. A blocked artifact remains quarantined; do not weaken policy to open it.

## Failure handling
**Detection:** non-zero guard exit, unexpected side effect, unknown key, or provenance ambiguity.  
**Evidence:** artifact hash, extracted metadata, reason codes, test output.  
**Retry policy:** maximum 1 extraction correction and 1 implementation correction.  
**Fallback:** quarantine and inspect in an isolated, non-secret environment.  
**Escalation:** security owner for any process/network/credential path.  
**Stop condition:** any unexplained side effect or exhausted retry.

## Definition of Done
**Implemented:** pre-open hook and guard are integrated.  
**Measured:** gate coverage and fixture outcomes are captured.  
**Verified:** tests pass; an independent reviewer confirms no untrusted side-effect configuration reaches runtime initialization; no secrets are exposed.

## Customization
Adapt the allowlist and side-effect markers to other notebook or artifact formats, but preserve fail-closed behavior and side-effect-free extraction.
