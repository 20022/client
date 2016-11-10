import R from "ramda"
import createReducer from "../reducers/create-reducer"
import {getForm} from "./form"
import qs from "query-string"

const getUri = (str) => `https://iso20022-yhwdxxhwcu.now.sh/element/${str}`

const ID = "xmi:id"
const TOP_LEVEL_KEYS = [ID, "name", "_type"]

export const ITEM_TYPES = [
  {name: "message", label: "Message"},
]

const ERROR = "ERROR"
const REQUEST = "REQUEST"

const GET_ELEMENT = "GET_ELEMENT"
const GET_ELEMENTS = "GET_ELEMENTS"
const GET_ELEMENT_FULL = "GET_ELEMENT_FULL"
const GET_ANCESTORS = "GET_ANCESTORS"

const getData = (type, dispatch, uri) => {
  dispatch({type: REQUEST, payload: {type, uri}})
  return fetch(uri)
  .then((response) => response.json())
  .then((data) => dispatch({type, payload: {data, uri}}))
  .catch((payload) => {
    dispatch({type: ERROR, payload, meta: {type}})
    throw payload
  })
}

// Action Creators
export const getElement = R.curry((id, dispatch, getState) => {
  const state = getState()
  if (!state.elements[id]) {
    getData(GET_ELEMENT, dispatch, getUri(id))
  }
})

const formatSearchQuery = (form) => {
  const query = {}
  if (form.searchText) {
    query.$text = form.searchText
  }
  // todo: handle other filters
  return query

}

export const search = () => R.curry((dispatch, getState) => {
  const query = R.compose(qs.stringify, formatSearchQuery, getForm)(getState())
  getData(GET_ELEMENTS, dispatch, getUri(`?${query}`))
})

export const getElementFull = (id) => (dispatch) => {
  getData(GET_ELEMENT_FULL, dispatch, getUri(id + "/related"))
}

export const getAncestors = R.curry((id, dispatch) => {
  getData(GET_ANCESTORS, dispatch, getUri(id + "/ancestors"))
})

// Selectors
export const selectElement = (id) => R.path(["elements", id])
export const selectElements = (ids) => R.compose(R.pick(ids), R.prop("elems"))

const hasIds = (str) => str && str.charAt && (str.charAt(0) === "_")

const getMeta = R.pipe(
  R.omit(TOP_LEVEL_KEYS),
  R.omit(["_id", "__related", "definition"]),
  R.reject(hasIds),
  R.toPairs,
  R.map(([key, value]) => {
    return {key, value}
  })
)

const getLinks = (entities) =>
  R.pipe(
    R.omit(TOP_LEVEL_KEYS),
    R.filter(hasIds),
    R.map(R.split(" ")),
    R.map(
      R.map((id) => {
        return {
          name: R.pathOr(id, [id, "name"], entities),
          id,
        }
      })
    ),
    R.toPairs,
    R.map(([key, value]) => {
      return {key, value}
    })
  )

export const expandItem = (entities) => {
  return R.applySpec({
    id: R.prop("xmi:id"),
    name: R.prop("name"),
    type: R.prop("_type"),
    definition: R.prop("definition"),
    meta: getMeta,
    links: getLinks(entities),
    __related: R.prop("__related"),
  })
}

export const getItemFromRoute = (state, ownProps) => {
  return R.compose(
    R.when(R.identity, expandItem(state.elements.elems)),
    R.path(["elements", "elems", ownProps.params.id])
  )(state)
}

export const getSearchItems = ({elements}) => {
  if (elements.list) {
    return R.compose(
      R.values,
      selectElements(elements.lists[elements.list])
    )(elements)
  }
  return []
}


// Reducer
const mergeSingle = ({data}) => R.assocPath(["elems", data["xmi:id"]], data)

const mergeArray = R.curry((array, state) => {
  console.log(array, state)
  return R.compose(
    R.assoc("elems", R.__, state),
    R.merge(state.elems),
    R.indexBy(R.prop(ID))
  )(array)
})

const mergeLists = R.curry((array, uri, state) => {
  return R.compose(
    R.assoc("lists", R.__, state),
    R.merge(state.lists),
    R.objOf(uri),
    R.pluck(ID)
  )(array)
})

const mergeArrayAndList = ({data, uri}) => R.compose(
  mergeArray(data),
  mergeLists(data, uri),
  R.assoc("list", uri)
)

export const mergeFull = ({data}) => {
  const array = data._related
  delete data._related
  data.__related = true
  return R.compose(
    mergeSingle({data}),
    mergeArray(array)
  )
}

const initialState = {elems: {}, lists: {}, list: null}

const reducerSpec = [
  [GET_ELEMENT, mergeSingle],
  [GET_ELEMENT_FULL, mergeFull],
  [GET_ELEMENTS, mergeArrayAndList],
  [GET_ANCESTORS, mergeArrayAndList],
]

// Reducer
export default createReducer(initialState, reducerSpec)
