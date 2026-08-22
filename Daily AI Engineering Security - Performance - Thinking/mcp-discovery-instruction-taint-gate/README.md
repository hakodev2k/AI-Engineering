# MCP Discovery Instruction Taint Gate

## Topic
Defend agent context against untrusted `server/discover` instructions and other server-supplied instruction fields.

## Category
Security

## Problem
MCP discovery metadata can carry instructions that clients may place near trusted system guidance. A malicious or compromised server can therefore smuggle prompt-injection text through a protocol control plane rather than ordinary user content.

## Evidence
Current public evidence and source links are documented in `evidence/research.md`. The package treats server-supplied instructions as untrusted data, not authoritative policy.

## Existing approach and limitation
Common mitigations include delimiters, warning text, prompt-injection detection, and length caps. These help but do not create a deterministic trust boundary, and lexical detection alone is bypassable.

## Proposed improvement
Use a fail-closed instruction admission gate that normalizes content, enforces size/control-character limits, classifies instruction capabilities, blocks policy-override/data-exfiltration/tool-escalation patterns, and only releases an explicitly bounded representation to model context. High-risk or ambiguous instruction sets require human approval rather than automatic admission.

## Architecture
1. `skills/discovery-instruction-threat-analysis.md` defines the reusable analysis procedure.
2. `rules/discovery-instruction-trust-boundary.md` defines enforceable policy.
3. `subagents/security-verifier.md` independently verifies risky admissions.
4. `workflows/discover-classify-gate.md` defines the bounded execution path.
5. `hooks/pre-context-injection.md` connects deterministic validation to runtime admission.
6. `scripts/instruction_gate.py` implements normalization and policy evaluation.
7. `config/policy.json` supplies safe defaults.
8. `tests/test_instruction_gate.py` provides regression tests.

## Package tree
```text
README.md
evidence/research.md
skills/discovery-instruction-threat-analysis.md
rules/discovery-instruction-trust-boundary.md
subagents/security-verifier.md
workflows/discover-classify-gate.md
hooks/pre-context-injection.md
scripts/instruction_gate.py
config/policy.json
tests/test_instruction_gate.py
```

## Installation
Requires Python 3.10+ and no third-party packages.

## Usage
```bash
python scripts/instruction_gate.py instruction.json --policy config/policy.json
python -m unittest tests/test_instruction_gate.py
```
Input JSON must contain `server_id` and `instructions`; optional `source_uri` and `requested_capabilities` improve audit evidence.

## Workflow
Observe discovery payload → normalize → measure size/structure → classify risk → apply deterministic policy → require approval for ambiguous/high-impact content → release bounded representation → independently verify high-risk decisions.

## Metrics
Track admitted/blocked/review counts, risky-pattern incidence, bytes removed, policy version, false-positive rate on approved fixtures, and attack-fixture block rate.

## Verification
**Implemented:** deterministic gate, policy, hook, workflow, tests.  
**Measured:** run the test suite plus a representative benign/malicious fixture corpus.  
**Verified:** all attack fixtures blocked or routed to review, all approved benign fixtures admitted, no raw untrusted instructions injected outside the bounded representation, and verifier sign-off for exceptions.

## Safety
The package never grants a server additional tool permissions. It never interprets discovery text as authorization. Secrets and user data must not be exposed to an instruction solely because the instruction asks for them.

## Failure handling
Malformed input, invalid policy, oversize content, control-character abuse, or execution uncertainty fails closed. Automated classification may be retried once after normalization; unresolved ambiguity escalates to review. No infinite retries.

## Definition of Done
- Research evidence recorded.
- Trust boundary rules active.
- Deterministic hook enabled before context injection.
- Attack fixtures pass.
- Benign regression fixtures pass.
- Exception path requires explicit approval.
- Audit decision includes server, source, policy, hashes, and reason.
- No blocking security issue remains.

## Customization
Tune pattern families, length limits, and review thresholds in `config/policy.json`; do not weaken the invariant that remote instructions are untrusted and cannot authorize privileged actions.
