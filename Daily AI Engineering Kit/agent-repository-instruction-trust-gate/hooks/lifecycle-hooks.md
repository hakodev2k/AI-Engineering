# Lifecycle Hooks

## Pre-task instruction gate
**Trigger:** before broad repository context collection. **Preconditions:** Python 3 and PyYAML installed; policy exists. **Action:** `python scripts/instruction_gate.py --root . --policy config/policy.yaml --output instruction-gate-report.json`. **Expected:** exit 0 and report status `pass`. **Failure:** exit 1 blocks execution for suspicious untrusted content; exit 2 blocks for tool/config error. **Blocking:** yes.

## Post-edit instruction gate
**Trigger:** after repository edits and before tests/final verification. **Action:** rerun the same command so newly added/generated content cannot silently introduce instruction-bearing material. **Expected:** exit 0. **Failure:** preserve report, revert or safely edit offending task-owned content, or request human policy approval. Maximum 2 edit/rescan attempts. **Blocking:** yes.

## Final verification
**Trigger:** after project-specific build/tests. **Action:** verification agent inspects `git diff`, `instruction-gate-report.json`, command exit codes, and approval evidence. **Expected:** no unintended changes, gate pass, relevant checks pass. **Failure:** status `failed`; never downgrade a blocking finding. **Blocking:** yes.