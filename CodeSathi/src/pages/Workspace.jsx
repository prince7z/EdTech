import React, { useEffect } from 'react'
import Bar2 from './component/appbar1.jsx'
import Menu from './component/menu.jsx'
import Mid from './component/codespace.jsx'
import Folder from './component/folder.jsx'
import Right from './component/right.jsx'
import { RecoilRoot } from 'recoil'
import { useParams } from 'react-router-dom'

function Workspace(){
    const { roomId } = useParams();

    useEffect(() => {
        if (roomId) {
            // If we have a roomId in the URL, we're joining an existing room
            console.log('Joining room:', roomId);
            // You can add logic here to handle joining the room
        }
    }, [roomId]);

    return(
        <>
        <Bar2></Bar2>
    
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        }}>
            <div style={{
                display:'flex',
                flexDirection:'row',
            }}>
                <Menu roomId={roomId} />
                <Folder/>
                <Mid/>                      
            </div>
            
            <Right/>
        </div>
        </>
    )
}

export default Workspace