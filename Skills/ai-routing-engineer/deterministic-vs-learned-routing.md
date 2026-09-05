# Deterministic vs Learned Routing

## Purpose
Choose and implement the appropriate routing mechanism: explicit rules, scoring, bandits, classifiers, or learned policies.

## When to use
Use when simple rules become complex, traffic is heterogeneous, or adaptive routing may improve quality, latency, or cost.

## Inputs
Routing objectives, candidate models, labeled outcomes, traffic volume, feedback delay, exploration tolerance, interpretability requirements, and risk constraints.

## Preconditions
Hard eligibility constraints must remain outside any learned optimizer unless they are independently enforced.

## Context to inspect
Existing rules, evaluation labels, online feedback, experimentation infrastructure, incident history, policy audit requirements, and model drift monitoring.

## Core knowledge
Deterministic routing is easier to audit and debug. Learned routing can exploit complex interactions but introduces training bias, exploration risk, delayed feedback, drift, and feedback loops. Contextual bandits optimize online reward but require carefully designed rewards and safe exploration.

## Procedure
1. Establish a deterministic baseline.
2. Quantify where the baseline loses measurable value.
3. Define features available at route time.
4. Define reward or target labels aligned with user outcomes.
5. Exclude prohibited and leakage-prone features.
6. Keep hard constraints as pre-routing filters.
7. Train or simulate a learned policy offline.
8. Compare against baseline on held-out traffic.
9. Shadow before allowing live decisions.
10. Bound exploration and define rollback thresholds.
11. Monitor drift, regret, and segment-level outcomes.

## Decision points
Prefer deterministic rules for low-volume or high-assurance workloads. Use learned routing when enough data exists and benefits exceed operational complexity. Avoid adaptive exploration where a wrong route can cause irreversible harm.

## Common failure patterns
Optimizing proxy rewards, using post-outcome features at training time, uncontrolled exploration, reward hacking, and losing route explainability.

## Verification
Offline replay and shadow tests must show benefit without violating hard constraints; live experiments must remain within predefined guardrails.

## Expected output
A justified router architecture, baseline comparison, training/evaluation method, and safe rollout design.

## Stop conditions
Stop when reward quality is weak, sample size is insufficient, or safe exploration cannot be guaranteed.