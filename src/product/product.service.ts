import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PRODUCT_TYPE } from '../producttype/producttype.enum';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-error';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) {}


    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepository.find({ relations: ["stores"] });
    }

    async findOne(id: string): Promise<ProductEntity> {
        const product = await this.productRepository.findOne(id, { relations: ["stores"] });
        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
        else
            return product;
    }   

    async create(product: ProductEntity): Promise<ProductEntity> {
        if (product.type && Object.values(PRODUCT_TYPE).includes(product.type.toUpperCase() as PRODUCT_TYPE) == false){
            throw new BusinessLogicException('The type product is invalid', BusinessError.BAD_REQUEST);
        }
        return await this.productRepository.save(product);
    }

    async update(id: string, product: ProductEntity): Promise<ProductEntity> {
        const  persistedProduct = await this.productRepository.findOne(id);
        if (!persistedProduct)
          throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
        return await this.productRepository.save({...persistedProduct, ...product});
    }

    async delete(id: string) {
        const product = await this.productRepository.findOne(id);
        if (!product)
          throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
        else {
          return await this.productRepository.remove(product);
        }
    }

}
