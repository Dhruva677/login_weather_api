import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.password || !form.email || !form.phone) {
            setError("All fields are required.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Account created! Redirecting to login…");
                setTimeout(() => navigate("/login"), 1800);
            } else {
                setError(data.message || "Registration failed. Please try again.");
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
                    <h1 className="auth__title">Create Account</h1>
                    <p className="auth__subtitle">Join CineVault and start exploring.</p>

                    <form className="auth__form" onSubmit={handleSubmit}>
                        <div className="auth__field">
                            <label htmlFor="reg-username">Username</label>
                            <input
                                id="reg-username"
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                        </div>
                        <div className="auth__field">
                            <label htmlFor="reg-email">Email</label>
                            <input
                                id="reg-email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>
                        <div className="auth__field">
                            <label htmlFor="reg-phone">Phone</label>
                            <input
                                id="reg-phone"
                                type="tel"
                                name="phone"
                                placeholder="+91 98765 43210"
                                value={form.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                            />
                        </div>
                        <div className="auth__field">
                            <label htmlFor="reg-password">Password</label>
                            <input
                                id="reg-password"
                                type="password"
                                name="password"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                        </div>

                        {error && <div className="auth__error">{error}</div>}
                        {success && <div className="auth__success">{success}</div>}

                        <button
                            id="register-submit-btn"
                            type="submit"
                            className="auth__btn"
                            disabled={loading}
                        >
                            {loading ? <span className="auth__spinner" /> : "Create Account"}
                        </button>
                    </form>

                    <p className="auth__switch">
                        Already have an account?{" "}
                        <Link to="/login" id="go-to-login">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
