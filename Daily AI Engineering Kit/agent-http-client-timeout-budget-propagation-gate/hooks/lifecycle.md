# Lifecycle Hooks

## Pre-task repository validation
**Trigger:** before investigation. **Action:** confirm repository root, policy file, and target path exist. **Expected:** readable inputs. **Failure:** block; no retries for missing inputs.

## Post-edit timeout gate
**Trigger:** after edits affecting HTTP clients, retries, or cancellation. **Command:** `python scripts/timeout_budget_gate.py --root <repo> --policy config/policy.yaml --out timeout-budget-report.json`. **Expected:** exit 0 and status `pass`. **Failure:** block completion; preserve report.

## Test validation
**Trigger:** after remediation. **Action:** run focused project-native unit/integration tests for the affected request path. **Expected:** all focused tests pass. **Failure:** allow at most two fix-test cycles; then escalate.

## Final package validation
**Trigger:** before package/repository completion. **Command:** `python scripts/verify_package.py`. **Expected:** exit 0. **Failure:** block completion.

## Approval hook
**Trigger:** proposed production timeout increase at or above policy threshold, production config/deployment, infrastructure changes, or weakening resilience controls. **Action:** stop before mutation and request explicit human approval in the consuming workflow. **Failure behavior:** no automatic bypass. **Blocking:** yes.
