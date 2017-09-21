// 3rd-party imports

import expect from "expect";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

// local imports

import ComboKeys from "src/";

const displayChildren = () => {
    return <div>{"I am children."}</div>;
};

describe("render prop", () => {
    let node;

    beforeEach(() => {
        node = document.createElement("div");
    });

    afterEach(() => {
        unmountComponentAtNode(node);
    });

    it("displays content", () => {
        render(<ComboKeys render={displayChildren} />, node, () => {
            expect(node.innerHTML).toContain("I am children.");
        });
    });
});

describe("function as child prop", () => {
    let node;

    beforeEach(() => {
        node = document.createElement("div");
    });

    afterEach(() => {
        unmountComponentAtNode(node);
    });

    it("displays content", () => {
        render(<ComboKeys>{displayChildren}</ComboKeys>, node, () => {
            expect(node.innerHTML).toContain("I am children.");
        });
    });
});
