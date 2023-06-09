import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

//创建一个TypeORM的基础实体类 BaseEntity，其他的实体类可以继承
//这个类以获得基础的字段和功能，包含：创建时间、更新时间和删除时间。
@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'datetime',
    length: 0,
    nullable: false,
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    length: 0,
    nullable: false,
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    length: 0,
    nullable: false,
    name: 'deleted_at',
    comment: '删除时间',
  })
  deletedAt: Date;
}
