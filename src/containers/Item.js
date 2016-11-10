import React from "react"
import {Panel} from "react-bootstrap"
// import {LinkContainer} from "react-router-bootstrap"
import {connect} from "../redux/connect"
import R from "ramda"
import format from "../modules/format"
import {LinkContainer} from "react-router-bootstrap"
import {getItemFromRoute, getElementFull} from "../modules/elements"

const Meta = (props) => (
    <p><strong>{props.key}: </strong>{props.value}</p>
)

const L = ({name, id}) => (
  <LinkContainer to={{ pathname: `/${id}` }}>
    <li><a>{name}</a></li>
  </LinkContainer>
)

const Link = (props) => (
  <li><strong>{props.key}: </strong>
    <ul>{props.value.map(L)}</ul>
  </li>
)


const Item = ({item}) => {
  if (!item) return (<h3>Not Found</h3>)
  console.log(item)
  return (
    <Panel header={item.name}>
      {format(item.definition)}
      <hr />
      <div>{item.meta.map(Meta)}</div>
      <hr />
      <h4>Links:</h4>
      <ul>{item.links.map(Link)}</ul>
    </Panel>
  )
}

export default connect(
  {item: getItemFromRoute},
  {getElementFull},
  (state, actions, ownProps) => {
    if (!R.path(["item", "__related"], state)) {
      actions.getElementFull(ownProps.params.id)
    }
  }
)(Item)
