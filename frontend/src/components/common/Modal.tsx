import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: string;
}

const Modal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, action }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
          <p>Are you sure you want to {action}?</p>
          <div className="flex justify-end mt-6 gap-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
          </div>
        </div>
      </div>
    );
  };

  export default Modal