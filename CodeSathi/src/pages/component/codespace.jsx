import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaTimes } from 'react-icons/fa';



function    Mid(){

    return(
        <>
        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            
            minWidth: '800px'  // Add minimum width
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
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderBottom: '1px solid #3c3c3c'
            }}>
                <div style={{
                    backgroundColor: '#1e1e1e',
                    padding: '5px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderBottom: '2px solid #007acc'
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
                    backgroundColor: '#1e1e1e',
                    color: '#ffffff',
                    padding: '10px',
                    height: '190px',
                    borderTop: '1px solid #3c3c3c',
                    fontFamily: 'Consolas, monospace',
                    overflow: 'auto'
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

    return (
        
        
        
            
            <div style={{
                width: '100%',
                height: '70vh',
            }}>
                <Editor
                    height="100%"
                    width="100%"  // Add explicit width
                    defaultLanguage="javascript"
                    defaultValue={code}
                    theme="hc-black"
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
