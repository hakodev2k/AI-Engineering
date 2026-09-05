# MCP Untrusted Instructions Boundary

**Category:** Security  
**Run date:** 2026-09-05 (UTC+7)

## Problem
MCP servers can supply natural-language `instructions` and other metadata that clients may place into the model context. When this server-controlled text is treated like privileged host guidance, a malicious or compromised server can steer the model across tool boundaries. The protocol-level issue is current: modelcontextprotocol/modelcontextprotocol issue #3213 (opened 2026-08-07) demonstrates prompt injection through `server/discover` / `initialize` instructions, while OWASP MCP guidance separately identifies tool poisoning and contextual prompt injection as active MCP risks.

## Evidence
See `evidence/research.md`. It separates observed evidence, interpretation, and the proposed mitigation.

## Existing approach and limitation
Current mitigations include trust warnings, prompt-injection classifiers, sanitization, length limits, structured outputs, tool allowlists, least privilege, and human approval. These help but do not create a reliable privilege boundary if server-authored text is still concatenated into a privileged system/developer instruction region. Pattern filters are incomplete by design, and XML/tag wrapping alone does not enforce authorization.

## Proposed improvement
Treat all server-authored natural language as untrusted data with provenance. The package adds a deterministic ingestion gate that rejects control characters, excessive length, and high-risk instruction patterns; assigns a trust class; requires a dedicated untrusted context channel; and forbids server text from changing tool permissions, approval requirements, secret access, or host policy. The gate complements rather than replaces least-privilege tool authorization.

## Package tree
- `evidence/research.md`
- `skills/mcp-instruction-threat-model.md`
- `rules/untrusted-server-content.md`
- `subagents/security-verifier.md`
- `workflows/research-diagnose.md`
- `workflows/integrate-verify.md`
- `hooks/pre-context-ingestion.md`
- `scripts/inspect_mcp_instructions.py`
- `config/policy.example.json`
- `tests/test_inspect_mcp_instructions.py`

## Installation
Python 3.10+, standard library only.

## Configuration
Copy `config/policy.example.json`. Define maximum instruction length and the destination context class. Do not put credentials in this file.

## Usage
`python scripts/inspect_mcp_instructions.py config/policy.example.json payload.json`

`payload.json` must contain `server_id` and `instructions`. Exit 0 means the payload may be admitted only as untrusted server content; exit 2 means blocked; exit 1 means invalid input/configuration.

## Workflow
Observe source and provenance -> establish threat model -> baseline current ingestion behavior -> run gate -> inspect any privileged-context concatenation -> implement isolated untrusted channel -> verify permission invariants -> adversarial regression tests -> independent security review.

## Metrics
Blocked high-risk payloads; untrusted payloads reaching privileged instruction regions; unauthorized tool-permission changes; approval bypasses; secret-exposure incidents; false-positive review rate; security-test pass rate.

## Verification
**Implemented:** deterministic gate, rules, workflow, tests.  
**Measured:** baseline records where server instructions enter the model context and what privileges are available.  
**Verified:** malicious fixtures are blocked or isolated; trusted host policy remains unchanged; dangerous tool authorization is enforced outside model text; no secret-bearing data is exposed.

## Safety
Never treat classifier success as proof that content is safe. Never grant additional tool privileges based on server-supplied instructions. Dangerous or irreversible actions require explicit human approval and backend authorization.

## Failure handling
Any unknown provenance, privileged-context insertion, malformed payload, or policy violation blocks ingestion. Investigation retries are limited to 2. If provenance or authorization cannot be established, stop and escalate to a security owner.

## Definition of Done
Evidence documented; trust boundary mapped; baseline captured; gate integrated; hostile fixtures pass expected block/isolation behavior; authorization invariants tested; security reviewer independently verifies; no secrets included; no blocking issue remains.

## Customization
Organizations may extend risk patterns and provenance classes, but MUST keep server-authored instructions non-authoritative and MUST NOT use text filtering as the sole authorization control.