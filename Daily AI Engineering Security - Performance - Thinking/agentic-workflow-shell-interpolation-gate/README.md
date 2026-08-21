# Agentic Workflow Shell Interpolation Gate

**Category:** Security

## Problem
AI-enabled GitHub Actions can be secured at the model layer yet remain exploitable at the workflow layer. Attacker-controlled issue, PR, comment, branch, or repository values may be expanded directly into shell scripts, or a public event may expose a command-capable agent with broader repository authority than intended.

## Evidence
`evidence/research.md` records current public evidence from GitHub documentation, OpenAI Codex Action security guidance, GitHub Security Lab, and 2026 GitHub advisories. The recurring weakness is a data-to-code trust-boundary failure around Actions expression expansion and privileged automation.

## Existing approach
Common defenses include reduced workflow permissions, fork restrictions, model prompt defenses, user allowlists, secret isolation, and manual review.

## Existing limitations
These controls do not automatically detect direct `${{ ... }}` interpolation into shell `run:` blocks. Model-side defenses cannot stop deterministic shell injection that occurs outside the model. Manual review often misses evaluation-order and `pull_request_target` trust mistakes.

## Proposed improvement
Use a deterministic scanner as a blocking pre-merge gate, then require an independent review of event trust, checkout ref, runner boundary, effective permissions, secrets, and agent exposure. Remediation should convert untrusted expressions from generated shell source into quoted data (`env:`/action arguments), or separate untrusted analysis from privileged action.

## Architecture
- **Evidence** defines the current problem and source basis.
- **Policy** controls conservative scanner patterns.
- **Skill** provides the reusable investigation/remediation procedure.
- **Rules** define observable security invariants.
- **Subagent** independently verifies high-risk changes.
- **Workflow** bounds diagnosis/remediation to two automated retries.
- **Hook** defines the deterministic pre-merge check.
- **Script/tests** provide executable detection and regression verification.

## Package tree
```text
agentic-workflow-shell-interpolation-gate/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-merge-scan.md
├── rules/
│   └── workflow-trust-rules.md
├── scripts/
│   └── scan_github_actions.py
├── skills/
│   └── scan-agentic-workflow.md
├── subagents/
│   └── security-reviewer.md
├── tests/
│   └── test_scan.py
└── workflows/
    └── audit-remediate-verify.md
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy the package into a repository or adapt the scanner/policy paths for CI.

## Configuration
Edit `config/policy.json` to add organization-specific high-risk GitHub context fields or agent actions. Do not delete the baseline high-risk patterns merely to make a scan pass.

## Usage
From the package root, scan a repository:

```bash
python scripts/scan_github_actions.py /path/to/repo --policy config/policy.json --json-out findings.json
```

Run regression tests:

```bash
python tests/test_scan.py
```

Exit codes: `0` = no blocking findings; `2` = invalid input/config; `3` = blocking finding.

## Workflow
Follow `workflows/audit-remediate-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Implement → Measure again → Independent verification → Complete. The same finding gets at most two automated remediation attempts.

## Metrics
Track blocking findings, explicit-permission coverage, external-trigger count, wildcard agent authorization, unresolved exceptions, and regression-test status.

## Verification
### Implemented
The package provides a scanner, policy, review rules, bounded workflow, independent reviewer contract, hook, and tests.

### Measured
The scanner reports files scanned and blocking/review findings. The regression test expects the vulnerable fixture to block and the `env:`-bounded fixture to pass.

### Verified
A repository change is verified only after the final snapshot produces zero unapproved blocking findings **and** an independent reviewer validates effective permissions, event trust, checkout refs, runner/secrets boundaries, and residual risks.

## Safety
Never validate a suspected injection by executing attacker-controlled content on a privileged or self-hosted runner. Never broaden permissions or expose secrets to simplify testing. Treat untrusted PR repository instructions as data, not control policy.

## Failure handling
- **Detection:** scanner exit 2/3 or reviewer finds an unresolved trust path.
- **Evidence:** preserve JSON findings and the exact source/sink path.
- **Retry:** maximum two remediation cycles per finding.
- **Fallback:** manual source-to-sink review.
- **Escalation:** security/repository owner for secrets, self-hosted runners, production deployment, or ambiguous privilege boundaries.
- **Stop condition:** do not complete while a blocking path or required approval remains unresolved.

## Definition of Done
Evidence is documented; baseline is captured; root cause is identified; unsafe interpolation is removed; explicit least privilege is preserved; deterministic tests pass; final scan has no unapproved blockers; high-risk changes have independent review; residual risks are documented; no secrets were exposed and no unsafe workflow was executed.

## Customization
Extend `high_risk_context_patterns` and `agent_action_markers` for your organization. Add repository-specific exceptions only as narrow, expiring, reviewed records rather than broad scanner suppression.
