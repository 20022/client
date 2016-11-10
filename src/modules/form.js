import R from "ramda"
import createReducer from "../reducers/create-reducer"

const CHANGE_FIELD = "CHANGE_FIELD"

// Action Creators
export const changeField = R.curry((key, value) => {
  return {
    type: CHANGE_FIELD,
    payload: {key, value},
  }
})

// Reducer
const fieldChanged = (payload) => R.assoc(payload.key, payload.value)

const reducerSpec = [
  [CHANGE_FIELD, fieldChanged],
]

// Selector
export const getForm = R.prop("form")

// // EXPORTS
// export changeField
// export getForm

export default createReducer({}, reducerSpec)
