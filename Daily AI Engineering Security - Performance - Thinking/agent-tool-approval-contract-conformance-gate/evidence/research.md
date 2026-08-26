# Research — Agent Tool Approval Contract Conformance Gate

**Topic:** high-risk agent tools bypassing global approval policy through local tool metadata  
**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Problem
An agent framework can present a global approval policy while individual tool registration metadata causes a high-risk executor to run automatically. When prompt-influenced data reaches that tool, the expected human authorization boundary disappears.

## Why it matters now
A CVE published August 18, 2026 describes exactly this failure in CodeWhale: an arbitrary Python evaluator returned an automatic approval requirement and therefore ran model-supplied Python without consulting the user's approval policy. Other 2026 agent-framework RCE disclosures show the broader consequence of connecting prompt-influenced inputs to code-execution primitives without a strong sandbox/authorization boundary.

## Affected users
Agent-framework maintainers, coding-agent users, platform builders, plugin/tool authors, CI operators, and security teams.

## Current public evidence

### Observed evidence
1. CVE-2026-75858, received by NVD August 18, 2026, affects CodeWhale versions >=0.8.41 and <0.8.64. NVD states that `rlm_eval` returned an automatic approval requirement, causing arbitrary model-supplied Python to run without consulting the user's configured approval policy; prompt injection in web pages, repository files, or MCP results could reach the executor. Fixed in 0.8.64: https://nvd.nist.gov/vuln/detail/CVE-2026-75858
2. CVE-2026-61447 documents PraisonAI before 1.6.78 executing LLM-generated Python without AST validation, import restrictions, or sandbox enforcement, allowing prompt injection to reach host code execution and environment-secret exfiltration: https://nvd.nist.gov/vuln/detail/CVE-2026-61447
3. Microsoft Security's May 7, 2026 agent-framework research describes CVE-2026-26030 in Semantic Kernel, where prompt injection could reach host-level code execution through tool invocation, and emphasizes the thin boundary between natural-language input and executable tool parameters: https://www.microsoft.com/en-us/security/blog/2026/05/07/prompts-become-shells-rce-vulnerabilities-ai-agent-frameworks/
4. Current Codex security guidance describes sandbox mode and approval policy as separate layers that work together; this supports verifying both effective authorization and technical confinement rather than assuming one substitutes for the other: https://developers.openai.com/codex/agent-approvals-security/

### Interpretation
The CodeWhale failure is an authorization-contract inconsistency: the operator's policy says a consequential action should be gated, while the registered tool says it may run automatically. This mismatch can nullify the global policy before any human sees the action. The other RCE reports show why code-execution tools require a stronger default classification and independent sandbox enforcement.

## Existing approaches
- global approval modes
- per-tool approval annotations
- human confirmation dialogs
- sandboxes and network restrictions
- prompt-injection filtering
- tool allowlists

## Remaining limitations
- local tool metadata may have higher effective precedence than user policy
- missing classifications can default permissively
- prompt filters cannot prove arbitrary generated code is safe
- human confirmation does not exist if the tool is silently auto-approved
- approval and sandbox configuration may drift independently
- startup success often does not attest the effective merged policy

## Root-cause analysis
1. Approval policy is represented in multiple layers without a single monotonic precedence rule.
2. Tool authors can assign their own consequence semantics.
3. High-risk executors are not always classified deterministically at registration.
4. Missing/unknown metadata may fail open.
5. Effective runtime policy is not regression-tested against the operator's declared policy.

## Improvement opportunity
Create a registration-time conformance gate owned by the runtime, not individual tools. It maps tools to consequence categories, rejects high-risk tools with `auto`/`never`/bypass semantics, requires sandbox attestation where appropriate, and produces machine-readable violations. Re-run the gate whenever tool definitions or global policy change.

## Goal
Ensure no tool can weaken the user's global authorization boundary and high-risk execution remains sandboxed and explicitly approved.

## Metrics
Approval coverage for high-risk tools, sandbox coverage, blocked policy conflicts, attack-fixture block rate, runtime registry drift.

## Trigger
Tool registration, plugin/MCP/tool update, approval-policy change, framework upgrade, or security regression.

## Inputs
Effective tool manifest and centrally owned policy.

## Outputs
`allow` or `block` with exact tool-level violation reasons.

## Relevant sources
- https://nvd.nist.gov/vuln/detail/CVE-2026-75858
- https://nvd.nist.gov/vuln/detail/CVE-2026-61447
- https://www.microsoft.com/en-us/security/blog/2026/05/07/prompts-become-shells-rce-vulnerabilities-ai-agent-frameworks/
- https://developers.openai.com/codex/agent-approvals-security/
