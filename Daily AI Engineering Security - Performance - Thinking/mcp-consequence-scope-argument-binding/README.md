# MCP Consequence-Scope Argument Binding

**Category:** Security

## Problem
An agent may be authorized to call a powerful MCP tool while still selecting an unauthorized repository, branch, filesystem path, or network endpoint from untrusted context. Broad credentials and unconstrained string arguments turn prompt injection into cross-resource action.

## Evidence
Current evidence and sources are documented in `evidence/research.md`, including modelcontextprotocol/servers #3751/#3752, AWS CVE-2026-18655, and MCP tool-annotation guidance.

## Existing approach
Least-privilege tokens, tool annotations, sandbox roots, endpoint allowlists, injection scanners, and human confirmation reduce risk.

## Existing limitations
Those controls do not consistently bind the exact normalized runtime target to the task-specific authorization decision. Approval may cover a tool name while hiding a target change.

## Proposed improvement
Add a deterministic, fail-closed policy decision point immediately before tool execution. Normalize every target-bearing argument, compare it with explicit task scope, and require human approval for configured high-consequence tools.

## Architecture
```text
mcp-consequence-scope-argument-binding/
├── README.md
├── evidence/research.md
├── config/policy.json
├── scripts/target_scope_guard.py
├── tests/test_target_scope_guard.py
├── skills/consequence-scope-analysis.md
├── rules/target-authorization.md
├── subagents/security-verifier.md
├── workflows/diagnose-and-verify.md
└── hooks/pre-tool-call.md
```

## Installation
Python 3.10+; standard library only. Copy `config/policy.json` to a trusted configuration location and customize approved repositories, branches, filesystem roots, hosts, and high-consequence tool names.

## Configuration
Policy entries are explicit allowlists. Filesystem roots are canonicalized with `realpath`; repositories strip a trailing `.git`; network destinations are compared by parsed hostname rather than substring.

## Usage
Create an event such as:
```json
{"tool":"push_files","repository":"hakodev2k/AI-Engineering","branch":"main","human_approved":true}
```
Then run:
`python scripts/target_scope_guard.py --event event.json --policy config/policy.json`

## Workflow
Follow `workflows/diagnose-and-verify.md`: Observe → baseline → diagnose → hypothesis → implement → re-measure → independent verify. Retries are bounded to two implementation revisions.

## Metrics
- Percentage of out-of-scope adversarial fixtures blocked
- Percentage of in-scope benign fixtures allowed
- High-consequence approval coverage
- Ambiguous-target and false-positive counts
- Secret exposure count (must remain zero)

## Verification
Run `python -m unittest tests/test_target_scope_guard.py`. The independent verifier must also inspect the actual pre-tool-call integration and confirm a block cannot be downgraded.

## Safety
Never widen target policy from model/tool output. Never log credentials. Dangerous or irreversible actions require explicit approval and a verified normalized target.

## Failure handling
**Detection:** non-zero guard exit, test failure, normalization ambiguity, or scope mismatch.  
**Evidence:** guard JSON plus safe fixture results.  
**Retry policy:** maximum 2 implementation revisions.  
**Fallback:** disable the tool or narrow credentials to the verified scope.  
**Escalation:** explicit human authorization/security review.  
**Stop condition:** secret exposure, irreversible risk, ambiguous target, or exhausted retries.

## Definition of Done
**Implemented:** guard and blocking hook integrated.  
**Measured:** baseline and post-change fixture metrics recorded.  
**Verified:** all tests pass; escape paths are blocked; in-scope calls remain usable; approval boundary is preserved; independent reviewer passes; no secrets exposed.

## Customization
Add domain-specific target normalizers only when they are deterministic. Prefer exact identifiers and canonical paths over regex or natural-language policy.
