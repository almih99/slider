const SliderModel = require("./slider-model.js");
const SliderView = require("./slider-view.js");
const SliderUIModel = require("./slider-ui-model");
const SliderController = require("./slider-controller.js");

let uimodel;
let view;

console.log("in slider.js");
console.log(document);

window.addEventListener("load", function (e) {
    console.log("in onload handler");
    uimodel = new SliderUIModel();
    
    uimodel.ticks=10;
    uimodel.subticks=5;
    uimodel.labels=[0,20,40,60,80,100];
    uimodel.showValue=true;
    view = new SliderView(document.getElementById("slider1"), uimodel);

    uimodel2 = new SliderUIModel();
    uimodel2.direction = "vertical";
    uimodel2.ticks=10;
    uimodel2.subticks=5;
    uimodel2.labels=[0,20,40,60,80,100];
    uimodel2.showValue=true;
    view = new SliderView(document.getElementById("slider2"), uimodel2);
});


