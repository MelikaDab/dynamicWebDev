import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { Routes, Route } from "react-router";

function App() {
    // const POSSIBLE_PAGES = [
    //     <Homepage userName="John Doe" />,
    //     <AccountSettings />,
    //     <ImageGallery />,
    //     <ImageDetails imageId="0" />
    // ]

    // return POSSIBLE_PAGES[0];
    return(
        <Routes>
            <Route path='/' element={<Homepage username="John Doe" />}/>
            <Route path='/account' element={<AccountSettings />}/>
            <Route path='/images' element={<ImageGallery />}/>
            {/* <Route path='/' element={<ImageDetails imageId="0" />}/> */}

            
        </Routes>
    )
}

export default App
