import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username", data.username || form.username);
                navigate("/home");
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch {
            setError("Cannot connect to server. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth__page">
            <div className="auth__bg-overlay" />
            <div className="auth__container">
                <div className="auth__logo">🎬 CineVault</div>
                <div className="auth__card">
                    <h1 className="auth__title">Sign In</h1>
                    <p className="auth__subtitle">Welcome back! Enter your credentials.</p>

                    <form className="auth__form" onSubmit={handleSubmit}>
                        <div className="auth__field">
                            <label htmlFor="login-username">Username</label>
                            <input
                                id="login-username"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                        </div>
                        <div className="auth__field">
                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </div>

                        {error && <div className="auth__error">{error}</div>}

                        <button
                            id="login-submit-btn"
                            type="submit"
                            className="auth__btn"
                            disabled={loading}
                        >
                            {loading ? <span className="auth__spinner" /> : "Sign In"}
                        </button>
                    </form>

                    <p className="auth__switch">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" id="go-to-register">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
