export interface Category {
    categoryId: number;
    categoryName: string;
    parentCategoryId: number | null;
    children?: Category[];
  }