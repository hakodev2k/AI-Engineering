# Product Metrics and Experiments

Use a metric hierarchy: business outcome -> product outcome -> behavioral driver -> diagnostic metrics -> guardrails. Avoid optimizing a proxy without confirming the higher-level outcome.

Define baseline, segment, observation window, expected direction, minimum meaningful change, and guardrails before launch. Watch for novelty effects, seasonality, selection bias, instrumentation changes, survivorship bias, and regression to the mean.

Experiments need a falsifiable hypothesis: for target user X, change Y should cause behavior/outcome Z because mechanism M. Identify the riskiest assumption and the cheapest credible test.

Do not claim causality from simple correlation. If randomization is not possible, explicitly classify the result as observational and document alternative explanations.

After launch decide: scale, continue measuring, iterate, pivot, rollback, or stop. Inconclusive is a valid result when evidence does not support a stronger claim.