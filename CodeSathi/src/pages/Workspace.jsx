import React from 'react'
import Bar2 from './component/appbar1.jsx'
import Menu from './component/menu.jsx'
import Mid from './component/codespace.jsx'
import Folder from './component/folder.jsx'
import Right from './component/right.jsx'
import { RecoilRoot } from 'recoil'


function Workspace(){

        return(
            <>
            <Bar2></Bar2>
        
     <div  style={{
            
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
                    
                       
        }}>
            <div style={{
                display:'flex',
                flexDirection:'row',
            }}>
            <Menu/>
            <Folder/>
            <Mid/>                      
             </div>
             
             <div>
                <Right/>
             </div>
                    
     </div>
            
            </>
            )

    }
export default Workspace