import { kyselyDb } from '../db/connection';
// import { karyawan } from '../db/dbSchema';
 
export const getAllKaryawan = async () => {  
    try {  
        const karyawanList = await kyselyDb  
            .selectFrom('karyawan')   
            .select(['perner', 'nama', 'take_home_pay', 'unit', 'sub_unit', 'posisi_pekerjaan', 'sumber_anggaran'])  
            .execute();  

        return karyawanList;  
    } catch (error) {  
        console.error('Error fetching karyawan:', error);  
        throw new Error('Failed to fetch karyawan data');  
    }  
};  // tes

export const getKaryawanById = async (perner) => {
    try {
        const karyawan = await kyselyDb
            .selectFrom('karyawan')
            .select([
                'perner', 
                'nama', 
                'jenis_kelamin', 
                'status_pernikahan', 
                'jumlah_anak', 
                'posisi_pekerjaan', 
                'kategori_posisi', 
                'unit', 
                'sub_unit', 
                'kota', 
                'nik_atasan', 
                'nama_atasan', 
                'sumber_anggaran', 
                'skema_umk', 
                'gaji_pokok', 
                'tunjangan_operasional', 
                'pph_21', 
                'take_home_pay', 
                'tunjangan_hari_raya', 
                'gaji_kotor', 
                'pajak_penghasilan', 
                'thp_gross_pph_21', 
                'uang_kehadiran', 
                'bpjs_ketenagakerjaan', 
                'bpjs_kesehatan', 
                'perlindungan_asuransi', 
                'tunjangan_ekstra', 
                'invoice_bulanan', 
                'invoice_kontrak', 
                'tunjangan_lainnya', 
                'created_at'
            ])
            .where('perner', '=', perner)
            .executeTakeFirst(); 
        
        if (!karyawan) {
            throw new Error(`Karyawan with perner ${perner} not found`);
        }

        return karyawan;
    } catch (error) {
        console.error(`Error fetching karyawan with perner ${perner}:`, error);
        throw new Error('Failed to fetch karyawan data');
    }
};