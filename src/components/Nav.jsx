import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Nav.css";

function Nav() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "U";

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 80);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <nav className={`nav ${show ? "nav--black" : ""}`}>
            <div className="nav__contents">
                <div className="nav__logo">
                    <span className="nav__logo-text">🎬 CineVault</span>
                </div>
                <div className="nav__links">
                    <a href="#">Home</a>
                    <a href="#">TV Shows</a>
                    <a href="#">Movies</a>
                    <a href="#">New &amp; Popular</a>
                </div>
                <div className="nav__right">
                    <span className="nav__username">{username}</span>
                    <div className="nav__avatar">
                        <div className="nav__avatar-icon">
                            {username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <button
                        id="logout-btn"
                        className="nav__logout-btn"
                        onClick={handleLogout}
                        title="Sign out"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
