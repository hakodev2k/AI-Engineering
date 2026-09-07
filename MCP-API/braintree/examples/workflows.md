# Braintree MCP workflow examples

## Inspect a transaction
Tool: `braintree.transaction.get`
Input: `{ "transactionId": "theTransactionId" }`
Expected output shape: `{ "source": "untrusted_provider_data", "value": { ...transaction } }`
Permission: `transaction:read`
Risk: READ
Approval: no

## Create a vaulted customer profile
Tool: `braintree.customer.create`
Input: `{ "email": "buyer@example.com", "firstName": "Example", "approvalToken": "<human-approved-token>" }`
Expected output shape: Braintree SDK result containing `success`, validation data when relevant, and the customer on success.
Permission: `customer:write`
Risk: WRITE
Approval: yes

## Prepare then execute a sale
1. Use `braintree.client_token.create` only after approval if a client token is needed to collect payment details in a Braintree client SDK.
2. The client SDK returns a Braintree payment-method nonce; raw card data never enters this MCP connector.
3. Tool: `braintree.transaction.sale`
Input: `{ "amount": "49.00", "paymentMethodNonce": "fake-valid-nonce", "orderId": "order-123", "submitForSettlement": false, "approvalToken": "<human-approved-token>" }`
Expected output shape: Braintree SDK sale result with transaction status/validation details.
Permission: `transaction:sale`
Risk: HIGH_RISK
Approval: explicit human approval required

## Refund a settled transaction
Tool: `braintree.transaction.refund`
Input: `{ "transactionId": "theTransactionId", "amount": "10.00", "approvalToken": "<human-approved-token>" }`
Expected output shape: Braintree SDK refund result.
Permission: `transaction:refund`
Risk: HIGH_RISK
Approval: explicit human approval required

## Inspect recurring billing before cancellation
1. Call `braintree.subscription.get` with the subscription ID.
2. Review status, plan, price, next billing date, and customer impact.
3. Only then call `braintree.subscription.cancel` with a human-issued approval token.

No example contains real provider credentials or payment-card data.
