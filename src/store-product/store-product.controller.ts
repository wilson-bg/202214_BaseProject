import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { StoreDTO } from '../store/store.dto';
import { StoreEntity } from '../store//store.entity';
import { StoreProductService } from './store-product.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class StoreProductController {
    constructor(private readonly storeProductService: StoreProductService){}

    @Post(':productId/stores/:storeId')
    @HttpCode(200)
    async addArtworkMuseum(@Param('productId') productId: string, @Param('storeId') storeId: string){
        const product = await this.storeProductService.addStoreToProduct(storeId, productId);
        return plainToInstance(StoreDTO, product);
    }

    @Get(':productId/stores')
    async findStoresFromProduct(@Param('productId') productId: string){
        return await this.storeProductService.findStoresFromProduct(productId);
    }
  
    @Get(':productId/stores/:storeId')
    async findStoreFromProduct(@Param('productId') productId: string, @Param('storeId') storeId: string){
        return await this.storeProductService.findStoreFromProduct(storeId,productId);
    }

    @Put(':productId/stores')
    async updateStoresFromProduct(@Param('productId') productId: string, @Body() storesDto: StoreDTO[]) {
        const stores = plainToInstance(StoreEntity, storesDto);
        return await this.storeProductService.updateStoresFromProduct(productId, stores);
    }
  
    @Delete(':productId/stores/:storeId')
    @HttpCode(204)
    async deleteStoreFromProduct(@Param('productId') productId: string, @Param('storeId') storeId: string){
        return await this.storeProductService.deleteStoreFromProduct(storeId, productId);
    }

}
