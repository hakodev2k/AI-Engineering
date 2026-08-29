# Browser-Agent Indirect Prompt Injection Action Gate

**Category:** Security  
**Run date:** 2026-08-30 (UTC+7)

## Problem
Browser agents read attacker-controlled web content while holding authenticated sessions and tools that can navigate, fill forms, send data, upload files, or submit transactions. Indirect prompt injection can turn untrusted page content into instructions that cause sensitive actions outside the user's intent.

## Evidence
See `evidence/research.md`. Recent signals include Google Gemini CLI browser-agent security work requiring navigation restrictions, sensitive-action confirmation and prompt-injection defenses; an open mcp-chrome issue describing indirect prompt injection against authenticated browser sessions; LivePI reporting 10.7%–29.6% attack-success rates across tested models in production-like tool environments; and an August 2026 DeepSeek Harness study reporting successful attacks across indirect-content channels.

## Existing approach
Prompt-level warnings, URL allowlists, browser sandboxing, human confirmation, content classifiers, and provider/model safety training are common defenses.

## Remaining limitation
A model can still misclassify or follow hostile content, and prompt-only defenses remain probabilistic. Confirmation prompts are often too broad or occur after sensitive data has already been read. The missing layer is a deterministic execution-boundary decision using provenance, destination, action type, data sensitivity, and explicit user approval.

## Proposed improvement
Insert a fail-closed policy gate before side-effecting browser actions. Treat page/tool content as untrusted by default; bind each action to an authority source and destination; require explicit approval for sensitive or high-impact actions; deny outbound sensitive-data transfer unless destination policy permits it; and keep audit evidence.

## Package tree
```text
README.md
evidence/research.md
config/policy.example.json
skills/browser-trust-boundary-threat-model.md
rules/browser-action-security-rules.md
subagents/security-reviewer.md
subagents/verification-agent.md
workflows/redteam-enforce-verify.md
hooks/pre-action-policy-check.md
scripts/browser_action_gate.py
tests/test_browser_action_gate.py
```

## Installation
Python 3.10+; standard library only.

## Usage
```bash
python scripts/browser_action_gate.py action.json --policy config/policy.example.json
python -m unittest tests/test_browser_action_gate.py
```
An action record contains `action`, `source_trust`, `destination`, `sensitive_data`, `human_approved`, `auth_context`, and optional `local_path`.

## Metrics
Attack success rate on adversarial fixtures; unauthorized side-effect rate; sensitive-data exfiltration rate; benign task success; approval rate; false-block rate; policy evaluation latency.

## Verification states
**Implemented:** policy gate and tests exist.  
**Measured:** benign and adversarial fixture outcomes are recorded.  
**Verified:** known malicious paths are blocked, permission boundaries are preserved, benign-task regression is within policy, and no secrets are emitted in logs.

## Safety
Fail closed when provenance, destination, or approval is missing for a high-risk action. Do not weaken authorization or secret handling for convenience. Dangerous or irreversible actions require explicit human approval.

## Failure handling
On gate error, block the action and retain redacted evidence. Retry policy evaluation at most once after fixing malformed input. Never retry the browser action itself automatically. Escalate policy ambiguity to a human.

## Definition of Done
Threat model documented; adversarial and benign fixtures exist; gate implemented; tests pass; attack paths blocked; sensitive-data egress policy enforced; no secret logged; approval boundaries preserved; independent verification complete.

## Customization
Add application-specific actions and destination classes in `config/policy.example.json`, keeping deny-by-default semantics for unknown high-risk actions.
