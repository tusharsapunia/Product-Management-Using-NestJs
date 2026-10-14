import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AuthEntity } from './auth.entity.js';

@Entity('roles')
export class RolesPermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role_name: string;

  @Column({ type: 'jsonb', default: [] })
  permissions: string[];

  @OneToMany(() => AuthEntity, (user) => user.role)
  users: AuthEntity[];
}
