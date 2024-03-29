export default function ErrorDisplay({ error }: { error: any }) {
  let errorMessage;
  if (typeof error === "string") {
    errorMessage = error.slice(0, 500);
  } else if (error?.message) {
    errorMessage = error.message.slice(0, 500);
  } else if (error?.error === "string") {
    errorMessage = error.error.slice(0, 500);
  } else {
    errorMessage = `${error}`.slice(0, 500);
  }
  console.log("ErrorDisplay", error, errorMessage);
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
