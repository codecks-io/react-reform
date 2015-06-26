/*eslint-env mocha*/

import expect from "expect";
import "../opt/validators";
import {getValidator} from "../validator-store";

describe("Default Validators", function() {

  function checkValidator(validator, target, input, opts) {
    expect(validator.isValid(input, opts)).toBe(target, `(${input}${opts!==undefined ? `, ${opts}` : ''}) should be ${target}`);
  }

  it("should work for required", function() {
    const validator = getValidator("required");
    checkValidator(validator, true, "foo");
    checkValidator(validator, false, "");
    checkValidator(validator, false, " ");
    checkValidator(validator, false, "  \n\t  \n");
    checkValidator(validator, true, true);
    checkValidator(validator, false, false);
    checkValidator(validator, false, null);
    checkValidator(validator, false, undefined);
    checkValidator(validator, true, 0);
  });

  it("should work for email", function() {
    const validator = getValidator("email");
    checkValidator(validator, false, "foo");
    checkValidator(validator, true, "foo@bar.com");
    checkValidator(validator, true, "foo@bar.fancynewtld");
    checkValidator(validator, false, "foo@bar");
    checkValidator(validator, false, null);
  });

  it("should work for minlength", function() {
    const validator = getValidator("minlength");
    checkValidator(validator, true, "foo", 2);
    checkValidator(validator, true, "foo", 3);
    checkValidator(validator, false, "foo", 4);
    checkValidator(validator, false, "foo", 4);
    checkValidator(validator, false, null, 4);
    checkValidator(validator, false, 1, 4);
    checkValidator(validator, true, 1000, 4);
  });

  it("should work for maxlength", function() {
    const validator = getValidator("maxlength");
    checkValidator(validator, true, "foo", 3);
    checkValidator(validator, true, "foo", 4);
    checkValidator(validator, false, "foo", 2);
    checkValidator(validator, true, null, 4);
    checkValidator(validator, true, 1, 4);
    checkValidator(validator, false, 10000, 4);
  });

  it("should work for pattern", function() {
    const validator = getValidator("pattern");
    checkValidator(validator, true, "5", "\\d+");
    checkValidator(validator, true, "5", /\d+/);
    checkValidator(validator, true, "5a", /\d+/);
    checkValidator(validator, false, "5a", /^\d+$/);
    checkValidator(validator, false, null, /\d+/);
  });


});
