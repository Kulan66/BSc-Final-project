import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

function MainLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

export default MainLayout;