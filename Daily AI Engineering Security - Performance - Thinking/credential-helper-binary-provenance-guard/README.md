# Credential Helper Binary Provenance Guard

**Category:** Security

## Problem
AI coding runtimes increasingly invoke OS credential/keychain helpers, Git credential helpers, and bundled command-line tools from altered PATHs, sandboxes, IDE sidecars, or packaged runtimes. If a security-sensitive helper is resolved by bare name, a shadow executable can be selected; if a runtime ships its own toolchain, helper discovery can also diverge from the user's trusted terminal. Both failure modes make credential access unreliable and can turn search-path ambiguity into code execution at a credential boundary.

## Evidence
`evidence/research.md` documents fresh 2026 reports from Claude Code and Codex plus the established untrusted-search-path weakness class. The strongest current report demonstrates `security` on macOS being resolved through `$PATH` instead of `/usr/bin/security`, with a reproducible shadow-binary attack path.

## Existing approach
Rely on the process PATH, shell lookup, bundled runtime defaults, sandbox policy, OS keychain ACLs, and manual troubleshooting with `which`/`command -v`.

## Existing limitations
Those controls do not prove which binary will actually execute before a credential operation. A sandbox can protect files while still launching the wrong helper; a bundled runtime can change helper discovery; generic authentication errors hide provenance failures.

## Proposed improvement
Treat credential-helper resolution as a security boundary. Declare expected absolute paths (and optional SHA-256 pins), resolve real paths without executing helpers, detect PATH shadowing, and fail closed before credential-bearing operations if provenance is ambiguous or changed.

## Architecture
- `evidence/research.md` — current public evidence and root causes.
- `config/helpers.example.json` — reviewed helper policy example.
- `skills/helper-provenance-preflight.md` — reusable investigation/preflight procedure.
- `rules/credential-helper-rules.md` — enforceable invariants.
- `subagents/provenance-verifier.md` — independent verification role.
- `workflows/attest-before-credential-use.md` — bounded observe/verify/recover flow.
- `hooks/pre-credential-helper.md` — blocking deterministic hook contract.
- `scripts/helper_provenance.py` — no-dependency provenance checker.
- `tests/test_helper_provenance.py` — regression tests.

## Installation
Python 3.10+; standard library only.

## Configuration
Copy `config/helpers.example.json` and review every expected path. Optional SHA-256 values should come from your trusted software-distribution or fleet-management process, not from the untrusted workspace.

## Usage
```bash
python3 scripts/helper_provenance.py --config config/helpers.example.json
python3 -m unittest tests/test_helper_provenance.py
```

The checker never invokes credential helpers and never reads credentials. It validates absolute/real paths, executability, optional hashes, and PATH resolution.

## Workflow
Observe actual runtime environment → baseline helper resolution → compare with reviewed policy → diagnose mismatch → repair launcher/runtime configuration → measure again → independently verify. Resolution remediation gets at most two attempts.

## Metrics
`helpers_checked`, `path_shadow_mismatches`, `realpath_mismatches`, `hash_mismatches`, `missing_helpers`, `preflight_block_rate`, and credential failures attributable to helper provenance.

## Verification
**Implemented:** policy, deterministic checker, rules, hook, tests exist.  
**Measured:** target runtime's effective helper path and PATH resolution are captured.  
**Verified:** checker exits 0, tests pass, expected binary identity is preserved, and the verifier confirms no credential operation was executed during attestation.

## Safety
MUST NOT print, read, or transmit credential contents. MUST NOT weaken sandbox, keychain ACLs, approvals, or authentication to make a check pass. Policy files MUST be sourced from a trusted configuration channel rather than the repository being evaluated.

## Failure handling
On mismatch, block the credential-bearing operation, preserve path/hash evidence, and repair configuration. Retry at most twice. If provenance remains ambiguous, fall back to a documented trusted absolute path or require human/platform-owner intervention; do not execute the ambiguous helper.

## Definition of Done
Current evidence documented; expected paths reviewed; baseline captured; provenance check passes; PATH shadowing test passes; optional hash pin verified where configured; no secret material exposed; tests pass; independent review complete; no security boundary weakened.

## Customization
Add platform-specific helpers by policy. Prefer exact paths; use hashes when your deployment can maintain them reliably. Do not hard-code volatile hashes without an update process.