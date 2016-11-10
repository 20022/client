import {mergeFull} from "../elements"

test("mergeFull", () => {
  const data = require("./mock-full-response.json")
  const result = mergeFull({data})({elems: {}, lists: {}, list: null})

  expect(result).toBe(3)
})
