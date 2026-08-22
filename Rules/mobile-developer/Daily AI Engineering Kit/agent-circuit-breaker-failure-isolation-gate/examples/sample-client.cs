using System.Net;

public sealed class InventoryClient(HttpClient httpClient)
{
    public async Task<string> GetInventoryAsync(string sku, CancellationToken cancellationToken)
    {
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeout.CancelAfter(TimeSpan.FromSeconds(2));

        for (var attempt = 1; attempt <= 2; attempt++)
        {
            using var response = await httpClient.GetAsync($"inventory/{Uri.EscapeDataString(sku)}", timeout.Token);
            if (response.IsSuccessStatusCode)
                return await response.Content.ReadAsStringAsync(timeout.Token);

            var transient = response.StatusCode is HttpStatusCode.RequestTimeout
                or HttpStatusCode.TooManyRequests
                or HttpStatusCode.BadGateway
                or HttpStatusCode.ServiceUnavailable
                or HttpStatusCode.GatewayTimeout;

            if (!transient || attempt == 2)
                response.EnsureSuccessStatusCode();

            await Task.Delay(TimeSpan.FromMilliseconds(100 * attempt), timeout.Token);
        }

        throw new InvalidOperationException("Bounded retry loop ended unexpectedly.");
    }
}
