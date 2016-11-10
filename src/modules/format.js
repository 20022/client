import React from "react"

const R = require("ramda")

const isList = (val) => {
  return val && val.charAt(0) === "-"
}

const isPunctation = (txt) => /(\,|\.|\:|\;)/.test(txt)
const noPunctation = R.complement(isPunctation)
const isListType = R.contains(R.__, ["ul-li", "li"])

const noNext = (elem, prev, next) => !next
const noPrevious = (elem, prev) => !prev
const firstInList = (elem, prev) => prev && !isListType(prev.type) && isList(elem)
const inList = (elem, prev, next) => isList(elem) && isList(next)
const endOfList = (elem, prev, next) => isList(elem) && !isList(next)
const isHeader = R.pipe(R.last, noPunctation)

const type = R.curry((type, val) => {
  return {type, val}
})

const startList = (val) => {
  return {type: "ul", children: [val.replace("- ", "")]}
}
const addToList = (val, prev) => {
  prev.children.push(val.replace("- ", ""))
}


const reducer = (acc, [elem, next]) => {
  const prev = R.last(acc)
  const formatted = R.cond([
    // [noPrevious, type("h4")], // first item is a header
    [firstInList, startList], // first item in list
    [inList, addToList],
    [endOfList, addToList],
    [noNext, type("p")],
    [isHeader, type("h4")],
    [R.always(true), type("p")],
  ])(elem, prev, next)
  if (formatted) {
    return R.append(formatted, acc)
  }
  return acc
}

const format = (str) => {
  return R.pipe(
    R.split("\n"),
    R.map(R.trim),
    R.converge(R.flip(R.append), [R.aperture(2), R.compose(R.of, R.last)]),
    R.reduce(reducer, [])
  )(str)
}

const render = R.map(R.cond([
  [R.propEq("type", "h4"), ({val}) => (<h4>{val}</h4>)],
  [R.propEq("type", "p"), ({val}) => (<p>{val}</p>)],
  [R.propEq("type", "ul"), ({children}) => (<ul>{children.map((val) => (<li>{val}</li>))}</ul>)],
]))

module.exports = R.compose(render, format)
