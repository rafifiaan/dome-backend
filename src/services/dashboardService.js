import { kyselyDb } from '../db/connection';
// import { users } from '../db/dbSchema';

export const getDashboardSummary = async () => {
    try {
        const result = await kyselyDb.selectFrom('users').selectAll().execute();
        const simplifiedResult = result.map(item => ({
            id: item.id,
            name: item.name,
            value: item.value
        }));
        return simplifiedResult;
    } catch (error) {
        console.error('Error fetching dashboard summary:', error.message);
        throw new Error('Error fetching dashboard summary');
    }
};
