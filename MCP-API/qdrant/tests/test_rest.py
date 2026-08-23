import httpx
import pytest
from qdrant_connector.config import load_config
from qdrant_connector.rest import QdrantRestClient, QdrantRestError


@pytest.mark.asyncio
async def test_api_key_header_and_success():
    def handler(request: httpx.Request):
        assert request.headers["api-key"] == "k"
        return httpx.Response(200, json={"result": {"collections": []}})
    c = load_config({"QDRANT_API_KEY": "k", "QDRANT_MAX_RETRIES": "0"})
    client = QdrantRestClient(c, httpx.MockTransport(handler))
    try:
        result = await client.get("/collections")
        assert result["result"]["collections"] == []
    finally:
        await client.close()


@pytest.mark.asyncio
async def test_permission_error_not_hidden():
    def handler(_: httpx.Request):
        return httpx.Response(403, text="forbidden")
    c = load_config({"QDRANT_MAX_RETRIES": "0"})
    client = QdrantRestClient(c, httpx.MockTransport(handler))
    try:
        with pytest.raises(QdrantRestError) as err:
            await client.get("/collections")
        assert err.value.status == 403
    finally:
        await client.close()


@pytest.mark.asyncio
async def test_destructive_delete_is_not_retried():
    calls = 0
    def handler(_: httpx.Request):
        nonlocal calls
        calls += 1
        return httpx.Response(500, text="server error")
    c = load_config({"QDRANT_MAX_RETRIES": "5"})
    client = QdrantRestClient(c, httpx.MockTransport(handler))
    try:
        with pytest.raises(QdrantRestError):
            await client.delete("/collections/x")
        assert calls == 1
    finally:
        await client.close()
