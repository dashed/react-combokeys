react-combokeys
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

// TBA

// render prop

```

## Props

Credits
=======

Some parts of code (e.g. `getRootProps()`) were blatantly copied from: https://github.com/paypal/downshift

Kudos to [@kentcdodds](https://github.com/kentcdodds) and his article [here](http://tinyletter.com/kentcdodds/letters/how-to-give-rendering-control-to-users-with-prop-getters), for inspiring me to create this React component library using the ideas that he (and others) have preached.

License
=======

MIT.
