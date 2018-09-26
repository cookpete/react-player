import React from 'react'
import test from 'ava'
import sinon from 'sinon'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

export default function (Player, methods, props) {
  let callPlayer

  test.beforeEach(t => {
    callPlayer = sinon.fake()
  })

  test.afterEach(t => {
    sinon.restore()
  })

  for (const method of Object.keys(methods)) {
    test(`${method}()`, t => {
      const instance = shallow(<Player {...props} />).instance()
      t.truthy(instance[method])
      instance.callPlayer = callPlayer
      instance[method]()
      if (methods[method]) {
        t.true(callPlayer.calledWith(methods[method]))
      } else {
        t.pass()
      }
    })
  }
}
