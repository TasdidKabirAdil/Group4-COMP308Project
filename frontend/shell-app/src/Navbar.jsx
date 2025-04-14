import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>Healthcare App</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {role === 'Nurse' && (
              <>
                <Nav.Link onClick={() => navigate('/nurse')}>Dashboard</Nav.Link>
                <Nav.Link onClick={() => navigate('/vitals-form')}>Enter Vitals</Nav.Link>
              </>
            )}
            {role === 'Patient' && (
              <Nav.Link onClick={() => navigate('/patient')}>Dashboard</Nav.Link>
            )}
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
