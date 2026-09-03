# Actor-Critic Design

## Purpose
Design actor-critic systems that coordinate policy and value learning without allowing critic error, policy lag, or unstable targets to dominate training.

## When to use
Use for continuous-control and large policy spaces where direct policy optimization benefits from a learned critic.

## Inputs
- Environment and reward definition
- Policy/value architectures
- Rollout or replay configuration
- Training and evaluation metrics

## Preconditions
Observation and action spaces, termination semantics, and reward scaling must be validated.

## Context to inspect
Inspect critic loss, explained variance, advantage distribution, actor entropy, target lag, replay age, policy/value update ratios, and gradient norms.

## Core knowledge
Actor-critic methods couple two estimators with different failure modes. A biased or underfit critic can misdirect the actor; an aggressively changing actor can invalidate critic targets. Update cadence, bootstrapping, target smoothing, and exploration must be treated as a system.

## Procedure
1. Define actor and critic objectives explicitly.
2. Validate value targets on synthetic trajectories.
3. Choose shared or separate representation based on interference risk.
4. Set conservative initial actor/critic learning rates.
5. Instrument advantage statistics and critic calibration.
6. Tune update ratio using evidence, not convention.
7. Check policy entropy and action saturation.
8. Inspect whether critic accuracy improves where policy visits.
9. Test multiple seeds and scenario slices.
10. Compare against policy-only or value-only baselines where practical.
11. Freeze deployment candidates only after stability and constraint checks.

## Decision points
Separate networks when shared features cause gradient interference. Use target critics or delayed policy updates when bootstrapped targets are unstable. Prefer simpler actor-critic variants unless sample efficiency materially justifies complexity.

## Common failure patterns
- Critic fits average return but fails near important actions.
- Actor improves training reward while critic calibration worsens.
- Shared encoders destabilize both objectives.
- Update ratios create stale actor or stale critic behavior.

## Verification
Require stable critic diagnostics, reproducible returns, bounded gradients, and consistent policy behavior under held-out scenarios and seeds.

## Expected output
A documented actor-critic training configuration with diagnostics, baseline comparisons, and evidence of stable coupled learning.

## Stop conditions
Stop when critic error cannot be controlled, policy updates become unstable, or training gains depend on a narrow seed/configuration.