import { applicationCycle } from '../models/applicationCycle.js';

const seedApplicationCycle = async () => {


	const application = [
		{
			name: 'Cycle 1',
			startDate: '10 dec 2020',
			endDate: '21 oct 2098',
		},
		{
			name: 'Cycle 2',
			startDate: '01 jan 2023',
			endDate: '30 jun 3042',
			
		},
	];
	await applicationCycle.deleteMany({});
	await applicationCycle.insertMany(application);
	return null;
};
export default seedApplicationCycle;
