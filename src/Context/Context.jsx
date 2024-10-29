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
        // Step 1: Format bold text with '**'
        let formattedText = text
            .split("**")
            .map((segment, index) => (index % 2 === 1 ? `<b>${segment}</b>` : segment))
            .join("");

        // Step 2: Break the text into bullet points for each point (assuming "\n", "1.", "-", etc.)
        formattedText = formattedText
            .split(/(?:\d\.\s|- )|\n/g)  // Splits on '1. ', '- ', or '\n' to capture points
            .filter(point => point.trim() !== "")  // Remove empty segments
            .map(point => `<li>${point.trim()}</li>`)  // Wrap each point in <li> tags
            .join("");  // Join the list items as a single string

        return `<ul>${formattedText}</ul>`;  // Wrap all list items in <ul> tags
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
            setDecision(formatResponse(responseDecision));
            setCourses(formatResponse(courseDisplay));
            setProjects(formatResponse(project));

            setRecentPrompt(input);
            setPrevPrompt(prev => [...prev, input]);

        } catch (error) {
            console.error("Error fetching response:", error);
            setResultData("An error occurred. Please try again.");
        } finally {
            setLoading(false);
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
