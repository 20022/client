import R from "ramda"
import {connect as reduxConnect} from "react-redux"

const bindActionCreators = R.curry((spec, dispatch) => {
  return R.map((fn) => {
    return R.curryN(fn.length, R.compose(dispatch, fn))
  }, spec)
})

const runSideEffects = R.curry((sideEffectFn, a, b, c) => {
  sideEffectFn(a, b, c)
  return R.unapply(R.mergeAll)(a, b, c)
})

export const connect = (stateHash, actionHash, sideEffectFn) => {
  return reduxConnect(
    R.unless(R.is(Function), R.applySpec)(stateHash),
    bindActionCreators(actionHash),
    runSideEffects(sideEffectFn)
  )
}
