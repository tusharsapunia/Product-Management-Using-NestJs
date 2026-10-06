import { PartialType } from "@nestjs/swagger";
import { ProductDTO } from "./product.dto.js";


export class PartialProduct extends PartialType(ProductDTO){}