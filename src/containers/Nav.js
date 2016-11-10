import React from "react"
import {Navbar, Nav, NavItem} from "react-bootstrap"

const AppNav = () => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">ISO20022 Message Explorer</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem>Search</NavItem>
    </Nav>
  </Navbar>
)


export default AppNav
