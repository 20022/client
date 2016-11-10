import React from "react"
import { Route, IndexRoute } from "react-router"
import App from "./containers/App"
import List from "./containers/List"
import Item from "./containers/Item"

export default <Route path="/" component={App}>
  <IndexRoute component={List} />
  <Route path="/:id" component={Item} />
</Route>
