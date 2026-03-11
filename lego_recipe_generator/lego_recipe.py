#!/usr/bin/env python3
"""
LEGO Building Recipe Generator
Creates authentic LEGO-style instruction manuals for any build idea.
"""

import json
import os
import sys
from pathlib import Path

# Load .env from this folder or project root
try:
    from dotenv import load_dotenv
    load_dotenv()
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

# Try to load OpenAI for AI-powered generation
try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False


# Realistic LEGO part database (common parts with element IDs)
LEGO_PARTS = {
    "2x4_brick": {"id": "3001", "name": "Brick 2x4", "color": "Red"},
    "2x3_brick": {"id": "3002", "name": "Brick 2x3", "color": "Blue"},
    "2x2_brick": {"id": "3003", "name": "Brick 2x2", "color": "Yellow"},
    "1x4_brick": {"id": "3010", "name": "Brick 1x4", "color": "White"},
    "1x2_brick": {"id": "3004", "name": "Brick 1x2", "color": "Black"},
    "1x1_brick": {"id": "3005", "name": "Brick 1x1", "color": "Various"},
    "2x4_plate": {"id": "3020", "name": "Plate 2x4", "color": "Gray"},
    "2x2_plate": {"id": "3022", "name": "Plate 2x2", "color": "Gray"},
    "1x4_plate": {"id": "3710", "name": "Plate 1x4", "color": "Gray"},
    "1x2_plate": {"id": "3023", "name": "Plate 1x2", "color": "Gray"},
    "1x1_plate": {"id": "3024", "name": "Plate 1x1", "color": "Gray"},
    "2x4_slope": {"id": "3040", "name": "Slope 45° 2x4", "color": "Red"},
    "2x2_slope": {"id": "3039", "name": "Slope 45° 2x2", "color": "Red"},
    "1x1_round": {"id": "4073", "name": "Round Brick 1x1", "color": "White"},
    "2x2_round": {"id": "4032", "name": "Round Plate 2x2", "color": "Yellow"},
    "1x2_technic": {"id": "3700", "name": "Technic Brick 1x2", "color": "Gray"},
    "axle_3": {"id": "3707", "name": "Axle 3L", "color": "Black"},
    "axle_4": {"id": "3708", "name": "Axle 4L", "color": "Black"},
    "gear_small": {"id": "3648", "name": "Gear 8 Tooth", "color": "Gray"},
    "gear_large": {"id": "3649", "name": "Gear 24 Tooth", "color": "Gray"},
    "trans_clear": {"id": "3024", "name": "Plate 1x1 Trans-Clear", "color": "Trans-Clear"},
    "tile_2x2": {"id": "3068", "name": "Tile 2x2", "color": "White"},
    "tile_1x2": {"id": "3069", "name": "Tile 1x2", "color": "White"},
    "door_1x3": {"id": "4865", "name": "Door 1x3x4", "color": "White"},
    "window_1x2": {"id": "60592", "name": "Window 1x2x3", "color": "Trans-Clear"},
    "hinge": {"id": "44226", "name": "Hinge Plate", "color": "Gray"},
    "lever": {"id": "4595", "name": "Lever", "color": "Red"},
    "knob": {"id": "3941", "name": "Cone 1x1", "color": "Red"},
    "cylinder_1x1": {"id": "3062", "name": "Cylinder 1x1", "color": "Various"},
    "cylinder_2x2": {"id": "3942", "name": "Cylinder 2x2", "color": "Various"},
}

# Predefined recipes for when AI is not available
PREDEFINED_RECIPES = {
    "candy machine": {
        "title": "Candy Vending Machine",
        "set_number": "10642-1",
        "parts": [
            {"part": "2x4_brick", "qty": 12, "step": 1},
            {"part": "2x2_brick", "qty": 8, "step": 1},
            {"part": "2x4_plate", "qty": 6, "step": 2},
            {"part": "2x2_plate", "qty": 4, "step": 2},
            {"part": "1x4_brick", "qty": 6, "step": 3},
            {"part": "1x2_brick", "qty": 8, "step": 3},
            {"part": "1x1_brick", "qty": 4, "step": 4},
            {"part": "2x4_slope", "qty": 2, "step": 5},
            {"part": "1x1_round", "qty": 6, "step": 6},
            {"part": "lever", "qty": 1, "step": 7},
            {"part": "knob", "qty": 4, "step": 7},
            {"part": "trans_clear", "qty": 2, "step": 8},
            {"part": "cylinder_2x2", "qty": 3, "step": 9},
        ],
        "steps": [
            "Build the base structure using 2x4 bricks in red. Create a 6-stud wide by 4-stud deep foundation.",
            "Add the first plate layer in gray. This forms the dispensing chamber floor.",
            "Construct the front panel with 1x4 white bricks. Leave a 2-stud gap in the center for the dispenser.",
            "Place 1x1 bricks at each corner for structural support. These will hold the transparent front.",
            "Add the roof slopes in red, angled toward the front. This creates the classic vending machine top.",
            "Insert 1x1 round bricks (white) as candy pieces inside the machine. Arrange in 3 columns.",
            "Attach the lever mechanism on the right side. Use one red lever and 4 red knobs for the coin slot.",
            "Install the transparent 1x1 plates as the viewing window to see the candy selection.",
            "Add 3 cylinder 2x2 pieces as the dispensing chutes. Test the lever to ensure candy drops!",
        ],
    },
    "house": {
        "title": "Classic LEGO House",
        "set_number": "10643-1",
        "parts": [
            {"part": "2x4_brick", "qty": 16, "step": 1},
            {"part": "2x2_brick", "qty": 4, "step": 1},
            {"part": "2x4_plate", "qty": 8, "step": 2},
            {"part": "1x4_brick", "qty": 4, "step": 3},
            {"part": "door_1x3", "qty": 1, "step": 4},
            {"part": "window_1x2", "qty": 2, "step": 5},
            {"part": "2x4_slope", "qty": 4, "step": 6},
            {"part": "2x2_slope", "qty": 2, "step": 6},
        ],
        "steps": [
            "Build the foundation with 2x4 red bricks. Create a 8x6 stud base.",
            "Add gray plates for the floor. Two layers for stability.",
            "Build the walls using 1x4 white bricks. Stack 4 bricks high.",
            "Install the white door in the center front. Ensure it opens outward.",
            "Add two windows on either side of the door. Use trans-clear pieces.",
            "Place red slopes for the roof. Angle them to meet at the peak.",
        ],
    },
    "car": {
        "title": "Simple LEGO Car",
        "set_number": "10644-1",
        "parts": [
            {"part": "2x4_plate", "qty": 1, "step": 1},
            {"part": "2x2_plate", "qty": 2, "step": 1},
            {"part": "2x4_brick", "qty": 2, "step": 2},
            {"part": "2x2_brick", "qty": 1, "step": 2},
            {"part": "1x1_round", "qty": 4, "step": 3},
            {"part": "axle_4", "qty": 2, "step": 3},
            {"part": "2x2_slope", "qty": 2, "step": 4},
        ],
        "steps": [
            "Start with the chassis: one 2x4 gray plate with two 2x2 plates for wheel wells.",
            "Build the body using 2x4 bricks (red) and a 2x2 brick (blue) for the cabin.",
            "Attach axles and 1x1 round bricks as wheels. Four wheels total.",
            "Add 2x2 slopes at the front for the hood. Your car is ready to roll!",
        ],
    },
}


def get_aggregated_parts(recipe: dict) -> dict:
    """Aggregate parts by type with quantities, like a real LEGO parts list."""
    parts_count = {}
    for p in recipe["parts"]:
        key = p["part"]
        if key not in parts_count:
            parts_count[key] = 0
        parts_count[key] += p["qty"]
    return parts_count


def print_recipe(recipe: dict, build_name: str) -> None:
    """Print recipe in authentic LEGO instruction format."""
    parts_agg = get_aggregated_parts(recipe)

    # Header
    print()
    print("═" * 60)
    print("  LEGO® BUILDING INSTRUCTIONS")
    print("═" * 60)
    print()
    print(f"  Set: {recipe['title']}")
    print(f"  Set Number: {recipe.get('set_number', 'CUSTOM-1')}")
    print(f"  Build: {build_name}")
    print()
    print("─" * 60)
    print("  PARTS LIST")
    print("─" * 60)
    print()

    # Parts list (like real LEGO - part number, image placeholder, qty)
    for i, (part_key, qty) in enumerate(sorted(parts_agg.items(), key=lambda x: -x[1]), 1):
        part_info = LEGO_PARTS.get(
            part_key,
            {"id": "????", "name": part_key.replace("_", " ").title(), "color": "—"},
        )
        print(f"  [{i:2}]  {part_info['id']}  {part_info['name']:25}  ×{qty:2}  ({part_info['color']})")

    print()
    print("─" * 60)
    print("  ASSEMBLY INSTRUCTIONS")
    print("─" * 60)
    print()

    # Step-by-step instructions
    for i, step_text in enumerate(recipe["steps"], 1):
        # Get parts for this step
        step_parts = [p for p in recipe["parts"] if p["step"] == i]
        parts_str = ", ".join(
            f"{p['qty']}× {LEGO_PARTS.get(p['part'], {}).get('name', p['part'])}"
            for p in step_parts
        )

        print(f"  STEP {i}")
        print("  " + "─" * 56)
        if parts_str:
            print(f"  Parts needed: {parts_str}")
        print(f"  {step_text}")
        print()

    print("═" * 60)
    print("  BUILD COMPLETE!  Enjoy your creation.  ")
    print("═" * 60)
    print()


def generate_with_ai(build_idea: str) -> dict | None:
    """Use OpenAI to generate a custom LEGO recipe."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key or not HAS_OPENAI:
        return None

    client = OpenAI(api_key=api_key)

    prompt = f"""You are a LEGO instruction manual designer. Create a detailed LEGO building recipe for: "{build_idea}".

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{{
  "title": "Creative name for the build",
  "set_number": "XXXXX-1",
  "parts": [
    {{"part": "part_key_from_list", "qty": number, "step": step_number}}
  ],
  "steps": [
    "Step 1 instruction text...",
    "Step 2 instruction text..."
  ]
}}

Available part keys: {", ".join(LEGO_PARTS.keys())}

Use only these part keys. Each part in "parts" must have step 1 through N matching the steps array length.
Make it fun, buildable, and authentic to LEGO style. 4-12 steps is ideal."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        text = response.choices[0].message.content.strip()
        # Remove markdown code blocks if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        return json.loads(text)
    except Exception as e:
        print(f"  (AI generation failed: {e})", file=sys.stderr)
        return None


def find_matching_recipe(build_idea: str) -> tuple[str | None, dict | None]:
    """Check if we have a predefined recipe for this build."""
    idea_lower = build_idea.lower().strip()
    for key, recipe in PREDEFINED_RECIPES.items():
        if key in idea_lower or idea_lower in key:
            return key, recipe
    return None, None


def main():
    print()
    print("  🧱 LEGO Recipe Generator")
    print("  ─────────────────────────")

    if len(sys.argv) > 1:
        build_idea = " ".join(sys.argv[1:])
    else:
        build_idea = input("  What do you want to build? ").strip()

    if not build_idea:
        print("  Please enter something to build!")
        sys.exit(1)

    recipe = None
    matched_key = None

    # 1. Check predefined recipes
    matched_key, recipe = find_matching_recipe(build_idea)

    # 2. Try AI generation if no match or for custom builds
    if not recipe and os.environ.get("OPENAI_API_KEY"):
        print("  Generating custom recipe with AI...")
        recipe = generate_with_ai(build_idea)

    # 3. Fallback: use AI-style template or candy machine as default
    if not recipe:
        if matched_key:
            recipe = PREDEFINED_RECIPES[matched_key]
        else:
            # Use candy machine as template for unknown builds
            print("  No exact match. Using 'Candy Machine' as template.")
            print("  (Add OPENAI_API_KEY to .env for custom AI-generated recipes)")
            recipe = PREDEFINED_RECIPES["candy machine"].copy()
            recipe["title"] = f"Custom: {build_idea.title()}"
            recipe["set_number"] = "CUSTOM-1"

    print_recipe(recipe, build_idea)


if __name__ == "__main__":
    main()
