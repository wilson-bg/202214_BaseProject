import { PRODUCT_TYPE } from "src/producttype/producttype.enum";

export class ProductDTO {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly type: PRODUCT_TYPE;
}