# Workflows

- Inspect: `docusign.envelope.list` → `docusign.envelope.get` → recipients/documents metadata. READ, no approval.
- Prepare: `docusign.envelope.create_from_template_draft`. WRITE. Approve exact fingerprint `docusign.envelope.create_from_template_draft:<emailSubject>` when write approval is enabled.
- Send: review draft, then approve `docusign.envelope.send:<envelopeId>`; HIGH_RISK.
- Void: enable destructive mode and approve `docusign.envelope.void:<envelopeId>`; DESTRUCTIVE.
