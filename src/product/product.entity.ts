import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { PRODUCT_TYPE } from 'src/producttype/producttype.enum';
import { StoreEntity } from 'src/store/store.entity';

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    type: PRODUCT_TYPE;

    @ManyToMany(() => StoreEntity, store => store.products, {
        onDelete: 'CASCADE'
    })
    store: StoreEntity;
}