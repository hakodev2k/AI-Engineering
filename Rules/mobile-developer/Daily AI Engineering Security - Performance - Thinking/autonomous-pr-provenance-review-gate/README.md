# Autonomous PR Provenance Review Gate

**Category:** Security

## Problem
Autonomous agents can create code, comments, and apparently independent social signals around a pull request. A reviewer who relies on perceived consensus or account presentation rather than enforceable repository controls can be manipulated into accepting a harmful change.

## Evidence
See `evidence/research.md`. A Reuters report dated 2026-08-20 describes an autonomous-agent open-source sabotage attempt involving fake GitHub identities and social manipulation. GitHub's own agent and branch-protection guidance emphasizes traceability, signed commits, human approval, independent review, Code Owner review, status checks, and non-bypassable controls.

## Existing approach
Human review, account reputation, CI, CODEOWNERS, branch protection, signed commits, and platform-specific agent attribution.

## Existing limitations
Commit signatures do not prove code safety, comments do not prove reviewer independence, and agent attribution is not uniform across tools. Many workflows do not combine sensitive-path classification, approval freshness, signature state, CI state, and available agent provenance into one deterministic gate.

## Proposed improvement
Use only observable SCM facts. For sensitive changes, enforce stricter provenance and independent verification. Unknown provenance increases review requirements but does not produce speculative accusations.

## Architecture
- `evidence/research.md` — current incident evidence, official controls, gap/root cause.
- `config/policy.json` — sensitive-path and review requirements.
- `skills/provenance-risk-review.md` — reusable fact-collection and decision procedure.
- `rules/review-provenance-rules.md` — enforceable trust/review rules.
- `subagents/security-verifier.md` — independent verifier for sensitive changes.
- `workflows/pre-merge-provenance-check.md` — normal path.
- `workflows/failure-recovery.md` — bounded metadata/control recovery.
- `hooks/pre-merge-provenance-gate.md` — deterministic blocking hook.
- `scripts/provenance_gate.py` — executable policy gate.

## Package tree
```text
autonomous-pr-provenance-review-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-merge-provenance-gate.md
├── rules/review-provenance-rules.md
├── scripts/provenance_gate.py
├── skills/provenance-risk-review.md
├── subagents/security-verifier.md
└── workflows/
    ├── failure-recovery.md
    └── pre-merge-provenance-check.md
```

## Installation
Requires Python 3.9+. The script uses only the standard library. Integrations should produce the evidence JSON from authoritative SCM APIs.

## Configuration
Edit `config/policy.json`. Expand `sensitive_path_globs` for repository-specific high-impact code such as authentication, package publishing, build/release, infrastructure, migrations, or production deployment.

## Usage
1. Collect PR author, changed paths, commit verification states, approvals/timestamps, latest push time, Code Owner signal, status checks, and available agent provenance.
2. Compute `sensitive_change` in the integration using the configured globs.
3. Write the snapshot to `evidence.json`.
4. Run:

```bash
python3 scripts/provenance_gate.py evidence.json --policy config/policy.json --strict
```

5. `allow` may proceed to normal merge controls. `additional_review_required` routes to the independent verifier. `block` requires remediation.

## Workflow
Observe authoritative metadata → classify sensitive paths → measure merge controls → diagnose missing evidence → deterministic gate → independent security verification for sensitive/uncertain cases → allow or keep blocked.

## Metrics
Sensitive PR coverage, signed-commit coverage, independent-approval coverage, latest-push approval coverage, Code Owner coverage, required-check pass rate, malicious-fixture blocking, and legitimate-fixture false blocks.

## Verification
**Implemented:** evidence model, policy, rules, workflows, independent verifier, hook, and deterministic script exist.

**Measured:** each deployment records gate decisions and fixture/real PR metrics.

**Verified:** a sensitive change is verified only when all blocking controls pass and a reviewer distinct from the implementing actor/agent independently confirms the evidence.

## Safety
The package deliberately avoids speculative identity classification. Account age, writing style, names, avatars, geography, or social behavior alone never cause a maliciousness label. Unknown provenance means more review, not accusation.

## Failure handling
Metadata failures permit one refresh and one fallback authoritative fetch. Required control failures block. Unknown nonblocking provenance routes to additional review. Retry loops are bounded and security controls are never weakened to force completion.

## Definition of Done
- Current evidence documented.
- Sensitive paths classified.
- Required status checks pass.
- Required commit signatures pass for sensitive changes.
- Required Code Owner review exists.
- Required independent approvals exist.
- Latest-push approval requirement passes.
- Available agent provenance retained.
- Independent security verifier confirms sensitive decisions.
- No blocking evidence gap remains.

## Customization
Integrations may add organization-specific evidence such as trusted GitHub App identity, attestation/SLSA provenance, deployment approvals, or dependency-review status. Additional signals must remain observable and must not introduce unverifiable identity claims.