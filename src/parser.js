import camelCase from 'camelcase'
import he from 'he'
import htm from 'htm'
import { createElement } from 'react'
import styleToObject from 'style-to-object'

export const html = htm.bind((type, props, ...children) => {
  const newProps = { ...props }

  // Decode HTML entities in arguments
  Object.keys(newProps).forEach(p => {
    newProps[p] =
      typeof newProps[p] === 'string'
        ? he.decode(newProps[p], { isAttributeValue: true })
        : newProps[p]
  })

  // React prefer class to className
  if (newProps.class !== undefined) {
    newProps.className = newProps.class
    delete newProps.class
  }

  // Use object style instead of inline style
  if (newProps.style !== undefined) {
    const objStyle = {}
    styleToObject(newProps.style, (propName, propValue) => {
      if (propName && propValue) objStyle[camelCase(propName)] = propValue
    })
    newProps.style = objStyle
  }

  return createElement(
    type,
    newProps,
    ...children.map(c =>
      typeof c === 'string' ? he.decode(c, { isAttributeValue: false }) : c
    )
  )
})

export default function parse(htmlString) {
  return html([htmlString])
}
