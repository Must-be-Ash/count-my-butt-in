import Footer from "@/app/components/Footer";
import Nav from "@/components/Nav";
import { ReactNode } from "react";

const Main = ({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) => {
  return (
    <main className="flex flex-col sm:mx-auto w-full h-screen p-3">
      {!hideNav && <Nav />}
      <div className="flex-1 flex flex-col items-center w-full">{children}</div>
    </main>
  );
};

export default Main;
