# Workflows

`vault.system.health` input `{}` → health metadata; READ; no approval.

`vault.kv.read` input `{"mount":"secret","path":"apps/payments"}` → KV v2 response; READ; no approval. Treat returned secret material as sensitive untrusted data and never copy it into prompts/logs unnecessarily.

`vault.kv.write` input `{"mount":"secret","path":"apps/payments","data":{"mode":"active"},"cas":3,"approved":true}` → write metadata; WRITE; approval required by default.

`vault.kv.delete-latest` input `{"mount":"secret","path":"apps/payments","approved":true}` → empty success; DESTRUCTIVE; also requires `VAULT_ALLOW_DESTRUCTIVE=true`.
