import { useState, useEffect } from 'react'
import logo from '../assets/react.svg';
import { Typography, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';

function Bar() {


    return (

        <div>

            <Bar1 logo={logo}></Bar1>
            
        </div>
    )


}


function Bar1({ logo }) {
    const [User, setUser] = useState("");

    useEffect(() => {
        setUser({
            name: "Prince",
            age: 19
        });
    }, []);
    if (!User) {
        return (


            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px",
                backgroundColor: "green",
                color: "white",

            }}>

                <div style={{
                    display: "flex",
                }} >
                    <img src={logo}></img>
                    <Typography variant="h5">Bitron</Typography>
                </div>

                <div >
                    <Button
                        variant={"text"}
                    >signin</Button>
                    <Button
                        variant={"text"}
                    >signup</Button>
                </div>
            </div>
        )
    }

    return (

        
        <div style={{
            display: "flex",
            justifyContent: "end",
            padding: "4px 10px",
            
            // padding: "5px",
            backgroundColor: "rgba(36, 4, 4, 0.9)",
            color: "white",
        }}>

            <div style={{
                display: "flex",
                position: "absolute",
                left: "12px",
            }} >
                <Typography variant="h5" textAlign={'center'} padding={'4px'}>RealSync</Typography>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                justifySelf: "flex-end",
                padding: "4px 10px",
                gap: "10px",
                fontSize: "12px",
                // marginLeft: "10px",
                // marginRight: "10px",
            }}>
                <Typography textAlign={'center'} padding={'4px'}>Home</Typography>
                <Typography textAlign={'center'} padding={'4px'}>User</Typography> 
                <Typography textAlign={'center'} padding={'4px'}>Projects</Typography>   
            </div>                           
            <div style={{
                paddingLeft: "10px",
                // paddingRight: "10px",
            }}
    >
                <IconButton onClick={() => console.log('Account clicked')}>
                    <AccountCircleIcon sx={{ color: 'white', fontSize: 30 }} />
                </IconButton>
            </div>
        </div>
    )

}


export default Bar