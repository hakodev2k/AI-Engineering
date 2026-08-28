# Session Reset Safety Policy Continuity Guard

**Category:** Security

## Problem
Safety decisions in agentic coding/security assistants can be scoped too narrowly to a single chat session. An attacker can restart or reframe a conversation (for example, repeatedly asserting that a real intrusion is merely a simulation) and regain access to harmful capabilities that were refused moments earlier.

## Evidence
See `evidence/research.md`. On August 27, 2026 Reuters reported that Aur0ra ransomware operators repeatedly bypassed Cursor refusals by restarting chats and claiming the activity was a security simulation. A July 2026 benchmark, IssueTrojanBench, also found high penetration rates for malicious issue requests against deployed coding agents and limited additional protection from agent-framework guardrails.

## Existing approach
Model-level refusal, per-turn classifiers, approval prompts, tool allowlists, and sandboxing.

## Remaining limitation
Refusal state, risk evidence, and target/resource identity often do not survive session resets. A new conversation can therefore erase behavioral context without changing the underlying operation, credential set, host, repository, or destination.

## Proposed improvement
Persist a minimal, privacy-preserving safety continuity record keyed to operation/target identity rather than chat ID. Re-evaluate high-risk actions against recent refusal/evidence history, require stronger authorization for simulation claims, and block repeated restart-based bypass attempts.

## Package tree
- `evidence/research.md`
- `config/policy.json`
- `skills/session-continuity-threat-analysis.md`
- `rules/safety-continuity.md`
- `subagents/security-verifier.md`
- `workflows/detect-enforce-verify.md`
- `hooks/pre-high-risk-tool.md`
- `scripts/session_continuity_guard.py`
- `tests/test_session_continuity_guard.py`

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/session_continuity_guard.py --event event.json --history history.json --policy config/policy.json`

## Metrics
Restart-bypass block rate, repeated-refusal recurrence, false-positive rate on legitimate authorized testing, authorization coverage, and high-risk tool calls after prior refusal.

## Verification
Run `python -m unittest tests/test_session_continuity_guard.py` and independently verify that changing only the session ID does not clear prior risk state.

## Safety
The package does not inspect hidden chain-of-thought. It uses observable actions, declared purpose, authorization evidence, target identifiers, risk decisions, and tool requests.

## Failure handling
Fail closed for high-risk operations when continuity evidence is missing or contradictory. Maximum two policy-diagnosis retries. Escalate legitimate penetration tests that cannot provide the configured authorization evidence.

## Definition of Done
**Implemented:** continuity gate executes before high-risk tools.  
**Measured:** restart-bypass fixtures and legitimate authorized fixtures evaluated.  
**Verified:** malicious reset/reframe fixtures block, authorized tests pass, no secrets are stored, and an independent reviewer verifies the policy boundary.
