import {
  useEffect,
  useRef,
  type MouseEvent,
  type RefObject,
} from "react";

interface UseModalOptions {
  onClose: () => void;
  focusRef?: RefObject<HTMLElement>;
}

interface UseModalResult {
  handleOverlayMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
}

export const useModal = ({
  onClose,
  focusRef,
}: UseModalOptions): UseModalResult => {

  const internalFocusRef =
    useRef<HTMLElement>(null);

  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modalOpen");

    const target = focusRef?.current ?? internalFocusRef.current;
    target?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modalOpen");
    };

  }, [onClose, focusRef]);

  const handleOverlayMouseDown = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return { handleOverlayMouseDown };
};