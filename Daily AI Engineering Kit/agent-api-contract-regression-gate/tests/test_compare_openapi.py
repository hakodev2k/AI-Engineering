#!/usr/bin/env python3
import importlib.util
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "compare-openapi.py"
spec = importlib.util.spec_from_file_location("compare_openapi", MODULE_PATH)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


class CompareOpenApiTests(unittest.TestCase):
    def base(self):
        return {
            "openapi": "3.0.3",
            "paths": {
                "/users/{id}": {
                    "get": {
                        "parameters": [
                            {"name": "id", "in": "path", "required": True, "schema": {"type": "string"}}
                        ],
                        "responses": {"200": {"description": "ok"}, "404": {"description": "missing"}},
                    }
                }
            },
            "components": {
                "schemas": {
                    "User": {
                        "type": "object",
                        "required": ["id"],
                        "properties": {
                            "id": {"type": "string"},
                            "role": {"type": "string", "enum": ["user", "admin"]},
                        },
                    }
                }
            },
        }

    def test_identical_contract_passes(self):
        baseline = self.base()
        breaking, non_breaking = module.compare_documents(baseline, self.base())
        self.assertEqual([], breaking)
        self.assertEqual([], non_breaking)

    def test_removed_path_is_breaking(self):
        baseline = self.base()
        candidate = self.base()
        candidate["paths"] = {}
        breaking, _ = module.compare_documents(baseline, candidate)
        self.assertIn("path-removed", {item["code"] for item in breaking})

    def test_required_parameter_added_is_breaking(self):
        baseline = self.base()
        candidate = self.base()
        candidate["paths"]["/users/{id}"]["get"]["parameters"].append(
            {"name": "tenant", "in": "query", "required": True, "schema": {"type": "string"}}
        )
        breaking, _ = module.compare_documents(baseline, candidate)
        self.assertIn("required-parameter-added", {item["code"] for item in breaking})

    def test_enum_narrowing_is_breaking(self):
        baseline = self.base()
        candidate = self.base()
        candidate["components"]["schemas"]["User"]["properties"]["role"]["enum"] = ["user"]
        breaking, _ = module.compare_documents(baseline, candidate)
        self.assertIn("enum-narrowed", {item["code"] for item in breaking})

    def test_optional_path_is_non_breaking(self):
        baseline = self.base()
        candidate = self.base()
        candidate["paths"]["/health"] = {"get": {"responses": {"200": {"description": "ok"}}}}
        breaking, non_breaking = module.compare_documents(baseline, candidate)
        self.assertEqual([], breaking)
        self.assertIn("path-added", {item["code"] for item in non_breaking})


if __name__ == "__main__":
    unittest.main()
