import BinderMainLogo from "./BinderMainLogo";
import LoginButton from "./LoginButton";

export default function BigLoginDisplayPage() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="relative flex place-items-center z-[-1]">
        <BinderMainLogo />
      </div>
      <LoginButton />
    </main>
  );
}
