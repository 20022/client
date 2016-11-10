import React from "react"
import R from "ramda"
import {FormGroup, Checkbox, ControlLabel, FormControl, Button} from "react-bootstrap"
import {connect} from "react-redux"

import {search, ITEM_TYPES} from "../modules/elements"
import {getForm, changeField} from "../modules/form"

const renderCheckboxes = (types, data, onChange) => {
  return (
    <div>
      {types.map((type) => (
        <Checkbox key={type.name}
          checked={!!data[type.name]}
          onChange={() => onChange(type.name, !data[type.name])}>
          {type.label}
        </Checkbox>
      ))}
    </div>
  )
}

const SearchForm = ({form, handleFieldChange, handleSearch}) => {
  return (
    <form>
      <FormGroup controlId="searchText">
        <ControlLabel>Search</ControlLabel>
        <FormControl
          type="text"
          placeholder="enter text"
          value={form.searchText || ""}
          onChange={handleFieldChange("searchText")} />
      </FormGroup>
      {renderCheckboxes(ITEM_TYPES, form, handleFieldChange)}

      <Button onClick={handleSearch}>Search</Button>
    </form>

  )
}

const handleFieldChange = R.curry((key, evt) => {
  return changeField(key, R.pathOr(evt, ["target", "value"], evt))
})

const bindActionCreators = R.curry((spec, dispatch) => {
  return R.map((fn) => {
    return R.curryN(fn.length, R.compose(dispatch, fn))
  }, spec)
})


export default connect(
  R.applySpec({form: getForm}),
  bindActionCreators({handleFieldChange, handleSearch: search})
)(SearchForm)
