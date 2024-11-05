export const kyselySchema = {
  users: {
    id: 'uuid',
    name: 'text',
    username: 'text',
    password: 'text',
    roles: 'text',
    reset_token: 'text',            
    reset_token_expires: 'timestamp', 
  },
  karyawan: {
    perner: 'serial',
    nama: 'varchar',
    take_home_pay: 'numeric',
    unit: 'varchar',
    sub_unit: 'varchar',
    posisi_pekerjaan: 'varchar',
    sumber_anggaran: 'varchar',
  },
};
