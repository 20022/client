import React from "react"
import {Grid, Row, Col} from "react-bootstrap"
import Search from "./Search"
import Nav from "./Nav"

const App = (props) => {
  return (
    <Grid>
      <Nav />
      <Row>
        <Col xs={3}>
          <Search />
        </Col>
        <Col xs={9}>
          {props.children}
        </Col>
      </Row>
    </Grid>
  )
}

export default App
