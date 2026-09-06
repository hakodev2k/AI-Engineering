import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "verify_cache_scope.py"
spec = importlib.util.spec_from_file_location("verify_cache_scope", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)


class CacheScopeTests(unittest.TestCase):
    def test_private_authorization_bound_entry_passes(self):
        doc = {"responses": [{
            "method": "tools/list",
            "authenticated": True,
            "personalized": True,
            "cacheScope": "private",
            "cache_key_fields": ["server_id", "method", "auth_context_hash"],
            "contains_model_instructions": False,
            "server_trust": "approved"
        }]}
        self.assertEqual(mod.validate_document(doc), [])

    def test_personalized_public_entry_blocks(self):
        doc = {"responses": [{
            "method": "tools/list",
            "authenticated": True,
            "personalized": True,
            "cacheScope": "public",
            "cache_key_fields": ["server_id", "method"],
            "public_invariance_verified": True
        }]}
        errors = mod.validate_document(doc)
        self.assertTrue(any("personalized response" in e for e in errors))

    def test_authenticated_public_requires_invariance(self):
        doc = {"responses": [{
            "method": "resources/list",
            "authenticated": True,
            "personalized": False,
            "cacheScope": "public",
            "cache_key_fields": ["server_id", "method"],
            "public_invariance_verified": False
        }]}
        errors = mod.validate_document(doc)
        self.assertTrue(any("lacks cross-context invariance" in e for e in errors))

    def test_untrusted_model_instructions_block_public(self):
        doc = {"responses": [{
            "method": "server/discover",
            "authenticated": False,
            "personalized": False,
            "cacheScope": "public",
            "cache_key_fields": ["server_id", "method"],
            "contains_model_instructions": True,
            "server_trust": "untrusted",
            "public_invariance_verified": True
        }]}
        errors = mod.validate_document(doc)
        self.assertTrue(any("model-visible instructions" in e for e in errors))

    def test_raw_token_field_blocks(self):
        doc = {"responses": [{
            "method": "prompts/list",
            "authenticated": True,
            "personalized": True,
            "cacheScope": "private",
            "cache_key_fields": ["server_id", "method", "auth_context_hash", "access_token"]
        }]}
        errors = mod.validate_document(doc)
        self.assertTrue(any("raw secret-bearing" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
