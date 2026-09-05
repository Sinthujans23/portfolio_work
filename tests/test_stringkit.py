"""Test suite for the *stringkit* package.

Covers normal, edge, and error cases for both ``reverse_words`` and
``is_palindrome`` functions.
"""

import pytest

import stringkit as sk


# ---------- reverse_words tests ----------

@pytest.mark.parametrize(
    "input_str,expected",
    [
        ("hello world", "world hello"),
        ("  leading and trailing  ", "trailing and leading"),
        ("multiple   spaces", "spaces multiple"),
        ("single", "single"),
        ("", ""),
        ("   ", ""),
        ("mixED CaSe Words", "Words CaSe mixED"),
    ],
)
def test_reverse_words_normal(input_str, expected):
    assert sk.reverse_words(input_str) == expected


def test_reverse_words_type_error():
    with pytest.raises(TypeError):
        sk.reverse_words(123)  # type: ignore


# ---------- is_palindrome tests ----------

@pytest.mark.parametrize(
    "input_str,expected",
    [
        ("radar", True),
        ("Level", False),  # case‑sensitive
        ("A man a plan a canal Panama", False),
        ("", True),
        ("a", True),
        ("aa", True),
        ("ab", False),
        ("  ", True),
        ("!@# #@!", True),
    ],
)
def test_is_palindrome_normal(input_str, expected):
    assert sk.is_palindrome(input_str) == expected


def test_is_palindrome_type_error():
    with pytest.raises(TypeError):
        sk.is_palindrome(None)  # type: ignore
