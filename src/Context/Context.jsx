import { createContext, useState } from "react";
import { run } from "../config/gemini";

export const Context = createContext();

export const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [decision, setDecision] = useState("");
    const [courses, setCourses] = useState("");
    const [projects, setProjects] = useState("");
    const [formData, setFormData] = useState({
        desiredSkills: '',
        education: '',
        technologies: '',
        codingLevel: '',
        otherProjects: ''
    });

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const formatResponse = (text) => {
        // Step 1: Apply bold to sections between '**'
        let formattedText = text
            .split("**")
            .map((segment, index) => (index % 2 === 1 ? `<b>${segment}</b>` : segment))
            .join("");
    
        // Step 2: Break text into lines and only add bullets to non-empty lines
        const listItems = formattedText
            .split(/(?:\d\.\s|- )|\n/g)  // Split on '1. ', '- ', or '\n'
            .map(point => point.trim())  // Trim whitespace from each line
            .filter(point => point !== "")  // Remove empty lines
            .map(point => `<li>${point}</li>`)  // Wrap each non-empty line in <li> tags
            .join("");  // Join all <li> items as a single string
    
        // Wrap in <ul> tags only if there are list items
        return listItems ? `<ul>${listItems}</ul>` : "";  
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setDecision("");
        setCourses("");
        setProjects("");
        setInput("");
        setRecentPrompt("");
        setPrevPrompt([]);
        setFormData({
            desiredSkills: '',
            education: '',
            technologies: '',
            codingLevel: '',
            otherProjects: '',
        });
    };

    const onSent = async () => {
        setLoading(true);
        setShowResult(true);
        setResultData("");
        setDecision("");
        setCourses("");
        setProjects("");
    
        try {
            const { desiredSkills, education, technologies, codingLevel, otherProjects } = formData;
    
            const prompt = {
                education,
                technologies,
                level: codingLevel,
                projects: otherProjects,
                firstCourse: desiredSkills
            };
    
            const { decision: responseDecision, courseDisplay, project } = await run(prompt);
    
            // Format each part for bolding and structured bullet points
            setDecision(formatResponse(responseDecision || "No decision available."));
            setCourses(formatResponse(courseDisplay || "No courses available."));
            setProjects(formatResponse(project || "No projects available."));
    
            setRecentPrompt(input);
            setPrevPrompt(prev => [...prev, input]);
    
        } catch (error) {
            console.error("Error fetching response:", error);
            setResultData("An error occurred. Please try again.");
        } finally {
            setLoading(false);  // Ensures loading stops regardless of success or error
            setInput("");
        }
    };

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        formData,
        setFormData,
        decision,
        courses,
        projects
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};
