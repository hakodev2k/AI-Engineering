# Security Scan Warning Projection Integrity Guard

**Category:** Security

## Problem
Security scans can finish successfully while execution warnings disappear between the scanner's canonical state and downstream SARIF, bulk ledgers, or campaign summaries. That can make stale or degraded scan evidence look clean to unattended CI consumers.

## Evidence
Current public evidence is documented in `evidence/research.md`, including OpenAI `codex-security` issues #251 and #248 from August 2026 covering warning loss in SARIF and bulk-scan paths.

## Existing approach and limitation
Normal scan pipelines use exit status, findings, coverage, SARIF, and bulk receipts. These surfaces do not necessarily preserve the same execution metadata. A warning can therefore be visible interactively yet absent from the artifact used for policy enforcement.

## Proposed improvement
Treat run warnings as a canonical evidence set and verify semantic preservation across every required projection. The package fingerprints warnings, defines enforceable preservation rules, provides a deterministic verifier, and requires an independent verification boundary.

## Architecture
```text
canonical scan warnings
        |
        v
stable warning fingerprints
        |
        +--> SARIF projection ----+
        +--> bulk receipt --------+--> deterministic comparison --> allow/block
        +--> other JSON output ---+
```

## Package tree
```text
security-scan-warning-projection-integrity-guard/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── post-scan-projection-gate.md
├── rules/
│   └── warning-projection-rules.md
├── scripts/
│   └── verify_warning_projection.py
├── skills/
│   └── projection-integrity-audit.md
├── subagents/
│   └── security-evidence-verifier.md
├── tests/
│   └── test_verify_warning_projection.py
└── workflows/
    └── measure-repair-verify.md
```

## Installation
Requires Python 3.9+ and no third-party Python dependencies. Copy this package into the security engineering repository or invoke the script from CI.

## Configuration
The verifier is intentionally projection-agnostic. Supply one canonical JSON file followed by one or more required projections. Generic projections may expose a top-level `warnings` array. SARIF projections are inspected at `runs[].invocations[].toolExecutionNotifications[]`.

## Usage
```bash
python scripts/verify_warning_projection.py canonical.json result.sarif bulk-receipt.json
python tests/test_verify_warning_projection.py
```

## Workflow
Follow `workflows/measure-repair-verify.md`: Observe → baseline → diagnose → hypothesis → implement → measure again → independent verification. Maximum two repair retries.

## Metrics
- warning preservation ratio: 1.0 for every required projection;
- missing warning count: 0;
- clean-run false warning count: 0;
- schema-valid projection rate: 100%.

## Verification
The implementation owner must not be the only verifier. Use `subagents/security-evidence-verifier.md` and the deterministic script against persisted artifacts. The hook blocks completion on malformed evidence or missing warnings.

## Safety
This package does not weaken scanning, suppress warnings, alter finding severity, or require secrets. Preserve warning semantics. Use safe identifiers/hashes when correlation data could contain credentials.

## Failure handling
Detection: non-zero verifier result, schema failure, or preservation ratio below 1.0. Evidence: persist canonical/projection files and missing fingerprints. Retry policy: maximum two implementation retries with a revised hypothesis. Fallback: mark the affected projection non-authoritative and retain canonical artifacts. Escalation: security/platform owner. Stop condition: two failed repair attempts or unreliable canonical warning capture.

## Definition of Done
**Implemented:** warning transport/projection changes exist. **Measured:** before/after preservation matrices are captured. **Verified:** tests pass, every required projection preserves 100% of canonical warnings, no false warnings appear in clean fixtures, schemas remain valid, and an independent verifier records no blocking issue.

## Customization
Extend `projected_warnings()` only for explicitly supported machine-readable formats. Keep warning identity normalization deterministic and version it if warning schemas materially change.