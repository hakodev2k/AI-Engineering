# Skill: Experiment and Benchmark Design
Purpose: generate evidence when published sources are insufficient.
Trigger: important uncertainty can be measured safely.
Inputs: hypothesis, variables, baseline, environment, budget, risks.
Preconditions: permissions, data rights, and safety constraints are satisfied.
Procedure: define hypothesis and metric; control variables; select representative cases; establish baseline; predeclare run count/tolerance; record environment; execute bounded runs; capture raw results; analyze variance; document confounders.
Decision rules: never cherry-pick cases; prefer representative workloads; rerun once for transient failure; stop on unsafe side effects.
Outputs: protocol, raw results, summary, limitations.
Quality: another person can reproduce the test.
Failure: classify tooling, environment, design, or hypothesis failure.
Stop: evidence threshold reached or experiment invalidated.
