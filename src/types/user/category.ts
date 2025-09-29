export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  order_index: number;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  order_index: number;
  subcategories: Subcategory[];
}
