/*eslint-env mocha*/

import expect from "expect";
import "../opt/validators";
import {getValidator} from "../validator-store";

describe("Default Validators", function() {

  it("should work for required ", function() {
    const validator = getValidator("required");
    expect(validator.isValid("foo")).toBe(true);
    expect(validator.isValid("")).toBe(false);
  });

});
