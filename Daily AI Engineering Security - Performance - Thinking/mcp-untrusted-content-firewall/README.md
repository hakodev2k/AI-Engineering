# MCP Untrusted Content Firewall

## Category
Security

## Problem
External MCP/tool/fetch content can carry instruction-like text into an agent context and influence later privileged actions. Existing approvals, sandboxing, and schema validation reduce risk but do not consistently preserve provenance or enforce trust-to-privilege transitions across tools.

## Evidence
See `evidence/research.md` for current public signals from the MCP specification, VS Code agent security guidance, approval documentation, and ecosystem reports.

## Proposed improvement
Insert a deterministic provenance/risk gate before external content reaches model context and again before tainted content can influence write/execute/network/credential/production actions.

## Architecture
1. Host captures external payload and provenance.
2. `hooks/pre-context.md` invokes `scripts/content_firewall.py`.
3. `config/policy.json` assigns trust/action weights and deterministic pattern rules.
4. Policy emits allow, allow-with-taint, require-review, or block.
5. `rules/security-rules.md` governs downstream authorization.
6. `workflows/investigate-and-enforce.md` coordinates baseline, rollout, and regression verification.
7. `subagents/security-verifier.md` independently validates the result.

## Package tree
```text
mcp-untrusted-content-firewall/
├── README.md
├── evidence/research.md
├── skills/assess-and-gate-content.md
├── rules/security-rules.md
├── subagents/security-verifier.md
├── workflows/investigate-and-enforce.md
├── hooks/pre-context.md
├── config/policy.json
└── scripts/content_firewall.py
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy the directory into the target project or agent-policy repository.

## Configuration
Edit `config/policy.json`. Keep privileged actions in `failClosedActions`. Add regex rules only when they are deterministic signals, not as claims of perfect prompt-injection detection.

## Usage
```bash
python scripts/content_firewall.py scan \
  --input external.txt \
  --source untrusted \
  --action execute \
  --policy config/policy.json
```

Exit codes: 0 allow, 10 allow-with-taint, 20 require-review, 30 block, 40 internal/configuration failure.

## Workflow
Follow `workflows/investigate-and-enforce.md`: baseline → provenance → deterministic scan → decision → scoped approval if needed → execute → audit → independent verification.

## Metrics
Provenance coverage, high-risk event rate, escalated privileged chains, false-positive rate on benign fixtures, false-negative rate on adversarial fixtures, and audit coverage.

## Verification
Do not claim the firewall is verified until target-host integration proves: external provenance is retained; privileged actions cannot bypass review after high-risk content; critical adversarial fixtures are not auto-allowed; benign false positives are measured.

## Safety
This package is defense-in-depth. It does not claim regex scanning can solve prompt injection. Preserve sandboxing, least privilege, schema validation, approval boundaries, and human review.

## Failure handling
Policy/config/scanner failures block privileged chains. Read-only display fallback is allowed only when explicitly configured and the content remains untrusted.

## Definition of Done
- Current evidence documented.
- Target-host baseline captured.
- Provenance attached to all tested external content.
- All critical adversarial fixtures block or require review.
- Privileged tainted chains require scoped approval.
- False-positive/negative metrics recorded.
- Independent verifier reports `verified`.
- No secrets or unsafe defaults introduced.

## Customization
Adapt source trust tiers, action classes, policy rules, and integration hooks to the host. Do not weaken mandatory rules merely to reduce approval friction.
