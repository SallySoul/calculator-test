class CalculatorApp {
  constructor(display_element) {
    this.display_element = display_element;
    this.clear();
  }

  clear() {
    this.current_op = "null";
    this.register = "";
    this.result = 0.0;
    this.display_element.display(0);
    console.log("Clear");
  }

  // Used when an operation is entered
  pushRegister() {
    this.result = this.register;
    this.register = "";
  }

  enter_digit(digit) {
    this.register += String(digit);
    console.log("Digit entered: " + digit + ", register is now " + this.register);
    this.display_element.display(this.register);
  }

  decimal() {
    this.register += '.'
    console.log("Decimal entered, register is now " + this.register);
    this.display_element.display(this.register);
  }

  add_op() {
    this.current_op = "add";
    this.pushRegister();
    console.log("Current op is now add");
  }

  sub_op() {
    // Sub is special cased:
    // If the current op is not null and register is empty
    // then we will interpret the register as negative
    if (this.current_op != "null" && this.register == "") {
      this.register += "-";
      console.log("Sub entered with non-null op and empty register, register is now " + this.register);
      this.display_element.display(this.register);
    } else {
      this.current_op = "sub";
      this.pushRegister();
      console.log("Current op is now sub");
    }
  }

  mul_op() {
    this.current_op = "mul";
    this.pushRegister();
    console.log("Current op is now mul");
  }

  div_op() {
    this.current_op = "div";
    this.pushRegister();
    console.log("Current op is now div");
  }

  enter() {
    var old_result = this.result;
    var old_register = parseFloat(this.register);
    var new_result = old_result;
    if (this.current_op == "add") {
      new_result = old_result + old_register;
    } else if (this.current_op == "sub") {
      new_result = old_result - old_register;
    } else if (this.current_op == "mul") {
      new_result = old_result * old_register;
    } else if (this.current_op == "div") {
      new_result = old_result / old_register;
    }
    console.log("enter, old_result: " + old_result + " old_register: " + old_register + " current_op: " + this.current_op + " new_result: " + new_result);
    this.result = new_result;
    this.register = "";
    this.current_op = "null";
    this.display_element.display(new_result);
  }
}

class TextDisplay {
  constructor(text_element) {
    this.text_element = text_element;
  }

  display(message) {
    this.text_element.textContent = String(message);
  }
}

// Javascript "closures" capture by reference not value
// soo you have to capture parameters instead?
function digit_callback(calculator, digit) {
  return function() { calculator.enter_digit(digit); }
}

function bindButton(document, id, callback) {
  var button = document.getElementById(id);
  if (button == null) {
    console.error(id + " not found");
    return;
  }
  button.addEventListener("click", callback);
}

function bindCalculatorApp(svg_document) {
  var display_element = svg_document.getElementById("display");
  if (display_element == null) {
    console.error("display not found");
    return;
  }
  var display = new TextDisplay(display_element);
  var calculator = new CalculatorApp(display);

  // Add the 0-9 digit buttons
  for (var i = 0; i < 10; i++) {
    var digit = String(i);
    var button_name = "button_" + digit;
    bindButton(svg_document, button_name, digit_callback(calculator, digit));
  }
  bindButton(svg_document, "button_decimal", function() {calculator.decimal();});
  bindButton(svg_document, "button_add", function() {calculator.add_op();});
  bindButton(svg_document, "button_sub", function() {calculator.sub_op();});
  bindButton(svg_document, "button_mul", function() {calculator.mul_op();});
  bindButton(svg_document, "button_div", function() {calculator.div_op();});
  bindButton(svg_document, "button_enter", function() {calculator.enter();});
  bindButton(svg_document, "button_clear", function() {calculator.clear();});

  console.log("binding calculator app complete");
}

function init() {
   var svg_object = document.getElementById("svg_object");
  if (svg_object == null) {
    console.error("svg_object not found!");
    return;
  }

  svg_object.addEventListener("load",function() {
    console.log("SVG contentDocument Loaded!");
    if(svg_object.contentDocument == null) {
      console.error("contentDocument is still null!");
    } else {
      bindCalculatorApp(svg_object.contentDocument);
    }
    }, false);

  console.log("init done");
}

init();
