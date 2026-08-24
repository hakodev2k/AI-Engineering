# MLOps Security Rules

## Purpose
Protect ML systems, artifacts, data, credentials, and execution paths against unauthorized use and tampering.

## Scope
Applies across training, registries, pipelines, serving, data access, and automation identities.

## MUST
- Human and workload identities MUST use least privilege and scoped credentials.
- Secrets MUST be stored in approved secret-management systems and redacted from logs and artifacts.
- Model, container, and dependency artifacts MUST be obtained from trusted sources and integrity-verified where supported.
- Untrusted serialized models or arbitrary code-bearing artifacts MUST be treated as executable content.
- Security-relevant actions MUST produce audit evidence.

## MUST NOT
- Credentials, tokens, private keys, or connection secrets MUST NOT be committed to source or embedded in model artifacts.
- Security controls MUST NOT be disabled merely to unblock a pipeline.
- Training or inference jobs MUST NOT receive production-wide permissions without demonstrated necessity.

## SHOULD
- Network paths SHOULD be restricted to required endpoints.
- Images and dependencies SHOULD be scanned and patched according to risk.

## Exceptions
A security exception requires threat/risk analysis, compensating controls, expiry, accountable approval, and verification.

## Verification
Inspect IAM policies, secret scans, audit logs, artifact provenance, dependency/container scans, network policy, and runtime identities. Test that unauthorized paths fail closed.