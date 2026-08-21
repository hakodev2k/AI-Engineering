# Skill: Scan Agentic Workflow

## Purpose
Detect trust-boundary violations in GitHub Actions before an AI-enabled workflow can execute attacker-controlled content with shell or repository authority.

## Trigger
Run when workflow/composite-action files change, when an AI action is introduced, or during a repository security audit.

## Inputs
Repository root, `config/policy.json`, workflow files, event triggers, permissions, action references, and any reviewed exceptions.

## Preconditions
- Repository snapshot is immutable for the duration of the scan.
- Policy is readable and valid JSON.
- The reviewer can identify whether external contributors can trigger the workflow.

## Required context
Only workflow/action files, policy, relevant event configuration, and referenced action security documentation. Do not load unrelated repository history by default.

## Allowed tools
Read-only file search, YAML/text inspection, `scripts/scan_github_actions.py`, Git history for provenance, and official security documentation.

## Constraints
Do not execute workflows, checkout untrusted code with credentials, or test injection against production/self-hosted runners.

## Procedure
1. Record the changed workflow files and their triggers.
2. Run the deterministic scanner and preserve JSON output.
3. For each blocking finding, trace the untrusted source to the shell/action sink.
4. Check whether `env:`/action arguments preserve the value as data instead of shell source.
5. For agent actions, review explicit permissions, allowed users, repository instruction trust, secrets, and runner type.
6. For `pull_request_target`, inspect checkout refs and any subsequent execution of checked-out content.
7. Propose the smallest remediation that removes the unsafe data-to-code transition.
8. Re-run the scanner and independently inspect the diff.

## Decision points
- Direct high-risk GitHub expression inside `run:`: block.
- `pull_request_target` plus head checkout/execution: block pending explicit proof of isolation.
- Agent workflow without explicit permissions: block when policy requires it.
- Wildcard agent authorization: require human security review.
- Ambiguous static result: do not auto-clear; hand off to reviewer.

## Expected output
Finding ID, file, line, severity, source, sink, evidence, remediation, and verification status.

## Metrics
Blocking findings before/after, workflows with explicit permissions, risky trigger count, and unresolved reviewed exceptions.

## Verification
The same repository snapshot must produce zero blocking findings after remediation, and a reviewer other than the implementer must validate high-risk changes.

## Failure handling
If parsing is incomplete, fall back to conservative text scanning and mark coverage degraded. Never report verified status with degraded coverage unless a human completes manual inspection.

## Stop conditions
Maximum two automated remediation cycles per finding. Stop immediately on secrets exposure, self-hosted runner impact, or ambiguity about production credentials and escalate.
