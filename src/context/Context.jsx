import { createContext, useState } from "react";
import runChat from "../conflict/Gmni";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prePrompt, setPrePrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultdata, setResultdata] = useState("");

    const delaypara =(index, nextWord)=>{
        setTimeout(function(){
            setResultdata(prev=>prev+nextWord)
        }, 75*index
    )
    }

    const newchat = ()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) =>{

        setResultdata('')
        setLoading(true)
        setShowResult(true)
        // setRecentPrompt(input)
        // setPrePrompt(prev=>[...prev,input])
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt)  
            setRecentPrompt(prompt)
        }
        else{
            setPrePrompt(prev=>[...prev, input])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        
        let responseArray = response.split("**");
        let newResponse="";
        for(let i =0; i <responseArray.length; i++){
            if(i === 0 || i%2 !== 1){
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")

        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length;i++){

            const nextWord = newResponseArray[i];
            delaypara(i, nextWord+" ");
        }


        setResultdata(newResponse2)
        setLoading(false)
        setInput("")
    }

    // onSent("What is react js")

    const contextValue = {
        prePrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultdata,
        setInput,
        newchat


    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider