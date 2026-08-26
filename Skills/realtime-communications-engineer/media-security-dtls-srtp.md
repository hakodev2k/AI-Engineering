# Media Security with DTLS-SRTP

## Purpose
Protect realtime media confidentiality and integrity while preserving interoperability and operational diagnosability.

## When to use
Use for security review, certificate/keying failures, transport changes, or media-server trust-boundary design.

## Inputs
Threat model, SDP, DTLS state, certificate policy, SRTP configuration, media topology, logs, and compliance constraints.

## Core knowledge
WebRTC commonly uses DTLS to establish SRTP keying. SRTP protects RTP/RTCP media, but application topology determines where media may be decrypted or transformed. Identity, signaling integrity, certificate fingerprints, key lifetime, replay protection, and end-to-end encryption requirements must be considered separately.

## Procedure
1. Map media trust boundaries and decrypting components.
2. Verify signaling securely carries negotiated fingerprints and parameters.
3. Inspect DTLS role/state and certificate handling.
4. Verify SRTP profile negotiation and protected RTP/RTCP.
5. Review replay, downgrade, and unauthorized forwarding risks.
6. Define key/certificate rotation and failure behavior.
7. Minimize sensitive diagnostic retention.
8. Test handshake failure, expired credentials, downgrade attempts, and reconnects.
9. Document residual risks.

## Decision points
Transport encryption is not equivalent to application-level end-to-end encryption. Add E2EE when the product threat model requires media servers not to access plaintext, accepting feature and operational trade-offs.

## Common failure patterns
Trusting signaling without integrity; fingerprint mismatch ignored; logging key material; conflating TLS signaling with media encryption; introducing server-side recording into an E2EE design without explicit policy.

## Verification
Verify successful authenticated DTLS establishment, SRTP protection, negative tests for invalid fingerprints, rotation behavior, and absence of secrets in logs.

## Expected output
A validated media-security design or bounded diagnosis with threat assumptions and evidence.

## Stop conditions
Stop for unresolved cryptographic policy, legal interception, recording consent, or key-management changes requiring security approval.