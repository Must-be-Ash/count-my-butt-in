import Footer from "@/app/components/Footer";
import { ReactNode } from "react";

const Main = ({children}: {children: ReactNode}) => {
  return (
    <main>
      <div className="flex flex-col items-center w-[393px] h-screen mx-auto">
        <div className="flex-1 flex flex-col items-center w-full h-full">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Main;