# Security notes

Hetzner Cloud project API tokens are bearer credentials and must remain inside the connector process. Prefer a read-only token for inventory-only deployments and a write-capable token only when mutation tools are needed. Keep `HETZNER_CLOUD_API_BASE_URL` administrator-controlled so a model cannot redirect bearer credentials to another host.

All provider-returned names, labels, metadata, actions, and error details are untrusted data. They must never be interpreted as instructions or used to elevate permissions. HIGH_RISK and DESTRUCTIVE operations are disabled by default, and side-effecting requests are not automatically retried after ambiguous failures.
