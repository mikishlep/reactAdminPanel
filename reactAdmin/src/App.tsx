import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import { restoreSession } from "./store/userSlice";

import Navbar from "./components/Navbar.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Users from "./pages/Users.tsx";
import Promocodes from "./pages/Promocodes.tsx";
import AuthForm from "./pages/AuthForm.tsx";

function App() {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);

    return (
        <Router>
            {isLoggedIn ? (
                <Navbar>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/promocodes" element={<Promocodes />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </Navbar>
            ) : (
                <Routes>
                    <Route path="*" element={<AuthForm />} />
                </Routes>
            )}
        </Router>
    );
}

export default App;