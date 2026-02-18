import { useState, useEffect } from "react";
import "./Nav.css";

function Nav() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 80);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`nav ${show ? "nav--black" : ""}`}>
            <div className="nav__contents">
                <div className="nav__logo">
                    <span className="nav__logo-text">🎬 CineStream</span>
                </div>
                <div className="nav__links">
                    <a href="#">Home</a>
                    <a href="#">TV Shows</a>
                    <a href="#">Movies</a>
                    <a href="#">New & Popular</a>
                </div>
                <div className="nav__avatar">
                    <div className="nav__avatar-icon">U</div>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
