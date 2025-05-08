import { test } from 'zora'
import sinon from 'sinon'
import React from 'react'
import { ReactTestRenderer, act, create } from 'react-test-renderer'

export function render(comp: React.ReactElement): ReactTestRenderer {
  let result;
  act(() => {
    result = create(comp, {
      createNodeMock: (element) => {
        if (element.type === 'video') {
          const video = document.createElement('video');
          video.src = element.props.src;
          video.muted = element.props.muted;
          return video;
        }
      },
    });
  });
  return result;
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
