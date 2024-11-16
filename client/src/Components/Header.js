import React from "react";

function Header() {
  return (
    <header>
      <nav>
        <div className="container">
          <img className="logo" src="/img/Logo.png" alt="Logo" />
          <h2 className="headerText">Talk to stranger</h2>
          <div className="online-status">5000+ online now</div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
