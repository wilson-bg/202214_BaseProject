import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreService } from './store.service';
import { StoreEntity } from './store.entity';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storesList: StoreEntity[];
  const emptyId = '00000000-0000-0000-0000-000000000000';
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    storesList = [];
    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.company.name(),
        city: 'BOG',
        address: faker.address.direction()
      });
      storesList.push(store);
    }
  };
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const stores: StoreEntity[] = await service.findAll();
    expect(stores).toBeDefined();
    expect(stores.length).toBe(storesList.length);
  });

  it('findOne should return a store by id', async () => {
    const store: StoreEntity = await service.findOne(storesList[0].id);
    expect(store).toBeDefined();
    expect(store.name).toBe(storesList[0].name);
    expect(store.city).toBe(storesList[0].city);
    expect(store.address).toBe(storesList[0].address);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne(emptyId)).rejects.toHaveProperty("message", 'The store with the given id was not found');
  });

  it('create should return a new store', async () => {
    const store: StoreEntity = {
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: 'BOG',
      address: faker.address.direction(),
      products:[]
    }

    const newStore: StoreEntity = await service.create(store);
    expect(newStore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({where: {id: newStore.id}})
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(newStore.name)
    expect(storedStore.city).toEqual(newStore.city)
    expect(storedStore.address).toEqual(newStore.address)

  });

  it('create should throw an exception for an invalid city', async () => {
    const store: StoreEntity = {
      id: faker.datatype.uuid(),
      name: faker.company.name(),
      city: 'Bogota',
      address: faker.address.direction(),
      products:[]
    }
    await expect(() => service.create(store)).rejects.toHaveProperty("message", "The city is invalid")

  });

  it('update should modify a store', async () => {
    const store: StoreEntity = storesList[0];
    store.name = "Evergreen";
    store.city = "BOG";
    store.address = "742 Evergreen Terrace";

    const updatedStore: StoreEntity = await service.update(store.id, store);
    expect(updatedStore).not.toBeNull();
  
    const storedStore: StoreEntity = await repository.findOne({ where: { id: store.id } })
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(updatedStore.name)
    expect(storedStore.city).toEqual(updatedStore.city)
    expect(storedStore.address).toEqual(updatedStore.address)
  });

  it('update should throw an exception for an invalid store', async () => {
    let store: StoreEntity = storesList[0];
    store = {
      ...store, name: "Evergreen", city: " Springfield", address: "742 Evergreen Terrace"
    }
    await expect(() => service.update(emptyId, store)).rejects.toHaveProperty("message", "The store with the given id was not found")
  });

  it('delete should remove a store', async () => {
    const store: StoreEntity = storesList[0];
    await service.delete(store.id);
  
    const deletedStore: StoreEntity = await repository.findOne({ where: { id: store.id } })
    expect(deletedStore).toBeUndefined();
  });

  it('delete should throw an exception for an invalid store', async () => {
    await expect(() => service.delete(emptyId)).rejects.toHaveProperty("message", "The store with the given id was not found")
  });  
  
});
