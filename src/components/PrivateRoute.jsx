import { Navigate } from "react-router-dom";

/**
 * Wraps a route so it is only accessible when the user is logged in.
 * If not logged in, redirects to /login.
 */
function PrivateRoute({ children }) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
