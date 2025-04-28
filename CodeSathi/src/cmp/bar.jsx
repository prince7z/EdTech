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
                backgroundColor: "navy",
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
            justifyContent: "space-between",
            padding: "15px",
            backgroundColor: "navy",
            color: "white",

        }}>

            <div style={{
                display: "flex",
            }} >
                <img src={logo}></img>
                <Typography variant="h5">Bitron</Typography>
            </div>

            <div >
                <IconButton onClick={() => console.log('Account clicked')}>
                    <AccountCircleIcon sx={{ color: 'white', fontSize: 30 }} />
                </IconButton>
            </div>
        </div>
    )

}


export default Bar