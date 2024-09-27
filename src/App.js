import { Outlet } from "react-router-dom";

import Header from "./components/User/Header";
import Footer from "./components/User/Footer";

import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
    return (
        <div>
            <div>
                <Header />
            </div>
            <div>
                <Outlet />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}
export default App;