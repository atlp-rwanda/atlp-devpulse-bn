import { ProgramModel } from "../models/programModel";

const seedPrograms = async () => {
    const programs = [
        {
            title: "Web Development",
            description: "Learn to build websites using HTML, CSS, and JavaScript",
            duration: "6 months",
            deleted_at: false,
            mainObjective: "Create responsive and engaging websites",
            requirements: ["Basic Computer Skills"],
            modeOfExecution: "Online"
        },
        {
            title: "Mobile Application",
            description: "Learn to develop mobile applications using Java or Kotlin",
            duration: "4 months",
            deleted_at: false,
            mainObjective: "Create cross-platform applications for Android and iOS",
            requirements: ["Basic Computer Skills", "Java or Kotlin"],
            modeOfExecution: "Hybrid"
        }
    ]
    await ProgramModel.deleteMany({programs})
    await ProgramModel.insertMany(programs)
    return null;
}

export default seedPrograms;