/*eslint-env mocha*/

import expect from "expect";
import Form from "react-reform";
import {Text} from "react-reform/opt/inputs";
import bootstrapTheme from "react-reform/opt/theme-bootstrap";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("Basic Flow", function() {

  function formComp(submitFn) {
    return (
      <Form onSubmit={submitFn} theme={bootstrapTheme}>
        <Text name="name" label="Your Name" placeholder="name..."/>
      </Form>
    );
  }

  it("should send data to the submit handler", function(done) {
    function handleSubmit({name}) {
      expect(name).toEqual("Daniel");
      done();
    }
    const root = TestUtils.renderIntoDocument(formComp(handleSubmit));
    const rootNode = ReactDOM.findDOMNode(root);
    const inputNode = rootNode.querySelector("input[name='name']");
    const buttonNode = rootNode.querySelector("button");

    TestUtils.Simulate.change(inputNode, {target: {value: "Daniel"}});
    buttonNode.click();
  });

});
