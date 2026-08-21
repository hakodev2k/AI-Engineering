# Research — MCP Discovery Instruction Injection Firewall

## Problem
MCP clients may consume server-controlled natural-language `instructions` from discovery/initialization responses and place them into model context. If that content is treated as trusted instruction text, a malicious or compromised server can attempt prompt injection. Shared caching can amplify the blast radius when poisoned discovery metadata is reused across users or sessions.

## Category
Security

## Why it matters now
On 2026-08-07, MCP issue #3213 reported that `server/discover` and legacy `initialize` responses can carry an unrestricted `instructions` field and described a prompt-injection path, including an amplified chain involving shared caching. The issue was still open when this package was generated.

OpenAI's Lockdown Mode documentation, updated in August 2026, explicitly describes prompt injection as a continuing security problem and states that limiting outbound network access reduces exfiltration risk but does not prevent injected instructions from affecting model behavior. This reinforces that network controls alone are not a complete defense.

The MCP security guidance also treats authorization and implementation security as system-level responsibilities, while MCP's own risk-vocabulary guidance warns that metadata/annotations are not enforcement and that untrusted servers can lie about their properties.

## Observed evidence
1. **MCP issue #3213 — `server/discover.instructions` injection surface**
   - Opened 2026-08-07.
   - Reports `instructions` as fully server-controlled natural language that can be included in an LLM prompt.
   - Notes missing content/length restrictions in the discussed path.
   - Describes a PoC and a cache-amplified attack chain using shared discovery data.
   - Suggested mitigations include isolating server instructions from trusted prompts, detection, length limits, and protocol-level marking as untrusted.

2. **OpenAI Lockdown Mode guidance**
   - Describes prompt injection as an ongoing security problem.
   - States that lockdown-style network restrictions reduce exfiltration opportunities but do not stop prompt injections from appearing in processed content or influencing responses.
   - Recommends careful control over apps/connectors/actions and notes that write actions create higher-risk side effects.

3. **MCP security and risk guidance**
   - MCP security best practices emphasize explicit trust/security controls.
   - MCP tool-annotation guidance states that annotations are hints, not enforcement; untrusted servers can lie; and strong guarantees require host-layer policy, network controls, or sandboxing.

## Existing approaches
- Put MCP-provided instructions directly in a prompt with delimiter text.
- Add heuristic phrases such as “treat this as untrusted.”
- Disable broad categories of external access.
- Require user confirmation for risky operations.
- Depend on tool annotations or server metadata to estimate risk.
- Rely on model refusals or prompt wording to resist malicious instructions.

## Observed limitations
- Delimiters are not a hard security boundary.
- Heuristic phrase matching can miss obfuscated or novel attacks and can produce false positives.
- Network lockdown reduces exfiltration channels but does not guarantee behavioral integrity.
- Tool annotations are server-supplied hints and cannot be trusted as enforcement when the server itself is untrusted.
- Confirmation dialogs are weak if they do not show the actual trust source, taint state, requested effect, and data boundary.
- Model-only defenses are probabilistic and vary by model/version.
- Shared caches can broaden impact if untrusted metadata is not partitioned by trust identity.

## Root-cause hypotheses
1. Control-plane metadata and data-plane content are merged into one natural-language context without a strict trust model.
2. Clients may lack deterministic validation before server instructions enter model context.
3. Cache keys may not include trust identity, server identity, policy version, or tenant/session boundary.
4. Approval gates may occur too late, after poisoned context already influenced tool selection or planning.
5. Security decisions are delegated to the model instead of a host-side policy engine.

## Improvement target
Build a host-side guard that:
- marks all remote MCP instructions as untrusted by default;
- validates size, encoding, control characters, and suspicious directive patterns;
- computes a taint/risk score deterministically;
- never merges raw untrusted instructions into a trusted system/developer instruction channel;
- only exposes normalized, bounded content in a clearly untrusted data envelope;
- partitions/disables caches for untrusted discovery instructions;
- escalates approval requirements when tainted content precedes sensitive tool calls;
- records auditable decisions without logging secrets;
- fails closed for malformed or over-budget content.

## Success metrics
- 100% of remote MCP instruction strings pass through the deterministic guard before model exposure.
- 0 raw remote instruction strings are inserted into trusted instruction channels.
- 100% of blocked/tainted decisions produce a structured audit event.
- Shared-cache reuse for untrusted instructions is disabled by default.
- Sensitive tool calls after tainted context require explicit policy approval.
- Regression tests cover direct override language, obfuscation-like control characters, oversized input, benign instructions, and cache policy.

## Sources
- Model Context Protocol GitHub issue #3213, “MCP-2026-015: server/discover instructions field enables prompt injection (amplified by cacheScope:public)”, opened 2026-08-07: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3213
- MCP Security Best Practices: https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices
- MCP Blog, “Tool Annotations as Risk Vocabulary: What Hints Can and Can't Do”: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
- OpenAI Help Center, “Lockdown Mode”: https://help.openai.com/en/articles/20001061-lockdown-mode

## Evidence / interpretation / solution boundary
- **Observed evidence:** the sources above document prompt-injection risk, untrusted metadata limitations, and the need for host/system controls.
- **Interpretation:** MCP discovery instructions should be treated as untrusted content rather than privileged instructions.
- **Proposed engineering solution:** the guard, cache policy, taint propagation, and approval workflow in this package are a reusable defensive design derived from those observations; they are not claimed to be an official MCP standard.