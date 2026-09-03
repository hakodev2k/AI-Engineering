# Safety and Evidence Rules

## MUST
- Execute primary and fallback against identical frozen scenario inputs and deterministic tool fixtures.
- Preserve model identifiers, evaluator version, scenario evidence, scores, latency, and cost.
- Treat safety/refusal, structured-output, and tool-contract failures as blocking.
- Validate required scenarios before comparison.
- Require explicit human approval before production model-routing changes, security weakening, secret/config changes, breaking public contracts, or deployment.
- Stop after at most two corrective implementation iterations.

## MUST NOT
- Route production traffic as part of this kit.
- Use destructive tools, production writes, real customer secrets, or irreversible side effects in evaluations.
- Delete or rewrite failing evidence.
- Average away a blocking safety or contract failure.
- Change the evaluator or acceptance threshold between primary and fallback runs without restarting both runs.
- Grant broader tool permissions to the fallback to obtain parity.

## SHOULD
- Prefer synthetic or sanitized fixtures.
- Pin prompts, schemas, tool definitions, and evaluator code by commit/hash.
- Add repository-specific critical scenarios beyond the four defaults.
- Review semantic differences even when aggregate scores pass.
