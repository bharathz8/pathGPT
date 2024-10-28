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
    const [formData, setFormData] = useState({
        desiredSkills: '',
        education: '',
        technologies: '',
        codingLevel: '',
        otherProjects: '',
    });

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
        setInput("");
        setRecentPrompt("");
        setPrevPrompt([]);
        setFormData({  // Reset form data as well
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
        setResultData("");  // Reset result data

        try {
            const { desiredSkills, education, technologies, codingLevel, otherProjects } = formData;

            const prompt = {
                education,
                technologies,
                level: codingLevel,
                projects: otherProjects,
                firstCourse: desiredSkills
            };

            const { decision, courseDisplay, project } = await run(prompt);

            setRecentPrompt(input);
            setPrevPrompt(prev => [...prev, input]);

            // Format and display results
            let response = `**Career Suggestion:** ${decision} **Courses:** ${courseDisplay} **Projects:** ${project}`;
            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let newResponse2 = newResponse.split("*").join("</br>");
            let newResponseArray = newResponse2.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
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
        setFormData
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};
