import { PRODUCT_TYPE } from "src/producttype/producttype.enum";
import { StoreDTO } from "src/store/store.dto";

export class ProductDTO {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly type: PRODUCT_TYPE;
}