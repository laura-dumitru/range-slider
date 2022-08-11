let slider = document.getElementById("myRange");
let result = document.getElementById("result");
result.innerHTML = slider.value; // Display the default slider value

let options = ["25", "50", "75"];

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function (input) {
  result.innerHTML = this.value;

  if (options.includes(this.value)) {
    console.log(`I am ${this.value}% happy`);
  }
};

// a range from 0 to 100, 0 being very sad, 100 very happy.
//Breakpoints for Custom events at 25/50/75%
//but if someone puts their input at around 35% for example, it should log the closest custom event, in this instance being 25%.

//an array

//let slider = document.getElementById("myRange");

/*for (i = 0; i < options.length; i++) {
  console.log(options);
}*/
