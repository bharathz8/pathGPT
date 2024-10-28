import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = `AIzaSyCqx57a5X9zJ-G7GFpS1d6lGDBxk50qRtU`; // Ensure this is set in your environment
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function run({ education, technologies, level, projects, firstCourse }) {
    try {
        // Log inputs for debugging
        console.log("Inputs for career suggestion:", { education, technologies, level, projects, firstCourse });

        // Career suggestion
        const prompt = `Education: ${education}, skills: ${technologies}, Level: ${level}, Projects_done: ${projects}. Based on my education, skills, and level, which career should I opt for ${firstCourse}? Just tell me one branch in one word.`;
        console.log("Prompt for career suggestion:", prompt);
        
        // Ensure the call to generateContent has the correct structure
        const result = await model.generateContent({ 
            prompt, 
            generationConfig 
        });

        if (!result || typeof result.text !== 'string') {
            throw new Error("Invalid response from model for career suggestion");
        }

        const decision = result.text.trim() || "Unable to determine";

        // Best courses
        const prompt_2 = `${decision} was suggested by a friend. Give me the 5 best free courses with links to master this field, ordered from beginner to advanced. Only list 5 links, no description.`;
        console.log("Prompt for courses:", prompt_2);
        
        const result_2 = await model.generateContent({ 
            prompt: prompt_2, 
            generationConfig 
        });

        if (!result_2 || typeof result_2.text !== 'string') {
            throw new Error("Invalid response from model for courses");
        }

        const courseDisplay = result_2.text.trim() || "No courses found";

        // Trending projects
        const prompt_3 = `For a ${decision} career, suggest 5 trending projects to build my skills at ${level} level.`;
        console.log("Prompt for projects:", prompt_3);
        
        const result_3 = await model.generateContent({ 
            prompt: prompt_3, 
            generationConfig 
        });

        if (!result_3 || typeof result_3.text !== 'string') {
            throw new Error("Invalid response from model for projects");
        }

        const project = result_3.text.trim() || "No projects available";

        return { decision, courseDisplay, project };
    } catch (error) {
        console.error("Error generating content:", error);
        return { decision: "Error", courseDisplay: "Error fetching courses", project: "Error fetching projects" };
    }
}

export default run;