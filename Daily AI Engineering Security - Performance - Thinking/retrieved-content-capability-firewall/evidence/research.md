# Research — Retrieved-Content Capability Firewall

## Topic
Prevent untrusted MCP/RAG/documentation content from becoming tool-authorizing instructions.

## Category
Security

## Problem
AI coding agents ingest documentation, MCP tool results, RAG chunks and web pages into turns that may also invoke shell, filesystem, network and memory tools. Recent disclosures show retrieved content can contain assistant-directed instructions that induce credential access, external exfiltration or destructive actions.

## Why it matters now
NVD published CVE-2026-75130 on 2026-08-18 for Context7 through 2.1.2. The record says unsanitized Custom AI Instructions delivered through MCP can steer connected coding agents to exfiltrate environment credentials and delete files. Context7 issues #2673 and #2663 independently documented assistant-targeted instructions mixed into `query-docs` responses, including a suggested auto-approved `npx` setup command. Varonis separately published CoSnitch against Microsoft Copilot on 2026-08-18, demonstrating automatic prompt execution, connector-based exfiltration and persistent memory poisoning.

## Affected users
Developers using MCP documentation servers, RAG-enabled coding assistants, agent frameworks with shell/filesystem/network tools, and platform teams that treat retrieved text as passive data.

## Current public evidence
### Observed evidence
1. NVD CVE-2026-75130 (2026-08-18): Context7 <=2.1.2 prompt injection through Custom AI Instructions can lead to credential exfiltration and destructive deletion.
2. Context7 issue #2673 (2026-05-25): `query-docs` returned assistant-directed instructions and a shell setup command; the report identifies channel confusion and privilege-escalation risk.
3. Context7 issue #2663 (2026-05-22): a non-document system-style notice in tool output proposed an auto-approved install command and recommended separating notices from retrieved content.
4. Varonis CoSnitch (2026-08-18): a distinct Copilot chain used auto-executed prompts, connected-app exfiltration and persistent memory poisoning.

### Interpretation
The recurring failure is a trust-boundary error: untrusted data and privileged instructions are co-resident, while the runtime may lack an action-time provenance gate that verifies a sensitive action is justified by trusted intent rather than retrieved text.

## Existing approaches
Patch vulnerable MCP servers; use current versions; rely on provider safety, instruction hierarchy and prompt-injection resistance; require approvals; sandbox tools; sanitize/filter content.

## Remaining limitations
Patching one server does not cover another poisoned source. Prompt-only rules are probabilistic. Generic approvals often show the command without showing that its motivation originated in retrieved content. Sanitization cannot reliably remove every natural-language instruction without damaging valid docs. Sandboxes reduce blast radius but may still permit credential reads or network egress.

## Root-cause analysis
1. Data/instruction channel confusion at retrieval boundaries.
2. Missing provenance from retrieved span to proposed action.
3. Tool authority exceeds what the current trusted request requires.
4. Approval decisions lack source-aware evidence.
5. Persistent memory can convert transient untrusted text into durable steering state.

## Improvement opportunity
Place a deterministic pre-action firewall between untrusted content and sensitive tools. It does not claim to solve prompt injection with regex. Instead it blocks recognizable high-risk action patterns, forces review for instruction-like content, and requires the host to bind privileged actions to trusted intent and least privilege.

## Goal / Metrics / Trigger / Inputs / Outputs
Goal: no sensitive action is authorized solely by retrieved content. Metrics: provenance coverage, block/review rate, false positives, unsafe-action escapes and secret-exposure count. Trigger: privileged action with MCP/RAG/web/document content in the decision context. Inputs: retrieved text, proposed action metadata, trusted user intent and policy. Outputs: allow/review/block decision plus redacted evidence.

## Relevant sources
- https://nvd.nist.gov/vuln/detail/CVE-2026-75130
- https://github.com/upstash/context7/issues/2673
- https://github.com/upstash/context7/issues/2663
- https://www.varonis.com/blog/cosnitch
