export type ProductResponse = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
