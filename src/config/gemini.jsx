import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";

  
  const apiKey = import.meta.env.VITE_GEN_AI_API_KEY; // Ensure this is set in your environment
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.0-pro	",
    generationConfig,
  });
  
  export async function run({ education, technologies, level, projects, firstCourse }) {
    try {
      // Log inputs for debugging
      console.log("Inputs for career suggestion:", { education, technologies, level, projects, firstCourse });
  
      // Career suggestion
      const prompt = `Education: ${education}, skills: ${technologies}, Level: ${level}, Projects_done: ${projects}. Based on my education, skills, and level, which career should I opt for ${firstCourse}? Just tell me one branch in one word.`;
      console.log("Prompt for career suggestion:", prompt);
  
      // Ensure the call to generateContent has the correct structure
      const result = await model.generateContent(prompt);
  
      if (!result || typeof result.response.text() !== "string") {
        throw new Error("Invalid response from model for career suggestion");
      }
  
      const decision = result.response.text().trim() || "Unable to determine";
  
      // Best courses
      const prompt_2 = `can you give a roadmap to learn and master ${decision} , the roadmap should contain concepts to be learned and within how much hour or weeks it should me completed and give in 5 points descriptivily   `;
      console.log("Prompt for courses:", prompt_2);
  
      const result_2 = await model.generateContent(prompt_2);
  
      if (!result_2 || typeof result_2.response.text() !== "string") {
        throw new Error("Invalid response from model for courses");
      }
  
      const courseDisplay = result_2.response.text().trim() || "No courses found";
  
      //Trending projects
      const prompt_3 = `For a ${decision} career, suggest 5 trending projects to build my skills at ${level} level,i need it in 5 points .`;
      console.log("Prompt for projects:", prompt_3);
  
      const result_3 = await model.generateContent(prompt_3);
  
      if (!result_3 || typeof result_3.response.text() !== "string") {
        throw new Error("Invalid response from model for projects");
      }
  
      const project = result_3.response.text().trim() || "No projects available";
  
      return { decision, courseDisplay, project };
    } catch (error) {
      console.error("Error generating content:", error);
      return {
        decision: "Error",
        courseDisplay: "Error fetching courses",
        project: "Error fetching projects",
      };
    }
  }
  
  export default run;