import wrapInput from "../../wrap-input";
import DatePicker from "react-date-picker";

require("react-date-picker/index.css");

export default wrapInput("DatePicker", DatePicker, {extractValueFromOnChange: date => date, propNameForValue: "date"});
