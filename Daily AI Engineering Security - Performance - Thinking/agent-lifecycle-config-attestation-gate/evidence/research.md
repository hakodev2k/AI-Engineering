# Research — Agent Lifecycle Config Attestation Gate

## Topic
Effective configuration drift across agent lifecycle transitions

## Category
Security

## Problem
Declarative agent configuration can appear restrictive while spawned, nested, resumed, or forked actors run with a different effective sandbox, MCP set, or permission policy.

## Why it matters now
Multi-agent coding is increasingly routine and current August 2026 bug reports show security-relevant config can be ignored or dropped in precisely the least-supervised contexts: subagents and nested project roots.

## Affected users
Developers using agent profiles; teams delegating to subagents; platform engineers exposing MCP servers; security teams relying on sandbox/network restrictions; users operating nested monorepos/workspaces.

## Current public evidence

### Observed evidence
1. **OpenAI Codex issue #40130, opened 2026-08-22.** The reporter states subagent sandbox/MCP restrictions are broken and gives the concrete expectation that a readonly agent should remain readonly and that tool access such as AWS or Context7 should be scoped per agent. https://github.com/openai/codex/issues/40130
2. **Anthropic Claude Code issue #83035, opened 2026-08-01.** A workspace-level sandbox is silently dropped when a session/subagent is rooted in a nested project whose local settings omit the sandbox key. The report demonstrates that a network command blocked in the parent succeeds in the delegated nested actor. https://github.com/anthropics/claude-code/issues/83035
3. **Anthropic Claude Code issue #78063, opened 2026-07-16.** `disallowedTools` configured on a named agent is not inherited by spawned subagents; the report demonstrates a disallowed curl command succeeding in the child. https://github.com/anthropics/claude-code/issues/78063
4. **Anthropic Claude Code issue #83421, opened 2026-08-02.** Permission mode/allow-list behavior differs between the parent and Task/Agent subagents, causing the opposite failure mode: unattended workflows stall on prompts the parent does not require. https://github.com/anthropics/claude-code/issues/83421

## Interpretation
These reports are from different products and show both fail-open and fail-closed variants. The common engineering problem is not one specific merge bug; it is the absence of a portable proof that the actor about to perform work received the intended effective configuration after lifecycle resolution.

## Existing approaches
- Declarative per-agent/project configuration.
- Workspace trust and managed settings.
- Parent-session permission/sandbox checks.
- Documentation describing inheritance/merge behavior.
- Hook-based enforcement on selected tool calls.

## Remaining limitations
- Source configuration is not proof of runtime-effective configuration.
- Parent behavior can mask child/nested behavior.
- Merge semantics can change across versions or project roots.
- Static linting cannot detect a runtime that silently ignores a valid key.
- Hook coverage can itself differ across actor types.

## Root-cause analysis
1. Multiple config scopes are resolved late and differently across lifecycle paths.
2. Security policy is represented as mutable configuration rather than an attested runtime contract.
3. Actor/root identity is often not bound to the policy snapshot used for approval.
4. Tests commonly validate a parent session only, not spawn/resume/fork/nested-root transitions.
5. Missing fields can be interpreted as defaults rather than inheritance, creating silent policy weakening.

## Improvement opportunity
Require an effective-config snapshot after the lifecycle transition and before privileged actions. Compare protected fields to a canonical contract, bind the result to actor/root/lifecycle identity and hashes, and fail closed on missing/mismatched protected fields.

## Proposed solution
A reusable deterministic attestation package with a Python comparator, lifecycle gate procedure, enforceable rules, independent security verifier, bounded recovery, and controlled tests.

## Goal
Convert configuration trust from “the file says X” to “this exact actor at this exact lifecycle point proved X.”

## Metrics
Attestation coverage; mismatches per transition; missing protected fields; privileged actions prevented before attestation; verification latency; regression-test pass rate.

## Trigger
Before a spawned/resumed/forked/nested-root actor receives write, network, deployment, secret, or privileged MCP capability.

## Inputs
Declared canonical JSON contract, observed effective-config JSON, actor ID, lifecycle operation, project root, protected paths.

## Outputs
Pass/block decision, mismatch list, canonical hashes, actor/lifecycle metadata.

## Verification
Controlled fixtures must prove exact match passes; missing protected key blocks; changed protected value blocks; unrelated unprotected changes do not block; invalid JSON returns an error; the gate never executes project-controlled code.