# MCP Discovery Instruction Injection Firewall

## Topic
Protecting MCP hosts from server-controlled discovery/initialization instructions that can act as prompt-injection input and potentially influence sensitive tool execution or shared cache behavior.

## Category
Security

## Problem
MCP servers can provide free-form natural-language instructions. When an MCP client inserts that text into trusted model instructions, the server gains a channel that can attempt to override intended behavior, request secrets, alter tool choices, or influence later actions. Shared caching can amplify the impact if untrusted instructions are reused outside their original trust boundary.

The package treats remote MCP instructions as **untrusted data, never authority**. The enforcement boundary is host-side deterministic policy, taint tracking, cache isolation, and sensitive-tool authorization—not prompt wording.

## Evidence
The package was selected after reviewing current public signals, including MCP issue #3213 (opened 2026-08-07 and still open when generated), MCP security/risk guidance, and OpenAI guidance describing prompt injection as a continuing security problem that cannot be solved merely by restricting network access.

See [`evidence/research.md`](evidence/research.md) for current public signals, existing approaches, limitations, root-cause hypotheses, and the evidence/interpretation/proposed-solution boundary.

## Existing approach
Common defenses include prompt delimiters, warning language, tool confirmation dialogs, broad network lockdown, server-supplied tool annotations, and model-level refusal behavior.

## Existing limitations
- prompt delimiters are not enforcement boundaries;
- model-only defenses are probabilistic;
- server annotations cannot prove a malicious server is safe;
- confirmation is weak when taint/source/effect are hidden;
- network lockdown reduces exfiltration paths but does not guarantee behavioral integrity;
- shared caches can widen impact if trust identity is omitted.

## Proposed improvement
Introduce a host-side security layer that:
1. treats remote MCP instructions as untrusted by default;
2. validates them deterministically before model exposure;
3. prevents raw remote text from entering system/developer channels;
4. propagates taint in host-managed state;
5. requires host authorization for sensitive actions after tainted input;
6. isolates/disables shared caching of untrusted instructions;
7. emits structured, redacted audit records;
8. fails closed on malformed input or security-policy failure.

## Architecture

```text
MCP Server
   |
   v
Discovery / Initialize Response
   |
   v
[Pre-context Guard]
   |-- malformed / prohibited --> BLOCK + AUDIT
   |
   |-- accepted
   v
Untrusted Data Envelope + Host Taint Metadata
   |
   v
LLM Planning / Response
   |
   v
Tool Proposal
   |
   v
[Host Authorization Gate]
   |-- safe + allowed ---------> Execute
   |-- sensitive + tainted ----> Human/Policy Approval
   |-- forbidden/ambiguous ----> DENY

Cache path:
Discovery Instructions -> isolated key / short TTL / revalidation
                       -> never public/global by default
```

The enforcement boundary is host-side code and policy, not the textual envelope shown to the model. Detailed assets, actors, trust boundaries, taint propagation, cache rules, attack paths, and security invariants are documented in [`architecture/threat-model.md`](architecture/threat-model.md).

## Package structure

```text
mcp-discovery-instruction-injection-firewall/
├── README.md
├── guide-intergration.md
├── architecture/
│   └── threat-model.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── instruction_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── run_tests.py
├── verification/
│   └── verification.md
└── workflows/
    └── workflows.md
```

## Installation
Requirements:
- Python 3.9+ for the provided deterministic guard/test runner;
- an MCP host/client integration point before prompt/context assembly;
- host-managed session metadata for taint;
- host-side authorization hook for sensitive tools.

Clone/copy this package into the integrating project and keep `config/policy.json` under source control.

No external Python dependency is required by the included scripts.

## Configuration
Review [`config/policy.json`](config/policy.json):
- `maxInstructionBytes`
- `maxInstructionChars`
- suspicious/hard-block patterns
- `publicCacheForUntrustedInstructions`
- cache TTL
- sensitive tool classes
- audit storage defaults

Treat the provided pattern list as a deterministic baseline, not a complete prompt-injection taxonomy. Security does not depend solely on phrase matching: the primary controls are trust separation, authority separation, taint propagation, cache isolation, and host-side authorization.

## Usage
Validate an MCP instruction payload:

```bash
python scripts/instruction_guard.py \
  --input instruction.txt \
  --source-id "mcp-server-identity" \
  --trust untrusted-remote \
  --config config/policy.json
```

Possible decisions:
- `allow-data-envelope`
- `allow-with-approval-taint`
- `block`

Exit codes:
- `0`: validator completed with an allowed/tainted decision;
- `10`: content blocked;
- `20`: invalid input/configuration;
- `30`: unexpected guard failure.

For application integration, follow [`guide-intergration.md`](guide-intergration.md).

## Workflow
Primary workflows are defined in [`workflows/workflows.md`](workflows/workflows.md):
1. safe ingestion of MCP instructions;
2. taint-aware sensitive-tool authorization;
3. isolated discovery caching.

Lifecycle enforcement points are defined in [`hooks/hooks.md`](hooks/hooks.md).

## Skills
[`skills/core-skills.md`](skills/core-skills.md) defines reusable procedures for:
- trust classification;
- deterministic guarded context construction;
- taint-aware authorization;
- discovery cache isolation;
- security verification and recovery.

## Rules
[`rules/engineering-rules.md`](rules/engineering-rules.md) defines observable `MUST`, `MUST NOT`, and `SHOULD` controls.

## Subagents
[`subagents/subagents.md`](subagents/subagents.md) separates research, policy, implementation, testing, and independent verification responsibilities so the implementer is not the only verifier of high-risk security changes.

## Hooks
[`hooks/hooks.md`](hooks/hooks.md) defines predictable enforcement points for ingestion, context assembly, cache admission, tool authorization, post-action checks, and final verification.

## Metrics
Recommended operational metrics:
- percentage of remote instruction payloads classified (target 100%);
- raw remote instructions entering trusted system/developer channels (target 0);
- allow/taint/block distribution;
- validation failure reasons;
- sensitive calls attempted under taint;
- approvals/denials;
- unauthorized sensitive executions (target 0);
- public/global cache hits for untrusted instructions (target 0);
- cross-tenant untrusted instruction reuse (target 0);
- false positives/false negatives from reviewed regression cases;
- audit event coverage.

## Verification
Run:

```bash
python tests/run_tests.py
```

The included suite checks benign/adversarial content, payload limits, control characters, and policy invariants. Package-level verification and downstream runtime requirements are documented in [`verification/verification.md`](verification/verification.md).

The package explicitly distinguishes:
- **Implemented:** reusable guard/policy/workflows/tests exist;
- **Measured:** metric definitions exist; production measurements require integration;
- **Verified:** package invariants can be checked independently; production protection requires downstream integration evidence.

## Safety
- no raw untrusted instructions should enter system/developer authority;
- model output cannot self-approve sensitive actions;
- policy errors fail closed;
- raw payload logging is disabled by default;
- untrusted instruction caching is not public/global by default;
- dangerous or irreversible operations require explicit host/user authorization;
- security controls must not be weakened to recover availability.

## Failure handling
For malformed content, missing policy, ambiguous trust identity, authorization failure, or validator errors:
1. reject the remote instruction payload;
2. preserve safe structural MCP metadata when possible;
3. emit a structured error/audit event;
4. do not fall back to unguarded prompt insertion;
5. bypass ambiguous caches;
6. escalate sensitive operations rather than retrying indefinitely.

Retries must be bounded. No retry path may weaken trust, verification, or authorization.

## Definition of Done
The reusable package is complete when:
- evidence and existing-solution limitations are documented;
- every required package artifact exists;
- guard and policy are deterministic and fail closed;
- skills/rules/subagents/workflows/hooks are actionable and consistent;
- tests cover required benign/adversarial cases;
- README references only existing files;
- no secrets are included;
- downstream integration requirements are explicit.

An application integration is complete only when:
- every MCP instruction path invokes the guard before prompt assembly;
- remote raw instructions cannot acquire system/developer authority;
- taint is stored outside model-controlled text;
- sensitive tool calls after tainted content cannot execute without valid host authorization;
- cache isolation tests pass;
- audit redaction is verified;
- the full regression suite passes in the target runtime.

## Customization
Adapt the package by changing:
- server trust registry and identity model;
- sensitive tool taxonomy;
- size limits;
- audit sink;
- approval UI;
- cache key composition/TTL;
- deterministic reason patterns;
- language/runtime of the guard.

Do not customize away the core invariants: untrusted-by-default remote instructions, authority separation, deterministic pre-context validation, host-managed taint, sensitive-action authorization, cache isolation, auditable decisions, and fail-closed recovery.