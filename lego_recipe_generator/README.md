# LEGO Recipe Generator

Creates authentic LEGO-style building instructions for any build idea. Like a real LEGO manual: parts list with quantities and element IDs, step-by-step assembly instructions.

## Quick Start

```bash
# Run with your build idea
python lego_recipe.py candy machine

# Or run interactively
python lego_recipe.py
# Then type: candy machine
```

## Example Output

```
══════════════════════════════════════════════════════════════
  LEGO® BUILDING INSTRUCTIONS
══════════════════════════════════════════════════════════════

  Set: Candy Vending Machine
  Set Number: 10642-1
  Build: candy machine

──────────────────────────────────────────────────────────────
  PARTS LIST
──────────────────────────────────────────────────────────────

  [ 1]  3001  Brick 2x4                   ×12  (Red)
  [ 2]  3003  Brick 2x2                   × 8  (Yellow)
  [ 3]  3020  Plate 2x4                   × 6  (Gray)
  ...

──────────────────────────────────────────────────────────────
  ASSEMBLY INSTRUCTIONS
──────────────────────────────────────────────────────────────

  STEP 1
  ────────────────────────────────────────────────────────
  Parts needed: 12× Brick 2x4, 8× Brick 2x2
  Build the base structure using 2x4 bricks in red...
```

## Predefined Recipes

- **candy machine** – Classic vending machine with lever and dispenser
- **house** – Simple house with door, windows, and sloped roof
- **car** – Basic car with wheels and chassis

## AI-Powered Custom Recipes

For custom builds (e.g., "spaceship", "robot", "castle"), add your OpenAI API key:

1. Create a `.env` file in this folder or the project root:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

2. Install optional dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run with any build idea – the AI will generate a custom recipe!
