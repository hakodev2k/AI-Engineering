# AI Dependency Upgrade Safety Agent

Reusable package for AI-assisted dependency upgrades with bounded planning, compatibility checks, and verification.

## Problem
Dependency upgrades often introduce hidden breaking changes, security regressions, migration work, or runtime failures.

## Purpose
Provide a repeatable agent workflow that investigates, plans, executes, and verifies upgrades safely.

## Workflow
Trigger -> Inventory -> Risk analysis -> Plan -> Upgrade -> Validate -> Review -> Complete

## Safety
No production deployment, lockfile replacement, breaking API migration, or major infrastructure change without approval.

## Definition of Done
- Upgrade impact analyzed
- Changes verified
- Tests passed
- Risks documented

## Prerequisites, run, and verification

Requires Git and Bash. From the target repository root, run the non-mutating preflight:

```bash
bash path/to/ai-dependency-upgrade-safety-agent/scripts/validate-upgrade.sh
```

Exit `0` confirms a Git working tree was found and prints detected Node/.NET markers plus the current diff statistic; exit `1` means the directory is not a Git repository. It does not restore packages, resolve advisories, or validate compatibility. Complete the package workflow with ecosystem-native install/restore, build, tests, lockfile review, migration review, and explicit approval where required.
