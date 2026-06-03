export interface Timeline {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  displayTime: string;
  slug: string;
  funfacts?: string[];
  createdAt: string;
  updatedAt: string;
}