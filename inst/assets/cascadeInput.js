
var cascadeInputBinding = new Shiny.InputBinding();

$.extend(cascadeInputBinding, {
  find: (scope) => {
    return $(scope).find(".cascadeInputBinding");
  },
  getValue: (el) => {
    //return parseInt($(el).text());
    ar = $(el).find(".selectpicker").map((ix, em) => {
      return {
        id: em.id,
        value: $(em).val()
      }
    }).get();
    return ar.reduce((obj, elm) => Object.assign(obj, {[elm.id]: elm.value}), {})
  },
  setValue: (el, value) => {
    //$(el).text(value);
  },
  subscribe: (el, callback) => {
    pckrs = $(el).find(".selectpicker")
    // hide send button if not all pickers selected
    if (pckrs.map((ix, eo) => $(eo).val()).length != pckrs.length) {
     $(el).find(".sndbtn").css("visibility", "hidden");
    }
    if ($(el).hasClass("dynhide")) {
     pckrs.slice(1).each((ix, et) => $(et).closest(".form-group").css("visibility", "hidden"));
    }
    pckrs.on("change.cascadeInput", function(e) {
      // hide send button
      $(el).find(".sndbtn").css("visibility", "hidden");
      // hide pickers with index + 2
      inxarr = pckrs.map((ind, emb) => {if(emb == this) {return ind}});
      inx = inxarr[0]
      if ($(el).hasClass("dynhide")) {
        pckrs.slice(inx+2).each((ix, et) => {
          $(et).closest(".form-group").css("visibility", "hidden")
        });
        // show picker with index + 1 (if necessary)
        pckrs.eq(inx+1).closest(".form-group").css("visibility", "visible")
      }
      // deselect pickers with index + 1
      pckrs.slice(inx+1).each((ix, et) => {
        $(et).selectpicker("val", "");
        $(et).selectpicker("refresh");
      });
      if ($(el).hasClass("choicelist")) {
        // get all selections before inx
        presl = pckrs.slice(0, inx + 1).map((em, eb) => $(eb).val());
        // get proper object
        selobj = [...presl].reduce((car, kye) => {
          return car[kye];
        }, $(el).data("choicelist"));
        // make new options
        const opts = Object.keys(selobj).map(function(val) {
        return `<option value='${val}'>${val}</option>`
      });
      optst = "".concat(...opts);
      // send new data to pickerinput
      pckrs.slice(inx+1).each((ix, et) => {
        $(et).data("shinyInputBinding").receiveMessage(et, {choices: optst, value: ""});
      });
      }
      // if last picker show button
      if (inx == pckrs.length-1) {// hide send button
        $(el).find(".sndbtn").css("visibility", "visible");
      }
    });
    $(el).find(".sndbtn").on("click.cascadeInputBinding", function(e) {
      callback();
    });
  },
  unsubscribe: (el) => {
    $(el).off(".cascadeInputBinding");
  },
  initialize: function(el) {
    /*
    if ($(el).hasClass("choicelist")) {
      const opts = Object.keys($(el).data("choicelist")).map(function(val) {
        return `<option value='${val}'>${val}</option>`
      });
      optst = "".concat(...opts);
      //($(el).find(".selectpicker")[0]).data("shinyInputBinding").receiveMessage(el, {choices: optst});
    }
    */
   this.choicelist = $(el).data("choicelist");
  }});

Shiny.inputBindings.register(cascadeInputBinding, "cascade.cascadeInputBinding");
