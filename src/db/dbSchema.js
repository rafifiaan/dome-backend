import { pgTable, serial, text, varchar, numeric, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: text('name'),
  username: text('username').unique(),
  password: text('password'),
  roles: text('roles'),
});

export const karyawan = pgTable('karyawan', {  
  perner: serial('perner').primaryKey(),  
  nama: varchar('nama'),  
  take_home_pay: numeric('take_home_pay'),  
  unit: varchar('unit'),  
  sub_unit: varchar('sub_unit'),  
  posisi_pekerjaan: varchar('posisi_pekerjaan'),  
  sumber_anggaran: varchar('sumber_anggaran'),  
}); 
