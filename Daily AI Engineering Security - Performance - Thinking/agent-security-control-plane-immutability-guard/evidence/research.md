# Research

## Topic
Security control-plane immutability and action-time attestation for AI agents

## Category
Security

## Problem
An agent can be governed by policy stored in files or runtime configuration that is itself mutable, inconsistently enforced, or not revalidated at action time. A security control that can be altered by its subject is not a stable trust boundary.

## Why it matters now
AI coding environments now combine sandbox rules, managed settings, permission modes, tool hooks, network allowlists, subagents, and desktop/CLI surfaces. Fresh August 2026 reports show both self-mutation risk and declared/effective-policy divergence.

## Affected users
Developers running coding agents locally; teams using unattended agents; security/platform teams managing sandbox and permission policy; organizations relying on managed settings or network egress restrictions.

## Current public evidence
### Observed evidence
1. **Anthropic Claude Code issue #84863, opened 2026-08-07.** Reporter shows sandbox filesystem read isolation is absent in the described setup and highlights that `settings.json` lives in an agent-writable tree, allowing the agent to alter the configuration governing sandbox behavior. https://github.com/anthropics/claude-code/issues/84863
2. **Anthropic Claude Code issue #86253, opened 2026-08-13.** A managed setting intended to disable bypass-permissions mode was reported not to block `--dangerously-skip-permissions`, while another deny rule from the same managed file proved the file was loaded. This is evidence that policy presence/loading and effective enforcement can diverge. https://github.com/anthropics/claude-code/issues/86253
3. **Anthropic Claude Code issue #88553, opened 2026-08-21.** A network egress allowlist was reported as inconsistently enforced, with non-allowlisted hosts intermittently reachable. https://github.com/anthropics/claude-code/issues/88553
4. **OpenAI Codex issue #38318, opened 2026-08-13.** `codex execpolicy check` reportedly returns `allow` while execution remains sandboxed when denied-read paths are active, demonstrating another vendor's declared-policy/effective-placement mismatch. https://github.com/openai/codex/issues/38318

### Interpretation
These reports do not prove one universal implementation flaw. Together they show a recurring engineering class: policy state is distributed, mutable, and can disagree with effective runtime enforcement. A reusable consumer-side attestation layer can detect local control-plane drift even when it cannot fix vendor internals.

## Existing approaches
- managed/admin settings
- workspace trust and permission prompts
- sandbox filesystem/network profiles
- command allow/deny policy engines
- configuration management and endpoint protection
- vendor-specific hooks and policy checks

## Remaining limitations
- configuration integrity is often checked only at startup
- approval may authorize an action without binding it to the exact policy revision
- local writable config can change after trust establishment
- policy evaluators and execution sandboxes can disagree
- cross-process/subagent inheritance is difficult to observe from static config alone

## Root-cause analysis
1. Security policy and ordinary workspace/user state share writable storage.
2. Policy loading, policy evaluation, and action execution are separate components.
3. Trust decisions are not cryptographically or deterministically bound to policy content.
4. Long-lived sessions create time-of-check/time-of-use windows.
5. Multi-agent/process runtimes amplify policy-state divergence.

## Improvement opportunity
Introduce action-time control-plane attestation: hash the approved policy set from a trusted context, keep the baseline outside agent-write authority, and block privileged actions whenever the current policy set differs.

## Proposed solution
This package implements dependency-free file hashing, required-file checks, explicit trusted baseline creation, an enforceable pre-tool hook contract, bounded failure handling, and independent verification.

## Goal
Prevent privileged execution under an unreviewed security-control revision.

## Metrics
Attestation coverage, drift-block count, false positives, re-baseline lead time, unverified privileged-action attempts.

## Trigger
Session start and immediately before commands/tools that can write outside a workspace, access secrets, use external network, change repository/production state, or disable sandbox/approval controls.

## Inputs
Workspace root, policy inventory, baseline state.

## Outputs
Verified/drift status, per-file hashes and reasons, blocking exit code.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84863
- https://github.com/anthropics/claude-code/issues/86253
- https://github.com/anthropics/claude-code/issues/88553
- https://github.com/openai/codex/issues/38318
