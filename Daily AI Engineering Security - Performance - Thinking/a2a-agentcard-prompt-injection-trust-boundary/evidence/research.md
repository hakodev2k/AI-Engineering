# Research

## Topic
A2A AgentCard prompt-injection trust boundary

## Category
Security

## Problem
Remote AgentCard metadata can be inserted into a coordinator LLM prompt and interpreted as instructions instead of data.

## Why it matters now
A public A2A sample issue opened on 2026-08-09 includes a concrete reproduction where attacker-controlled AgentCard `description` and skill descriptions are rendered by Jinja directly into an LLM prompt. A separate A2A specification change in August 2026 requires verifier-side trust roots for AgentCard signature verification, showing that AgentCard provenance is actively being hardened. These solve different layers: provenance does not grant free-form text instructional authority.

## Affected users
A2A client authors, agent routers, enterprise agent gateways, developers consuming discovered agents, and platform teams that turn AgentCards into model context.

## Current public evidence
### Observed evidence
1. **A2A samples issue #687**, opened 2026-08-09: `agents/agents.jinja` renders discovered AgentCard `description` and `skills` directly into the LLM prompt; the report includes a malicious-card reproduction. https://github.com/a2aproject/a2a-samples/issues/687
2. **A2A specification PR around verifier-side trust roots**, visible in August 2026 repository activity: the project is tightening AgentCard signature verification and explicitly separating signer claims from verifier trust. https://github.com/a2aproject/A2A/pulls
3. **GitHub's prompt-injection guidance for agentic VS Code**, updated 2026-07-06, documents that externally sourced content entering agent context can expose tokens/files or cause arbitrary code execution when interpreted as instructions. https://github.blog/security/vulnerability-research/safeguarding-vs-code-against-prompt-injections/

## Interpretation
The durable control is not keyword removal. The architectural defect is authority confusion: descriptive remote metadata enters a privileged instruction surface. Signed or authenticated metadata can still be malicious, compromised, or simply contain imperative prose that should not control the coordinator.

## Existing approaches
- Input escaping/sanitization.
- Server allowlists and authenticated discovery.
- AgentCard signatures and trust-root verification.
- Prompt delimiters such as XML/Markdown fences.
- Model-side instruction hierarchy.

## Remaining limitations
- Escaping syntax does not change semantic authority.
- Allowlists do not protect against compromised trusted servers.
- Signatures prove origin/integrity, not safe intent.
- Delimiters are advisory to a probabilistic model.
- Model policy is defense-in-depth, not a deterministic precondition.

## Root-cause analysis
1. Protocol metadata and model instructions are flattened into one text stream.
2. Hosts lack typed provenance at render time.
3. Free-form descriptions are optimized for model usefulness and therefore often contain imperative language.
4. Security review focuses on transport/authentication while prompt authority is handled later and probabilistically.

## Improvement opportunity
Introduce a deterministic pre-render boundary: validate shape and size, retain source provenance, classify control-language risk, normalize metadata as data, and block direct interpolation into privileged prompts.

## Proposed solution
This package implements a pre-render scanner plus explicit rules and workflow. The scanner flags instruction-like patterns and overlong remote fields, emits normalized JSON, and returns blocking exit codes. The workflow requires an independent reviewer for policy exceptions.

## Goal
Prevent remote AgentCard text from becoming privileged coordinator instructions while preserving useful discovery metadata.

## Metrics
- Injection fixture block rate: target 100% for maintained fixtures.
- Benign fixture pass rate: target >=95% across organization-approved corpus.
- Gated-dispatch coverage: target 100%.
- Unreviewed policy overrides: target 0.
- Parse/schema failures that fail open: target 0.

## Trigger
Agent discovery, AgentCard refresh, card cache invalidation, or first dispatch to a newly discovered agent.

## Inputs
AgentCard JSON and local policy.

## Outputs
Allow/block decision, normalized data-only card, findings with field path and reason.

## Verification
Run `python -m unittest tests/test_scan_agentcard.py`; confirm malicious descriptions and skill descriptions block, benign metadata passes, malformed JSON returns input-error, and policy behavior is deterministic.