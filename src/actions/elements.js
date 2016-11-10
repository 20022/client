const getUri = (str) => `https://iso20022-juvxapjopf.now.sh/element/${str}`

const ID = "xmi:id"
const TOP_LEVEL_KEYS = [ID, "name", "_type"]

const ERROR = "ERROR"
const REQUEST = "REQUEST"

const GET_ELEMENT = "GET_ELEMENT"
const GET_ELEMENTS = "GET_ELEMENTS"
const GET_ELEMENT_FULL = "GET_ELEMENT_FULL"
const GET_ANCESTORS = "GET_ANCESTORS"

const CHANGE_FIELD = "CHANGE_FIELD"

const getData = (dispatch, type, uri) => {
  dispatch({type:REQUEST, payload: {type, uri})
  return fetch(uri)
  .then((response) => response.json())
  .then((payload) => dispatch({type, payload, meta: {uri}}))
  .catch((payload) => dispatch({type: ERROR, payload, meta:{type}}))
}

// Action Creators
const getElement = R.curry((id, dispatch, getState) => {
  const state = getState()
  if (!state.elements[id]) {
    getData(GET_ELEMENT,dispatch, getUri(id))
  }
})

const search = R.curry((text, dispatch) => {
  getData(GET_ELEMENTS, dispatch, getUri(`/?$text=${text}`))
})

const getElementFull = R.curry((id, dispatch) => {
  getData(GET_ELEMENT_FULL, dispatch, getUri(id + "/related"))
})

const getAncestors = R.curry((id, dispatch) => {
  getData(GET_ANCESTORS, dispatch, getUri(id + "/ancestors"))
})

// Selectors
const selectElement = (id) => R.path(["elements", id])
const selectElements = (ids) => R.compose(R.picks(ids), R.prop("elements"))

const hasIds = (str) => str.charAt(0) === "_"

const meta = R.pipe(
  R.omit(TOP_LEVEL_KEYS),
  R.reject(hasIds),
  R.toPairs,
  R.map(([key, value]) => {key, value})
)

const getLinks = (entities) =>
  R.pipe(
    R.omit(TOP_LEVEL_KEYS),
    R.filter(hasIds),
    R.map(R.split(" ")),
    R.map(R.map((id) => {
      return {
        name: R.pathOr(id, [id, "name"], entities),
        id,
    })),
    R.toPairs,
    R.map(([key, value]) => {key, value})
  )

const expandItem = (item, entities) => {
  return R.applySpec({
    id: R.prop("xmi:id"),
    name: R.prop("name"),
    type: R.prop("_type"),
    meta: getMeta,
    links: getLinks(entities)
  })
}





// Reducer
const mergeSingle = (payload) => R.assocPath(["elems", payload["xmi:id"]], payload)
const mergeArray = R.curry((array, state) => {
  const elems = R.compose(R.merge(state.elems), R.indexBy(R.prop(ID)))(array)
  const list = R.pluck(ID, array)
  return R.merge(state, {elems, list})
})
const mergeFull = (payload) => {
  const array = payload._related
  delete payload._related
  return R.compose(
    mergeSingle(payload),
    mergeArray(array)
  )
}

const initialState = {elems: {}, list: []}

const reducerSpec = [
  [GET_ELEMENT, mergeSingle],
  [GET_ELEMENT_FULL, mergeFull],
  [GET_ELEMENTS, mergeArray],
  [GET_ANCESTORS, mergeArray]
]



/* EXPORTS */
// Action Creators
export getElement
export getElementFull
export search

// Reducer
export default createReducer(reducerSpec, initialState)

// Selectors
