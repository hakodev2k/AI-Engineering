# Research Evidence

## Topic
Permission Policy Precedence Auditor

## Category
Security

## Problem
AI coding agents increasingly combine static allow/deny rules, safety classifiers, per-tool approval modes, hooks, subagent inheritance, and tool-server-side checks. These layers can disagree. A tool explicitly allowlisted by the user may still be blocked by a higher-priority classifier, while a hook that reports `allow` may not override that classifier. The effective policy is therefore different from the configured policy, producing both false confidence and operational dead ends.

## Why it matters now
Recent Claude Code reports show this is active in August 2026. Users report allowlisted MCP tools being denied before reaching the server, read-only operations blocked non-deterministically, and no supported durable escape hatch except abandoning Auto Mode. This is not merely usability friction: teams may incorrectly assume an allow rule is authoritative, or conversely disable safety mechanisms globally to get work done.

## Affected users
Developers using MCP tools, unattended agents, teams relying on permission-as-code, security engineers, platform builders implementing multiple approval layers, and subagent workflows inheriting parent permission state.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #83611 (2026-08-03) reports a tool explicitly present in `permissions.allow` being denied by the auto-mode classifier before the MCP server is invoked. The issue also records repeated denials ending in a circuit breaker.
2. Issue #76149 reports that `permissions.allow` and a `PreToolUse` hook returning `permissionDecision: allow` do not suppress the auto-mode content classifier; the only practical workaround reported is leaving Auto Mode.
3. Issue #85491 reports read-only operations explicitly pre-approved by users still being blocked non-deterministically in auto mode.
4. Issue #64128 reports documented allow-rule escape hatches being ignored for some operations, creating circular permission constraints.

### Interpretation
The core failure is policy-precedence ambiguity. Multiple enforcement layers exist, but users often cannot inspect the actual order, override semantics, or final decision provenance. Configuration validation alone is insufficient because a syntactically valid allowlist can be semantically ineffective.

## Existing approaches
- Static `permissions.allow` and `permissions.deny` rules.
- Auto-mode safety classifiers.
- PreToolUse hooks and approval prompts.
- Server-side validation and user confirmation flags.
- Global bypass/manual modes.

## Remaining limitations
- No deterministic preflight that computes the effective decision across all layers.
- No machine-readable explanation of which layer overrode another.
- Retries often repeat a deterministic denial.
- Users may resort to globally weaker modes when one safe tool is blocked.
- Subagent inheritance can hide where a restriction originates.

## Root-cause analysis
1. Policy layers are evaluated independently and have undocumented or non-obvious precedence.
2. Allow semantics are often advisory rather than authoritative.
3. Decision provenance is not consistently exposed to the agent or operator.
4. Retry loops treat policy failures as transient tool failures.
5. Configuration UX conflates authorization, classifier safety, and server trust.

## Improvement opportunity
Add a reusable preflight and audit layer that models every permission source, computes the effective decision, records provenance, distinguishes deterministic policy denial from transient failure, blocks futile retries, and refuses any remediation that weakens unrelated security boundaries.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/83611
- https://github.com/anthropics/claude-code/issues/76149
- https://github.com/anthropics/claude-code/issues/85491
- https://github.com/anthropics/claude-code/issues/64128

## Goal
Make permission behavior observable and predictable before tool execution.

## Metrics
Policy conflicts detected, deterministic-denial retries prevented, percentage of tool calls with decision provenance, false-block rate on pre-approved read-only tools, number of global bypasses required.

## Trigger
Before a high-value or repeated tool call, after a denial, or when configuring unattended agent permissions.

## Inputs
Tool name, arguments, operation risk, static allow/deny rules, classifier result, hook result, approval state, server-side requirements, inherited subagent policy.

## Outputs
Effective decision, winning policy layer, conflict list, retryability, required human action, evidence record.