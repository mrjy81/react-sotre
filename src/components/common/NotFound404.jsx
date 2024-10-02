import React from "react";

export default function NotFound404() {
  return (
    <section className="py-5">
      <div
        className="d-flex justify-content-center 
                align-items-center flex-column 
                text-center w-100"
      >
        <div className="bg_img w-50"></div>
        <div>
          <p className="display-4">مثل اینکه صفحه مورد نظر شما یافت نشد</p>
          <a
            href="#"
            className="text-white text-decoration-none px-4 py-3 
                    bg-success d-inline-block mt-2 rounded"
          >
            Go to Home
          </a>
        </div>
      </div>
    </section>
  );
}
