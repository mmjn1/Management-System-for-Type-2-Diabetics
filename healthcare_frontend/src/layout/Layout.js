import { Outlet } from "react-router-dom";
import Header from "../components/Header/HeaderBar";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
