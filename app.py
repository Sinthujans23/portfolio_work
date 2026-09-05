"""Application entry point that runs the test suite for the stringkit project."""

import sys
import pytest

if __name__ == "__main__":
    sys.exit(pytest.main(["-q"]))
