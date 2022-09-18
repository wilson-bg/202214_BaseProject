import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductDTO } from './product.dto';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async findAll() {
      return await this.productService.findAll();
    }

    @Get(':productId')
    async findOne(@Param('productId') productId: string) {
      return await this.productService.findOne(productId);
    }

    @Post()
    async create(@Body() productDto: ProductDTO) {
      const product: ProductEntity = plainToInstance(ProductEntity, productDto);
      return await this.productService.create(product);
    }

    @Put(':productId')
    async update(@Param('productId') productId: string, @Body() productDto: ProductDTO) {
      const product: ProductEntity = plainToInstance(ProductEntity, productDto);
      return await this.productService.update(productId, product);
    }
  
    @Delete(':productId')
    @HttpCode(204)
    async delete(@Param('productId') productId: string) {
      return await this.productService.delete(productId);
    }

}
