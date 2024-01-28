import React from "react";
import "../../assets/glucocare/vendor/fontawesome-free/css/all.min.css";
import "../../assets/glucocare/vendor/animate.css/animate.min.css";
import "../../assets/glucocare/vendor/bootstrap/css/bootstrap.min.css";
import "../../assets/glucocare/vendor/bootstrap-icons/bootstrap-icons.css";
import "../../assets/glucocare/vendor/boxicons/css/boxicons.min.css";
import "../../assets/glucocare/vendor/glightbox/css/glightbox.min.css";
import "../../assets/glucocare/vendor/remixicon/remixicon.css";
import "../../assets/glucocare/vendor/swiper/swiper-bundle.min.css";
import "../../assets/glucocare/css/style.css";

import MainMenu from "./MainMenu";

const Header = () => {
  // const token = useAuth();
  const token = 0;

  return (
    <div>
      <div id="topbar" className="d-flex align-items-center fixed-top">
        <div className="container d-flex justify-content-between">
          <div className="contact-info d-flex align-items-center">
            <i className="bi bi-envelope"></i>{" "}
            <a href="mailto:contact@example.com"> mmjn1@student.le.ac.uk</a>
            <i className="bi bi-phone"></i> +44 5589 55488 55
          </div>
        </div>
      </div>

      {/* Header */}
      <header id="header" className="d-flex fixed-top">
        <div className="container d-flex align-items-center">
          <h1 className="logo me-auto">
            <a href="/">GlucoCare</a>
          </h1>
          <MainMenu />
          <a href="/auth/login" className="appointment-btn scrollto">
            <span className="d-none d-md-inline" style={{ fontSize: "16px" }}>
              Login
            </span>
          </a>
        </div>
      </header>
    </div>
  );
};

export default Header;
