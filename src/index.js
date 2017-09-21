// 3rd-party imports

import React, { Component } from "react";
import PropTypes from "prop-types";

import shallowequal from "shallowequal";

import ComboKeysClass from "combokeys";
import GlobalBinder from "combokeys/plugins/global-bind";

// helpers

function noop() {}

function normalizeBindings(bindings = []) {
    if (typeof bindings === "string") {
        return [bindings];
    }

    if (Array.isArray(bindings)) {
        return bindings;
    }

    return Array.from(bindings);
}

function unwrapArray(arg, defaultValue) {
    arg = Array.isArray(arg) ? /* istanbul ignore next (preact) */ arg[0] : arg;
    if (!arg && defaultValue) {
        return defaultValue;
    } else {
        return arg;
    }
}

function getElementProps(element) {
    // props for react, attributes for preact
    return (
        element.props || /* istanbul ignore next (preact) */ element.attributes
    );
}

function isDOMElement(element) {
    /* istanbul ignore if */
    if (element.nodeName) {
        // then this is preact
        return typeof element.nodeName === "string";
    } else {
        // then we assume this is react
        return typeof element.type === "string";
    }
}

function validateGetRootPropsCalledCorrectly(element, { refKey }) {
    const refKeySpecified = refKey !== "ref";
    const isComposite = !isDOMElement(element);
    if (isComposite && !refKeySpecified) {
        throw new Error(
            "react-combokeys: You returned a non-DOM element. You must specify a refKey in getRootProps"
        );
    } else if (!isComposite && refKeySpecified) {
        throw new Error(
            `react-combokeys: You returned a DOM element. You should not specify a refKey in getRootProps. You specified "${refKey}"`
        );
    }
    if (!getElementProps(element).hasOwnProperty(refKey)) {
        throw new Error(
            `react-combokeys: You must apply the ref prop "${refKey}" from getRootProps onto your root element.`
        );
    }
}

function getChildRenderFunction({ children, render }) {
    if (render) {
        return render;
    }

    if (children) {
        if (typeof children === "function") {
            return children;
        }

        return unwrapArray(children, noop);
    }

    return null;
}

const keys = ["global", "bind", "keypress", "keydown", "keyup"];
function hasPropsChanged(prevProps, nextProps) {
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (!shallowequal(prevProps[key], nextProps[key])) {
            return true;
        }
    }

    return false;
}

// component

export default class ComboKeys extends Component {
    static propTypes = {
        global: PropTypes.bool,

        render: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.func
        ]),

        onCombo: PropTypes.func,

        bind: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),

        keypress: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),

        keydown: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),

        keyup: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ])
    };

    static defaultProps = {
        global: true,

        render: null, // render prop
        onCombo: () => {},

        bind: [],
        keypress: [],
        keydown: [],
        keyup: []
    };

    state = {
        hasPropsChanged: false,

        combo: null,
        action: null,

        // if a combo/key/shortcut was pressed
        isPressed: false
    };

    // props

    combokeys = null;
    _rootNode = null;
    rootRef = node => (this._rootNode = node);

    // helpers

    getStateAndHelpers() {
        const { getRootProps } = this;

        const { combo, action, isPressed } = this.state;

        return {
            // prop getters
            getRootProps,

            // state
            combo,
            shortcut: combo,
            action,
            isPressed
        };
    }

    getRootProps = ({ refKey = "ref", ...rest } = {}) => {
        // this is used in the render to know whether the user has called getRootProps.
        // It uses that to know whether to apply the props automatically
        this.getRootProps.called = true;
        this.getRootProps.refKey = refKey;

        return {
            [refKey]: this.rootRef,
            ...rest
        };
    };

    handleCombo = ({ event, combo, action }) => {
        this.props.onCombo({ event, combo, action });
        this.setState({ combo, action, isPressed: true });
    };

    handleDefaultCallback = (event, combo) => {
        this.handleCombo({ event, combo, action: "default" });
    };

    handleKeypress = (event, combo) => {
        this.handleCombo({ event, combo, action: "keypress" });
    };

    handleKeydown = (event, combo) => {
        this.handleCombo({ event, combo, action: "keydown" });
    };

    handleKeyup = (event, combo) => {
        this.handleCombo({ event, combo, action: "keyup" });
    };

    setup = () => {
        const { global, bind, keypress, keydown, keyup } = this.props;

        const element =
            (global ? document.documentElement : this._rootNode) ||
            document.documentElement;

        const combokeys = new ComboKeysClass(element);

        if (global) {
            GlobalBinder(combokeys);
        }

        const bindingFunc = global
            ? combokeys.bindGlobal.bind(combokeys)
            : combokeys.bind.bind(combokeys);

        const defaultBindings = normalizeBindings(bind);
        if (defaultBindings.length > 0) {
            // NOTE: By default, the best action (either keydown or key press)
            //       is picked based on the given key combination.
            bindingFunc(defaultBindings, this.handleDefaultCallback);
        }

        const keypressBindings = normalizeBindings(keypress);
        if (keypressBindings.length > 0) {
            bindingFunc(keypressBindings, this.handleKeypress, "keypress");
        }

        const keydownBindings = normalizeBindings(keydown);
        if (keydownBindings.length > 0) {
            bindingFunc(keydownBindings, this.handleKeydown, "keydown");
        }

        const keyupBindings = normalizeBindings(keyup);
        if (keyupBindings.length > 0) {
            bindingFunc(keyupBindings, this.handleKeyup, "keyup");
        }

        this.combokeys = combokeys;
    };

    teardown = () => {
        if (this.combokeys) {
            this.combokeys.detach();
        }

        this.combokeys = null;
    };

    // react lifecycle API

    componentDidMount() {
        this.setup();
    }

    componentWillUnmount() {
        this.teardown();
    }

    componentWillReceiveProps(nextProps) {
        if (!hasPropsChanged(this.props, nextProps)) {
            return;
        }

        this.teardown();
        this.setState({
            combo: null,
            action: null,
            isPressed: false,
            hasPropsChanged: true
        });
    }

    componentDidUpdate() {
        if (this.state.hasPropsChanged) {
            this.setup();

            this.setState({
                hasPropsChanged: false
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.hasPropsChanged && !nextState.hasPropsChanged) {
            return false;
        }

        return true;
    }

    render() {
        const child = getChildRenderFunction(this.props);

        if (!child) {
            return null;
        }

        // we reset this so we know whether the user calls getRootProps during
        // this render. If they do then we don't need to do anything,
        // if they don't then we need to clone the element they return and
        // apply the props for them.
        this.getRootProps.called = false;
        this.getRootProps.refKey = undefined;

        const element = unwrapArray(child(this.getStateAndHelpers()));

        if (!element) {
            return null;
        }

        if (this.props.global) {
            return element;
        }

        if (this.getRootProps.called) {
            validateGetRootPropsCalledCorrectly(element, this.getRootProps);
            return element;
        }

        if (isDOMElement(element)) {
            // they didn't apply the root props, but we can clone
            // this and apply the props ourselves
            return React.cloneElement(
                element,
                this.getRootProps(getElementProps(element))
            );
        }

        // they didn't apply the root props, but they need to
        // otherwise we can't query around the autocomplete
        throw new Error(
            "react-combokeys: If you return a non-DOM element, you must use apply the getRootProps function"
        );
    }
}
