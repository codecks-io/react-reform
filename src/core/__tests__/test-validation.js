/*eslint-env mocha*/

import expect from "expect";
import Form from "react-reform";
import {Text} from "react-reform/opt/inputs";
import bootstrapTheme from "react-reform/opt/theme-bootstrap";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("Validation", function() {

  function formComp(submitFn) {
    return (
      <Form onSubmit={submitFn} theme={bootstrapTheme}>
        <Text name="name" label="Your Name" placeholder="name..."/>
      </Form>
    );
  }

  it("should display field errors sent from the server", function(done) {
    let rootNode;

    function handleSubmit() {
      return new Promise((resolve, reject) => {
        reject({"name": "not unique!"});
        setTimeout(() => {
          expect(rootNode.innerText).toInclude("not unique!");
          done();
        });
      });
    }
    const root = TestUtils.renderIntoDocument(formComp(handleSubmit));
    rootNode = ReactDOM.findDOMNode(root);
    const inputNode = rootNode.querySelector("input[name='name']");
    const buttonNode = rootNode.querySelector("button");

    TestUtils.Simulate.change(inputNode, {target: {value: "Daniel"}});
    buttonNode.click();
  });

  it("should call console.error when onSubmit throws real error", function(done) {
    function handleSubmit() {
      return new Promise(() => {
        throw new Error("expected error");
      });
    }
    const root = TestUtils.renderIntoDocument(formComp(handleSubmit));
    const rootNode = ReactDOM.findDOMNode(root);
    const inputNode = rootNode.querySelector("input[name='name']");
    const buttonNode = rootNode.querySelector("button");

    TestUtils.Simulate.change(inputNode, {target: {value: "Daniel"}});

    const orgErrorFn = console.error;
    console.error = (arg1) => {
      expect(arg1).toBe("onSubmit threw:");
      console.error = orgErrorFn;
      done();
    };
    buttonNode.click();
  });

});
