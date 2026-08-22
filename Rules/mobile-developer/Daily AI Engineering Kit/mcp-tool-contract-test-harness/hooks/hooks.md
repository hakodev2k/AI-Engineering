# Hooks

## PreContractTest
- **Trigger:** before fixture execution.
- **Action:** validate policy and contract.
- **Command:** `python scripts/validate-contract.py --policy config/tool-test-policy.json --contract <contract.json>`
- **Failure behavior:** stop; do not invoke any tool fixture.

## PreLiveFixture
- **Trigger:** before a fixture marked live/destructive/privileged.
- **Action:** require the host integration to confirm explicit human approval and safe target environment.
- **Command:** host-specific approval check; no portable command is assumed.
- **Failure behavior:** stop the fixture and mark it blocked.

## PostFixtureRun
- **Trigger:** after the adapter exports normalized fixture results.
- **Action:** evaluate expected vs observed results.
- **Command:** `python scripts/evaluate-fixtures.py --contract <contract.json> --results <results.json>`
- **Failure behavior:** preserve report; route failures to Contract Analyst instead of retrying blindly.

## PreComplete
- **Trigger:** before declaring the tool verified.
- **Action:** re-run contract validation and deterministic evaluation; confirm independent Safety Reviewer decision is `pass`.
- **Failure behavior:** status remains completed/unverified.

Deterministic hooks are preferred. LLM hooks must not replace schema validation, fixture evaluation, or approval enforcement.