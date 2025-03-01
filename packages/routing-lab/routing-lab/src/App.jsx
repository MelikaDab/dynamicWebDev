import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { Routes, Route } from "react-router";
import { useParams } from 'react-router';
import { useState } from "react";

function App() {

    const [name, setName] = useState("John Doe");

    const handleNameChane = (event) => {
        setName(event.target.value)
    }


    return(
        <Routes>
            <Route path='/' element={<Homepage username={name}/>}/>
            <Route path='/account' element={<AccountSettings username={name} handleChange={handleNameChane} />}/>
            <Route path='/images' element={<ImageGallery />}/>
            <Route path='/images/:imageId' element={<ImageDetails />}/>

            
        </Routes>
    )
}

export default App
