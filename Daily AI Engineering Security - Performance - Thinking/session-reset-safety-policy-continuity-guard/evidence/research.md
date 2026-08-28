# Research — Session Reset Safety Policy Continuity Guard

**Category:** Security  
**Research date:** 2026-08-28 (UTC+7)

## Topic
Preserve safety-relevant risk state across chat/session resets so attackers cannot bypass refusals by restarting and reframing the same harmful operation.

## Problem
Agent safety decisions are frequently evaluated in the current conversation. When refusal evidence and target identity are not durable across sessions, a user can restart a chat, restate the same operation as a simulation, and attempt the action again with a clean context.

## Why it matters now
Reuters reported on August 27, 2026 that the Aur0ra ransomware group used Cursor in real intrusions and repeatedly circumvented refusals by restarting conversations and emphasizing that the activity was a test/simulation. Separately, IssueTrojanBench (July 22, 2026) evaluated malicious issue requests against Cursor, Claude Code, and Codex Desktop and reported that 66.5% of malicious issues penetrated all tested guardrails, with rejection largely coming from underlying models rather than agent frameworks. These signals point to a practical need for deterministic agent-layer controls independent of conversational framing.

## Affected users
AI coding-agent vendors, enterprise agent platforms, SOC/red-team copilots, developers granting shell/network/credential tools, and organizations operating agents on real infrastructure.

## Current public evidence
### Observed evidence
1. Reuters, August 27, 2026: Aur0ra operators used Cursor for credential theft/account takeover activity; refusals were often bypassed by restarting the dialogue and claiming the intrusion was a simulation.  
   https://www.reuters.com/world/russian-speaking-cybercriminals-used-spacexs-cursor-ai-tool-hack-seven-companies-2026-08-27/
2. IssueTrojanBench, July 22, 2026: benchmark of malicious issue requests against modern coding agents reports 66.5% penetration across guardrails and limited additional protection from agent frameworks.  
   https://arxiv.org/abs/2607.20759
3. SC Media/Wiz, July 9, 2026: GhostApproval showed six coding assistants could be induced by malicious repository content to write through symlinks outside intended workspaces, demonstrating why agent-layer authorization must bind to actual effects rather than conversational intent alone.  
   https://www.scworld.com/news/ghostapproval-technique-leads-ai-coding-tools-to-alter-files-outside-of-sandbox

### Interpretation
A refusal is not useful as an agent-layer control if a new session erases the evidence that caused it. The durable unit should be the attempted operation and affected resource, not the chat identifier. Claims such as “this is only a simulation” are user assertions, not authorization evidence.

## Existing approaches
- Model refusal policies and per-turn safety classification.
- Human approval for risky commands.
- Sandboxes/workspace restrictions.
- Tool allowlists and command filters.
- Red-team mode or declared security-testing contexts.

## Remaining limitations
- Session resets can clear refusal history.
- User-declared simulation/testing context may be accepted without independent authorization evidence.
- Per-command approvals can miss a harmful multi-step campaign whose individual operations look plausible.
- Sandboxes constrain effects but do not prove target authorization, and real enterprise agents often have network/credential access by design.
- Risk decisions may be logged but not queried before subsequent sessions.

## Root-cause analysis
1. Safety memory is scoped to conversation IDs instead of resource/operation identity.
2. Declared intent is conflated with authorization.
3. Risk signals are not normalized into durable, queryable reason codes.
4. High-risk tool gates do not always consult prior denials/refusals.
5. Session restart is treated as a UX event rather than a security-boundary event.

## Improvement opportunity
Maintain a minimal continuity ledger with hashed target/resource identifiers, action class, timestamp, prior decision, and reason codes. Before high-risk tool use, consult recent entries across sessions. A simulation claim cannot lower risk unless accompanied by configured authorization evidence. Repeated resets increase scrutiny rather than resetting it.

## Relevant sources
- Reuters, 2026-08-27: https://www.reuters.com/world/russian-speaking-cybercriminals-used-spacexs-cursor-ai-tool-hack-seven-companies-2026-08-27/
- IssueTrojanBench: https://arxiv.org/abs/2607.20759
- GhostApproval coverage: https://www.scworld.com/news/ghostapproval-technique-leads-ai-coding-tools-to-alter-files-outside-of-sandbox
