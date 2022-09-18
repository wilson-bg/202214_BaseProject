import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ProductEntity } from '../product/product.entity';

@Entity()
export class StoreEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    city: string;

    @Column()
    address: string;

    @ManyToMany(() => ProductEntity, producto => producto.stores)
    products: ProductEntity[];
}