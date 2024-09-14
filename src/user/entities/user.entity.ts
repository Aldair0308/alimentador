import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsEmail } from "class-validator";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column({ unique: true, nullable: false })
    @IsNotEmpty()
    @IsEmail()
    email: string; 

    @Column({ nullable: false })
    @IsNotEmpty()
    password: string;

    @Column({ default: 'photo_user.jpg' })
    photo: string; 

    @Column({ default: 'user' })
    rol: string;
}