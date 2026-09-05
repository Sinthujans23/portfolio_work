"""Top-level package for stringkit.

This module re-exports the public API functions from :pymod:`stringkit.core`.
"""

from .core import reverse_words, is_palindrome

__all__ = ["reverse_words", "is_palindrome"]
