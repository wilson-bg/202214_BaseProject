import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-error';
import { StoreDTO } from './store.dto';
import { StoreEntity } from './store.entity';

@Injectable()
export class StoreService {

    constructor(
        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>
    ) {}


    async findAll(): Promise<StoreEntity[]> {
        return await this.storeRepository.find({ relations: ["products"] });
    }

    async findOne(id: string): Promise<StoreEntity> {
        const store = await this.storeRepository.findOne(id, { relations: ["products"] });
        if (!store)
            throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)
        else
            return store;
    }   

    async create(store: StoreEntity): Promise<StoreEntity> {
        /*const store = new StoreEntity();
        store.name = storeDTO.name;
        store.city = storeDTO.city;
        store.address = storeDTO.address;*/
        return await this.storeRepository.save(store);
    }

    async update(id: string, store: StoreEntity): Promise<StoreEntity> {
        const persistedStore = await this.storeRepository.findOne(id);
        if (!persistedStore)
          throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)
        
        /*persistedStore.name = store.name;
        persistedStore.city = store.city;
        persistedStore.address = store.address;
        await this.storeRepository.save(persistedStore);
        return persistedStore;*/
        return await this.storeRepository.save({...persistedStore, ...store});
    }

    async delete(id: string) {
        const store = await this.storeRepository.findOne(id);
        if (!store)
          throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)
        else {
          return await this.storeRepository.remove(store);
        }
    }

}

