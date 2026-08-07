import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            danger
              ? 'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600'
              : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600'
          }`}
        >
          {danger ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      </div>
    </Modal>
  );
}
