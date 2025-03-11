interface ErrorMessageProps {
  message: string | null;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="mt-4 rounded-md bg-red-50 p-4 text-red-600">{message}</div>
  );
}
