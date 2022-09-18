import { Column, Entity, JoinTable, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { PRODUCT_TYPE } from '../producttype/producttype.enum';
import { StoreEntity } from '../store/store.entity';

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    type: String;

    @ManyToMany(() => StoreEntity, store => store.products/*, {
        onDelete: 'CASCADE'
    }*/)
    @JoinTable()
    stores: StoreEntity[];
}