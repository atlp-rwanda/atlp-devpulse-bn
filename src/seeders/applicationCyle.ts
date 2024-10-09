import { applicationCycle } from '../models/applicationCycle';

const seedApplicationCycle = async () => {


	const application = [
		{
			name: 'Cycle 1',
			startDate: '2023-11-15',
			endDate: '2024-04-01',
		},
		{
			name: 'Cycle 2',
			startDate: '2024-02-02',
			endDate: '2024-12-02',

		},
	];
	await applicationCycle.deleteMany({application});
	await applicationCycle.insertMany(application);
	return null;
};
export default seedApplicationCycle;