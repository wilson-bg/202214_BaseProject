import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-error';
import { ProductDTO } from './product.dto';
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
        /*const product = new ProductEntity();
        product.name = productDTO.name;
        product.price = productDTO.price;
        product.type = productDTO.type; */      
        return await this.productRepository.save(product);
    }

    async update(id: string, product: ProductEntity): Promise<ProductEntity> {
        const  persistedProduct = await this.productRepository.findOne(id);
        if (!persistedProduct)
          throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
        
        /*persistedProduct.name = product.name;
        persistedProduct.price = product.price;
        persistedProduct.type = product.type; 
        await this.productRepository.save(product);
        return product;*/
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
