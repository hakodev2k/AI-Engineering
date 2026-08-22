# MCP Server Instruction Provenance Gate

**Category:** Security  
**Run date:** 2026-08-22 (UTC+7)

## Problem
MCP servers can supply natural-language instructions and metadata that clients may place into model context. Without explicit provenance and action-time authorization, server-controlled text can gain influence over high-impact tools beyond the authority intended by the user.

## Evidence
See `evidence/research.md`. The package is grounded in the August 2026 MCP server-instruction prompt-injection report, MCP trust guidance, and current OpenAI prompt-injection/MCP safety guidance.

## Existing approach and limitations
Server allowlists, prompt warnings, generic injection detectors, confirmation dialogs, and sanitization help, but none by itself preserves exact content provenance through the action boundary. Trust can become stale when metadata changes, and model-only controls are probabilistic.

## Proposed improvement
Treat MCP instructions as data with an explicit source/trust envelope. Hash the exact payload, reject malformed input, classify requested capabilities, and require current-hash-bound approval before untrusted instructions can influence high-impact operations.

## Architecture
```text
MCP instructions
  -> provenance/hash validation
  -> explicit server trust lookup
  -> requested capability classification
  -> deterministic action-time gate
  -> allow | approval_required | deny
  -> independent security verification
```

## Package tree
```text
README.md
evidence/research.md
config/policy.json
skills/instruction-provenance-analysis.md
rules/trust-boundary.md
subagents/security-verifier.md
workflows/ingest-and-authorize.md
hooks/pre-tool-gate.md
scripts/instruction_gate.py
scripts/test_instruction_gate.py
tests/cases.json
```

## Installation
Requires Python 3.10+ and only the Python standard library. No network access or secrets are required by the scripts.

## Configuration
Edit `config/policy.json`. Add a server to `trusted_servers` only after an explicit trust decision. Extend `high_impact_capabilities` to match the actual tool surface. Keep high-impact approval enabled for untrusted servers.

## Usage
From this topic directory:

```bash
python3 scripts/instruction_gate.py input.json --policy config/policy.json
python3 scripts/test_instruction_gate.py
```

The gate exits with 0 for allow, 2 for invalid input/configuration, 4 when approval is required, and 5 for deny.

## Workflow
Follow `workflows/ingest-and-authorize.md`. Measure the existing boundary first, locate where provenance is lost, integrate the gate before execution, rerun fixtures, then hand evidence to `subagents/security-verifier.md`.

## Metrics
- Provenance coverage for MCP instructions.
- High-impact action-time gate coverage.
- Malicious fixture block/approval rate.
- Benign fixture pass rate.
- Stale approval rejection rate.

## Verification
**Implemented:** policy, deterministic gate, rules, workflow, hook, fixture suite, and independent verifier role are present.  
**Measured:** adopters must capture baseline and post-change results in their integration; this repository package does not claim production measurements.  
**Verified:** package-level verification requires `python3 scripts/test_instruction_gate.py` to pass and an independent review of capability mappings. Production verification additionally requires confirming that every high-impact MCP-influenced tool path invokes the gate.

## Safety
The package never treats fluent text as proof of trust, contains no secrets, performs no destructive actions, and fails closed for invalid or unapproved high-impact flows. Human approval is required before dangerous or irreversible actions when policy requires it.

## Failure handling
Detection: nonzero gate exit, failed fixture, missing provenance, ambiguous capability mapping, or stale approval.  
Evidence: preserve bounded decision metadata and hashes.  
Retry: maximum two implementation retries after the first measured attempt, each based on new evidence.  
Fallback: disable the affected high-impact path or restrict it to a trusted, least-privilege capability.  
Escalation: security owner/human reviewer.  
Stop condition: three measured implementation attempts, unavailable provenance, or unresolved boundary ambiguity.

## Definition of Done
- Current evidence documented.
- Existing approaches and limitations recorded.
- Baseline captured in the adopting system.
- Every MCP instruction carries provenance/hash.
- High-impact actions are deterministically gated.
- Fixture suite passes.
- Stale approval is rejected.
- Independent verifier signs off.
- No secrets are embedded and no blocking issue remains.

## Customization
Map application-specific capabilities into `config/policy.json`; integrate the hook immediately before the actual privileged operation; retain only bounded hashes/metadata in logs when raw instructions may contain sensitive information.
