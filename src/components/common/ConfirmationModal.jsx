import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";

export function ConfirmationModal() {
  const [modal, setModal] = useState(null);
  const exampleModal = useRef(null);

  useEffect(() => {
    setModal(new Modal(exampleModal.current));
  }, []);

  const handleYes = () => {
    // Perform action when Yes is clicked
    console.log("Yes was clicked!");
    modal.hide();
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => modal.show()}
      >
        Open Modal
      </button>

      <div
        className="modal fade"
        ref={exampleModal}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Confirmation
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => modal.hide()}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are you sure you want to proceed?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => modal.hide()}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleYes}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
