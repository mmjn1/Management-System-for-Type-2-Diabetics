import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../../components/Header/HeaderBar";

export default function LandingLayout() {
  return (
    <>
      <Header></Header>
      <h2>Landing Layout</h2>
      <Outlet />
    </>
  );
}
