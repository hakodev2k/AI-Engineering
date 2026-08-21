# Test Fixture Data Safety Workflow

## Trigger
Before any automated integration/API/E2E/Playwright test that mutates persistent state or calls external systems.

## Entry conditions
- Test intent and command are known.
- Target environment is supplied or discoverable.
- Fixture source can be identified.

## Inputs
Test command, target environment metadata, fixture sources, planned side effects, reset/cleanup method, repository test configuration.

## Stages
1. **Discover context** — Fixture Safety Analyst locates environment selectors, fixture builders/importers, reset hooks, test credentials boundaries, and external endpoints.
2. **Classify target** — classify environment and fixture provenance using `config/test-data-safety-policy.json`.
3. **Build manifest** — populate `schemas/safety-manifest.schema.json` contract using `templates/safety-manifest.example.json` as a starting shape.
4. **Preflight gate** — run `python scripts/validate-safety-manifest.py --manifest <file> --policy config/test-data-safety-policy.json`.
5. **Approval checkpoint** — stop if decision is `human-approval-required`; do not execute until approval evidence is recorded.
6. **Execute approved test** — run only the declared test command using the declared run ID and isolation boundary.
7. **Collect run evidence** — record created resource IDs, mutations, external side effects, and cleanup results.
8. **Independent review** — Isolation Reviewer evaluates the run and produces a review record.
9. **Final gate** — run `python scripts/evaluate-isolation-gate.py --manifest <file> --review <file> --policy config/test-data-safety-policy.json`.
10. **Complete** — report `executed` and `verified` separately.

## Produced artifacts
- Safety manifest
- Test run/resource inventory
- Cleanup evidence
- Isolation review record
- Final gate decision

## Checkpoints
- No mutation before preflight gate.
- No approval-required execution without explicit approval evidence.
- No completion before independent post-run review.

## Retry rules
- Metadata/tool read failure: retry once if clearly transient.
- Test infrastructure transient failure: at most one rerun, reusing a new run ID unless the original run is proven fully cleaned.
- Cleanup transient failure: retry the same scoped cleanup once; never broaden scope automatically.
- Validation/business-rule failure: no blind retry; fix evidence/config or escalate.

## Evidence preserved
Preserve manifest, run ID, test logs, created resource IDs, pre/post snapshots, cleanup output, and review findings for every failed attempt.

## Approval points
Explicit human approval is required for production/production-like mutation, raw or derived sensitive data exceptions, destructive reset operations, real notification/payment integrations, secret/permission changes, or broader-than-run cleanup.

## Failure paths
- `unknown` environment/provenance -> blocked.
- Missing isolation boundary -> blocked.
- Production target -> blocked unless a separately governed approved read-only use case; mutating production remains blocked by default.
- Production-derived fixtures without approved sanitization evidence -> blocked.
- Cross-boundary mutation or incomplete cleanup -> blocked and preserve evidence.

## Stop conditions
Stop when required context is unresolved, approval is absent, cleanup ownership is unclear, or repeated transient failure exceeds one retry.

## Definition of Done
- Preflight manifest validated.
- Required approval, if any, recorded before execution.
- Test ran only against the approved target and boundary.
- Created resources/side effects were inventoried.
- Cleanup/reset evidence exists.
- Independent reviewer decision exists.
- Final gate returns `verified`.
- Remaining risks are documented and no blocking finding remains.