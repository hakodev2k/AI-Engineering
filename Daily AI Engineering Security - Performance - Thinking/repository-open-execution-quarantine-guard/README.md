# Repository-Open Execution Quarantine Guard

**Category:** Security

## Problem
Repository-controlled startup configuration can execute before a developer has meaningfully reviewed a cloned workspace. 2026 reports show active use of Claude Code `SessionStart`, VS Code `runOn: folderOpen`, and package install hooks as execution surfaces.

## Evidence
See `evidence/research.md` for observed public signals, current mitigations, remaining limitations, and root-cause analysis.

## Proposed improvement
Treat repository open/session start as a security boundary. Before launching an editor or agent, statically scan known auto-execution surfaces, classify risky commands, bind approvals to exact file hashes, and fail closed when an unapproved startup trigger is present.

## Package tree
```text
repository-open-execution-quarantine-guard/
├── README.md
├── evidence/research.md
├── skills/repository-open-threat-scan.md
├── rules/trust-before-execution.md
├── subagents/workspace-trust-reviewer.md
├── workflows/quarantine-and-approve.md
├── hooks/pre-open-security-gate.md
├── scripts/scan_repository_open_risk.py
└── tests/test_scan_repository_open_risk.py
```

## Installation
Requires Python 3.10+. No third-party packages are required.

## Configuration
The scanner accepts a repository path and an optional JSON approval file. Approval records map normalized risky file paths to SHA-256 hashes. A changed file invalidates the approval.

Example approval file:
```json
{
  ".claude/settings.json": "<sha256>",
  ".vscode/tasks.json": "<sha256>"
}
```

## Usage
```bash
python scripts/scan_repository_open_risk.py /path/to/repo
python scripts/scan_repository_open_risk.py /path/to/repo --approval-file approvals.json --json
```
Exit code `0` means no blocking unapproved finding; `2` means risky unapproved startup configuration exists; `1` means scanner/input failure.

## Workflow
1. Clone/extract without launching the target editor or agent.
2. Run `hooks/pre-open-security-gate.md` / the scanner.
3. Review every blocking finding using `subagents/workspace-trust-reviewer.md`.
4. If accepted, record the exact SHA-256 of the risky file in an approval file.
5. Re-run the scanner. Only a clean run permits workspace activation.
6. Any config drift invalidates approval automatically.

## Metrics
- detected startup execution surfaces/repository;
- blocked unapproved findings;
- approval hash mismatches;
- scanner coverage rate before workspace activation;
- false-positive rate;
- clone-to-safe-open latency.

## Verification
Run:
```bash
python -m unittest tests/test_scan_repository_open_risk.py -v
```
Verification requires detection of malicious `SessionStart` and `folderOpen` fixtures, clean handling of benign repositories, and hash-bound approval invalidation after mutation.

## Safety
The scanner MUST NOT execute repository-controlled commands, import repository code, run package managers, source shell files, or launch the target workspace. Reviewers MUST NOT weaken the gate merely to reduce friction.

## Failure handling
Scanner errors block activation. Missing/unreadable policy inputs block when supplied. Review retry is bounded to two evidence-gathering passes; unresolved ambiguity escalates to a human security owner.

## Definition of Done
- Evidence documented.
- All known target startup surfaces scanned deterministically.
- Risky fixture tests pass.
- Changed risky config invalidates prior approval.
- No project-controlled command executes during scanning.
- Blocking findings require explicit approval.
- README paths match the actual package.

## Customization
Extend `RISK_FILES` and parser functions in the scanner for additional editors/agents. New surfaces MUST include tests and an explicit trigger/risk rationale before being treated as blocking.