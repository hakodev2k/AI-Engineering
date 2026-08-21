# Untrusted Repository Instruction Execution Guard

## Topic
Prevent repository-controlled or externally retrieved instructions from silently escalating into privileged coding-agent tool execution.

## Category
Security

## Problem
Coding agents intentionally read repository instructions, README content, filenames, paths, issues, PRs, test/build configuration, and remote tool/server descriptions. Those sources may be attacker-controlled. If their provenance disappears before tool authorization, an indirect prompt injection can steer the model toward shell execution, repository-code execution, network access, GitHub writes, package installation, secret-bearing actions, or sandbox weakening.

## Evidence
See `evidence/research.md`. Current evidence includes 2026 advisories affecting Eclipse Theia, DeepSeek TUI, and Claude Code, plus current public reports of repository-file instruction injection and MCP server-controlled instruction risk.

## Existing approach
Sandboxing, human approval, repository trust prompts, tool allowlists, prompt-injection classifiers, static scanners, and auto-loaded agent instruction files.

## Existing limitations
These controls are frequently disconnected. A tool may be auto-approved without knowing the action was caused by untrusted repository text. Test/build tools may appear benign while executing attacker-controlled code. Prompt classifiers are probabilistic, and sandboxing alone does not stop every allowed network or remote-write side effect.

## Proposed improvement
Propagate source provenance into the tool router and use deterministic policy to combine source trust with tool/environment capabilities. The gate returns `allow`, `require_approval`, or `deny`. The model cannot override the decision. High-risk cases are verified with isolated adversarial fixtures and an independent Security Reviewer.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, gaps, and root causes.
- `config/trust-policy.json` — source trust, tool impact, deny rules, and approval rules.
- `skills/untrusted-context-threat-model.md` — reusable threat-model procedure.
- `rules/untrusted-repository-content.md` — enforceable trust and tool-security rules.
- `subagents/security-reviewer.md` — independent high-risk verifier.
- `workflows/taint-to-tool-authorization.md` — bounded observe/measure/fix/verify workflow.
- `hooks/pre-tool-taint-gate.md` — deterministic pre-execution integration contract.
- `scripts/taint_gate.py` — executable policy engine.
- `tests/test_taint_gate.py` — negative and benign regression tests.

## Actual package tree
```text
untrusted-repository-instruction-execution-guard/
├── README.md
├── config/
│   └── trust-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-tool-taint-gate.md
├── rules/
│   └── untrusted-repository-content.md
├── scripts/
│   └── taint_gate.py
├── skills/
│   └── untrusted-context-threat-model.md
├── subagents/
│   └── security-reviewer.md
├── tests/
│   └── test_taint_gate.py
└── workflows/
    └── taint-to-tool-authorization.md
```

## Installation
Requires Python 3.10+. Tests use `pytest`.

```bash
python --version
python -m pip install pytest
```

The core gate has no third-party runtime dependency.

## Configuration
Customize `config/trust-policy.json` to your runtime. Keep unknown repository/external sources untrusted or unknown by default. Add tool names to `high_impact_tools` and set capability metadata in the input for each proposed call.

Do not encode secrets in the policy, provenance records, action IDs, or audit reasons.

## Decision input
Example untrusted repository test execution:

```json
{
  "sources": [
    {"type": "repository-file", "trust": "untrusted"}
  ],
  "tool": {
    "name": "test",
    "capabilities": {
      "executes_repository_code": true,
      "network_access": false,
      "secret_access": false,
      "destructive_write": false,
      "writes_outside_workspace": false,
      "github_write": false,
      "package_install": false,
      "sandbox_bypass": false
    }
  },
  "environment": {"has_secrets": false},
  "approval": {"granted": false, "action_id": null}
}
```

## Usage
Run the gate before tool execution:

```bash
python scripts/taint_gate.py decision.json --policy config/trust-policy.json
```

Exit codes:
- `0` — allow.
- `2` — invalid input/configuration; integration must fail closed for high-impact actions.
- `4` — explicit human approval required.
- `5` — deny.

After human approval, bind approval to the concrete action/repository revision using a non-secret `action_id` and re-evaluate:

```json
{"granted": true, "action_id": "repo@abc123:test"}
```

Run regression tests:

```bash
pytest -q tests/test_taint_gate.py
```

## Workflow
Follow `workflows/taint-to-tool-authorization.md`: Observe trust crossings → baseline fixture decisions → diagnose missing provenance/under-classified tools → implement one fix → re-run fixtures → bounded retry → independent Security Reviewer verification.

## Metrics
Track provenance coverage, high-impact tool coverage, attack-fixture block/approval rate, benign false-block rate, unknown-provenance decisions, and any real security incidents caused by low-trust context.

## Verification
### Implemented
Provenance reaches the authorization layer and the deterministic gate is invoked before relevant tool execution.

### Measured
Representative benign and adversarial fixtures have baseline and post-change outcomes recorded.

### Verified
All required negative fixtures are blocked or approval-gated as policy specifies; trusted benign workflows remain usable; the sandbox/credential boundary is preserved; and a separate Security Reviewer confirms the result.

## Safety
- Use synthetic secrets and isolated repositories for tests.
- Never test exfiltration against real external endpoints.
- Never disable sandbox/network restrictions merely to make an agent workflow succeed.
- Do not let model text override a deterministic deny or approval-required result.
- Treat builds/tests/package scripts as execution of repository-controlled code when they can run repository logic.
- Redact raw secrets from audit logs.

## Failure handling
Detection comes from gate exit codes, missing provenance, failed fixtures, sandbox escapes, or unexpected side effects. Retry at most once after a clearly understood policy/integration failure. If a second failure occurs, disable auto-approval for the affected path and escalate. Stop immediately if testing touches real secrets or destructive external targets.

## Definition of Done
- Current evidence and existing limitations documented.
- All context sources are labeled or conservatively treated as unknown/untrusted.
- All high-impact tools have capability metadata.
- Baseline fixture outcomes are captured.
- Deterministic policy is implemented/configured.
- Repository-instruction, filename/path, test/build, network/write, and unknown-provenance fixtures produce expected decisions where applicable.
- Tests pass.
- No real secrets or destructive targets are used.
- Independent Security Reviewer returns Verified.
- No blocking issue remains.

## Customization
Integrate provenance at the earliest ingestion point available and preserve it through summarization, compaction, multi-agent handoffs, and tool routing. Add organization-specific capabilities such as database writes or deployment actions, but keep the final decision deterministic and separately auditable from model reasoning.
