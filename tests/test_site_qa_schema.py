import copy
import json
import unittest
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = json.loads((ROOT / "schemas/site-qa-report.schema.json").read_text())
SAMPLE = json.loads((ROOT / "examples/site-qa.synthetic.json").read_text())

class TestSiteQaReportSchema(unittest.TestCase):
    def setUp(self):
        self.validator = Draft202012Validator(SCHEMA)

    def test_synthetic_report_valid(self):
        self.assertEqual(list(self.validator.iter_errors(SAMPLE)), [])

    def test_rejects_injected_fields(self):
        candidate = copy.deepcopy(SAMPLE)
        candidate["privateSiteId"] = "not-allowed"
        self.assertTrue(list(self.validator.iter_errors(candidate)))

    def test_requires_evidence_on_reported_pass(self):
        candidate = copy.deepcopy(SAMPLE)
        candidate["checks"][0] = {"id": "source", "status": "passed"}
        self.assertTrue(list(self.validator.iter_errors(candidate)))

    def test_requires_reason_on_not_applicable(self):
        candidate = copy.deepcopy(SAMPLE)
        candidate["checks"][2]["reason"] = ""
        self.assertTrue(list(self.validator.iter_errors(candidate)))

    def test_requires_approval_and_deployment_evidence(self):
        candidate = copy.deepcopy(SAMPLE)
        candidate["approval"]["status"] = "approved"
        candidate["deployment"]["status"] = "reported-published"
        self.assertTrue(list(self.validator.iter_errors(candidate)))

if __name__ == '__main__':
    unittest.main()
