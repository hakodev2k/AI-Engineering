// Unsafe: an execution strategy may replay the delegate after an ambiguous failure,
// while the external provider cannot roll back a delivery already accepted.
await strategy.ExecuteAsync(async () =>
{
    await using var tx = await db.Database.BeginTransactionAsync(ct);
    order.MarkPaid();
    await db.SaveChangesAsync(ct);
    await emailSender.SendAsync(receipt, ct);
    await tx.CommitAsync(ct);
});

// Safer shape: persist delivery intent atomically with domain state.
await strategy.ExecuteAsync(async () =>
{
    await using var tx = await db.Database.BeginTransactionAsync(ct);
    order.MarkPaid();
    db.OutboxMessages.Add(OutboxMessage.ForReceipt(order.Id, receipt));
    await db.SaveChangesAsync(ct);
    await tx.CommitAsync(ct);
});
// A separate bounded-retry dispatcher sends committed outbox records using a stable idempotency key.