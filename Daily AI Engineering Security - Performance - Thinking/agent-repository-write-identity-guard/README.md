# Agent Repository Write & Identity Guard

**Category:** Security

## Problem
Autonomous or semi-autonomous coding agents can interact with real repositories, open pull requests, edit prior activity, create identities, contact maintainers, or attempt to influence review. When repository write capability, external identity creation, and social interaction are not separated by enforceable policy, a compromised or misaligned agent can turn ordinary code-generation capability into a software supply-chain attack.

## Evidence
See `evidence/research.md`. Current August 2026 evidence includes the UK AI Security Institute incident report on unsanctioned agent behaviour and Reuters' independent reporting, plus recent reviewed agent/workspace prompt-injection advisories showing that untrusted repository context can steer AI coding tools.

## Existing approach
Common controls include branch protection, human review, least-privilege tokens, sandboxing, prompt-injection filters, and approval prompts.

## Existing limitations
These controls are often applied independently. A human may review code but not detect coordinated identity manipulation; a sandbox may restrict local execution but still permit external repository writes; an approval dialog may not reveal whether a request also creates a new account, edits audit-relevant history, or contacts a maintainer.

## Proposed improvement
Insert a deterministic policy gate before every repository-changing or identity-affecting action. The gate classifies consequence level, verifies actor identity, rejects self-approval and history rewriting, requires explicit human authorization for high-impact actions, and emits a stable audit decision.

## Architecture
- `config/policy.json` — consequence and permission policy.
- `scripts/repo_action_guard.py` — deterministic policy evaluator.
- `tests/test_repo_action_guard.py` — executable regression tests.
- `skills/repository-action-threat-model.md` — reusable threat analysis procedure.
- `rules/agent-repository-boundaries.md` — enforceable security requirements.
- `subagents/security-verifier.md` — independent reviewer role.
- `workflows/observe-enforce-verify.md` — bounded implementation workflow.
- `hooks/pre-repository-write.md` — integration hook.
- `evidence/research.md` — source-backed research.

## Installation
Python 3.10+; no third-party packages required.

## Configuration
Edit `config/policy.json` to match the repository's approved branches, write operations, and human approver identities. Do not add secrets.

## Usage
```bash
python scripts/repo_action_guard.py --event event.json --policy config/policy.json
```
Exit code `0` means policy allows the action; `3` means the action is blocked; `2` means invalid input/configuration.

## Workflow
Observe action intent → classify consequence → verify identity and approvals → enforce repository boundary → execute only if allowed → independently verify resulting state.

## Metrics
- blocked unauthorized write attempts
- self-approval rejection rate
- high-risk actions with explicit human approval
- mutable-history attempts blocked
- external-identity actions blocked
- false-positive review count

## Verification
Run:
```bash
python -m unittest tests/test_repo_action_guard.py
```
The implementation agent MUST NOT be the only verifier for high-risk changes.

## Safety
The guard is fail-closed. It never stores credentials, never grants permissions, and never weakens branch protection. Human authorization is required for consequential repository changes.

## Failure handling
Detection: non-zero exit or policy mismatch. Evidence: serialized reason codes. Retry policy: at most one corrected policy/input evaluation. Fallback: deny the action. Escalation: repository owner/security reviewer. Stop condition: unresolved identity, approval, branch, or history-integrity violation.

## Definition of Done
**Implemented:** guard, policy, hook, rules, and workflow integrated.  
**Measured:** policy decisions and regression fixtures recorded.  
**Verified:** tests pass, no self-approval or identity-creation path bypasses policy, branch protection remains intact, and an independent reviewer confirms the final state.

## Customization
Extend action classes conservatively. New write-capable or identity-affecting operations SHOULD default to high risk until explicitly classified.