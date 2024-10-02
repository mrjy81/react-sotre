import React from "react";
import "../../styles/footer.css";
export default function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 className="text-uppercase">Company Name</h5>
            <p>
              Here you can use rows and columns to organize your footer content.
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Links</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <a href="#!" className="text-dark">
                  Link 1
                </a>
              </li>
              <li>
                <a href="#!" className="text-dark">
                  Link 2
                </a>
              </li>
              <li>
                <a href="#!" className="text-dark">
                  Link 3
                </a>
              </li>
              <li>
                <a href="#!" className="text-dark">
                  Link 4
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-0">Contact</h5>
            <ul className="list-unstyled">
              <li>
                <i className="fas fa-home me-3"></i> New York, NY 10012, US
              </li>
              <li>
                <i className="fas fa-envelope me-3"></i> info@example.com
              </li>
              <li>
                <i className="fas fa-phone me-3"></i> + 01 234 567 88
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center p-3">
        © 2024 Copyright:
        <a className="text-dark" href="https://mdbootstrap.com/">
          YourWebsite.com
        </a>
      </div>
    </footer>
  );
}
