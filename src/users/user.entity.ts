import { Exclude } from "class-transformer";
import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class User extends AbstractEntity {
    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    name: string;
}