import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const [navCollapsed, setNavCollapsed] = useState(true);

  const handleNavCollapse = () => setNavCollapsed(!navCollapsed);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          BillEase Admin
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={!navCollapsed}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`${navCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Customers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/invoices"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Invoices
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/reminders"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
              >
                Reminders
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
