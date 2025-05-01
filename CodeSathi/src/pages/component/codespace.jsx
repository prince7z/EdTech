import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaTimes } from 'react-icons/fa';



function    Mid(){

    return(
        <>
        <div style={{
            // width: '100%',
            display: 'flex',
            flexDirection: 'column',
            // backgroundColor: 'green',
            // border: '1px solid rgb(245, 241, 241)',
            // minWidth: '55vw'  // Add minimum width
        }}>
        <Bar/>
        <Codespace/>
        <Output/>
        </div>
        </>
    )

}

function Bar(){
    const[files, setFiles] = useState([
        { name: 'codespace.jsx'},
        { name: 'app.jsx'    },
    ])
    return(
        <>
        <div style={{
                backgroundColor: '#252526',
                width: '65vw',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                padding: '4px 8px',
                backgroundColor: 'green',

                borderBottom: '1px solid #3c3c3c',

            }}>
                <div style={{
                    backgroundColor: '#1e1e1e',
                    padding: '5px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#007acc',
                    borderBottom: '2px solid rgb(231, 231, 9)'
                }}>
                    <span style={{ color: '#cccccc' }}>codespace.jsx</span>
                    <FaTimes style={{ 
                        cursor: 'pointer', 
                        color: '#cccccc',
                        fontSize: '6px' 
                    }} />
                </div>
            </div>
        </>
    )

}


function Output(){
    const [output,setoutput]=useState("output will be here");

    return(
        <>
         <div style={{
                    backgroundColor: 'red',
                    color: '#ffffff',
                    padding: '10px',
                    boxSizing: 'border-box',
                    width: '65vw',
                    height: '16.5vh',
                    borderTop: '1px solid #3c3c3c',
                    fontFamily: 'Consolas, monospace',
                    overflow: 'scroll',
                    scrollbarWidth: 'none',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: '1px solid #3c3c3c',
                        padding: '5px 0'
                    }}>
                        <span style={{ color: '#cccccc' }}>Output</span>
                    </div>
                    <pre style={{ margin: '10px 0' }}>
                        {output}
                         Program output will appear here...
                    </pre>
                </div>
        </>
    )
        
    
}



function Codespace() {
    const [code, setCode] = useState('//write code here');
    
    
    const handleEditorChange = (value) => {
        setCode(value);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCode((prevCode) => prevCode + 'bckshg');
            console.log(code);
        }, 2000);
        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [code]);

    return (
        
        
        
            
            <div style={{
                width: '65vw',
                height: '64.4vh',
                position: 'relative',
                zIndex: 2,
                // border: '0.5px solid rgb(238, 229, 229)',
            }}>
                <Editor
                    height="100%"
                    width="65vw"  // Add explicit width
                    defaultLanguage="javascript"
                    defaultValue={code}
                    theme="vs-dark"
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        lineNumbers: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                />
               
            </div>
        
        
    );
}

export default Mid;
