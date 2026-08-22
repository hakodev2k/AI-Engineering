# Trusted Plugin Runtime Provenance Gate

## Category
Security

## Problem
Privileged bundled plugins can fail because package provenance, trusted roots, sandbox-visible paths, child-process environment, and native-host registration drift out of sync. The unsafe response is to disable sandboxing or broadly trust user/plugin directories. This package instead diagnoses the exact boundary mismatch and fails closed.

## Evidence
See `evidence/research.md`. Multiple August 2026 Codex Windows reports reproduce bundled Browser/Chrome services being rejected by trusted RPC path validation even when the service exists and appears legitimately installed. Other reports show partial native-host installation state.

## Existing approach
Current runtimes use trusted-code-path checks, sandboxed workers, bundled plugin caches, and native-host registration. These controls are necessary but can become internally inconsistent across process boundaries.

## Existing limitations
A parent process can consider a path trusted while the privileged child does not; plugin state can report installed while required native-host registration is absent; diagnostics often do not expose the effective trust view that rejected the module.

## Proposed improvement
Run a deterministic pre-launch provenance gate before privileged service startup. Validate canonical containment, package hash/version when available, parent and sandbox trust roots, required child environment propagation, and native-host registration. Never auto-expand trust.

## Architecture
```text
trusted-plugin-runtime-provenance-gate/
├── README.md
├── evidence/research.md
├── skills/provenance-preflight.md
├── rules/trust-boundary-rules.md
├── subagents/security-verifier.md
├── workflows/diagnose-and-verify.md
├── hooks/pre-launch.md
├── scripts/trusted_plugin_preflight.py
└── tests/test_trusted_plugin_preflight.py
```

## Installation
Requires Python 3.10+ and only the standard library. Copy the package into an agent/runtime repository. No elevated privileges are required for the validator itself.

## Configuration
Create a JSON file such as:

```json
{
  "plugin_root": "C:/Users/me/.agent/plugins/browser/1.2.3",
  "service_path": "C:/Users/me/.agent/plugins/browser/1.2.3/scripts/browser-service.mjs",
  "expected_sha256": "<64-hex trusted manifest hash>",
  "trusted_roots": ["C:/Users/me/.agent/plugins/browser/1.2.3"],
  "sandbox_trusted_roots": ["C:/Users/me/.agent/plugins/browser/1.2.3"],
  "required_child_env": {"TRUST_MODE": "strict"},
  "child_env": {"TRUST_MODE": "strict"}
}
```

For native-host integrations, add:

```json
{"native_host":{"manifest":"C:/path/host.json","registered_manifest":"C:/path/host.json"}}
```

## Usage
Run `python scripts/trusted_plugin_preflight.py --config preflight.json`. Exit `0` means all configured invariants pass; exit `1` means launch must be blocked; exit `2` means invalid input/configuration.

## Workflow
Follow `workflows/diagnose-and-verify.md`: Observe → baseline → classify mismatch → smallest external repair → one recheck → independent security verification → launch only on pass.

## Metrics
Track preflight pass rate, failures by class, false-positive rate for known-good packages, unsafe-workaround count, time-to-diagnosis, and partial-install detections.

## Verification
Run `python -m unittest tests/test_trusted_plugin_preflight.py`. Tests cover known-good provenance, path escape, and parent/sandbox trust divergence. Extend fixtures for platform-specific native-host registration and signed package metadata.

## Safety
The script is read-only. It never edits trusted roots, registry state, plugin files, or sandbox configuration. Unknown provenance fails closed. Any privilege broadening or machine-level repair requires explicit human approval.

## Failure handling
Detection: non-zero preflight exit. Evidence: structured error codes. Retry: one recheck only after observable repair. Fallback: keep affected privileged integration disabled while unrelated safe functionality continues. Escalation: runtime/package owner. Stop: second failure, unknown provenance, or unresolved trust-view divergence.

## Definition of Done
**Implemented:** package files and deterministic validator exist. **Measured:** current and post-repair preflight reports are captured. **Verified:** known-good fixtures pass, unsafe/inconsistent fixtures block, parent and sandbox trust views agree, required registration passes, and no security control is weakened.

## Customization
Add platform adapters that export effective sandbox roots or native-host registration into the JSON input. Keep platform collection separate from the validator so deterministic policy remains testable.