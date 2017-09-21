react-combokeys [![Build Status](https://travis-ci.org/dashed/react-combokeys.svg)](https://travis-ci.org/dashed/react-combokeys) [![npm version](https://img.shields.io/npm/v/react-combokeys.svg?style=flat)](https://www.npmjs.com/package/react-combokeys)
===============

> Bind to [keyboard shortcuts](https://en.wikipedia.org/wiki/Keyboard_shortcut) in React.

**NOTE:** This React component library wraps [combokeys](https://github.com/avocode/combokeys) which is a fork of [mousetrap](https://github.com/ccampbell/mousetrap). `combokeys` handles the capturing of keyboard shortcuts/combos/keypresses.

## Install

```sh
$ yarn add react-combokeys
# npm v5+
$ npm install react-combokeys
# before npm v5
$ npm install --save react-combokeys
```

## Usage

```js
// 3rd-party imports

import ReactDOM from "react-dom";
import React, { Component } from "react";

import ComboKeys from "react-combokeys";

// function as child component

ReactDOM.render(
    <ComboKeys bind={["a", "command+shift+k"]} keyup="b" keydown="c">
        {({ combo }) => {
            return <div>{`Combo: ${combo || "none yet"}`}</div>;
        }}
    </ComboKeys>,
    mountNode
);

// render prop

const render = ({ combo }) => {
    return <div>{`Combo: ${combo || "none yet"}`}</div>;
};

ReactDOM.render(
    <ComboKeys
        bind={["a", "command+shift+k"]}
        keyup="b"
        keydown="c"
        render={render}
    />,
    mountNode
);
```

## Props

### `render` (optional)

An optional function that is called whenever a keyboard shortcut/combo has been detected, or when internal state for tracking keyboard shortcut/combo has changed.

 It's expected that `render` function returns a single React element.
This has same API semantics as [`React.Component.render()`](https://facebook.github.io/react/docs/react-component.html#render).

If `render` function is given, it has precedence over any given child component:

```js
// TODO: add example
```


### Function as child component (optional)

Same semantics as `render` prop function (see above).

If `render` function is not given, then the child component will be invoked as a function.

```js
// TODO: add example
```

### `onCombo` (optional)

An optional function that is called whenever a keyboard shortcut/combo has been detected.

The `onCombo` function is invoked with an object argument: `({ event, combo, action })`.


Credits
=======

Some parts of code (e.g. `getRootProps()`) were blatantly copied from: https://github.com/paypal/downshift

Kudos to [@kentcdodds](https://github.com/kentcdodds) and his article [here](http://tinyletter.com/kentcdodds/letters/how-to-give-rendering-control-to-users-with-prop-getters), for inspiring me to create this React component library using the ideas that he (and others) have preached.

License
=======

MIT.
