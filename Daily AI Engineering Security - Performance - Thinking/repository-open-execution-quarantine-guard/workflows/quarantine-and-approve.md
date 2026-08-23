# Workflow: Quarantine and Approve

## Trigger
A repository is cloned, extracted, switched to an unreviewed revision, or risky startup configuration changes.

## Goal
Prevent project-controlled commands from running before their exact configuration is reviewed and trusted.

## Inputs
Repository root, optional approval JSON, intended editor/agent.

## Baseline
Record whether the host currently opens repositories before static startup-surface review and the number of auto-execution surfaces detected.

## Stages
1. **Quarantine** — keep the target editor/agent closed; treat repository as data.
2. **Observe** — run `scripts/scan_repository_open_risk.py`.
3. **Classify** — group findings by trigger and blocking status.
4. **Review** — `workspace-trust-reviewer` evaluates each blocker.
5. **Decision checkpoint** — approve exact hash, remediate, or block.
6. **Re-scan** — after approval/remediation, run the scanner again.
7. **Activation** — open the workspace only after exit code `0`.
8. **Drift revalidation** — re-run after branch switches or changes to risky files.

## Responsible agent
Scanner automation owns observation; Workspace Trust Reviewer owns risk decision; human security owner approves dangerous/high-impact exceptions.

## Tools
Read-only filesystem, SHA-256, JSON parser, optional public documentation.

## Outputs
Findings report, exact-hash approval record, final scan result.

## Checkpoints
- No project command executed before scan.
- Every blocker reviewed.
- Approvals use exact hashes.
- Final scanner exit is `0`.

## Metrics
Scan duration, blockers/repository, approval mismatches, safe-open coverage, false positives.

## Retry policy
At most 2 review/re-scan cycles after the initial scan. A third unresolved cycle escalates.

## Stop conditions
Success: final scan `0` and no unresolved high-risk finding. Failure: scanner error, unapproved blocker, approval mismatch, or retry limit reached.

## Failure path
Keep workspace quarantined, preserve evidence, and escalate to a human security owner. Do not bypass the gate.

## Verification
Run package unit tests and an end-to-end fixture scan before claiming enforcement.

## Definition of Done
No automatic repository-controlled execution occurs before trust; risky configuration is either removed or bound to explicit exact-hash approval; final scan evidence is retained.