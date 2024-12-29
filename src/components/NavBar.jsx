import { useState } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [navLinks, setNavLinks] = useState([
    {
      id: 1,
      navTitle: "Home",
      linkTo: "/",
    },
    {
      id: 2,
      navTitle: "Buses",
      linkTo: "/buses",
    },
  ]);
  return (
    <nav>
      <ul className="hidden sm:flex items-center gap-x-5">
        {navLinks.map((navLink) => {
          return (
            <li key={navLink.id}>
              <NavLink
                to={navLink.linkTo}
                className="font-bold text-black hover:opacity-75 transition-opacity duration-200 ease-out"
              >
                {navLink.navTitle}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
