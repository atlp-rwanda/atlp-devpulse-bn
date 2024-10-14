import { jobModels } from "../models/jobModels";
import { ProgramModel } from "../models/programModel";
import { cohortModels } from "../models/cohortModel";
import  applicationCycle  from "../models/applicationCycle";

const seedJobs = async () => {
    const program = await ProgramModel.findOne();
    const cohort = await cohortModels.findOne();
    const cycle = await applicationCycle.findOne();

    if(!program || !cohort || !cycle){
        return;
    }

    const jobs = [
        {
            title: 'Senior Software Engineer',
            program: program._id,
            cohort: cohort._id,
            cycle: cycle._id,
            link: 'https://www.linkedin.com/jobs/view/senior-software-engineer-nodejs-mongodb-5f999c06282d9c1811789615/',
            description: 'You will be working on cutting-edge software solutions that enhance the productivity and efficiency of our clients.',
            label: 'public'
        },
        {
            title: 'Senior Frontend Developer',
            program: program._id,
            cohort: cohort._id,
            cycle: cycle._id,
            link: 'https://www.linkedin.com/jobs/view/senior-frontend-developer-react-nodejs-5f999c06282d9c1811789615/',
            description: 'This role requires a strong background in React, Node.js, and software development best practices.',
            label: 'public'
        },
        {
            title: 'Senior Backend Developer',
            program: program._id,
            cohort: cohort._id,
            cycle: cycle._id,
            link: 'https://www.linkedin.com/jobs/view/senior-backend-developer-python-django-5f999c06282d9c1811789615/',
            description: ' This role requires a strong background in Python, Django, and software development best practices.',
            label: 'public'
        }

    ]

    await jobModels.deleteMany({jobs});
    await jobModels.insertMany(jobs);
    return null;
}

export default seedJobs;