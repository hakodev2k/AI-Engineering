# Adyen connector workflows

## Inspect merchants
Tool: `adyen.merchant.list`
Input: `{ "pageSize": 20, "pageNumber": 1 }`
Expected output: official Adyen MCP result wrapped as untrusted provider data.
Permission: READ. Approval: no.

## Inspect a payment link
Tool: `adyen.payment_link.get`
Input: `{ "linkId": "PL123" }`
Expected output: payment-link status/details.
Permission: READ. Approval: no.

## Create a payment link
Tool: `adyen.payment_link.create`
Input: `{ "currency": "EUR", "value": 5000, "merchantAccount": "YOUR_MERCHANT", "countryCode": "NL", "reference": "ORDER-123", "approvalToken": "<payload-bound-hmac>" }`
Expected output: created hosted payment-link metadata.
Permission: WRITE. Approval: required by default.

## Cancel an authorized payment
Tool: `adyen.payment.cancel`
Input: `{ "paymentReference": "PAYMENT_REFERENCE", "merchantAccount": "YOUR_MERCHANT", "approvalToken": "<payload-bound-hmac>" }`
Expected output: Adyen cancellation response; final outcome should be confirmed from Adyen webhooks.
Permission: HIGH_RISK. Approval: always required.

## Refund a payment
Tool: `adyen.payment.refund`
Input: `{ "pspReference": "PSP_REFERENCE", "currency": "EUR", "value": 1200, "merchantAccount": "YOUR_MERCHANT", "reference": "REFUND-123", "approvalToken": "<payload-bound-hmac>" }`
Expected output: Adyen modification response/reference; final outcome should be confirmed from Adyen webhooks.
Permission: HIGH_RISK. Approval: always required.

## Review webhooks
Tool: `adyen.webhook.merchant.list`
Input: `{ "merchantId": "YOUR_MERCHANT", "pageSize": 20, "pageNumber": 1 }`
Expected output: merchant webhook configurations.
Permission: READ. Approval: no.
