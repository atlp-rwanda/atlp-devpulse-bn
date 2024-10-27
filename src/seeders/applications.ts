import { applicant_records } from '../models/candidateApplication';
import { formModel } from '../models/formsModel';
import { jobModels } from '../models/jobModels';
import { ProgramModel } from '../models/programModel';
import { cohortModels } from '../models/cohortModel';
import { applicationCycle } from '../models/applicationCycle';

const seedApplications = async () => {
  const program = await ProgramModel.findOne();
  const cohort = await cohortModels.findOne();
  const cycle = await applicationCycle.findOne();
  const jobPostRecords = await jobModels.find();

  if (!program || !cohort || !cycle || jobPostRecords.length < 2) {
    return;
  }

  const forms = [
    {
      title: 'Software Engineer Application',
      description: 'Form for applying to Software Engineer position.',
      jobpost: jobPostRecords[0]._id,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSezLekXcCODUmxadn2rqNSU_izVpLGLXS7SW02-_tXoq4wgOA/viewform?usp=sf_link",
      spreadsheetlink: 'https://docs.google.com/spreadsheets/d/1j_97nSDE2LtdLOlkXWAwKlQ0KsO9NMvqenYRRdNPAhQ/edit?usp=sharing',
    },
    {
      title: 'Frontend Developer Application',
      description: 'Form for applying to Frontend Developer position.',
      jobpost: jobPostRecords[1]._id,
      link: "https://docs.google.com/forms/d/e/1FAIpQLSezLekXcCODUmxadn2rqNSU_izVpLGLXS7SW02-_tXoq4wgOA/viewform?usp=sf_link",
      spreadsheetlink: 'https://docs.google.com/spreadsheets/d/1j_97nSDE2LtdLOlkXWAwKlQ0KsO9NMvqenYRRdNPAhQ/edit?usp=sharing',
    },
  ];

  await formModel.deleteMany({});
  const formRecords = await formModel.insertMany(forms);

  const applicants = [
    {
      firstName: 'NGENDAHIMANA',
      lastName: 'Fidele',
      email: 'fidnge@msn.com',
      telephone: '+2507801234569',
      availability_for_interview: 'Friday, 9:30 - 10:00 PM',
      gender: 'Male',
      resume: 'https://example.com/resume/ngendahimana.pdf',
      comments: 'Looking forward to the interview.',
      address: '456 KG, Kigali, Rwanda',
      status: 'submitted',
      formUrl: formRecords[0].link, 
      dateOfSubmission: '2024-10-05',
    },
    {
      firstName: 'UWIMANA',
      lastName: 'Aisha',
      email: 'uwimana@gmail.com',
      telephone: '+2507809876543',
      availability_for_interview: 'Monday, 10:00 - 10:30 AM',
      gender: 'Female',
      resume: 'https://example.com/resume/uwimana.pdf',
      comments: 'I am excited about this opportunity.',
      address: '789 KG, Kigali, Rwanda',
      status: 'submitted',
      formUrl: formRecords[1].link, 
      dateOfSubmission: '2024-10-06',
    },
    {
      firstName: 'KAMI',
      lastName: 'David',
      email: 'davidk@yahoo.com',
      telephone: '+2507898765432',
      availability_for_interview: 'Wednesday, 2:00 - 2:30 PM',
      gender: 'Male',
      resume: 'https://example.com/resume/kagame.pdf',
      comments: 'I have experience in full-stack development.',
      address: '123 KN, Kigali, Rwanda',
      status: 'submitted',
      formUrl: formRecords[0].link,
      dateOfSubmission: '2024-10-07',
    },
    {
      firstName: 'MUKARUGWIZA',
      lastName: 'Marie',
      email: 'marie.m@gmail.com',
      telephone: '+2507823456789',
      availability_for_interview: 'Thursday, 1:00 - 1:30 PM',
      gender: 'Female',
      resume: 'https://example.com/resume/mukarugwiza.pdf',
      comments: 'Eager to contribute to this project.',
      address: '234 KG, Kigali, Rwanda',
      status: 'submitted',
      formUrl: formRecords[1].link, 
      dateOfSubmission: '2024-10-08',
    }
  ];

  await applicant_records.deleteMany({});
  await applicant_records.insertMany(applicants);

  console.log('Database seeded successfully');
};

export default seedApplications;
