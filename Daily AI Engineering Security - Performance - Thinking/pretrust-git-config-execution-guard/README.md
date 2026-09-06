# Pretrust Git Config Execution Guard

**Category:** Security  
**Run date:** 2026-09-07 (Vietnam time)

## Problem
AI coding agents frequently inspect Git metadata before the user has explicitly trusted a workspace. Git supports command-bearing repository-local configuration; malicious `.git/config` can therefore cause host command execution during apparently read-only context gathering before model invocation, tool approval, or an agent sandbox is relevant.

## Evidence
Grounded in September 2026 GitSpawn disclosures and CVE-2026-72718. See `evidence/research.md`.

## Existing approach and limitations
Vendor patches disable/strip `core.fsmonitor`, users upgrade, and products add workspace trust. Those controls remain product/path specific, and trust prompts can be too late when startup metadata collection runs first.

## Proposed improvement
Inspect `.git/config` without invoking Git; block command-bearing `core.fsmonitor`; fail closed on ambiguous metadata; independently verify; permit Git context collection only after a pass.

## Architecture
```text
pretrust-git-config-execution-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-git-context-check.md
├── rules/pretrust-repository-rules.md
├── scripts/git_pretrust_guard.py
├── skills/repository-trust-audit.md
├── subagents/security-verifier.md
├── tests/test_git_pretrust_guard.py
└── workflows/safe-repository-onboarding.md
```

## Installation and usage
Python 3.10+, no third-party packages.
```bash
python scripts/git_pretrust_guard.py /path/to/repository --json
python -m unittest tests/test_git_pretrust_guard.py
```
Exit `0` safe for this policy; `2` blocked finding; `3` inspection error.

## Workflow
Observe → baseline pretrust Git process count → static diagnosis → human-approved remediation/isolation if needed → rerun → independent verification → permit Git context collection.

## Metrics
Preflight latency, blocked repositories, false-positive rate, inspection errors, and Git subprocesses launched before trust. Primary target: **zero Git subprocesses before a successful pretrust check**.

## Verification and safety
Tests must prove a crafted command-bearing value is blocked without executing it. The guard MUST NOT invoke Git, hooks, package managers, or repository executables. Metadata edits require human approval.

## Failure handling
One retry maximum for local inspection errors. Security findings receive no automatic retry. Ambiguity blocks and escalates.

## Definition of Done
**Implemented:** scanner/policy saved. **Measured:** benign/malicious fixtures produce expected exits. **Verified:** tests pass, malicious value blocked, no payload executes, and Git context starts only after exit `0`.