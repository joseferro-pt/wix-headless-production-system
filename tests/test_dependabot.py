"""Validate the real WHPS Dependabot YAML; no network or Wix access."""
import copy
from pathlib import Path
import unittest
import yaml

ROOT = Path(__file__).resolve().parents[1]
ECOSYSTEMS = {"pip", "github-actions"}


def check_config(config):
    if not isinstance(config, dict) or config.get("version") != 2:
        raise ValueError("Dependabot configuration must use version 2")
    updates = config.get("updates")
    if not isinstance(updates, list) or len(updates) != 2:
        raise ValueError("Exactly two update ecosystems required")
    seen = set()
    for entry in updates:
        if not isinstance(entry, dict):
            raise ValueError("Update entries must be mappings")
        ecosystem = entry.get("package-ecosystem")
        if ecosystem not in ECOSYSTEMS or ecosystem in seen:
            raise ValueError("Missing, duplicate or unsupported package ecosystem")
        seen.add(ecosystem)
        if entry.get("directory") != "/":
            raise ValueError("Expected root repository directory")
        if not isinstance(entry.get("schedule"), dict) or entry["schedule"].get("interval") != "weekly":
            raise ValueError("Expected weekly schedule")
        limit = entry.get("open-pull-requests-limit")
        if type(limit) is not int or limit < 1:
            raise ValueError("Invalid pull request limit")
        groups = entry.get("groups")
        if not isinstance(groups, dict) or len(groups) != 1:
            raise ValueError("Expected one named update group per ecosystem")
        group = next(iter(groups.values()))
        if not isinstance(group, dict) or group.get("patterns") != ["*"]:
            raise ValueError("Expected explicit all-dependencies group")
    if seen != ECOSYSTEMS:
        raise ValueError("Missing required dependency ecosystem")


class DependabotConfigurationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.config = yaml.safe_load((ROOT / ".github/dependabot.yml").read_text(encoding="utf8"))

    def test_actual_yaml_is_valid_and_approved(self):
        check_config(self.config)

    def test_reject_incomplete_or_wrong_configuration(self):
        for defect in ("empty", "duplicate", "missing_schedule", "wrong_path", "missing_group"):
            with self.subTest(defect=defect):
                bad = copy.deepcopy(self.config)
                if defect == "empty":
                    bad["updates"][0]["package-ecosystem"] = ""
                elif defect == "duplicate":
                    bad["updates"][1]["package-ecosystem"] = "pip"
                elif defect == "missing_schedule":
                    bad["updates"][0]["schedule"] = {}
                elif defect == "wrong_path":
                    bad["updates"][1]["directory"] = "/client-sites"
                else:
                    del bad["updates"][0]["groups"]
                with self.assertRaises(ValueError):
                    check_config(bad)


if __name__ == "__main__":
    unittest.main()
