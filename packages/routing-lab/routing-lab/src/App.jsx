import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { Routes, Route } from "react-router";
import { useState } from "react";
import { MainLayout } from "./MainLayout.jsx";
import { useImageFetching } from "./images/useImageFetching.js";
import { RegisterPage } from "./auth/RegisterPage.jsx";
import { LoginPage } from "./auth/LoginPage.jsx";

function App() {
    
    const { isLoading, fetchedImages } = useImageFetching("");
    const [authToken, setAuthToken] = useState("");
    const [name, setName] = useState("John Doe");

    const handleNameChane = (event) => {
        setName(event.target.value)
    }


    return(
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Homepage username={name}/>}/>
                <Route path='/account' element={<AccountSettings username={name} handleChange={handleNameChane} />}/>
                <Route path='/images' element={<ImageGallery isLoading={isLoading} fetchedImages={fetchedImages}/>}/>
                <Route path='/images/:imageId' element={<ImageDetails />}/>
                <Route path="/register" element={<RegisterPage setToken={setAuthToken} />}/>
                <Route path="/login" element={<LoginPage setToken={setAuthToken}/>}/>
            </Route>
            
        </Routes>
    )
}

export default App
