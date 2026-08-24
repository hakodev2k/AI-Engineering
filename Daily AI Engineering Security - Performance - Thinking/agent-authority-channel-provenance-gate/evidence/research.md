# Research — Agent Authority Channel Provenance Gate

## Topic
Authenticated provenance for user/system authority channels in agent runtimes

## Category
Security

## Problem
Agent runtimes increasingly combine model text, tool output, subagent results, injected reminders, mid-turn steering, and real user messages in one conversational stream. If authority is inferred from plaintext role-like markers rather than authenticated transport metadata, model/tool/subagent content can be mistaken for a genuine user or system instruction.

## Why it matters now
Recent August 2026 reports show this failure across multiple agent systems. The risk is not only prompt injection in untrusted content; it is privilege confusion at the message-routing layer, where attacker-controlled or model-generated text is promoted into an authority-bearing channel.

## Affected users
Developers using coding agents, platform builders implementing message buses or subagent relays, teams integrating chat gateways, MCP/tools, background agents, and security reviewers responsible for trust boundaries.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #88115, opened 2026-08-20, reports assistant-generated text appearing as USER messages, including an instruction to exfiltrate SSH private keys. The key failure is provenance/role confusion, not merely unsafe content. https://github.com/anthropics/claude-code/issues/88115
2. Claude Code issue #85126, opened 2026-08-08, reports a spoofed `system-reminder`-style message at a tool-result boundary instructing the agent to conceal information from the user. https://github.com/anthropics/claude-code/issues/85126
3. Hermes Agent issue #81828, opened 2026-08-08, reports that the model can fabricate the static plaintext marker used for an out-of-band user steering channel and then treat the fabricated text as authoritative. https://github.com/NousResearch/hermes-agent/issues/81828
4. Claude Code issue #71602, opened 2026-06-26, reports forged `<system-reminder>` markup in subagent output being relayed unsanitized to the parent and impersonating trusted system metadata. https://github.com/anthropics/claude-code/issues/71602

## Interpretation
The common invariant is that authoritative message identity is represented or reconstructed from model-visible text. A marker that is visible to the model, tool, or subagent is forgeable. Sanitizing one tag or prompt pattern does not establish provenance.

## Existing approaches
- Prompt-level warnings to ignore suspicious instructions.
- Filtering or escaping known reminder/steering tags.
- Role-separated provider APIs (`system`, `user`, `assistant`, `tool`).
- Hidden-character filtering and prompt-injection mitigation at ingress.
- Product-specific routing code that injects internal reminders or steering messages.

## Remaining limitations
- Role separation is lost when multiple internal channels are serialized back into model-visible plaintext.
- Tag filtering is pattern-specific and can miss new or equivalent markers.
- Model-visible secrets/markers cannot authenticate origin.
- Relayed subagent/tool text may cross trust boundaries without immutable source metadata.
- Logging often stores rendered text but not a verifiable authority decision, making incident reconstruction difficult.

## Root-cause analysis
1. Authority is encoded in content instead of transport metadata.
2. Internal message normalization discards or rewrites source identity.
3. Rendering and authorization are coupled: a string that looks like a system/user marker gains semantic privilege.
4. Provenance checks occur too late, after text has already entered an authority-bearing role.
5. There is no deterministic invariant that only trusted ingress adapters may create `user` or `system` authority events.

## Improvement opportunity
Introduce an authority-channel gate before messages enter the model transcript. Every event receives immutable `source`, `authority`, `authenticated`, and correlation metadata. Only configured trusted adapters may mint `user` or `system` authority. Untrusted/model/tool/subagent content containing role-like markers remains data and is escaped or annotated rather than promoted.

## Proposed solution
This package provides a deterministic JSONL provenance validator, enforceable authority rules, a security-review skill, a dedicated verifier subagent, a bounded integration workflow, a pre-model hook contract, and executable regression tests.

## Goal
Make message authority depend on trusted transport provenance, never on plaintext markers.

## Metrics
- unauthorized authority promotions per 10k messages
- percentage of user/system messages with authenticated provenance
- spoof-marker detections in untrusted channels
- provenance-field coverage in audit logs
- false-positive rate on legitimate messages
- security regression test pass rate

## Trigger
Before any event is normalized into a user/system model role or relayed from tool/subagent/model channels.

## Inputs
JSONL message-event stream and configured trusted source sets.

## Outputs
Machine-readable findings, blocking exit status, and auditable provenance decisions.

## Verification
Verified only when forged user/system markers from model/tool/subagent sources are blocked, legitimate authenticated ingress passes, missing provenance fails closed for authority-bearing events, and regression tests pass without exposing secrets.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/88115
- https://github.com/anthropics/claude-code/issues/85126
- https://github.com/NousResearch/hermes-agent/issues/81828
- https://github.com/anthropics/claude-code/issues/71602
