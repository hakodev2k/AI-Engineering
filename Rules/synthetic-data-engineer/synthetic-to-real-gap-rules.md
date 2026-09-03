# Synthetic-to-Real Gap Rules

## Purpose
Measure and manage the gap between behavior learned or validated on synthetic data and behavior encountered on real data.

## Scope
Applies when synthetic datasets substitute for, augment, or precondition training, evaluation, testing, analytics, or simulation.

## MUST
- Define which downstream outcomes are expected to transfer from synthetic to real conditions.
- Validate material claims against representative real or independently observed data before production reliance when such evidence is available.
- Measure performance deltas across synthetic-only, real-only, and mixed-data regimes when training utility is a core objective.
- Investigate systematic failures caused by unrealistic textures, frequencies, correlations, noise, missingness, or scenario assumptions.
- Document transfer limitations and contexts where synthetic results must not be generalized.

## MUST NOT
- Treat strong synthetic benchmark performance as proof of real-world performance.
- Hide domain-gap regressions behind aggregate averages.
- Tune synthetic data to one downstream architecture and claim general utility without evidence.
- Replace required real-world validation in safety-critical use cases solely for convenience.

## SHOULD
- Use targeted domain randomization or calibration to reduce known gaps.
- Track transfer metrics across generator and downstream-model versions.
- Prefer representative real validation sets that are operationally distinct from generation sources.

## Exceptions
If real validation is impossible, document why, identify proxy evidence, quantify uncertainty, and obtain approval proportional to impact.

## Verification
Review transfer experiments, real-world validation results, gap analyses, failure clustering, calibration records, and documented limits on downstream claims.