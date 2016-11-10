import form from "../modules/form"
import elements from "../modules/elements"
import { routerReducer as routing } from "react-router-redux"
import { combineReducers } from "redux"

const rootReducer = combineReducers({
  form,
  elements,
  routing,
})

export default rootReducer
