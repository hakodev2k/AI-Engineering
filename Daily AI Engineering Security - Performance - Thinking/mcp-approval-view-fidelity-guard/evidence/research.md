# Research — MCP Approval-View Fidelity Guard

**Research date:** 2026-08-20 (UTC+7)  
**Category:** Security

## Problem

MCP clients commonly discover tool metadata (`name`, `description`, `inputSchema`, annotations), show some representation to a human for approval, and later inject tool metadata into model context. If the human-visible representation and the model-visible bytes are not equivalent, a server can place instructions in metadata that the model receives but the reviewer does not visibly inspect. A related time-of-check/time-of-use problem appears when metadata changes after approval without a fresh approval decision.

This is not the same problem as cross-server tool-name collision or origin routing. The security property here is **approval-view fidelity**: the exact security-relevant metadata approved by the human must be the metadata authorized for model exposure and invocation.

## Why it matters now

MCP 2026-07-28 explicitly says tools are model-controlled, hosts must obtain explicit user consent, users should understand what a tool does before authorizing it, and descriptions/annotations should be treated as untrusted unless they come from a trusted server. Those goals depend on the approval surface faithfully representing what the model will consume.

A July 2026 empirical paper isolates a concrete fidelity gap using Unicode TAG characters. It reports that an attacker-controlled payload can be invisible in mainstream rendered approval views while remaining present in the bytes/token stream delivered to the model. The same work reports no forced re-approval for its tested metadata mutations, including a rug-pull scenario.

Microsoft's public Agent Governance Toolkit now includes MCP protections for invisible Unicode, tool-description injection, schema abuse, tool fingerprinting, and rug-pull detection, which is an independent engineering signal that metadata integrity and drift are active implementation concerns.

## Current public signals

### Signal 1 — MCP 2026-07-28 security model

The current MCP specification says:

- tool invocation is model-controlled;
- hosts must obtain explicit user consent before invoking tools;
- users should understand tool behavior before authorizing it;
- tool descriptions/annotations are not inherently trustworthy;
- clients should show tool inputs before sensitive calls and log tool use.

Observed limitation: the protocol does not itself define a canonical human rendering, a byte-equivalence invariant between approval view and model context, or mandatory re-approval when security-relevant metadata changes.

Sources:
- https://modelcontextprotocol.io/specification/2026-07-28
- https://modelcontextprotocol.io/specification/2026-07-28/server/tools
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/index.mdx

### Signal 2 — July 2026 approval-view fidelity experiment

Rashidi, *Unicode TAG-Block Concealment of Tool-Metadata Payloads in the Model Context Protocol* (arXiv:2607.05744), reports a deterministic harness across multiple metadata surfaces and three independently developed Python MCP server libraries. The paper's central finding is that Unicode TAG-block text can be absent from the reviewer's rendered view yet remain in the metadata delivered to the model. It also tests metadata mutation after approval and reports no protocol-mandated re-approval in the tested cases.

Source:
- https://arxiv.org/abs/2607.05744

### Signal 3 — independent production-oriented mitigations

Microsoft's `agent-governance-toolkit` describes MCP defenses that include invisible-Unicode detection, tool-poisoning detection, description-injection detection, schema checks, fingerprints, schema drift detection, and rug-pull detection.

Sources:
- https://github.com/microsoft/agent-governance-toolkit/blob/main/agent-governance-python/agent-os/src/agent_os/mcp_security.py
- https://github.com/microsoft/agent-governance-toolkit/blob/main/docs/specs/MCP-SECURITY-GATEWAY-1.0.md

### Signal 4 — broader client-side tool-poisoning evidence

A March 2026 MCP threat-modeling study evaluates seven MCP clients and identifies tool poisoning in metadata as a high-impact client-side risk, arguing for static metadata analysis, behavioral checks, and better user transparency.

Source:
- https://arxiv.org/abs/2603.22489

## Existing approaches

1. **Human approval dialogs.** Good for explicit consent, but only if the displayed representation is faithful and complete.
2. **String/prompt-injection scanners.** Useful for known patterns but can miss Unicode concealment or novel encodings and should not be the sole boundary.
3. **Trusting server metadata after installation.** Convenient but weak against compromised servers, package updates, dependency compromise, or post-approval metadata drift.
4. **Tool fingerprinting/schema drift detection.** Stronger because it turns metadata mutation into an observable event, but it must bind the approved digest to the exact representation passed to the model and invoked at runtime.
5. **Per-call approval.** Stronger than one-time approval, but still unsafe if the approval UI hides characters or does not display the same canonical metadata.

## Observed limitations

- Rendering can normalize, suppress, or fail to display Unicode characters that remain in the underlying string.
- Security decisions based only on visually rendered text are not byte-stable.
- A sanitizer that searches known phrases is weaker than a structural invariant.
- Re-approval policies often key on tool name/server registration rather than the full security-relevant metadata digest.
- Schema fields, defaults, descriptions, titles, and annotations can all influence the model but may not all appear in approval UIs.
- Fingerprinting without canonicalization can produce false drift from harmless serialization differences or miss semantically relevant normalization mismatches.

## Root-cause hypotheses

1. **Approval is object-identity based instead of content-addressed.** The host remembers “approved tool X” rather than “approved canonical descriptor digest D.”
2. **Different transformations feed UI and model.** The renderer and model serializer may normalize or filter metadata differently.
3. **No explicit dangerous-codepoint policy.** Default text rendering is treated as sufficient validation.
4. **Drift detection is late or absent.** Metadata is refreshed independently of approval state.
5. **Security-critical fields are not enumerated.** Hosts disagree on which descriptor fields are approval-relevant.

## Improvement target

Introduce a deterministic host-side boundary with these invariants:

1. Parse tool metadata as data; reject malformed structures.
2. Walk all model-visible strings and block invisible/control codepoints that cannot be faithfully reviewed, using a configurable allowlist for ordinary whitespace.
3. Canonicalize the full security-relevant descriptor into stable JSON.
4. Render approval text from that same canonical object.
5. Compute a SHA-256 digest of the canonical descriptor.
6. Store approval as `(server identity, tool name, descriptor digest, policy version)`.
7. Before model exposure and before invocation, recompute the digest and require an exact match.
8. Any mismatch invalidates approval and requires re-review; never silently update the approved digest.
9. Keep deterministic audit records of checks and decisions without storing secrets or tool arguments unnecessarily.

## Success metrics

- **Invisible metadata detection:** 100% rejection of configured TAG-block/control test vectors.
- **Approval/model equivalence:** approved canonical digest equals pre-model and pre-call digest on every allowed invocation.
- **Drift containment:** 100% of tested descriptor mutations invalidate prior approval.
- **Benign stability:** key-order-only JSON changes do not cause false drift after canonicalization.
- **Regression coverage:** all supplied positive/negative tests pass.
- **Operational visibility:** every block has a deterministic reason code.

## Interpretation vs proposal

### Observed evidence

The specification requires meaningful consent and treats metadata cautiously; recent research demonstrates an approval/model representation gap and metadata-rug-pull behavior; an independent Microsoft toolkit implements related metadata and drift defenses.

### Interpretation

A reliable consent boundary needs a content-addressed contract over the exact security-relevant metadata, not only a UI prompt or tool/server name.

### Proposed engineering solution

This package adds a host-side **Approval-View Fidelity Guard** that enforces Unicode reviewability, canonical descriptor hashing, approval digest binding, and re-approval on drift. It does not claim to solve every MCP attack and does not treat static scanning as proof that a server is trustworthy.