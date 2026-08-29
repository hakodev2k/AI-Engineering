# AI Production Monitoring Rules

## Purpose
Detect when production AI systems drift outside approved performance, safety, reliability, fairness, security, or usage boundaries.

## Scope
Applies to operational metrics, model behavior, input and output distributions, abuse signals, dependency health, control effectiveness, and post-deployment governance review.

## MUST
- Production AI systems MUST define monitoring appropriate to their risk tier before release.
- Monitoring MUST cover critical availability and latency plus material model or system quality signals relevant to approved use.
- High-risk systems MUST monitor for safety incidents, unauthorized use, material data drift, control bypass, and other identified hazards where technically feasible.
- Monitoring thresholds MUST have named owners, response actions, and escalation paths.
- Material anomalies MUST be investigated using evidence before being dismissed as benign.
- Monitoring design MUST be reassessed after incidents, material changes, or newly discovered failure modes.

## MUST NOT
- MUST NOT rely exclusively on aggregate success metrics when critical subgroup or tail failures can be hidden.
- MUST NOT collect unrestricted prompts or outputs for monitoring without applying privacy and security requirements.
- MUST NOT leave alerts without an accountable responder or actionable playbook.
- MUST NOT treat model-provider uptime as proof that the end-to-end AI system is healthy.

## SHOULD
- Monitoring SHOULD distinguish infrastructure failures from model-quality and policy failures.
- High-risk systems SHOULD retain enough version and request metadata to correlate incidents with the exact model and configuration.
- Alerting SHOULD prioritize user harm and control failure over noisy low-value signals.

## Exceptions
Exceptions MUST document the unavailable signal, reason, compensating detection method, residual risk, implementation deadline, and approval. Critical undetectable hazards require escalation before launch.

## Verification
Inspect dashboards, alert rules, metric definitions, logs, privacy controls, runbooks, sampled incidents, and on-call ownership. Confirm alerts are tested and map to approved risk controls.