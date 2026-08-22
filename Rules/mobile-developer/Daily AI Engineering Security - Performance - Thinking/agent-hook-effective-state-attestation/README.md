# Agent Hook Effective-State Attestation

## Topic
Verify that AI-agent hooks actually executing at runtime match the security hooks an operator intended to enable or disable.

## Category
**Security**

## Problem
Hook systems are increasingly used for `PreToolUse` approvals, audit logging, repository protections, policy enforcement, and post-write validation. Recent Claude Code bugs show declared state can diverge from runtime state in both dangerous directions: a disabled plugin hook can still execute, while an enterprise managed hook can silently disappear. If teams trust only settings files, plugin flags, MDM inventory, or UI hook listings, they can believe a control exists when it does not—or believe third-party code is disabled when it is still running.

## Evidence
`evidence/research.md` documents the current public signals and separates observed evidence, interpretation, and this package's proposed engineering response. Primary signals are Anthropic Claude Code issues #85893 (2026-08-11) and #86293 (2026-08-13).

## Existing approach
Common approaches are to inspect settings files, trust plugin enabled/disabled flags, trust `/hooks` or another runtime listing, rely on the hook's own audit log, or manually trigger a smoke test.

## Existing limitations
- On-disk configuration can remain intact while a managed hook is never registered.
- A runtime/UI listing can omit a hook that nevertheless executes.
- Plugin lifecycle state may apply inconsistently to skills, agents, and hooks.
- Audit logging cannot attest to its own absence: if the audit hook is not loaded, both enforcement evidence and logging disappear.
- Manual smoke tests are difficult to repeat safely and at scale.

## Proposed improvement
Treat the **effective hook graph** as executable security policy and attest it independently before protected agent work begins.

The package uses:
1. an approved expected-state manifest;
2. a normalized runtime hook snapshot;
3. deterministic identity comparison using event, matcher, and SHA-256 of normalized command;
4. fail-closed handling of missing critical hooks, active forbidden hooks, and unapproved unknown hooks;
5. optional harmless canary verification for selected critical hooks;
6. explicit invalidation whenever relevant configuration/runtime state changes.

## Architecture

```text
Approved Hook Policy
        |
        v
+----------------------+          +-----------------------+
| Expected identities  |          | Agent runtime         |
| required/forbidden   |          | effective hook state  |
+----------+-----------+          +-----------+-----------+
           |                                  |
           |                         host-specific adapter
           |                                  |
           +--------------+-------------------+
                          v
               hook_state_guard.py
                          |
          +---------------+---------------+
          |                               |
       verified                         blocked
          |                               |
 optional isolated canary        drift incident workflow
          |                               |
 protected tools enabled          fail closed / escalate
```

The LLM is not asked to decide whether commands are equivalent. Deterministic code performs reconciliation.

## Package structure

```text
agent-hook-effective-state-attestation/
├── README.md
├── guide-intergration.md
├── config/
│   └── hook-policy.example.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── hook_state_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_hook_state_guard.py
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.10+ and no third-party runtime dependencies.

1. Place the package in a trusted tooling location.
2. Copy `config/hook-policy.example.json` to a consumer-owned, ignored path and set `HOOK_POLICY_PATH` to it.
3. Define approved required/optional/forbidden hooks.
4. Build a small host-specific adapter that exports the effective runtime hook state as JSON.
5. Keep policy and adapter outside agent-writable paths where practical.

See `guide-intergration.md` for integration details.

## Configuration
Each policy item contains:
- `id`: stable local identifier;
- `event`: e.g. `PreToolUse`, `PostToolUse`;
- `matcher`: normalized matcher expression;
- `source`: provenance metadata;
- `command`: expected command used only for local fingerprinting/comparison;
- `state`: `required`, `optional`, or `forbidden`;
- `critical`: whether mismatch blocks protected work.

`allow_unknown_noncritical_hooks` defaults conceptually to false in secure deployments. Unknown executable hooks should require explicit policy, not silent acceptance.

## Usage

```bash
python scripts/hook_state_guard.py \
  --policy "$HOOK_POLICY_PATH" \
  --runtime .agent-attestation/runtime-hooks.json \
  --report .agent-attestation/report.json
```

Exit codes:
- `0`: verified reconciliation pass;
- `2`: policy mismatch;
- `3`: invalid input;
- `4`: operational/runtime failure.

Reports never echo the full command; they contain hashes and metadata.

## Workflow
Primary workflow: `workflows/workflows.md` → **Session Hook Attestation**.

The sequence is:

`Observe → Normalize → Reconcile → Block on mismatch → Optional canary → Verify → Enable protected work`

Configuration changes invalidate prior attestations. A drift incident allows at most one automated reload/restart remediation before escalation.

## Skills
`skills/core-skills.md` provides four executable skills:
- build an effective hook inventory;
- reconcile declared vs effective state;
- verify critical hooks with an isolated canary;
- respond to hook-state drift.

Each skill includes triggers, inputs, preconditions, decisions, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` defines observable `MUST`, `MUST NOT`, and `SHOULD` requirements. Key rules are fail-closed critical mismatch handling, deterministic identity comparison, evidence preservation, no unknown-hook execution for discovery, and no weakening of other controls to work around missing hooks.

## Subagents
`subagents/subagents.md` separates responsibilities:
- Runtime Evidence Collector;
- Policy Reconciler;
- Verification Agent;
- Security Reviewer.

The verifier is independent from remediation/implementation decisions for high-risk mismatches.

## Hooks
`hooks/hooks.md` defines predictable integration points:
- session-start attestation;
- settings/plugin change invalidation;
- pre-tool critical gate;
- post-remediation verification;
- final verification.

## Metrics
Recommended production metrics:
- required critical hook coverage (%);
- forbidden-active hook count;
- unknown-hook count;
- canary success rate;
- duplicate canary invocation count;
- attestation latency;
- drift incidents by agent/runtime version;
- mean time to detect and restore hook integrity.

A package implementation must not claim security improvement without collecting these measurements in the target environment.

## Verification

### Implemented
Policy, adapter, guard, lifecycle hooks, and workflows are installed.

### Measured
The agent runtime produced a current hook snapshot and the guard reconciled it.

### Verified
- all critical required hooks are present;
- no critical forbidden hook is active;
- unknown-hook policy is satisfied;
- configured critical canaries pass exactly once in an isolated environment;
- no relevant state changed since attestation.

Run the included tests with:

```bash
python -m pytest tests/test_hook_state_guard.py
```

## Safety
- Do not run unknown hook commands just to inspect them.
- Do not use production credentials during canary testing.
- Keep canaries in disposable workspaces.
- Never treat absence of hook logs as proof that no hook should have run.
- Never weaken sandbox, approval, or auditing controls to clear a mismatch.
- Preserve redacted evidence before any remediation.
- Explicit human approval is required for destructive changes such as uninstalling enterprise tooling or removing managed policy.

## Failure handling

**Detection:** guard non-zero exit, missing canary marker, duplicate marker, configuration/runtime fingerprint change, or runtime-listing disagreement.

**Evidence:** redacted attestation report, host/version, policy version, configuration-source identifiers, timestamps.

**Retry policy:** one clean process reload/restart and one fresh reconciliation.

**Maximum retries:** 1 automated remediation cycle.

**Fallback:** keep protected actions disabled and escalate.

**Escalation:** security/platform owner for enterprise enforcement hooks; plugin owner for unexpected third-party hooks.

**Stop condition:** fresh verified attestation or explicit human-controlled blocked state.

## Definition of Done
A deployment is complete only when all of the following are true:
- current evidence and existing-solution limitations are documented;
- policy manifest is reviewed and integrity-protected;
- runtime adapter captures effective state rather than configuration alone;
- included guard tests pass;
- current runtime snapshot is collected;
- critical required-hook coverage is 100%;
- forbidden-active count is 0;
- unknown-hook policy passes;
- configured critical canaries pass;
- reports contain no secrets/arbitrary hook output;
- failure/retry/escalation behavior is tested;
- final attestation is `implemented=true`, `measured=true`, `verified=true`;
- no blocking mismatch remains.

## Customization
Adapters can support Claude Code, Codex, internal agent hosts, or other runtimes as long as they normalize effective hooks to the small JSON shape consumed by the guard. Organizations can extend policy with source fingerprints, signed manifests, executable hashes, publisher identities, or per-event freshness requirements without changing the core reconciliation model.
