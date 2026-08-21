# Agent Secret Transcript Redaction Guard

## Topic
Prevent plaintext credentials from crossing AI-agent tool-output boundaries into model context, session transcripts, logs, telemetry or synced history.

## Category
**Security**

## Problem
Coding agents execute shell commands, read files and consume tool/MCP output. A single `env`, `printenv`, `.env` read, verbose deployment command or failed authentication operation can place live credentials in stdout/stderr. If the agent host persists or reinjects that result before deterministic sanitation, the credential has already crossed the trust boundary.

Prompt instructions are insufficient as the only control: recent Claude Code and Codex reports document plaintext credential exposure even with explicit secret-handling expectations, and current hook mechanisms may not reliably replace tool output before rendering/persistence.

## Evidence
Research and source links are in `evidence/research.md`. Key current signals include:
- Claude Code #86707 (2026-08-14): request for credential-shaped redaction at transcript write time because tool output is stored verbatim.
- Claude Code #80153 (2026-07-22): environment dump exposed multiple live API tokens in a persisted transcript.
- Codex #34233 (2026-07-19): live credentials reached stored tool/conversation output despite explicit redaction instructions.
- Claude Code #77587 and Codex #31015: hook/output-rewrite limitations affecting sanitizer use cases.

## Existing approach
Common protections include prompt rules, shell-specific redaction pipelines, repository secret scanners, PostToolUse hooks and CI-style masking.

## Existing limitations
- Prompt compliance is probabilistic.
- Shell-written regex can miss credential formats.
- Repository scanners are too late for ephemeral output.
- Hook replacement may be late, schema-sensitive or unsupported.
- Known-value masking alone misses unregistered credentials; pattern-only masking can false-positive or miss novel formats.
- Post-hoc transcript cleanup occurs after data may already have reached model inference, sync or telemetry.

## Proposed improvement
Use a layered deterministic boundary:
1. **Command preflight** blocks configured broad environment/credential-dump commands and direct references to configured secret variables unless explicitly overridden.
2. **Exact known-value masking** reads only explicitly named secret environment variables and masks exact occurrences, longest first.
3. **High-confidence pattern masking** covers common credential shapes and sensitive key/value assignments.
4. **Residual verification** runs before any model or durable sink and again immediately before transcript serialization.
5. **Fail-closed quarantine** suppresses raw output when configuration, sanitation, schema validation or residual checks fail.
6. **Independent verification** proves the actual host integration protects every critical sink with synthetic canaries.

## Architecture
```text
planned tool/shell action
        |
        v
 command preflight
   | allow       | block/approve
   v             v
 tool execution  safer action / explicit one-shot override
        |
        v
 bounded raw capture (internal only)
        |
        v
 exact masking -> pattern masking -> assignment masking
        |
        v
 residual check ----failure----> quarantine generic marker
        |
        v
 schema validation
        |
        +----> sanitized model context
        |
        v
 final pre-transcript residual check
        |
        v
 sanitized transcript/log/telemetry
```

## Package structure
```text
agent-secret-transcript-redaction-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── redaction-policy.json
├── evidence/
│   └── research.md
├── skills/
│   └── core-skills.md
├── rules/
│   └── engineering-rules.md
├── subagents/
│   └── subagents.md
├── workflows/
│   └── workflows.md
├── hooks/
│   └── hooks.md
├── scripts/
│   ├── command_preflight.py
│   └── secret_output_guard.py
├── tests/
│   └── run_tests.py
└── verification/
    └── verification.md
```

## Installation
Requires Python 3.10+ and no third-party Python packages.

1. Copy this package into the repository or host-integration project.
2. Review `config/redaction-policy.json`.
3. Add only secret environment-variable names your host is allowed to register for exact masking.
4. Wire command preflight before shell execution.
5. Wire the output sanitizer before model context and transcript/log persistence.
6. Add host-specific integration tests for every output sink.
7. Run the package regression suite.

## Configuration
`config/redaction-policy.json` controls:
- mode (`redact` or `warn`; production should normally use `redact`);
- exact secret environment-variable names;
- blocked high-risk command patterns;
- sensitive assignment key names;
- minimum exact-secret length;
- redaction marker;
- maximum output size;
- fail-on-residual behavior.

The reference implementation deliberately does **not** enumerate the full environment to discover secrets.

## Usage
### Preflight a shell command
```bash
python scripts/command_preflight.py \
  --policy config/redaction-policy.json \
  --command 'git status --short'
```

### Sanitize captured tool output
```bash
python scripts/secret_output_guard.py \
  --policy config/redaction-policy.json \
  --input raw-output.txt \
  --output safe-output.txt \
  --metrics redaction-metrics.json
```

Only the sanitized output may be forwarded to the model or durable sinks.

### Run regression tests
```bash
python tests/run_tests.py
```

Tests use synthetic credentials only.

## Workflow
The primary workflow is **Observe → Baseline → Cause → Hypothesis → Implement → Measure again → Independent verify**. See `workflows/workflows.md` for boundary-protection and incident-recovery workflows. Retry loops are bounded to two implementation iterations for a persistent integration defect; unresolved critical paths are quarantined/escalated rather than weakened.

## Skills
`skills/core-skills.md` provides:
- Secret Boundary Assessment;
- Safe Tool Output Sanitization;
- Leak Incident Verification and Recovery.

Each Skill defines triggers, inputs, procedures, decisions, metrics, failure handling and stop conditions.

## Rules
`rules/engineering-rules.md` groups enforceable MUST / MUST NOT / SHOULD requirements. The central rule is that no raw tool output may bypass a failed sanitizer into model or persistent history.

## Subagents
`subagents/subagents.md` separates responsibilities among:
- Boundary Mapper;
- Sanitizer Implementation Agent;
- Independent Security Verifier.

The implementing agent is not the sole verifier.

## Hooks
`hooks/hooks.md` defines four integration points:
- PreToolUse command preflight;
- PostToolCapture sanitation before model/transcript;
- PreTranscriptWrite residual verification;
- PostIntegrationChange regression suite;
- FinalVerification boundary coverage gate.

If a host's official PostToolUse hook occurs too late or cannot replace the tool-result schema safely, move the boundary earlier into the tool runner/adapter. Never fall back to raw output.

## Metrics
Track without credential values:
- critical boundary coverage %;
- exact mask count;
- pattern mask count;
- sensitive-assignment mask count;
- residual count;
- bytes in/out;
- high-risk preflight block count;
- false-positive rate on representative non-secret logs;
- leak recurrence count;
- time to containment for confirmed incidents.

## Verification
See `verification/verification.md`.

Security success requires evidence from the real integration, not only a passing standalone script. Required gates include 100% critical sink coverage, zero registered/high-confidence residuals, zero raw pass-through on sanitizer failure and independent inspection of synthetic-canary model/transcript artifacts.

Status vocabulary:
- **Implemented:** control is wired.
- **Measured:** before/after synthetic fixtures and metrics are captured.
- **Verified:** an independent reviewer confirms the actual critical sinks are protected.

## Safety
- Never use live production credentials in tests.
- Never dump the whole environment to discover secret values.
- Never include secret values in diagnostics or incident reports.
- Keep existing sandbox, permission and approval controls; this package is defense-in-depth, not a replacement.
- Require explicit one-shot human approval for high-risk command overrides.
- Confirmed exposed credentials should be revoked/rotated according to provider policy.
- Respect legal/audit retention rules before destructive transcript/log cleanup.

## Failure handling
- Policy invalid → fail closed.
- Sanitizer error → quarantine result; no raw fallback.
- High-confidence residual → suppress payload and emit value-free security event.
- Unsupported structured rewrite → move interception earlier or block that result type.
- Two unsuccessful fix/retest iterations for the same critical defect → quarantine/disable affected path and escalate.

## Definition of Done
A host integration is done only when:
1. current evidence and threat model are documented;
2. every critical result source/sink is mapped;
3. baseline synthetic leakage behavior is captured;
4. preflight and sanitizer controls are installed where applicable;
5. standalone and host-specific tests pass;
6. registered/high-confidence residual count is zero;
7. sanitizer failure proves fail-closed behavior;
8. false positives are measured and acceptable under a declared threshold;
9. incident/recovery behavior is documented;
10. independent verification confirms model and transcript boundaries;
11. no blocking issue remains.

## Customization
Add provider-specific patterns only with synthetic positive fixtures and representative negative fixtures. Add safe metadata-only tools for tasks such as “is key X configured?” so the agent does not need values. For streaming tools, implement a stateful chunk-aware sanitizer or buffer within a bounded limit; never use stateless per-chunk regex that can miss a credential split across chunks.
