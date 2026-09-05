# Delegated Agent Secret Inheritance Gate

**Category:** Security  
**Run date:** 2026-09-06 (UTC+7)

## Problem
In-process or loosely isolated agent delegation can unintentionally give child/subagents the parent process's full environment. That turns every delegated tool invocation into a potential credential-reading path even when the child task does not need those credentials.

## Evidence
See `evidence/research.md`. The package distinguishes observed public evidence, interpretation, and the proposed control.

## Existing approach
Common controls include sandboxing, environment-variable allowlists, Kubernetes Secrets, secret stores, output redaction, and user approval. These help, but a secret placed directly in an agent-visible environment remains readable by that agent and by subprocesses it spawns. Delegation may also bypass process-boundary scrubbing when child agents run in-process.

## Existing limitations
Environment inheritance is usually implicit; allowlists often operate only at subprocess execution; secret values may already be present before child-task policy is evaluated; and output redaction does not prevent outbound exfiltration. A generic sandbox is therefore insufficient when the secret itself is inside the sandbox.

## Proposed improvement
Make delegated-agent credential visibility an explicit capability contract. Before delegation, compute the child-visible environment from a deny-by-default policy, reject implicit full inheritance, permit only named non-sensitive variables by default, and require broker/opaque-reference mode for sensitive credentials. Verify the declared boundary with deterministic tests that inspect variable names only, never values.

## Architecture
- `evidence/research.md`
- `skills/delegation-secret-boundary-assessment.md`
- `rules/subagent-secret-isolation.md`
- `subagents/security-reviewer.md`
- `workflows/observe-harden-verify.md`
- `hooks/pre-delegation-secret-policy.md`
- `scripts/check_delegation_env.py`
- `config/policy.example.json`
- `tests/test_check_delegation_env.py`

## Installation
Python 3.10+; standard library only.

## Configuration
Model environment names, never secret values. Declare the child task's requested variables and whether each sensitive credential is delivered via an opaque broker/reference rather than readable plaintext.

## Usage
`python scripts/check_delegation_env.py config/policy.example.json`

Exit codes: `0` pass, `2` blocking policy violation, `1` invalid input/runtime error.

## Workflow
Observe actual delegation boundary -> capture parent/child environment-name baseline -> classify sensitive names -> form least-privilege hypothesis -> implement filtered or brokered delivery -> rerun checker -> run negative tests -> independent security verification.

## Metrics
Sensitive variable names exposed to child; explicit allowlist coverage; brokered-vs-readable credential count; unauthorized variable-access test failures; blocked inheritance events; exposure incidents.

## Verification
**Implemented:** executable policy, rules, workflow, tests.  
**Measured:** baseline and post-change child-visible variable-name sets captured.  
**Verified:** no unrequested sensitive environment variable reaches delegated agents; negative tests pass; no secret value appears in artifacts; independent reviewer approves.

## Safety
Never print environment values. Never weaken isolation to make a child task work. Readable sensitive delivery requires explicit approval, minimum scope, bounded lifetime, and destination restrictions.

## Failure handling
Unknown inheritance or sensitive unbrokered credentials block delegation. Retry policy resolution at most twice; then stop and escalate rather than inheriting the parent environment.

## Definition of Done
Evidence documented; delegation path identified; baseline captured; full inheritance blocked; requested variable set minimized; sensitive credentials brokered or approved; tests pass; independent verification complete; no secrets included.

## Customization
Extend sensitive-name patterns while preserving deny-by-default semantics.