import pytest
from qdrant_connector.config import load_config, assert_collection_allowed
from qdrant_connector.policy import expected_approval, require_approval


def test_config_defaults():
    c = load_config({})
    assert c.qdrant_url == "http://localhost:6333"
    assert c.max_retries == 3
    assert c.prefer_official_mcp is True


def test_rejects_bad_url():
    with pytest.raises(ValueError):
        load_config({"QDRANT_URL": "file:///tmp/x"})


def test_collection_allowlist():
    c = load_config({"QDRANT_ALLOWED_COLLECTIONS": "safe,docs"})
    assert_collection_allowed(c, "safe")
    with pytest.raises(PermissionError):
        assert_collection_allowed(c, "other")


def test_approval_required_and_validated():
    token = expected_approval("secret", "qdrant.point.upsert")
    require_approval("qdrant.point.upsert", token, "secret")
    with pytest.raises(PermissionError):
        require_approval("qdrant.point.upsert", "bad", "secret")
    with pytest.raises(PermissionError):
        require_approval("qdrant.point.upsert", None, None)
