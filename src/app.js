import React from "react";
import MyComponent from "./my-component";

require("./style.less");


window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  React.render(<MyComponent/>, appEl);
});
