import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { create } from 'react-test-renderer'

export function testPlayerMethods (Player, methods, props) {
  for (const method of Object.keys(methods)) {
    test(`${method}()`, t => {
      const callPlayer = sinon.fake()
      const instance = create(<Player {...props} />).getInstance()
      t.truthy(instance[method])
      instance.callPlayer = callPlayer
      instance[method]()
      if (methods[method]) {
        t.ok(callPlayer.calledWith(methods[method]))
      }
      sinon.restore()
    })
  }
}

export function containsMatchingElement (wrapper, comp) {
  return isObjectContained(create(comp).toJSON(), wrapper.toJSON())
}

export function isObjectContained (subObject, jsonObject) {
  if (typeof subObject !== 'object' || typeof jsonObject !== 'object') {
    return false
  }

  for (const key in subObject) {
    if (!(key in jsonObject)) {
      return false
    }

    if (typeof subObject[key] === 'object' && typeof jsonObject[key] === 'object') {
      if (!isObjectContained(subObject[key], jsonObject[key])) {
        return false
      }
    } else if (subObject[key] !== jsonObject[key]) {
      return false
    }
  }
  return true
}
