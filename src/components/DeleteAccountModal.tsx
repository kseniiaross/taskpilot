import { useRef } from "react";

import { useModal } from "../hooks/useModal";

interface DeleteAccountModalProps {
  onClose: () => void;
  onDelete: () => void;
}

const DeleteAccountModal = ({
  onClose,
  onDelete,
}: DeleteAccountModalProps) => {

  const cancelButtonRef =
    useRef<HTMLButtonElement>(null);

  const { handleOverlayMouseDown } = useModal({
    onClose,
    focusRef: cancelButtonRef,
  });

  return (
    <div
      className="deleteModalOverlay"
      role="presentation"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className="deleteModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div className="deleteModal__header">
          <span className="deleteModal__eyebrow">
            Danger Zone
          </span>

          <h2 id="delete-modal-title">
            Delete Account
          </h2>

          <p id="delete-modal-description">
            This action permanently removes your account and all associated data.
            It cannot be undone.
          </p>
        </div>

        <div className="deleteModal__list">
          <div>• Profile</div>
          <div>• Workspaces</div>
          <div>• Tasks</div>
          <div>• Settings</div>
        </div>

        <div className="deleteModal__actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="deleteModal__cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="deleteModal__delete"
            onClick={onDelete}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;