import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const MobileNavBar = () => {
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
    {
      id: 3,
      navTitle: "Routes",
      linkTo: "/routes",
    },
  ]);
  return (
    <nav>
      <ul className="flex flex-col gap-y-8">
        {navLinks.map((navLink) => {
          return (
            <li key={navLink.id}>
              <NavLink
                to={navLink.linkTo}
                className="font-semibold text-4xl text-black hover:opacity-65 transition-opacity duration-200 ease-out"
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

export default MobileNavBar;
