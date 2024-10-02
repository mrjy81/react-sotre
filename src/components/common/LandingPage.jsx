import React from "react";

export default function LandingPage() {
  return (
    <>
      <main className="container my-5">
        <section id="features" className="row">
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Feature 1</h5>
                <p className="card-text">Description of feature 1 goes here.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Feature 2</h5>
                <p className="card-text">Description of feature 2 goes here.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Feature 3</h5>
                <p className="card-text">Description of feature 3 goes here.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
