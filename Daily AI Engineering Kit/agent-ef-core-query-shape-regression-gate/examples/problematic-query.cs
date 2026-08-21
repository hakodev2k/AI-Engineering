using Microsoft.EntityFrameworkCore;

public sealed class OrderService
{
    private readonly AppDbContext _db;
    public OrderService(AppDbContext db) => _db = db;

    public async Task<List<Order>> GetOpenOrdersAsync(CancellationToken ct)
    {
        var all = await _db.Orders.ToListAsync(ct);
        return all.Where(x => x.Status == "Open").ToList();
    }

    public async Task CloseAllAsync(CancellationToken ct)
    {
        foreach (var order in await _db.Orders.Where(x => x.Status == "Open").ToListAsync(ct))
        {
            order.Status = "Closed";
            await _db.SaveChangesAsync(ct);
        }
    }
}
