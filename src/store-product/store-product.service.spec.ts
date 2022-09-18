import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreProductService } from './store-product.service';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';
import { PRODUCT_TYPE } from '../producttype/producttype.enum';

describe('StoreProductService', () => {
  let service: StoreProductService;
  let storeRepository: Repository<StoreEntity>;
  let productRepository: Repository<ProductEntity>;
  let product: ProductEntity;
  let storesList: StoreEntity[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreProductService],
    }).compile();

    service = module.get<StoreProductService>(StoreProductService);
    storeRepository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );

    await seedDatabase();

  });

  const seedDatabase = async () => {
    storeRepository.clear();
    productRepository.clear();
    storesList = [];

    for (let i = 0; i < 3; i++) {
      const store: StoreEntity = await storeRepository.save({
        id: faker.datatype.uuid(),
        name: faker.company.name(),
        city: faker.address.city(),
        address: faker.address.direction()
      });
      storesList.push(store);
    }

    product = await productRepository.save({
      id: faker.datatype.uuid(),
      name: faker.random.word(),
      price: parseInt(faker.random.numeric(5)),
      type: faker.datatype.number({ max: 100 }) > 50 ? PRODUCT_TYPE.PERISHABLE : PRODUCT_TYPE.NONPERISHABLE,
      stores: storesList
    });
    
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('addStoreToProduct should add an store to a product', async () => {
    const store = await storeRepository.save({
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: faker.address.city(),
      address: faker.address.direction()
    });
    //product.stores.push(store);

    const storeProduct = await service.addStoreToProduct(store.id, product.id);
    expect(storeProduct).toBeDefined();
    expect(storeProduct.stores.length).toBe(product.stores.length+1);
  });

  it('addStoreToProduct should thrown exception for an invalid store', async () => {
    /*const product: ProductEntity = await productRepository.({
      id: faker.datatype.uuid(),
      name: `ProductNew ${faker.datatype.number()}`,
      price: parseInt(faker.random.numeric(5)),
      type: faker.datatype.number({ max: 100 }) > 50 ? PRODUCT_TYPE.PERISHABLE : PRODUCT_TYPE.NONPERISHABLE,
      stores:[]
    });
    */
    await expect(service.addStoreToProduct('0', product.id)).rejects.toHaveProperty('message','The store with the given id was not found');
  });

  it('addStoreToProduct should thrown exception for an invalid product', async () => {
    /*const store: StoreEntity = await storeRepository.save({
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: faker.address.city(),
      address: faker.address.direction()
    });*/

    await expect(service.addStoreToProduct(storesList[0].id, "0")).rejects.toHaveProperty('message','The product with the given id was not found');
  });

  
  it('findStoresFromProduct should return all stores by product', async () => {
    const stores = await service.findStoresFromProduct(product.id);
    expect(stores).toBeDefined();
    expect(stores.length).toBe(product.stores.length+1);
  });


  it('findStoresFromProduct should throw an exception for an invalid product', async () => {
    await expect(service.findStoresFromProduct('0')).rejects.toHaveProperty('message', 'The product with the given id was not found');
  });

  it('findStoreFromProduct should return a store from a product', async () => {
    const store = await service.findStoreFromProduct(storesList[0].id, product.id);
    expect(store).toBeDefined();
    expect(store.id).toBe(storesList[0].id);
  });

  it('findStoreFromProduct should throw an exception for an invalid product', async () => {
    await expect(service.findStoreFromProduct(storesList[0].id, '0')).rejects.toHaveProperty('message','The product with the given id was not found');
  });

  it('findStoreFromProduct should throw an exception for an invalid store', async () => {
    await expect(service.findStoreFromProduct('0', product.id)).rejects.toHaveProperty('message','The store with the given id was not found');
  });

  it('findStoreFromProduct should thrown an exception for an non asocciated store', async () => {
    const store: StoreEntity = await storeRepository.save({
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: faker.address.city(),
      address: faker.address.direction()
    });

    await expect(service.findStoreFromProduct(store.id, product.id)).rejects.toHaveProperty('message','The product with the given id is not associated to the store');
  });

  it('deleteStoreFromProduct should delete a store from a product', async () => {
    await service.deleteStoreFromProduct(storesList[0].id, product.id);

    const storedStore: StoreEntity = await storeRepository.findOne({where: {id: storesList[0].id}, relations: ["products"]});
    const deletedproduct: ProductEntity = storedStore.products.find(a => a.id === product.id);
    expect(deletedproduct).toBeUndefined();

    const store = await service.findStoresFromProduct(product.id);
    expect(store.length).toBe(product.stores.length);
  });

  it('updateStoresFromProduct should update all stores from a product', async () => {
    const store1: StoreEntity = await storeRepository.save({
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: faker.address.city(),
      address: faker.address.direction()
    });

    const store2: StoreEntity = await storeRepository.save({
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: faker.address.city(),
      address: faker.address.direction()
    });

    const storedProduct = await service.updateStoresFromProduct(product.id,[store1, store2]);
    expect(storedProduct.stores).toBeDefined();
    expect(storedProduct.stores.length).toBe(2);

  });



  it('updateStoresFromProduct should thrown an exception for an invalid product', async () => {
    const store: StoreEntity = await storeRepository.save({
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: faker.address.city(),
      address: faker.address.direction()
    });
    await expect(service.updateStoresFromProduct('0', [store])).rejects.toHaveProperty('message', 'The product with the given id was not found');
  });

  it('updateStoresFromProduct should thrown an exception for an invalid store', async () => {
    const store: StoreEntity = {
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: faker.address.city(),
      address: faker.address.direction(),
      products: []
    };
    await expect(service.updateStoresFromProduct(product.id, [store])).rejects.toHaveProperty('message','The store with the given id was not found');
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid product', async () => {
    await expect(service.deleteStoreFromProduct(storesList[0].id, '0')).rejects.toHaveProperty('message','The product with the given id was not found');
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid store', async () => {
    await expect(service.deleteStoreFromProduct('0', product.id)).rejects.toHaveProperty('message','The store with the given id was not found');
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated product ', async () => {
    const store: StoreEntity = await storeRepository.save({
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: faker.address.city(),
      address: faker.address.direction()
    });
    await expect(service.deleteStoreFromProduct(store.id, product.id)).rejects.toHaveProperty('message','The product with the given id is not associated to the store');
  });
  

});
