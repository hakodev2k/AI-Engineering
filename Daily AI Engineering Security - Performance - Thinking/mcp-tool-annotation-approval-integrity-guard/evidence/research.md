# Research

## Topic
MCP tool annotation integrity across discovery, SDK translation and approval policy

## Category
Security

## Problem
MCP clients and agent frameworks may receive correct tool annotations from a server but lose or misinterpret them before approval policy runs.

## Why it matters now
On 2026-08-18, Hermes Agent issue #88858 reported that live-discovered MCP tools with `readOnlyHint: true` were all treated as write-capable because the SDK object exposes `read_only_hint` while the adapter read the camelCase name. Separately, Vercel Eve issue #1890 on 2026-08-10 reported that MCP annotations are retained in connection metadata but are not exposed to `ApprovalContext`, forcing policy to decide from tool name alone.

## Affected users
Agent-framework developers, MCP client maintainers, security/platform teams, and users connecting untrusted MCP servers.

## Current public evidence
### Observed evidence
- Hermes Agent #88858: live-discovered read-only annotations are missed due to camelCase versus snake_case object attributes, causing every read-only tool to prompt under untrusted mode. https://github.com/NousResearch/hermes-agent/issues/88858
- Vercel Eve #1890: annotations exist in `ConnectionToolMetadata.annotations` but do not reach approval policy, which therefore lacks protocol-declared risk metadata. https://github.com/vercel/eve/issues/1890
- MCP defines tool annotations as hints. They are server assertions and are not sufficient as standalone authorization evidence.

## Existing approaches
Frameworks parse MCP schemas into SDK-native objects, maintain connection metadata, and implement trust/approval gates. Some approval systems default unknown tools to requiring consent.

## Remaining limitations
Field-name translation is implementation-specific; metadata may be dropped between layers; approval APIs may expose only tool names; tests often cover serialized dictionaries but not live SDK objects; annotation refresh/drift is rarely bound to the approval decision.

## Root-cause analysis
1. Wire-schema names and SDK attribute names differ.
2. Annotation semantics cross multiple ownership boundaries.
3. Approval code trusts absence/presence without provenance or completeness checks.
4. Test fixtures do not represent both dict and SDK-object forms.
5. Tool refresh can change annotations after an earlier classification.

## Improvement opportunity
Normalize annotation access at one boundary, attach provenance and completeness, classify conservatively, and attest the exact annotation snapshot at approval time.

## Goal
Zero risk downgrades caused by missing/mistranslated annotations while reducing avoidable prompts for genuinely read-only tools.

## Metrics
`annotation_preservation_rate`, `unknown_annotation_rate`, `risk_downgrade_count`, `approval_prompt_rate_readonly`, `annotation_drift_count`.

## Trigger
Tool discovery, tools/list refresh, reconnect, approval evaluation, or any adapter/schema upgrade.

## Inputs
Wire JSON or SDK-native tool metadata plus tool identity.

## Outputs
Canonical annotations, provenance, warnings, conservative risk class.

## Interpretation
The problem is not that annotations are always trustworthy; it is that losing them silently makes policy inconsistent. Correct handling must preserve them without treating them as authoritative authorization.

## Proposed solution
Use a canonical normalizer, explicit unknown state, contradiction checks, drift comparison, and a blocking pre-approval validator.