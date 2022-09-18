import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-error';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';

/*
Ok addStoreToProduct: Asociar una tienda a un producto.
Ok findStoresFromProduct: Obtener las tiendas que tienen un producto.
Ok findStoreFromProduct: Obtener una tienda que tiene un producto.
Ok updateStoresFromProduct: Actualizar las tiendas que tienen un producto.
Ok deleteStoreFromProduct: Eliminar la tienda que tiene un producto.
*/

@Injectable()
export class StoreProductService {
    constructor(
        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) {}
    
    async addStoreToProduct(storeId: string,productId: string): Promise<ProductEntity> {
        const store: StoreEntity = await this.storeRepository.findOne({ where: { id: storeId }, relations: ['products'] });
        if (!store)
                throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)

        const product: ProductEntity = await this.productRepository.findOne({where: { id: productId },relations: ['stores']});
        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)

        product.stores = [...product.stores, store];
        return await this.productRepository.save(product);
    }
    
    async findStoresFromProduct(productId: string): Promise<StoreEntity[]> {
        const product: ProductEntity = await this.productRepository.findOne({where: { id: productId }, relations: ['stores']});
        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)

        return product.stores;
    }
    
    async findStoreFromProduct(storeId: string, productId: string): Promise<StoreEntity> {
        const store: StoreEntity = await this.storeRepository.findOne({ where: { id: storeId }, relations: ['products'] });
        if (!store)
                throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)

        const product: ProductEntity = await this.productRepository.findOne({where: { id: productId }, relations: ['stores']});
        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)

        const storeProduct = product.stores.find((e) => e.id === store.id);
        if (!storeProduct)
            throw new BusinessLogicException('The product with the given id is not associated to the store',BusinessError.PRECONDITION_FAILED);

        return storeProduct;
    }
    
    async updateStoresFromProduct(productId: string, stores: StoreEntity[]): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({where: { id: productId }, relations: ['stores']});
        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
    
        for (const store of stores) {
            const persistedStore: StoreEntity = await this.storeRepository.findOne({ where: { id: store.id }});
            if (!persistedStore)
                throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)
        }

        product.stores = stores;
        return await this.productRepository.save(product);
    }
    
    async deleteStoreFromProduct(storeId: string, productId: string): Promise<void> {
        const store: StoreEntity = await this.storeRepository.findOne({where: { id: storeId }, relations: ['products'] });
        if (!store)
            throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)
        
        const product: ProductEntity = await this.productRepository.findOne({where: { id:productId }, relations: ['stores']});
        if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
 
        const storeProduct = product.stores.find((el) => el.id === store.id);
        if (!storeProduct)
            throw new BusinessLogicException('The product with the given id is not associated to the store',BusinessError.PRECONDITION_FAILED);

        product.stores = product.stores.filter((el) => el.id !== store.id);

        await this.productRepository.save(product);
    }

}
