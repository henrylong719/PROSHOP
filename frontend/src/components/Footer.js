import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          {/* p - for classes that set padding
          y -for classes that set both *-top and *-bottom
          3 - (by default) for classes that set the margin or padding to $spacer (1rem) */}
          <Col className="text-center py-3">Copyright &copy; ProShop</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
