import React, { Fragment, useEffect, useMemo } from 'react'
import { Marp as MarpCore } from '@marp-team/marp-core'
import parser from './parser'

const defaultRenderer = ss =>
  ss.map((s, i) => <Fragment key={i}>{s.slide}</Fragment>)

const useMarp = opts => {
  useEffect(MarpCore.ready, [])
  return useMemo(() => new MarpCore(opts), [opts])
}

export default ({ children, markdown, options, render }) => {
  const containerClassName = useMemo(
    () =>
      `marp-${Math.random()
        .toString(36)
        .slice(-8)}`,
    []
  )

  const opts = useMemo(
    () => ({
      ...(options || {}),
      container: false,
      inlineSVG: true,
      markdown: {
        ...((options && options.markdown) || {}),
        xhtmlOut: true,
      },
      slideContainer: { tag: 'div', class: containerClassName },
    }),
    [options, containerClassName]
  )

  const marp = useMarp(opts)

  const { html, css, comments } = marp.render(markdown || '', {
    htmlAsArray: true,
  })

  const slides = html.map((slide, i) => ({
    slide: (
      <div className={containerClassName} style={{ all: 'initial' }} key={i}>
        {parser(slide)}
      </div>
    ),
    html: slide,
    comments: comments[i],
  }))

  return (
    <>
      <style>{css}</style>
      {(render || children || defaultRenderer)(slides)}
    </>
  )
}
