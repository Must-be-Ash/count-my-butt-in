import Footer from "@/app/components/Footer";
import { ReactNode } from "react";

const Main = ({children}: {children: ReactNode}) => {
  return (
    <main>
      <div className="flex flex-col items-center h-screen w-[393px] mx-auto">
        <div className="flex-1 flex flex-col items-center p-3">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Main;