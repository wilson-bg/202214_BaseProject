import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { PRODUCT_TYPE } from '../producttype/producttype.enum';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productsList: ProductEntity[];
  const emptyId = '00000000-0000-0000-0000-000000000000';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: `Product ${i}`,
        price: parseInt(faker.random.numeric(5)),
        type: faker.datatype.number({ max: 100 }) > 50 ? PRODUCT_TYPE.PERISHABLE : PRODUCT_TYPE.NONPERISHABLE
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).toBeDefined();
    expect(products.length).toBe(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const product: ProductEntity = await service.findOne(productsList[0].id);
    expect(product).toBeDefined();
    expect(product.name).toBe(productsList[0].name);
    expect(product.price).toBe(productsList[0].price);
    expect(product.type).toBe(productsList[0].type);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne(emptyId)).rejects.toHaveProperty("message", 'The product with the given id was not found');
  });

  it('create should return a new product', async () => {
    const product: ProductEntity = {
      id: "",
      name: `ProductNew ${faker.datatype.number()}`,
      price: parseInt(faker.random.numeric(5)),
      type: faker.datatype.number({ max: 100 }) > 50 ? PRODUCT_TYPE.PERISHABLE : PRODUCT_TYPE.NONPERISHABLE,
      stores:[]
    }

    const newProduct: ProductEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductEntity = await repository.findOne({where: {id: newProduct.id}})
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name)
    expect(storedProduct.price).toEqual(newProduct.price)
    expect(storedProduct.type).toEqual(newProduct.type)

  });

  it('update should modify a product', async () => {
    const product: ProductEntity = productsList[0];
    product.name = "New name";
    product.price = 5000;
    product.type =  PRODUCT_TYPE.PERISHABLE;

    const updatedProduct: ProductEntity = await service.update(product.id, product);
    expect(updatedProduct).not.toBeNull();
  
    const storedMuseum: ProductEntity = await repository.findOne({ where: { id: product.id } })
    expect(storedMuseum).not.toBeNull();
    expect(storedMuseum.name).toEqual(product.name)
    expect(storedMuseum.price).toEqual(product.price)
    expect(storedMuseum.type).toEqual(product.type)
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: ProductEntity = productsList[0];
    product = {
      ...product, name: "New name", price: 10000, type: PRODUCT_TYPE.PERISHABLE
    }
    await expect(() => service.update(emptyId, product)).rejects.toHaveProperty("message", "The product with the given id was not found")
  });

  it('delete should remove a product', async () => {
    const product: ProductEntity = productsList[0];
    await service.delete(product.id);
  
    const deletedProduct: ProductEntity = await repository.findOne({ where: { id: product.id } })
    expect(deletedProduct).toBeUndefined();
  });

  it('delete should throw an exception for an invalid product', async () => {
    await expect(() => service.delete(emptyId)).rejects.toHaveProperty("message", "The product with the given id was not found")
  });  


});
