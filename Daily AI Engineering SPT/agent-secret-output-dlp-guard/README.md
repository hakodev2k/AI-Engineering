# Agent Secret Output DLP Guard

## Topic
Prevent secret-bearing tool output from entering AI-agent context, transcripts, logs, caches, telemetry, or subagent handoffs.

## Category
Security

## Problem
Coding agents can read files, environment variables, CLI output, logs, HTTP results, and configuration. Even when repository instructions say “never expose secrets,” a tool may already have emitted the credential before the model notices. The result can then be persisted in conversation history and repeatedly resent as context.

Recent 2026 issue reports across Codex and Claude Code show this is a recurring engineering problem rather than a theoretical risk. See `evidence/research.md`.

## Evidence
The package is grounded in multiple public reports:
- OpenAI Codex #34233: credentials printed from config inspection despite `AGENTS.md` redaction instructions.
- Claude Code #80153: broad environment output leaked multiple live API tokens into persisted transcript.
- Claude Code #44868: `.env`/`.dev.vars` values reached transcript through normal inspection commands despite prompt prohibitions.
- Claude Code #63593 and #29434: requests for write-time/context redaction because tool output can persist secrets beyond the original command.

The evidence supports a key conclusion: prompt-level guidance is useful defense-in-depth but is not a reliable primary secret boundary.

## Existing approach
Common controls today include:
- natural-language project/system rules;
- ignore files;
- permission prompts;
- command-local regex redaction;
- Git secret scanners;
- credential rotation after accidental disclosure.

## Existing limitations
These controls leave important gaps:
- the model acts too late if raw tool output is already appended to context;
- ignore files do not protect environment variables or alternate read mechanisms;
- permission to execute does not equal permission to disclose returned bytes;
- ad-hoc regexes often miss formats outside their author's assumptions;
- repository scanners do not protect agent transcripts;
- UI masking is insufficient if raw values are persisted or sent to the model.

## Proposed improvement
Install a deterministic **Secret Output DLP Guard** between tool execution and every downstream sink.

The design combines:
1. **Pre-tool risk gating** for broad environment dumps and known secret-bearing paths.
2. **Exact-value matching** for sensitive environment values known to the runtime.
3. **Provider/token pattern detection** for recognizable credentials.
4. **Sensitive assignment detection** for unknown credential formats in `KEY=value` or `KEY: value` output.
5. **Private-key blocking** for high-severity material.
6. **Pre-persistence redaction** so model, transcript, UI, telemetry, cache, traces, and subagents all receive the same sanitized envelope.
7. **Fail-closed behavior** when the scanner fails.
8. **Plaintext-free audit metadata** using reason codes and hashes rather than matched values.
9. **Seeded canary verification** for every registered adapter and sink.

## Architecture

```text
Agent request
    |
    v
Pre-tool risk gate
    |
    v
Tool executor
    |
    | raw result (quarantined)
    v
Secret Output DLP Guard
    |
    +--> sanitized envelope --> model context
    +--> sanitized envelope --> transcript/UI
    +--> sanitized envelope --> telemetry/cache/trace
    +--> sanitized envelope --> subagent handoff
    |
    +--> plaintext-free audit metadata
```

### Security invariant
No raw tool output may be delivered directly to a model-visible or persistent sink.

## Package structure

```text
agent-secret-output-dlp-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
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
│   ├── secret_dlp_guard.py
│   └── scan_json_result.py
├── tests/
│   └── test_secret_dlp_guard.py
└── verification/
    └── verification.md
```

## Installation
The reference implementation uses Python's standard library only.

Recommended runtime: Python 3.10+.

Clone/copy the package into the agent host repository and keep `config/policy.json` under normal code review. Never put real secret values in the policy file.

## Configuration
Edit `config/policy.json` to define:
- sensitive environment-name fragments;
- sensitive path patterns;
- provider-specific secret regexes;
- sensitive key-name regex;
- maximum output bytes;
- private-key block policy;
- raw override behavior;
- audit-storage requirements.

Exact secret values are discovered only from matching process environment variables at runtime and are never serialized by the reference scanner.

## Usage

### Pre-tool risk check

```bash
python scripts/secret_dlp_guard.py precheck \
  --tool bash \
  --target 'printenv' \
  --policy config/policy.json
```

High-risk operations return exit code `3` and a structured deny decision.

### Sanitize text output

```bash
python scripts/secret_dlp_guard.py sanitize \
  --input raw-tool-output.txt \
  --output sanitized-tool-output.json \
  --audit dlp-audit.json \
  --policy config/policy.json
```

Only the sanitized JSON envelope should be handed to downstream systems.

### Sanitize structured JSON result

```bash
python scripts/scan_json_result.py raw-result.json sanitized-result.json \
  --policy config/policy.json
```

### Verify sanitized envelope

```bash
python scripts/secret_dlp_guard.py verify \
  --input sanitized-tool-output.json \
  --policy config/policy.json
```

### Run tests

```bash
python tests/test_secret_dlp_guard.py
```

## Workflow
The package uses five bounded workflows described in `workflows/workflows.md`:
1. Baseline and exposure mapping.
2. Pre-tool risk gating.
3. Tool-output sanitization.
4. Regression and false-positive tuning.
5. Real-secret exposure incident response.

No workflow uses unlimited retries. Scanner failures fail closed.

## Skills
`skills/core-skills.md` contains reusable procedures for:
- mapping secret exposure paths;
- building layered secret detection;
- enforcing pre-persistence sanitization;
- gating high-risk reads before execution.

Each Skill defines triggers, inputs, procedures, metrics, verification, failure behavior, and stop conditions.

## Rules
`rules/engineering-rules.md` contains observable `MUST`, `MUST NOT`, and `SHOULD` requirements.

Important rules include:
- sanitize before every model/persistence sink;
- do not rely on prompt instructions as the security boundary;
- do not persist plaintext matches in audits;
- do not use UI-only masking;
- do not bypass scanning for read-only tools;
- require canary coverage for every adapter.

## Subagents
The package defines four non-overlapping roles:
- Exposure Mapper;
- DLP Implementer;
- Security Verifier;
- Incident Reviewer.

The implementer must not be the sole verifier for the security fix.

## Hooks
`hooks/hooks.md` defines lifecycle enforcement:
- `pre-tool-risk-check`;
- `post-tool-output-dlp`;
- `transcript-write-assertion`;
- `model-context-assertion`;
- `startup-known-secret-registration`;
- `final-security-verification`.

## Metrics
Track at minimum:
- percentage of registered tool adapters routed through DLP;
- seeded secret recall by detector class;
- plaintext canary occurrences per sink;
- redactions and blocks per 1,000 tool calls;
- scanner failures;
- p50/p95 scan latency;
- bytes scanned;
- benign false-positive rate;
- raw-secret override events.

### Target security metrics
- registered adapter coverage: **100%**;
- seeded high-confidence secret recall: **100%**;
- plaintext canary occurrences in downstream sinks: **0**;
- scanner-failure raw bypasses: **0**;
- private-key fixture: **blocked**.

## Verification
Verification must distinguish three states.

### Implemented
The package contains the enforcement logic, policy, workflows, hooks, rules, tests, and integration contract.

### Measured
The included tests can measure deterministic behavior on synthetic fixtures. Production environments must additionally measure adapter coverage, sink leakage, false positives, and scanner latency.

### Verified
A production integration is verified only after every actual downstream sink passes seeded canary testing. See `verification/verification.md`.

Do not claim successful production protection from unit tests alone.

## Safety
- Use only synthetic canaries in tests.
- Never paste leaked production credentials into tickets or chat.
- Never log detector match plaintext.
- Treat any known real transcript exposure as credential-compromise evidence and rotate/revoke according to provider policy.
- Keep raw output in the smallest possible execution-local scope.
- Keep the guard enabled even after a high-risk operation receives user approval unless the secret is routed to a separately secured non-model sink.

## Failure handling
### Scanner failure
Quarantine raw output and emit a safe `dlp_scanner_failed` envelope. Never forward raw bytes.

### Oversized output
Block or safely truncate before model visibility. Do not bypass DLP to preserve convenience.

### False positives
Tune heuristic/contextual detectors against benign fixtures. Do not weaken exact-known-value or private-key protection just to reduce noise.

### Real leak
1. stop reproducing with the real credential;
2. rotate/revoke it;
3. determine which sinks received it;
4. apply retention/deletion controls where available;
5. add a synthetic regression fixture;
6. fix the boundary;
7. verify independently.

## Definition of Done
The integration is complete only when all applicable criteria are satisfied:
- problem evidence is documented;
- existing approaches and limitations are documented;
- every tool-output adapter is inventoried;
- every model/transcript/log/cache/trace/subagent sink is inventoried;
- pre-tool high-risk gate is integrated where relevant;
- tool output is sanitized before all downstream sinks;
- scanner errors fail closed;
- audit metadata contains no plaintext matches;
- seeded high-confidence recall is 100%;
- sink-level canary leakage is zero;
- private-key material is blocked under default policy;
- false-positive rate is measured;
- scanner latency is measured;
- no global raw-secret override exists;
- independent verification is complete;
- residual risks are documented;
- no blocking issue remains.

## Customization
Production teams can replace the minimal reference detector with a dedicated DLP/secret-scanning engine, add provider parsers, integrate secret managers, or implement the envelope contract natively in C#, Go, Rust, TypeScript, or another host language.

Do not change the core boundary invariant: **raw tool output is untrusted secret-bearing data until it passes deterministic DLP enforcement**.