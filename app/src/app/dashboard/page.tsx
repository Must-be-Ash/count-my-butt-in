import BinderMainLogo from "@/app/components/BinderMainLogo";
import LoginOrUserWidget from "../components/LoginOrUserWidget";
import Main from "@/layouts/Main";
export default function Dashboard() {
  return (
    <Main>
      <BinderMainLogo />
      <LoginOrUserWidget />
    </Main>
  );
}
