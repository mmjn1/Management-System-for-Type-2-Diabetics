import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../../components/Header/HeaderBar";

export default function ProtectedLayout() {
  return (
    <>
      <Container>
        <Header></Header>
        <h2>Protected Layout</h2>
        <Outlet />
      </Container>
    </>
  );
}
