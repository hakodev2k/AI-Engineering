# Research — Agent Message Provenance Role Integrity Gate

**Category:** Security  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Prevent assistant-, tool-, subagent-, or peer-session-generated content from being silently promoted into a trusted `user` message role.

## Problem
Agent harnesses increasingly route text across advisor tools, subagents, peer sessions, structured-output recovery paths, and external channels. If routing code rewrites generated or forwarded text as `role=user` without provenance, the model can no longer distinguish actual user intent from machine-generated content. This can corrupt decisions and create a prompt-injection path into privileged tool use.

## Why it matters now
Recent 2026 reports show the failure across multiple independent agent stacks. The common problem is not a specific malicious string; it is loss of source identity and trust metadata during message transport.

## Affected users
AI coding-agent users, agent SDK maintainers, multi-agent platform builders, teams exposing privileged tools, and developers integrating advisor/subagent/session-forwarding features.

## Current public evidence

### Observed evidence
1. **Anthropic Claude Code issue #88115 — opened 2026-08-20.** The reporter observed text they did not type appearing as `USER` messages after an advisor tool call. One injected message included instructions to exfiltrate an SSH private key. The assistant refused, but the report explicitly identifies conversation-integrity and security impact.  
   https://github.com/anthropics/claude-code/issues/88115
2. **OpenClaw issue #73702 — opened 2026-04-28.** `sessions_send` reply text was forwarded back to a caller as bare `role=user` content without sender/provenance metadata, making a peer-agent reply indistinguishable from a real user turn and creating a cross-session prompt-injection vector.  
   https://github.com/openclaw/openclaw/issues/73702
3. **Anthropic Claude Agent SDK TypeScript issue #379 — opened 2026-07-15.** Structured-output enforcement text is injected as a plain user message; models sometimes interpret it as prompt injection. This is a separate reliability symptom of control text being encoded in the wrong conversational role.  
   https://github.com/anthropics/claude-agent-sdk-typescript/issues/379

### Interpretation
These reports independently indicate that message role is being used as a transport convenience instead of a security boundary. Once provenance is erased, downstream model policy cannot reliably decide whether content expresses user intent, framework control, tool output, or another agent's untrusted reply.

## Existing approaches
- String-level prompt-injection detection.
- Delimiters or XML wrappers around external content.
- Human approval before dangerous tool calls.
- Separate system/developer/user/tool roles where the SDK supports them.
- Sender metadata in selected transport paths.

## Remaining limitations
- Detection heuristics cannot prove message authorship.
- Wrappers fail if routing later strips them or promotes content into `user` role.
- Human approval can be misleading when the approval UI does not show the real source of the request.
- Some SDK recovery mechanisms intentionally inject control nudges as user messages.
- Multi-agent forwarding can lose sender identity between hops.

## Root-cause analysis
1. Message role and message source are conflated.
2. Transport adapters normalize heterogeneous messages into a small role set and drop provenance.
3. Control/recovery text is injected through the same channel used for actual user intent.
4. Privileged authorization consumes downstream text without cryptographically or structurally binding it to source metadata.
5. Regression tests often validate content, not role/source invariants.

## Improvement opportunity
Introduce a deterministic role-integrity gate before prompt assembly and privileged tool authorization. Every message must carry immutable source type, source identifier, transport hop, original role, and trust class. Only authenticated UI/API user-origin messages may be normalized to `role=user`. Tool, assistant, subagent, framework-control, and forwarded-session content must retain non-user provenance and may never authorize privileged actions by itself.

## Relevant sources
- Claude Code #88115: https://github.com/anthropics/claude-code/issues/88115
- OpenClaw #73702: https://github.com/openclaw/openclaw/issues/73702
- Claude Agent SDK TypeScript #379: https://github.com/anthropics/claude-agent-sdk-typescript/issues/379
