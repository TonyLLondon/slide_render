import React, { Fragment, useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { Deck, Notes, Slide } from 'spectacle'
import { SlideDeck, theme, Notes as MdxDeckNotes } from 'mdx-deck'
import Marp from './marp'

import './style.scss'

const defaultMd = `
---
theme: uncover
_class: invert
---

# Marp React example <!--fit-->

at [CodeSandbox](https://codesandbox.io/s/kkryjmyy75)

![bg right fit](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)

---

![bg](#f0f8ff)

### Custom renderer

You can use custom renderer with function.

Try **/w Presenter notes** mode by select box at the top.

<!-- Presenter note is supported by HTML comment. -->

---

### Working with other frameworks

You can use Marp with other frameworks:

- [Spectacle](https://github.com/FormidableLabs/spectacle)
- [mdx-deck](https://github.com/jxnblk/mdx-deck) (as container)
`.trim()

// Traditional preview pane
const MarpPreviewRenderer = slides =>
  slides.map(({ slide, comments }, i) => (
    <div className="slide" key={i}>
      {slide}
      {comments.map((comment, i) => (
        <p key={i}>{comment}</p>
      ))}
    </div>
  ))

// Create Spectacle slide deck based on Marp
const MarpSpectacleRenderer = slides => (
  <Deck>
    {slides.map(({ slide, comments }, i) => (
      <Slide key={i} transition={['zoom']}>
        {slide}
        {comments.length > 0 && (
          <Notes>
            {comments.map((comment, i) => (
              <p key={i}>{comment}</p>
            ))}
          </Notes>
        )}
      </Slide>
    ))}
  </Deck>
)

const MarpMdxDeckTheme = {
  ...theme,
  css: {
    '> div > div > div': {
      boxSizing: 'border-box',
      display: 'block',
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}

// Create mdx-deck slide deck based on Marp
const MarpMdxDeckRenderer = slides => (
  <SlideDeck
    theme={MarpMdxDeckTheme}
    slides={slides.map(({ slide, comments }) => () => (
      <>
        {slide}
        {comments && comments.length > 0 && (
          <MdxDeckNotes>
            {comments.map((comment, ci) => (
              <p key={ci}>{comment}</p>
            ))}
          </MdxDeckNotes>
        )}
      </>
    ))}
    Provider={({ children }) => children}
    width="auto"
    height="auto"
  />
)

const App = () => {
  const [buffer, setBuffer] = useState(defaultMd)
  const [mode, setMode] = useState('simple')

  const handleBufferUpdate = e => setBuffer(e.target.value)
  const handleModeUpdate = e => setMode(e.target.value)

  return (
    <div id="app">
      <textarea id="editor" onChange={handleBufferUpdate} value={buffer} />
      <div id="marp">
        <select onChange={handleModeUpdate} value={mode}>
          <option value="simple">Simple Marp Rendering</option>
          <option value="preview">/w Presenter notes</option>
          <option value="spectacle">Spectacle slide deck</option>
          <option value="mdx-deck">mdx-deck slide deck</option>
        </select>
        {mode === 'simple' && <Marp markdown={buffer} />}
        {mode === 'preview' && (
          <Marp markdown={buffer} render={MarpPreviewRenderer} />
        )}
        {mode === 'spectacle' && (
          <Marp markdown={buffer} render={MarpSpectacleRenderer} />
        )}
        {mode === 'mdx-deck' && (
          <Marp markdown={buffer} render={MarpMdxDeckRenderer} />
        )}
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
