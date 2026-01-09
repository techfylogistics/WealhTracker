Mental rule (easy to remember)

“If it’s a choice → type”
“If it’s a shape → interface”


Correct definition (recommended)
export type XirrScope = 'ITEM' | 'CATEGORY' | 'OVERALL';

When should you use interface instead?

Use interface when the thing has shape / structure:

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}


Interfaces describe objects, not choices.

