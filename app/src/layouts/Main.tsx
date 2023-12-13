import Footer from "@/app/components/Footer";
import { ReactNode } from "react";

const Main = ({children}: {children: ReactNode}) => {
  return (
    <main>
      <div className="flex flex-col items-center h-screen mx-auto w-96">
        <div className="flex-1 flex flex-col items-center">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Main;