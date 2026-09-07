# Post-Training Release Readiness

## Purpose
Decide whether a post-trained model is ready for production handoff by integrating quality, safety, reproducibility, serving compatibility, rollback, and operational evidence.

## When to use
Use for the final checkpoint decision, before canary deployment, and after material changes to training data, objectives, algorithms, tokenizer/template, or serving behavior.

## Inputs
Selected checkpoint, training lineage, evaluation report, safety/red-team results, serving benchmarks, model card/change record, deployment constraints, and rollback plan.

## Preconditions
The candidate has completed independent evaluation and all artifacts required to reproduce model identity are immutable and addressable.

## Context to inspect
Review exact checkpoint hashes, tokenizer/chat template, generation defaults, quantization/serving conversions, context length, tool schemas, safety layers, latency/throughput, memory use, known regressions, licensing/data obligations, and previous production model behavior.

## Core knowledge
A training-successful checkpoint is not automatically release-ready. Serialization, quantization, inference kernels, prompt templates, decoding defaults, and runtime guardrails can change behavior. Release gates should be defined before final evaluation, distinguish blockers from accepted risks, and include a rollback target. Senior ownership includes communicating trade-offs and unsupported use cases, not just delivering weights.

## Procedure
1. Identify the exact candidate checkpoint and freeze its associated tokenizer, template, and configuration.
2. Confirm full lineage to base model, data versions, code revision, hyperparameters, and training environment.
3. Review target, preservation, safety, robustness, and cost metrics against predeclared gates.
4. Triage every material regression into blocker, accepted risk, or mitigated issue with an owner.
5. Convert or quantize the model exactly as production requires.
6. Re-run critical evaluations on the production-format artifact, not only the training checkpoint.
7. Benchmark latency, throughput, memory, context length, output-token behavior, and tool-call compatibility in the target serving stack.
8. Test runtime guardrails, system prompts, structured outputs, and tool schemas end to end.
9. Execute smoke tests for startup, autoscaling/restart, model loading, and malformed inputs.
10. Define canary metrics and thresholds that can detect behavior or operational regressions.
11. Confirm rollback to the prior stable model is tested and operationally feasible.
12. Document known limitations, unsupported scenarios, and monitoring requirements.
13. Obtain required safety/product/operations approvals for accepted high-impact trade-offs.
14. Archive the release evidence and immutable artifact identifiers.

## Decision points
Block release for severe safety or correctness regressions even if averages improve. Use canary release for uncertain but bounded distribution-shift risk; use offline-only iteration when monitoring cannot detect the relevant failure quickly. Accept small regressions only when their impact and owner are explicit and the overall trade-off is approved.

## Common failure patterns
Deploying a quantized artifact without re-evaluation; tokenizer or chat-template mismatch; release by aggregate score alone; no rollback test; hidden generation-default changes; missing model/data lineage; accepting regressions without ownership; assuming staging performance equals production load behavior.

## Verification
Verify immutable model identity, all release gates, production-format evaluations, serving benchmarks, safety integration, canary observability, rollback execution, and artifact lineage. A release is verified only when the deployed representation—not merely the training checkpoint—passes the agreed evidence gates.

## Expected output
A release-readiness decision package containing model identifiers, lineage, gate results, production-serving validation, accepted risks, rollback plan, canary criteria, known limitations, and approval record.

## Stop conditions
Stop release if a blocking evaluation fails, the production artifact differs materially from the evaluated artifact, rollback is unavailable, critical lineage is missing, safety controls cannot be verified, or serving behavior violates operational limits.