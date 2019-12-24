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
  }

  // Used when an operation is entered
  pushRegister() {
    this.result = parseFloat(this.register);
    this.register = "";
  }

  enter_digit(digit) {
    this.register += String(digit);
    this.display_element.display(parseFloat(this.register));
  }

  decimal() {
    this.register += ".";
    this.display_element.display(this.register);
  }

  add_op() {
    this.current_op = "add";
    this.pushRegister();
  }

  sub_op() {
    // Sub is special cased:
    // If the current op is not null and register is empty
    // then we will interpret the register as negative
    if (this.current_op != "null" && this.register == "") {
      this.register += "-";
      this.display_element.display(parseFloat(this.register));
    } else {
      this.current_op = "sub";
      this.pushRegister();
    }
  }

  mul_op() {
    this.current_op = "mul";
    this.pushRegister();
  }

  div_op() {
    this.current_op = "div";
    this.pushRegister();
  }

  enter() {
    // Do nothing for empty register
    if (this.register == "" || this.registor == "-") {
      return;
    }

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
    this.result = new_result;
    this.register = String(new_result);
    this.display_element.display(this.result);
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
  return function() {
    calculator.enter_digit(digit);
  };
}

// Helper function for binding a callback to a button
function bindButton(document, id, callback) {
  var button = document.getElementById(id);
  if (button == null) {
    console.error(id + " not found");
    return;
  }
  button.addEventListener("click", callback);
}

// Create an instance of CalculatorApp and bind it to an svg_document
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

  // All the other buttons
  bindButton(svg_document, "button_decimal", function() {
    calculator.decimal();
  });
  bindButton(svg_document, "button_add", function() {
    calculator.add_op();
  });
  bindButton(svg_document, "button_sub", function() {
    calculator.sub_op();
  });
  bindButton(svg_document, "button_mul", function() {
    calculator.mul_op();
  });
  bindButton(svg_document, "button_div", function() {
    calculator.div_op();
  });
  bindButton(svg_document, "button_enter", function() {
    calculator.enter();
  });
  bindButton(svg_document, "button_clear", function() {
    calculator.clear();
  });
}

function init() {
  var svg_object = document.getElementById("svg_object");
  if (svg_object == null) {
    console.error("svg_object not found!");
    return;
  }

  // We don't can't bind the calculator app
  // until the svg is loaded
  svg_object.addEventListener(
    "load",
    function() {
      console.log("SVG contentDocument Loaded!");
      if (svg_object.contentDocument == null) {
        console.error("contentDocument is still null!");
      } else {
        bindCalculatorApp(svg_object.contentDocument);
      }
    },
    false
  );
}

init();
