import { AbstractEntity } from "src/database/abstract.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Article extends AbstractEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => User, (user) => user.articles)
    @JoinColumn({ name: "user_uuid" })
    author: User;
}