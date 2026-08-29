# MCP Server Instructions Trust-Boundary Gate

Category: Security

## Problem
MCP servers can supply natural-language instructions and tool metadata that clients may place into model context. Treating server-controlled guidance as trusted policy creates a prompt-injection path that can influence tool selection or side effects. A newly reported protocol issue (#3213, Aug 7, 2026) specifically identifies `server/discover` and `initialize` instructions as an injection surface.

## Evidence
See `evidence/research.md`. The MCP specification already states that tool behavior descriptions/annotations are untrusted unless obtained from a trusted server. OWASP MCP Top 10 identifies tool poisoning and contextual prompt injection. MCP's March 2026 tool-annotations guidance explicitly says annotations and server instructions are soft signals, not enforcement, and untrusted servers can lie.

## Existing approach
Clients may display server instructions, use annotations for UX/approval decisions, run prompt-injection classifiers, or rely on user approval. These layers help but remain fragile when server-controlled natural language is blended into trusted system instructions or can directly cause privileged tool calls.

## Proposed improvement
Introduce a deterministic trust-boundary gate:
1. classify server instructions/tool metadata as untrusted data by default;
2. normalize and size-limit metadata before model exposure;
3. never promote server text into immutable system policy;
4. derive allowed actions from user intent plus host policy, not server prose;
5. require independent authorization for side-effecting/high-risk calls;
6. log origin, trust classification, requested capability, approval, and final tool call;
7. test injection payloads against the gate.

## Package tree
- `evidence/research.md`
- `skills/instruction-boundary-threat-model.md`
- `rules/mcp-instruction-trust-rules.md`
- `subagents/threat-modeler.md`
- `subagents/security-verifier.md`
- `workflows/observe-model-enforce-verify.md`
- `hooks/preflight-mcp-metadata-check.md`
- `scripts/mcp_instruction_gate.py`
- `tests/test_mcp_instruction_gate.py`

## Installation
Python 3.10+. Standard library only.

## Usage
`python scripts/mcp_instruction_gate.py metadata.json --policy strict --json`

The input can contain `instructions`, `server_name`, `trusted`, and `tools` with descriptions/annotations.

## Security metrics
Injection fixtures blocked; high-risk tool calls requiring approval; untrusted metadata promoted to trusted policy (target 0); secrets in logged artifacts (target 0); false-positive review rate; security regression pass rate.

## Verification
Implemented = origin/trust classification and enforcement integrated. Measured = attack/control fixtures executed. Verified = injected server guidance cannot bypass policy or approval boundaries and legitimate control cases remain usable.

## Safety
Secure by default. Unknown server trust is untrusted. Do not weaken authorization because metadata claims `readOnlyHint`, safety, idempotence, or benign intent.

## Failure handling
Parsing or policy ambiguity blocks privileged execution. Maximum one sanitized re-evaluation; otherwise require explicit human review or disable the untrusted integration for that task.

## Definition of Done
Evidence documented; threat model complete; trust boundaries explicit; gate/tests implemented; attack fixtures blocked; legitimate fixtures pass; no secret exposure; independent security verification complete.
