# Research — Persistent Memory Write Provenance Gate

**Topic:** Persistent memory poisoning through untrusted retrieved content  
**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Problem
AI assistants that persist cross-session memory can accidentally promote attacker-controlled content from webpages, documents, tool outputs, or connector data into durable user memory. Once written, the poisoned state can bias future answers and tool behavior long after the original untrusted content disappears.

## Why it matters now
On August 18, 2026, Varonis Threat Labs disclosed CoSnitch (CVE-2026-24301), a Microsoft Copilot flaw chain that included persistent memory poisoning via web summarization. Varonis demonstrated that a crafted webpage could inject attacker instructions into the user's permanent memory store, surviving password changes, session revocation, and device re-enrollment until manually deleted. NVD published CVE-2026-24301 on August 18, 2026 with a Microsoft-assigned CVSS 3.1 score of 8.8 HIGH for the associated Copilot command-injection/data-disclosure issue. Independent coverage by Ars Technica described the same memory-poisoning path as a separate prompt-injection route that could influence persistent memory.

## Affected users
Agent-platform builders, assistant/memory subsystem owners, teams using RAG or web summarization with persistent personalization, and users who connect assistants to sensitive applications.

## Current public evidence
### Observed evidence
1. Varonis CoSnitch research, updated August 18, 2026: persistent memory poisoning via web summarization can write attacker instructions to cross-session memory and persist until manually removed. https://www.varonis.com/blog/cosnitch
2. NVD CVE-2026-24301, published August 18, 2026: Microsoft Copilot hosted-service vulnerability, CVSS 8.8 HIGH, with Microsoft reference. https://nvd.nist.gov/vuln/detail/cve-2026-24301
3. Ars Technica, August 18, 2026: reports a separate prompt-injection technique that poisoned Copilot's permanent memory store after summarizing attacker-controlled web content. https://arstechnica.com/security/2026/08/microsoft-copilot-reveals-secret-input-that-allowed-it-to-be-hacked/

### Interpretation
The durable failure is not just prompt injection. The system loses provenance at the memory-write boundary: transient untrusted content is converted into durable trusted state without an enforceable source policy, explicit user intent, bounded lifetime, or high-risk namespace separation.

## Existing approaches
- Prompt-injection scanners and content filters.
- Manual memory management UIs.
- Session logout/password reset and connector revocation.
- Memory allow/deny toggles.
- Human approval for sensitive actions.

## Remaining limitations
- Content scanners are heuristic and can miss semantic attacks.
- Standard incident-response actions may not clear assistant memory.
- Users rarely inspect memory entries individually.
- A memory write can outlive the source session and become detached from its origin.
- Approval prompts are weak if they do not show source provenance and exact durable effect.
- A general preference store may sit too close to tool authorization or security-sensitive state.

## Root-cause analysis
1. Source provenance is dropped or weakened between retrieval and memory write.
2. Durable memory and transient context are treated as equivalent trust domains.
3. Write authorization is based on model intent rather than explicit policy.
4. Memory entries often lack expiry, source reference, review state, and namespace restrictions.
5. Incident response focuses on credentials/sessions rather than durable model state.

## Improvement opportunity
Introduce a deterministic pre-write gate that requires source provenance, quarantines untrusted retrieved content, blocks control-language patterns, prevents writes into high-risk namespaces, requires explicit human approval for untrusted writes, and retains source references for audit/removal. Treat memory persistence as a privileged state transition, not a side effect of summarization.

## Relevant sources
- Varonis Threat Labs — CoSnitch: https://www.varonis.com/blog/cosnitch
- NVD — CVE-2026-24301: https://nvd.nist.gov/vuln/detail/cve-2026-24301
- Microsoft Security Response Center reference: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-24301
- Ars Technica coverage: https://arstechnica.com/security/2026/08/microsoft-copilot-reveals-secret-input-that-allowed-it-to-be-hacked/
