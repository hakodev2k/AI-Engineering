# A2A Agent Card Prompt Boundary Guard

**Category:** Security

## Problem
Remote A2A Agent Cards contain human-readable `description` and `skills` metadata that clients may feed to an LLM. Current public reports show reference-client code rendering those remote fields directly into prompts, creating a prompt-injection boundary failure. Agent Card signature or HTTPS integrity does not make remote metadata trustworthy as instructions.

## Evidence
See `evidence/research.md`. Current evidence includes A2A issue #687 (2026-08-09), A2A Python validation work (#975/#1023), and the A2A specification's Agent Card integrity guidance.

## Existing approach and limitation
A2A supports HTTPS, authentication, optional JWS signatures and validation hooks. These controls establish origin/integrity and URL safety, but do not by themselves prevent a legitimately remote agent from supplying instruction-like text that a client later places in privileged model context.

## Proposed improvement
Treat all remote Agent Card prose as untrusted data. Before LLM consumption, enforce size and control-character bounds, detect instruction-like patterns for review, preserve provenance, prohibit promotion into system/developer instructions, and require an application-owned rendering template that labels remote fields as data. The deterministic script is a preflight gate, not a claim that pattern matching can solve prompt injection alone.

## Package tree
- `evidence/research.md` — current signals, existing approaches, gaps and root causes.
- `skills/agent-card-risk-assessment.md` — evidence-driven assessment procedure.
- `rules/agent-card-trust-boundary.md` — enforceable security invariants.
- `subagents/security-reviewer.md` — independent reviewer contract.
- `workflows/research-diagnose.md` — research and diagnosis path.
- `workflows/enforce-and-verify.md` — implementation and bounded verification path.
- `hooks/pre-agent-card-consumption.md` — blocking pre-consumption hook.
- `scripts/agent_card_guard.py` — dependency-free Agent Card validator.
- `tests/test_agent_card_guard.py` — deterministic regression tests.

## Installation
Python 3.10+ only; no third-party dependencies.

## Configuration
The reference script accepts `--max-text-chars` and `--allow-private-hosts`. Private hosts are blocked by default because untrusted Agent Card URLs are also an SSRF surface; internal deployments may explicitly opt in after network-boundary review.

## Usage
`python scripts/agent_card_guard.py path/to/agent-card.json`

Exit codes: `0` accepted; `2` blocking security finding; `64` invalid input/usage.

## Workflow
Observe remote card → record provenance → run preflight → independently review findings → render accepted metadata only in an untrusted-data envelope → run adversarial fixtures → verify no privileged-prompt promotion.

## Metrics
- cards scanned / cards blocked
- instruction-like text findings per 100 cards
- maximum remote prose length
- private/loopback URL findings
- percent of LLM-bound cards carrying provenance labels
- adversarial fixture pass rate

## Verification
Run `python -m unittest tests/test_agent_card_guard.py`. Verification requires malicious instruction-like metadata and private-target URLs to block, benign public cards to pass, and the client integration to keep accepted card prose outside privileged instruction roles.

## Safety
MUST NOT auto-rewrite suspicious text into supposedly safe instructions. MUST NOT treat signatures as semantic trust. Human approval is required before relaxing a blocking policy for a new external agent.

## Failure handling
Scanner parse failure blocks consumption. A blocked card remains quarantined. Retry only after card or policy changes, maximum two automated validation attempts per revision; then escalate to a human reviewer.

## Definition of Done
**Implemented:** preflight is wired before any LLM prompt construction. **Measured:** scan outcomes and integration-role placement are recorded. **Verified:** regression tests pass and an independent reviewer confirms remote Agent Card prose cannot become system/developer instructions.
