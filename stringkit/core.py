"""Core implementations for the *stringkit* package.

Provides two utility functions:

* :func:`reverse_words` – Returns a new string with the order of words reversed.
* :func:`is_palindrome` – Determines whether a string reads the same forwards and
  backwards, considering the exact sequence of characters (case‑sensitive).

Both functions validate their input type and raise :class:`TypeError` if the
provided argument is not a :class:`str`.
"""

from __future__ import annotations

from typing import List


def _validate_str_input(s: str) -> None:
    """Validate that *s* is a string.

    Parameters
    ----------
    s:
        The value to validate.
    """
    if not isinstance(s, str):
        raise TypeError(f"Expected a string, got {type(s)!r}")


def reverse_words(s: str) -> str:
    """Return a new string with the order of *words* reversed.

    Words are defined as sequences of characters separated by whitespace. The
    function collapses any whitespace to a single space in the output, mimicking
    typical ``str.split`` behaviour.

    Parameters
    ----------
    s:
        Input string.

    Returns
    -------
    str
        The input string with word order reversed.
    """
    _validate_str_input(s)
    # Split on any whitespace, filter out empty strings, reverse, and join.
    words: List[str] = s.split()
    reversed_words = list(reversed(words))
    return " ".join(reversed_words)


def is_palindrome(s: str) -> bool:
    """Return ``True`` if *s* is a palindrome, ``False`` otherwise.

    The check is **case‑sensitive** and includes all characters (including
    whitespace and punctuation). This mirrors the simple specification in the
    architecture document.

    Parameters
    ----------
    s:
        Input string.

    Returns
    -------
    bool
        ``True`` if *s* reads the same forwards and backwards.
    """
    _validate_str_input(s)
    return s == s[::-1]
