import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProductService } from './store-product.service';
import { StoreProductController } from './store-product.controller';
import { ProductEntity } from 'src/product/product.entity';
import { StoreEntity } from 'src/store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, StoreEntity])],
  controllers: [StoreProductController],
  providers: [StoreProductService]
})
export class StoreProductModule {}
