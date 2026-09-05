"""
Regenerates app/opengraph-image.png — the card shown when the site is shared
on LinkedIn, WhatsApp, Slack or iMessage.

    python scripts/make-og-image.py

Kept as a script rather than a one-off so the card can be rebuilt whenever the
name, role or photo changes. Mirrors the site's light palette; the five hue
strip along the bottom is the same sequence as the scroll-progress bar.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent

W, H = 1200, 630

BG = (252, 252, 252)  # --bg
TEXT = (23, 23, 26)  # --text
TEXT_2 = (87, 87, 94)  # --text-2
TEXT_3 = (108, 108, 117)  # --text-3
BORDER = (210, 210, 206)  # --border-strong

HUES = [
    (42, 91, 215),  # --c-blue
    (98, 72, 216),  # --c-violet
    (13, 114, 104),  # --c-teal
    (143, 86, 9),  # --c-amber
    (184, 57, 92),  # --c-rose
]

FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_REG = "C:/Windows/Fonts/segoeui.ttf"
FONT_MONO = "C:/Windows/Fonts/consola.ttf"

NAME = "Denusha Thavaruban"
ROLE = "Software Engineering Undergraduate"
META = "University of Moratuwa  ·  Sri Lanka"
FOOT = "React  ·  Next.js  ·  TypeScript  ·  Node.js"

# Crop of public/profile.jpg used for the circular avatar, matching the
# .portrait rule in globals.css.
CROP_X, CROP_Y, CROP_SIZE = 360, 248, 430


def radial_blob(size, colour, strength):
    """A soft circular tint, built by stacking ellipses on a small canvas and
    scaling up — cheaper than a real blur and smooth enough at this size."""
    n = 64
    mask = Image.new("L", (n, n), 0)
    d = ImageDraw.Draw(mask)
    for i in range(n // 2, 0, -1):
        alpha = int(strength * (1 - i / (n / 2)) ** 2)
        d.ellipse((n / 2 - i, n / 2 - i, n / 2 + i, n / 2 + i), fill=alpha)
    layer = Image.new("RGB", (size, size), colour)
    return layer, mask.resize((size, size), Image.BILINEAR)


def main():
    card = Image.new("RGB", (W, H), BG)

    # Two colour fields, echoing the hero's aurora.
    for colour, pos, size, strength in (
        (HUES[0], (-260, -300), 900, 46),
        (HUES[1], (760, -360), 860, 40),
    ):
        layer, mask = radial_blob(size, colour, strength)
        card.paste(layer, pos, mask)

    draw = ImageDraw.Draw(card)

    # ── Avatar ──────────────────────────────────────────────
    d_av = 300
    photo = Image.open(ROOT / "public" / "profile.jpg").convert("RGB")
    avatar = photo.crop(
        (CROP_X, CROP_Y, CROP_X + CROP_SIZE, CROP_Y + CROP_SIZE)
    ).resize((d_av, d_av), Image.LANCZOS)

    mask = Image.new("L", (d_av * 4, d_av * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, d_av * 4 - 1, d_av * 4 - 1), fill=255)
    mask = mask.resize((d_av, d_av), Image.LANCZOS)  # antialiased edge

    ax, ay = 92, (H - d_av) // 2
    draw.ellipse((ax - 2, ay - 2, ax + d_av + 2, ay + d_av + 2), fill=BORDER)
    card.paste(avatar, (ax, ay), mask)

    # ── Text ────────────────────────────────────────────────
    tx = ax + d_av + 68
    f_name = ImageFont.truetype(FONT_BOLD, 62)
    f_role = ImageFont.truetype(FONT_REG, 31)
    f_meta = ImageFont.truetype(FONT_MONO, 22)

    y = 196
    draw.text((tx, y), NAME, font=f_name, fill=TEXT)
    y += 84
    draw.text((tx, y), ROLE, font=f_role, fill=TEXT_2)
    y += 58
    draw.line((tx, y, tx + 52, y), fill=HUES[0], width=3)
    y += 26
    draw.text((tx, y), META, font=f_meta, fill=TEXT_3)
    y += 38
    draw.text((tx, y), FOOT, font=f_meta, fill=TEXT_3)

    # ── Hue strip, same order as the scroll-progress bar ────
    strip = 10
    seg = W / len(HUES)
    for i, colour in enumerate(HUES):
        draw.rectangle(
            (int(i * seg), H - strip, int((i + 1) * seg), H), fill=colour
        )

    out = ROOT / "app" / "opengraph-image.png"
    card.save(out, optimize=True)
    print(f"wrote {out.relative_to(ROOT)}  ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
