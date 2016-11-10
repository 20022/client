import {ListGroup, ListGroupItem, Badge} from "react-bootstrap"
import {LinkContainer} from "react-router-bootstrap"
import {connect} from "react-redux"
import React from "react"
import R from "ramda"

import {getSearchItems} from "../modules/elements"

const truncate = (str) => {
  if (!str) return ""
  if (str.length <= 200) {
    return str
  }
  return str.substr(0, 200) + "..."
}

const styleMap = {
  "messageDefinition": "success",
  "code": "info",
  "messageElement": "success",
  "constraint": "danger",
  "topLevelCatalogueEntry": null,
  "topLevelDictionaryEntry": null,
  "businessRole": null,
  "element": "info",
}

const Item = (item) => (
  <LinkContainer
    bsStyle={styleMap[item._type]}
    style={{marginBottom: 3}}
    key={item._id}
    to={{ pathname: `/${item["xmi:id"]}`}}>
      <ListGroupItem header={item.name}>
        {truncate(item.definition)} <Badge>{item._type}</Badge>
      </ListGroupItem>
  </LinkContainer>
)

const List = ({items}) => {
  return (
    <ListGroup>
      {items.map(Item)}
    </ListGroup>
  )
}

export default connect(R.applySpec({items: getSearchItems}))(List)
