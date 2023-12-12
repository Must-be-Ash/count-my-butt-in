export default function ErrorDisplay({ error }: { error: any }) {
  let errorMessage;
  if (typeof error === "string") {
    errorMessage = error.slice(0, 500);
  } else {
    errorMessage = `${error}`.slice(0, 500);
  }
  return (
    <>
      {error && (
        <div className="text-sm text-red-400 break-words max-w-sm sm:max-w-xl">
          {errorMessage}
        </div>
      )}
    </>
  );
}
