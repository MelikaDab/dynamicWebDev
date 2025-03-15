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
import { ProtectedRoute } from "./auth/ProtectedRoute.jsx";

function App() {
    
    const [authToken, setAuthToken] = useState("");
    const { isLoading, fetchedImages } = useImageFetching({authToken});
    const [name, setName] = useState("John Doe");

    const handleNameChane = (event) => {
        setName(event.target.value)
    }


    return(
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<ProtectedRoute authToken={authToken} ><Homepage username={name}/></ProtectedRoute>}/>
                <Route path='/account' element={<ProtectedRoute authToken={authToken} ><AccountSettings username={name} handleChange={handleNameChane} /></ProtectedRoute>}/>
                <Route path='/images'
                 element={
                //  <ProtectedRoute authToken={authToken}>
                    <ImageGallery authToken={authToken} isLoading={isLoading} fetchedImages={fetchedImages}/>
                // </ProtectedRoute>
            }/>
                <Route path='/images/:imageId' element={<ProtectedRoute authToken={authToken}><ImageDetails /></ProtectedRoute>}/>
                <Route path="/register" element={<RegisterPage setToken={setAuthToken} />}/>
                <Route path="/login" element={<LoginPage setToken={setAuthToken}/>}/>
            </Route>
            
        </Routes>
    )
}

export default App
