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
    // Remove any markdown-style asterisks
    const cleanedText = text.replace(/\*\*/g, '').replace(/\*/g, '');

    // Split text into lines, trim each, and filter out any empty lines
    const formattedText = cleanedText
        .split(/\n/g)
        .map(line => line.trim())
        .filter(line => line !== "")  // Remove empty lines
        .map((line, index, array) => {
            // Check if the line is a heading based on formatting rules
            const isHeading = line.endsWith(":") || 
                (index < array.length - 1 && array[index + 1].trim() !== "" && !array[index + 1].endsWith(":"));
            
            const isNumberedItem = /^\d+\.\s/.test(line); // Check if the line is a numbered item

            // Format each line: bold for headings, indent content, and extra spacing for numbered items
            const content = isHeading
                ? `<div style="margin-top: 1em; font-weight: bold;">${line}</div>`
                : `<div style="margin-left: 1em;">${line}</div>`;

            // Add spacing before numbered items without adding bullets to empty lines
            return isNumberedItem 
                ? `<div style="margin-top: 1em;"></div>${content}`
                : content;
        })
        .join("");  // Combine all formatted items into a single string

    return formattedText;
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
