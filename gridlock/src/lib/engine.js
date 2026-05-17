// The Dictionary. The keys are the exact 9-slot state.
const RECIPE_BOOK = {
  // Top row wood, middle stick, bottom stick
  "oak_planks,oak_planks,oak_planks,empty,stick,empty,empty,stick,empty": {
    id: "wooden_pickaxe",
    name: "Wooden Pickaxe",
    icon: "⛏️"
  },
  // 2x2 wood in the top left
  "oak_planks,oak_planks,empty,oak_planks,oak_planks,empty,empty,empty,empty": {
    id: "crafting_table",
    name: "Crafting Table",
    icon: "🧰"
  }
};

// The Engine
export const validateRecipe = (gridArray) => {
  // 1. Normalize the array into a predictable string
  // If a slot is null/undefined, make it 'empty'. Otherwise, grab the item id.
  const serializedGrid = gridArray.map(slot => slot ? slot.id : 'empty').join(',');

  // 2. Look it up in the dictionary
  const result = RECIPE_BOOK[serializedGrid];

  // 3. Return the result (or null if it's gibberish)
  return result || null;
};