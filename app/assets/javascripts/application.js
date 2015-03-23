// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .


$('.btn.generate').on('click', function(){
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 10;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum,rnum+1);
    }
    $('.url_token').val(randomstring);
});

$('.btn.feedback').on('click', function(){
	// alert('Save feedback and redirect to Thankyou page.');
	// $.get( window.location.pathname.split('/').pop(), function( data ) {
	//   $( "body" ).html( data );
	//   alert( "Load was performed." );
	// });
	// var info = {}
	// info['text'] = $('textarea.feedback').val();
	// // info['survey_id'] = window.location.pathname.split('/').pop();
	// $.ajax({
 //    url: '/feedback/client_surveys',
 //    type: "POST",
 //    dataType: 'script',
 //    data: info,
 //    success: function(data){

 //    }
 //  });
});	
// slider
// Ion.RangeSlider
// version 2.0.6 Build: 300
// © Denis Ineshin, 2015
// https://github.com/IonDen
//
// Project page:    http://ionden.com/a/plugins/ion.rangeSlider/en.html
// GitHub page:     https://github.com/IonDen/ion.rangeSlider
//
// Released under MIT licence:
// http://ionden.com/a/plugins/licence-en.html
// =====================================================================================================================

;(function ($, document, window, navigator, undefined) {
    "use strict";

    // =================================================================================================================
    // Service

    var plugin_count = 0;

    var is_old_ie = (function () {
        var n = navigator.userAgent,
            r = /msie\s\d+/i,
            v;
        if (n.search(r) > 0) {
            v = r.exec(n).toString();
            v = v.split(" ")[1];
            if (v < 9) {
                $("html").addClass("lt-ie9");
                return true;
            }
        }
        return false;
    } ());

    // IE8 fix
    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;
            var slice = [].slice;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
                bound = function () {

                    if (this instanceof bound) {

                        var F = function(){};
                        F.prototype = target.prototype;
                        var self = new F();

                        var result = target.apply(
                            self,
                            args.concat(slice.call(arguments))
                        );
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;

                    } else {

                        return target.apply(
                            that,
                            args.concat(slice.call(arguments))
                        );

                    }

                };

            return bound;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            var k;
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = +fromIndex || 0;
            if (Math.abs(n) === Infinity) {
                n = 0;
            }
            if (n >= len) {
                return -1;
            }
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }



    // =================================================================================================================
    // Template

    var base_html =
        '<span class="irs">' +
        '<span class="irs-line" tabindex="-1"><span class="irs-line-left"></span><span class="irs-line-mid"></span><span class="irs-line-right"></span></span>' +
        '<span class="irs-min">0</span><span class="irs-max">1</span>' +
        '<span class="irs-from">0</span><span class="irs-to">0</span><span class="irs-single">0</span>' +
        '</span>' +
        '<span class="irs-grid"></span>' +
        '<span class="irs-bar"></span>';

    var single_html =
        '<span class="irs-bar-edge"></span>' +
        '<span class="irs-shadow shadow-single"></span>' +
        '<span class="irs-slider single"></span>';

    var double_html =
        '<span class="irs-shadow shadow-from"></span>' +
        '<span class="irs-shadow shadow-to"></span>' +
        '<span class="irs-slider from"></span>' +
        '<span class="irs-slider to"></span>';

    var disable_html =
        '<span class="irs-disable-mask"></span>';



    // =================================================================================================================
    // Core

    var IonRangeSlider = function (input, options, plugin_count) {
        this.VERSION = "2.0.6";
        this.input = input;
        this.plugin_count = plugin_count;
        this.current_plugin = 0;
        this.calc_count = 0;
        this.old_from = 0;
        this.old_to = 0;
        this.raf_id = null;
        this.dragging = false;
        this.force_redraw = false;
        this.is_key = false;
        this.is_update = false;
        this.is_start = true;
        this.is_active = false;
        this.is_resize = false;
        this.is_click = false;

        this.$cache = {
            win: $(window),
            body: $(document.body),
            input: $(input),
            cont: null,
            rs: null,
            min: null,
            max: null,
            from: null,
            to: null,
            single: null,
            bar: null,
            line: null,
            s_single: null,
            s_from: null,
            s_to: null,
            shad_single: null,
            shad_from: null,
            shad_to: null,
            grid: null,
            grid_labels: []
        };

        // get config data attributes
        var $inp = this.$cache.input;
        var data = {
            type: $inp.data("type"),

            min: $inp.data("min"),
            max: $inp.data("max"),
            from: $inp.data("from"),
            to: $inp.data("to"),
            step: $inp.data("step"),

            min_interval: $inp.data("minInterval"),
            max_interval: $inp.data("maxInterval"),
            drag_interval: $inp.data("dragInterval"),

            values: $inp.data("values"),

            from_fixed: $inp.data("fromFixed"),
            from_min: $inp.data("fromMin"),
            from_max: $inp.data("fromMax"),
            from_shadow: $inp.data("fromShadow"),

            to_fixed: $inp.data("toFixed"),
            to_min: $inp.data("toMin"),
            to_max: $inp.data("toMax"),
            to_shadow: $inp.data("toShadow"),

            prettify_enabled: $inp.data("prettifyEnabled"),
            prettify_separator: $inp.data("prettifySeparator"),

            force_edges: $inp.data("forceEdges"),

            keyboard: $inp.data("keyboard"),
            keyboard_step: $inp.data("keyboardStep"),

            grid: $inp.data("grid"),
            grid_margin: $inp.data("gridMargin"),
            grid_num: $inp.data("gridNum"),
            grid_snap: $inp.data("gridSnap"),

            hide_min_max: $inp.data("hideMinMax"),
            hide_from_to: $inp.data("hideFromTo"),

            prefix: $inp.data("prefix"),
            postfix: $inp.data("postfix"),
            max_postfix: $inp.data("maxPostfix"),
            decorate_both: $inp.data("decorateBoth"),
            values_separator: $inp.data("valuesSeparator"),

            disable: $inp.data("disable")
        };
        data.values = data.values && data.values.split(",");
        options = $.extend(data, options);

        // get from and to out of input
        var val = $inp.prop("value");
        if (val) {
            val = val.split(";");

            if (val[0] && val[0] == +val[0]) {
                val[0] = +val[0];
            }
            if (val[1] && val[1] == +val[1]) {
                val[1] = +val[1];
            }

            if (options.values && options.values.length) {
                data.from = val[0] && options.values.indexOf(val[0]);
                data.to = val[1] && options.values.indexOf(val[1]);
            } else {
                data.from = val[0] && +val[0];
                data.to = val[1] && +val[1];
            }
        }

        // get config from options
        this.options = $.extend({
            type: "single",

            min: 10,
            max: 100,
            from: null,
            to: null,
            step: 1,

            min_interval: 0,
            max_interval: 0,
            drag_interval: false,

            values: [],
            p_values: [],

            from_fixed: false,
            from_min: null,
            from_max: null,
            from_shadow: false,

            to_fixed: false,
            to_min: null,
            to_max: null,
            to_shadow: false,

            prettify_enabled: true,
            prettify_separator: " ",
            prettify: null,

            force_edges: false,

            keyboard: false,
            keyboard_step: 5,

            grid: false,
            grid_margin: true,
            grid_num: 4,
            grid_snap: false,

            hide_min_max: false,
            hide_from_to: false,

            prefix: "",
            postfix: "",
            max_postfix: "",
            decorate_both: true,
            values_separator: " — ",

            disable: false,

            onStart: null,
            onChange: null,
            onFinish: null,
            onUpdate: null
        }, options);

        this.validate();

        this.result = {
            input: this.$cache.input,
            slider: null,

            min: this.options.min,
            max: this.options.max,

            from: this.options.from,
            from_percent: 0,
            from_value: null,

            to: this.options.to,
            to_percent: 0,
            to_value: null
        };

        this.coords = {
            // left
            x_gap: 0,
            x_pointer: 0,

            // width
            w_rs: 0,
            w_rs_old: 0,
            w_handle: 0,

            // percents
            p_gap: 0,
            p_gap_left: 0,
            p_gap_right: 0,
            p_step: 0,
            p_pointer: 0,
            p_handle: 0,
            p_single: 0,
            p_single_real: 0,
            p_from: 0,
            p_from_real: 0,
            p_to: 0,
            p_to_real: 0,
            p_bar_x: 0,
            p_bar_w: 0,

            // grid
            grid_gap: 0,
            big_num: 0,
            big: [],
            big_w: [],
            big_p: [],
            big_x: []
        };

        this.labels = {
            // width
            w_min: 0,
            w_max: 0,
            w_from: 0,
            w_to: 0,
            w_single: 0,

            // percents
            p_min: 0,
            p_max: 0,
            p_from: 0,
            p_from_left: 0,
            p_to: 0,
            p_to_left: 0,
            p_single: 0,
            p_single_left: 0
        };

        this.init();
    };

    IonRangeSlider.prototype = {
        init: function (is_update) {
            this.coords.p_step = this.options.step / ((this.options.max - this.options.min) / 100);
            this.target = "base";

            this.toggleInput();
            this.append();
            this.setMinMax();

            if (is_update) {
                this.force_redraw = true;
                this.calc(true);

                if (this.options.onUpdate && typeof this.options.onUpdate === "function") {
                    this.options.onUpdate(this.result);
                }
            } else {
                this.force_redraw = true;
                this.calc(true);

                if (this.options.onStart && typeof this.options.onStart === "function") {
                    this.options.onStart(this.result);
                }
            }

            this.updateScene();
            this.raf_id = requestAnimationFrame(this.updateScene.bind(this));
        },

        append: function () {
            var container_html = '<span class="irs js-irs-' + this.plugin_count + '"></span>';
            this.$cache.input.before(container_html);
            this.$cache.input.prop("readonly", true);
            this.$cache.cont = this.$cache.input.prev();
            this.result.slider = this.$cache.cont;

            this.$cache.cont.html(base_html);
            this.$cache.rs = this.$cache.cont.find(".irs");
            this.$cache.min = this.$cache.cont.find(".irs-min");
            this.$cache.max = this.$cache.cont.find(".irs-max");
            this.$cache.from = this.$cache.cont.find(".irs-from");
            this.$cache.to = this.$cache.cont.find(".irs-to");
            this.$cache.single = this.$cache.cont.find(".irs-single");
            this.$cache.bar = this.$cache.cont.find(".irs-bar");
            this.$cache.line = this.$cache.cont.find(".irs-line");
            this.$cache.grid = this.$cache.cont.find(".irs-grid");

            if (this.options.type === "single") {
                this.$cache.cont.append(single_html);
                this.$cache.s_single = this.$cache.cont.find(".single");
                this.$cache.from[0].style.visibility = "hidden";
                this.$cache.to[0].style.visibility = "hidden";
                this.$cache.shad_single = this.$cache.cont.find(".shadow-single");
            } else {
                this.$cache.cont.append(double_html);
                this.$cache.s_from = this.$cache.cont.find(".from");
                this.$cache.s_to = this.$cache.cont.find(".to");
                this.$cache.shad_from = this.$cache.cont.find(".shadow-from");
                this.$cache.shad_to = this.$cache.cont.find(".shadow-to");
            }

            if (this.options.hide_from_to) {
                this.$cache.from[0].style.display = "none";
                this.$cache.to[0].style.display = "none";
                this.$cache.single[0].style.display = "none";
            }

            this.appendGrid();

            if (this.options.disable) {
                this.appendDisableMask();
                this.$cache.input[0].disabled = true;
            } else {
                this.$cache.cont.removeClass("irs-disabled");
                this.$cache.input[0].disabled = false;
                this.bindEvents();
            }
        },

        appendDisableMask: function () {
            this.$cache.cont.append(disable_html);
            this.$cache.cont.addClass("irs-disabled");
        },

        remove: function () {
            this.$cache.cont.remove();
            this.$cache.cont = null;

            this.$cache.line.off("keydown.irs_" + this.plugin_count);

            this.$cache.body.off("touchmove.irs_" + this.plugin_count);
            this.$cache.body.off("mousemove.irs_" + this.plugin_count);

            this.$cache.win.off("touchend.irs_" + this.plugin_count);
            this.$cache.win.off("mouseup.irs_" + this.plugin_count);

            if (is_old_ie) {
                this.$cache.body.off("mouseup.irs_" + this.plugin_count);
                this.$cache.body.off("mouseleave.irs_" + this.plugin_count);
            }

            this.$cache.grid_labels = [];
            this.coords.big = [];
            this.coords.big_w = [];
            this.coords.big_p = [];
            this.coords.big_x = [];

            cancelAnimationFrame(this.raf_id);
        },

        bindEvents: function () {
            this.$cache.body.on("touchmove.irs_" + this.plugin_count, this.pointerMove.bind(this));
            this.$cache.body.on("mousemove.irs_" + this.plugin_count, this.pointerMove.bind(this));

            this.$cache.win.on("touchend.irs_" + this.plugin_count, this.pointerUp.bind(this));
            this.$cache.win.on("mouseup.irs_" + this.plugin_count, this.pointerUp.bind(this));

            this.$cache.line.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
            this.$cache.line.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

            if (this.options.drag_interval && this.options.type === "double") {
                this.$cache.bar.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "both"));
                this.$cache.bar.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "both"));
            } else {
                this.$cache.bar.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
                this.$cache.bar.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
            }

            if (this.options.type === "single") {
                this.$cache.s_single.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
                this.$cache.shad_single.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

                this.$cache.s_single.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
                this.$cache.shad_single.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
            } else {
                this.$cache.s_from.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
                this.$cache.s_to.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
                this.$cache.shad_from.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
                this.$cache.shad_to.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

                this.$cache.s_from.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
                this.$cache.s_to.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
                this.$cache.shad_from.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
                this.$cache.shad_to.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
            }

            if (this.options.keyboard) {
                this.$cache.line.on("keydown.irs_" + this.plugin_count, this.key.bind(this, "keyboard"));
            }

            if (is_old_ie) {
                this.$cache.body.on("mouseup.irs_" + this.plugin_count, this.pointerUp.bind(this));
                this.$cache.body.on("mouseleave.irs_" + this.plugin_count, this.pointerUp.bind(this));
            }
        },

        pointerMove: function (e) {
            if (!this.dragging) {
                return;
            }

            var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
            this.coords.x_pointer = x - this.coords.x_gap;

            this.calc();
        },

        pointerUp: function (e) {
            if (this.current_plugin !== this.plugin_count) {
                return;
            }

            if (this.is_active) {
                this.is_active = false;
            } else {
                return;
            }

            var is_function = this.options.onFinish && typeof this.options.onFinish === "function",
                is_original = $.contains(this.$cache.cont[0], e.target) || this.dragging;

            if (is_function && is_original) {
                this.options.onFinish(this.result);
            }

            this.$cache.cont.find(".state_hover").removeClass("state_hover");

            this.force_redraw = true;
            this.dragging = false;

            if (is_old_ie) {
                $("*").prop("unselectable", false);
            }
        },

        pointerDown: function (target, e) {
            e.preventDefault();
            var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
            if (e.button === 2) {
                return;
            }

            this.current_plugin = this.plugin_count;
            this.target = target;

            this.is_active = true;
            this.dragging = true;

            this.coords.x_gap = this.$cache.rs.offset().left;
            this.coords.x_pointer = x - this.coords.x_gap;

            this.calcPointer();

            switch (target) {
                case "single":
                    this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_single);
                    break;
                case "from":
                    this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_from);
                    this.$cache.s_from.addClass("state_hover");
                    this.$cache.s_from.addClass("type_last");
                    this.$cache.s_to.removeClass("type_last");
                    break;
                case "to":
                    this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_to);
                    this.$cache.s_to.addClass("state_hover");
                    this.$cache.s_to.addClass("type_last");
                    this.$cache.s_from.removeClass("type_last");
                    break;
                case "both":
                    this.coords.p_gap_left = this.toFixed(this.coords.p_pointer - this.coords.p_from);
                    this.coords.p_gap_right = this.toFixed(this.coords.p_to - this.coords.p_pointer);
                    this.$cache.s_to.removeClass("type_last");
                    this.$cache.s_from.removeClass("type_last");
                    break;
            }

            if (is_old_ie) {
                $("*").prop("unselectable", true);
            }

            this.$cache.line.trigger("focus");
        },

        pointerClick: function (target, e) {
            e.preventDefault();
            var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
            if (e.button === 2) {
                return;
            }

            this.current_plugin = this.plugin_count;
            this.target = target;

            this.is_click = true;
            this.coords.x_gap = this.$cache.rs.offset().left;
            this.coords.x_pointer = +(x - this.coords.x_gap).toFixed();

            this.force_redraw = true;
            this.calc();

            this.$cache.line.trigger("focus");
        },

        key: function (target, e) {
            if (this.current_plugin !== this.plugin_count || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                return;
            }

            switch (e.which) {
                case 83: // W
                case 65: // A
                case 40: // DOWN
                case 37: // LEFT
                    e.preventDefault();
                    this.moveByKey(false);
                    break;

                case 87: // S
                case 68: // D
                case 38: // UP
                case 39: // RIGHT
                    e.preventDefault();
                    this.moveByKey(true);
                    break;
            }

            return true;
        },

        // Move by key beta
        // TODO: refactor than have plenty of time
        moveByKey: function (right) {
            var p = this.coords.p_pointer;

            if (right) {
                p += this.options.keyboard_step;
            } else {
                p -= this.options.keyboard_step;
            }

            this.coords.x_pointer = this.toFixed(this.coords.w_rs / 100 * p);
            this.is_key = true;
            this.calc();
        },

        setMinMax: function () {
            if (!this.options) {
                return;
            }

            if (this.options.hide_min_max) {
                this.$cache.min[0].style.display = "none";
                this.$cache.max[0].style.display = "none";
                return;
            }

            if (this.options.values.length) {
                this.$cache.min.html(this.decorate(this.options.p_values[this.options.min]));
                this.$cache.max.html(this.decorate(this.options.p_values[this.options.max]));
            } else {
                this.$cache.min.html(this.decorate(this._prettify(this.options.min), this.options.min));
                this.$cache.max.html(this.decorate(this._prettify(this.options.max), this.options.max));
            }

            this.labels.w_min = this.$cache.min.outerWidth(false);
            this.labels.w_max = this.$cache.max.outerWidth(false);
        },



        // =============================================================================================================
        // Calculations

        calc: function (update) {
            if (!this.options) {
                return;
            }

            this.calc_count++;

            if (this.calc_count === 10 || update) {
                this.calc_count = 0;
                this.coords.w_rs = this.$cache.rs.outerWidth(false);
                if (this.options.type === "single") {
                    this.coords.w_handle = this.$cache.s_single.outerWidth(false);
                } else {
                    this.coords.w_handle = this.$cache.s_from.outerWidth(false);
                }
            }

            if (!this.coords.w_rs) {
                return;
            }

            this.calcPointer();

            this.coords.p_handle = this.toFixed(this.coords.w_handle / this.coords.w_rs * 100);
            var real_width = 100 - this.coords.p_handle,
                real_x = this.toFixed(this.coords.p_pointer - this.coords.p_gap);

            if (this.target === "click") {
                real_x = this.toFixed(this.coords.p_pointer - (this.coords.p_handle / 2));
                this.target = this.chooseHandle(real_x);
            }

            if (real_x < 0) {
                real_x = 0;
            } else if (real_x > real_width) {
                real_x = real_width;
            }

            switch (this.target) {
                case "base":
                    var w = (this.options.max - this.options.min) / 100,
                        f = (this.result.from - this.options.min) / w,
                        t = (this.result.to - this.options.min) / w;

                    this.coords.p_single_real = this.toFixed(f);
                    this.coords.p_from_real = this.toFixed(f);
                    this.coords.p_to_real = this.toFixed(t);

                    this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);
                    this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                    this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);

                    this.coords.p_single = this.toFixed(f - (this.coords.p_handle / 100 * f));
                    this.coords.p_from = this.toFixed(f - (this.coords.p_handle / 100 * f));
                    this.coords.p_to = this.toFixed(t - (this.coords.p_handle / 100 * t));

                    this.target = null;

                    break;

                case "single":
                    if (this.options.from_fixed) {
                        break;
                    }

                    this.coords.p_single_real = this.calcWithStep(real_x / real_width * 100);
                    this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);
                    this.coords.p_single = this.toFixed(this.coords.p_single_real / 100 * real_width);

                    break;

                case "from":
                    if (this.options.from_fixed) {
                        break;
                    }

                    this.coords.p_from_real = this.calcWithStep(real_x / real_width * 100);
                    if (this.coords.p_from_real > this.coords.p_to_real) {
                        this.coords.p_from_real = this.coords.p_to_real;
                    }
                    this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                    this.coords.p_from_real = this.checkMinInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
                    this.coords.p_from_real = this.checkMaxInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
                    this.coords.p_from = this.toFixed(this.coords.p_from_real / 100 * real_width);

                    break;

                case "to":
                    if (this.options.to_fixed) {
                        break;
                    }

                    this.coords.p_to_real = this.calcWithStep(real_x / real_width * 100);
                    if (this.coords.p_to_real < this.coords.p_from_real) {
                        this.coords.p_to_real = this.coords.p_from_real;
                    }
                    this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
                    this.coords.p_to_real = this.checkMinInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
                    this.coords.p_to_real = this.checkMaxInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
                    this.coords.p_to = this.toFixed(this.coords.p_to_real / 100 * real_width);

                    break;

                case "both":
                    real_x = this.toFixed(real_x + (this.coords.p_handle * 0.1));

                    this.coords.p_from_real = this.calcWithStep((real_x - this.coords.p_gap_left) / real_width * 100);
                    this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                    this.coords.p_from_real = this.checkMinInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
                    this.coords.p_from = this.toFixed(this.coords.p_from_real / 100 * real_width);

                    this.coords.p_to_real = this.calcWithStep((real_x + this.coords.p_gap_right) / real_width * 100);
                    this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
                    this.coords.p_to_real = this.checkMinInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
                    this.coords.p_to = this.toFixed(this.coords.p_to_real / 100 * real_width);

                    break;
            }

            if (this.options.type === "single") {
                this.coords.p_bar_x = (this.coords.p_handle / 2);
                this.coords.p_bar_w = this.coords.p_single;

                this.result.from_percent = this.coords.p_single_real;
                this.result.from = this.calcReal(this.coords.p_single_real);
                if (this.options.values.length) {
                    this.result.from_value = this.options.values[this.result.from];
                }
            } else {
                this.coords.p_bar_x = this.toFixed(this.coords.p_from + (this.coords.p_handle / 2));
                this.coords.p_bar_w = this.toFixed(this.coords.p_to - this.coords.p_from);

                this.result.from_percent = this.coords.p_from_real;
                this.result.from = this.calcReal(this.coords.p_from_real);
                this.result.to_percent = this.coords.p_to_real;
                this.result.to = this.calcReal(this.coords.p_to_real);
                if (this.options.values.length) {
                    this.result.from_value = this.options.values[this.result.from];
                    this.result.to_value = this.options.values[this.result.to];
                }
            }

            this.calcMinMax();
            this.calcLabels();
        },

        calcPointer: function () {
            if (!this.coords.w_rs) {
                this.coords.p_pointer = 0;
                return;
            }

            if (this.coords.x_pointer < 0 || isNaN(this.coords.x_pointer)  ) {
                this.coords.x_pointer = 0;
            } else if (this.coords.x_pointer > this.coords.w_rs) {
                this.coords.x_pointer = this.coords.w_rs;
            }

            this.coords.p_pointer = this.toFixed(this.coords.x_pointer / this.coords.w_rs * 100);
        },

        chooseHandle: function (real_x) {
            if (this.options.type === "single") {
                return "single";
            } else {
                var m_point = this.coords.p_from_real + ((this.coords.p_to_real - this.coords.p_from_real) / 2);
                if (real_x >= m_point) {
                    return "to";
                } else {
                    return "from";
                }
            }
        },

        calcMinMax: function () {
            if (!this.coords.w_rs) {
                return;
            }

            this.labels.p_min = this.labels.w_min / this.coords.w_rs * 100;
            this.labels.p_max = this.labels.w_max / this.coords.w_rs * 100;
        },

        calcLabels: function () {
            if (!this.coords.w_rs || this.options.hide_from_to) {
                return;
            }

            if (this.options.type === "single") {

                this.labels.w_single = this.$cache.single.outerWidth(false);
                this.labels.p_single = this.labels.w_single / this.coords.w_rs * 100;
                this.labels.p_single_left = this.coords.p_single + (this.coords.p_handle / 2) - (this.labels.p_single / 2);
                this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single);

            } else {

                this.labels.w_from = this.$cache.from.outerWidth(false);
                this.labels.p_from = this.labels.w_from / this.coords.w_rs * 100;
                this.labels.p_from_left = this.coords.p_from + (this.coords.p_handle / 2) - (this.labels.p_from / 2);
                this.labels.p_from_left = this.toFixed(this.labels.p_from_left);
                this.labels.p_from_left = this.checkEdges(this.labels.p_from_left, this.labels.p_from);

                this.labels.w_to = this.$cache.to.outerWidth(false);
                this.labels.p_to = this.labels.w_to / this.coords.w_rs * 100;
                this.labels.p_to_left = this.coords.p_to + (this.coords.p_handle / 2) - (this.labels.p_to / 2);
                this.labels.p_to_left = this.toFixed(this.labels.p_to_left);
                this.labels.p_to_left = this.checkEdges(this.labels.p_to_left, this.labels.p_to);

                this.labels.w_single = this.$cache.single.outerWidth(false);
                this.labels.p_single = this.labels.w_single / this.coords.w_rs * 100;
                this.labels.p_single_left = ((this.labels.p_from_left + this.labels.p_to_left + this.labels.p_to) / 2) - (this.labels.p_single / 2);
                this.labels.p_single_left = this.toFixed(this.labels.p_single_left);
                this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single);

            }
        },



        // =============================================================================================================
        // Drawings

        updateScene: function () {
            if (!this.options) {
                return;
            }

            this.drawHandles();

            this.raf_id = requestAnimationFrame(this.updateScene.bind(this));
        },

        drawHandles: function () {
            this.coords.w_rs = this.$cache.rs.outerWidth(false);

            if (!this.coords.w_rs) {
                return;
            }

            if (this.coords.w_rs !== this.coords.w_rs_old) {
                this.target = "base";
                this.is_resize = true;
            }

            if (this.coords.w_rs !== this.coords.w_rs_old || this.force_redraw) {
                this.setMinMax();
                this.calc(true);
                this.drawLabels();
                if (this.options.grid) {
                    this.calcGridMargin();
                    this.calcGridLabels();
                }
                this.force_redraw = true;
                this.coords.w_rs_old = this.coords.w_rs;
                this.drawShadow();
            }

            if (!this.coords.w_rs) {
                return;
            }

            if (!this.dragging && !this.force_redraw && !this.is_key) {
                return;
            }

            if (this.old_from !== this.result.from || this.old_to !== this.result.to || this.force_redraw || this.is_key) {

                this.drawLabels();

                this.$cache.bar[0].style.left = this.coords.p_bar_x + "%";
                this.$cache.bar[0].style.width = this.coords.p_bar_w + "%";

                if (this.options.type === "single") {
                    this.$cache.s_single[0].style.left = this.coords.p_single + "%";

                    this.$cache.single[0].style.left = this.labels.p_single_left + "%";

                    if (this.options.values.length) {
                        this.$cache.input.prop("value", this.result.from_value);
                        this.$cache.input.data("from", this.result.from_value);
                    } else {
                        this.$cache.input.prop("value", this.result.from);
                        this.$cache.input.data("from", this.result.from);
                    }
                } else {
                    this.$cache.s_from[0].style.left = this.coords.p_from + "%";
                    this.$cache.s_to[0].style.left = this.coords.p_to + "%";

                    if (this.old_from !== this.result.from || this.force_redraw) {
                        this.$cache.from[0].style.left = this.labels.p_from_left + "%";
                    }
                    if (this.old_to !== this.result.to || this.force_redraw) {
                        this.$cache.to[0].style.left = this.labels.p_to_left + "%";
                    }

                    this.$cache.single[0].style.left = this.labels.p_single_left + "%";

                    if (this.options.values.length) {
                        this.$cache.input.prop("value", this.result.from_value + ";" + this.result.to_value);
                        this.$cache.input.data("from", this.result.from_value);
                        this.$cache.input.data("to", this.result.to_value);
                    } else {
                        this.$cache.input.prop("value", this.result.from + ";" + this.result.to);
                        this.$cache.input.data("from", this.result.from);
                        this.$cache.input.data("to", this.result.to);
                    }
                }

                if ((this.old_from !== this.result.from || this.old_to !== this.result.to) && !this.is_start) {
                    this.$cache.input.trigger("change");
                }

                this.old_from = this.result.from;
                this.old_to = this.result.to;

                var is_function = this.options.onChange && typeof this.options.onChange === "function" && !this.is_resize;
                if (is_function && !this.is_update && !this.is_start) {
                    this.options.onChange(this.result);
                }

                var is_finish = this.options.onFinish && typeof this.options.onFinish === "function";
                if (is_finish && (this.is_key || this.is_click)) {
                    this.options.onFinish(this.result);
                }

                this.is_update = false;
                this.is_resize = false;
            }

            this.is_start = false;
            this.is_key = false;
            this.is_click = false;
            this.force_redraw = false;
        },

        drawLabels: function () {
            if (!this.options) {
                return;
            }

            var values_num = this.options.values.length,
                p_values = this.options.p_values,
                text_single,
                text_from,
                text_to;

            if (this.options.hide_from_to) {
                return;
            }

            if (this.options.type === "single") {

                if (values_num) {
                    text_single = this.decorate(p_values[this.result.from]);
                    this.$cache.single.html(text_single);
                } else {
                    text_single = this.decorate(this._prettify(this.result.from), this.result.from);
                    this.$cache.single.html(text_single);
                }

                this.calcLabels();

                if (this.labels.p_single_left < this.labels.p_min + 1) {
                    this.$cache.min[0].style.visibility = "hidden";
                } else {
                    this.$cache.min[0].style.visibility = "visible";
                }

                if (this.labels.p_single_left + this.labels.p_single > 100 - this.labels.p_max - 1) {
                    this.$cache.max[0].style.visibility = "hidden";
                } else {
                    this.$cache.max[0].style.visibility = "visible";
                }

            } else {

                if (values_num) {

                    if (this.options.decorate_both) {
                        text_single = this.decorate(p_values[this.result.from]);
                        text_single += this.options.values_separator;
                        text_single += this.decorate(p_values[this.result.to]);
                    } else {
                        text_single = this.decorate(p_values[this.result.from] + this.options.values_separator + p_values[this.result.to]);
                    }
                    text_from = this.decorate(p_values[this.result.from]);
                    text_to = this.decorate(p_values[this.result.to]);

                    this.$cache.single.html(text_single);
                    this.$cache.from.html(text_from);
                    this.$cache.to.html(text_to);

                } else {

                    if (this.options.decorate_both) {
                        text_single = this.decorate(this._prettify(this.result.from));
                        text_single += this.options.values_separator;
                        text_single += this.decorate(this._prettify(this.result.to));
                    } else {
                        text_single = this.decorate(this._prettify(this.result.from) + this.options.values_separator + this._prettify(this.result.to), this.result.from);
                    }
                    text_from = this.decorate(this._prettify(this.result.from), this.result.from);
                    text_to = this.decorate(this._prettify(this.result.to), this.result.to);

                    this.$cache.single.html(text_single);
                    this.$cache.from.html(text_from);
                    this.$cache.to.html(text_to);

                }

                this.calcLabels();

                var min = Math.min(this.labels.p_single_left, this.labels.p_from_left),
                    single_left = this.labels.p_single_left + this.labels.p_single,
                    to_left = this.labels.p_to_left + this.labels.p_to,
                    max = Math.max(single_left, to_left);

                if (this.labels.p_from_left + this.labels.p_from >= this.labels.p_to_left) {
                    this.$cache.from[0].style.visibility = "hidden";
                    this.$cache.to[0].style.visibility = "hidden";
                    this.$cache.single[0].style.visibility = "visible";

                    if (this.result.from === this.result.to) {
                        this.$cache.from[0].style.visibility = "visible";
                        this.$cache.single[0].style.visibility = "hidden";
                        max = to_left;
                    } else {
                        this.$cache.from[0].style.visibility = "hidden";
                        this.$cache.single[0].style.visibility = "visible";
                        max = Math.max(single_left, to_left);
                    }
                } else {
                    this.$cache.from[0].style.visibility = "visible";
                    this.$cache.to[0].style.visibility = "visible";
                    this.$cache.single[0].style.visibility = "hidden";
                }

                if (min < this.labels.p_min + 1) {
                    this.$cache.min[0].style.visibility = "hidden";
                } else {
                    this.$cache.min[0].style.visibility = "visible";
                }

                if (max > 100 - this.labels.p_max - 1) {
                    this.$cache.max[0].style.visibility = "hidden";
                } else {
                    this.$cache.max[0].style.visibility = "visible";
                }

            }
        },

        drawShadow: function () {
            var o = this.options,
                c = this.$cache,

                is_from_min = typeof o.from_min === "number" && !isNaN(o.from_min),
                is_from_max = typeof o.from_max === "number" && !isNaN(o.from_max),
                is_to_min = typeof o.to_min === "number" && !isNaN(o.to_min),
                is_to_max = typeof o.to_max === "number" && !isNaN(o.to_max),

                from_min,
                from_max,
                to_min,
                to_max;

            if (o.type === "single") {
                if (o.from_shadow && (is_from_min || is_from_max)) {
                    from_min = this.calcPercent(o.from_min || o.min);
                    from_max = this.calcPercent(o.from_max || o.max) - from_min;
                    from_min = this.toFixed(from_min - (this.coords.p_handle / 100 * from_min));
                    from_max = this.toFixed(from_max - (this.coords.p_handle / 100 * from_max));
                    from_min = from_min + (this.coords.p_handle / 2);

                    c.shad_single[0].style.display = "block";
                    c.shad_single[0].style.left = from_min + "%";
                    c.shad_single[0].style.width = from_max + "%";
                } else {
                    c.shad_single[0].style.display = "none";
                }
            } else {
                if (o.from_shadow && (is_from_min || is_from_max)) {
                    from_min = this.calcPercent(o.from_min || o.min);
                    from_max = this.calcPercent(o.from_max || o.max) - from_min;
                    from_min = this.toFixed(from_min - (this.coords.p_handle / 100 * from_min));
                    from_max = this.toFixed(from_max - (this.coords.p_handle / 100 * from_max));
                    from_min = from_min + (this.coords.p_handle / 2);

                    c.shad_from[0].style.display = "block";
                    c.shad_from[0].style.left = from_min + "%";
                    c.shad_from[0].style.width = from_max + "%";
                } else {
                    c.shad_from[0].style.display = "none";
                }

                if (o.to_shadow && (is_to_min || is_to_max)) {
                    to_min = this.calcPercent(o.to_min || o.min);
                    to_max = this.calcPercent(o.to_max || o.max) - to_min;
                    to_min = this.toFixed(to_min - (this.coords.p_handle / 100 * to_min));
                    to_max = this.toFixed(to_max - (this.coords.p_handle / 100 * to_max));
                    to_min = to_min + (this.coords.p_handle / 2);

                    c.shad_to[0].style.display = "block";
                    c.shad_to[0].style.left = to_min + "%";
                    c.shad_to[0].style.width = to_max + "%";
                } else {
                    c.shad_to[0].style.display = "none";
                }
            }
        },



        // =============================================================================================================
        // Service methods

        toggleInput: function () {
            this.$cache.input.toggleClass("irs-hidden-input");
        },

        calcPercent: function (num) {
            var w = (this.options.max - this.options.min) / 100,
                percent = (num - this.options.min) / w;

            return this.toFixed(percent);
        },

        calcReal: function (percent) {
            var min = this.options.min,
                max = this.options.max,
                abs = 0;

            if (min < 0) {
                abs = Math.abs(min);
                min = min + abs;
                max = max + abs;
            }

            var number = ((max - min) / 100 * percent) + min,
                string = this.options.step.toString().split(".")[1];

            if (string) {
                number = +number.toFixed(string.length);
            } else {
                number = number / this.options.step;
                number = number * this.options.step;
                number = +number.toFixed(0);
            }

            if (abs) {
                number -= abs;
            }

            if (number < this.options.min) {
                number = this.options.min;
            } else if (number > this.options.max) {
                number = this.options.max;
            }

            if (string) {
                return +number.toFixed(string.length);
            } else {
                return this.toFixed(number);
            }
        },

        calcWithStep: function (percent) {
            var rounded = Math.round(percent / this.coords.p_step) * this.coords.p_step;

            if (rounded > 100) {
                rounded = 100;
            }
            if (percent === 100) {
                rounded = 100;
            }

            return this.toFixed(rounded);
        },

        checkMinInterval: function (p_current, p_next, type) {
            var o = this.options,
                current,
                next;

            if (!o.min_interval) {
                return p_current;
            }

            current = this.calcReal(p_current);
            next = this.calcReal(p_next);

            if (type === "from") {

                if (next - current < o.min_interval) {
                    current = next - o.min_interval;
                }

            } else {

                if (current - next < o.min_interval) {
                    current = next + o.min_interval;
                }

            }

            return this.calcPercent(current);
        },

        checkMaxInterval: function (p_current, p_next, type) {
            var o = this.options,
                current,
                next;

            if (!o.max_interval) {
                return p_current;
            }

            current = this.calcReal(p_current);
            next = this.calcReal(p_next);

            if (type === "from") {

                if (next - current > o.max_interval) {
                    current = next - o.max_interval;
                }

            } else {

                if (current - next > o.max_interval) {
                    current = next + o.max_interval;
                }

            }

            return this.calcPercent(current);
        },

        checkDiapason: function (p_num, min, max) {
            var num = this.calcReal(p_num),
                o = this.options;

            if (!min || typeof min !== "number") {
                min = o.min;
            }

            if (!max || typeof max !== "number") {
                max = o.max;
            }

            if (num < min) {
                num = min;
            }

            if (num > max) {
                num = max;
            }

            return this.calcPercent(num);
        },

        toFixed: function (num) {
            num = num.toFixed(5);
            return +num;
        },

        _prettify: function (num) {
            if (!this.options.prettify_enabled) {
                return num;
            }

            if (this.options.prettify && typeof this.options.prettify === "function") {
                return this.options.prettify(num);
            } else {
                return this.prettify(num);
            }
        },

        prettify: function (num) {
            var n = num.toString();
            return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + this.options.prettify_separator);
        },

        checkEdges: function (left, width) {
            if (!this.options.force_edges) {
                return this.toFixed(left);
            }

            if (left < 0) {
                left = 0;
            } else if (left > 100 - width) {
                left = 100 - width;
            }

            return this.toFixed(left);
        },

        validate: function () {
            var o = this.options,
                r = this.result,
                v = o.values,
                vl = v.length,
                value,
                i;

            if (typeof o.min === "string") o.min = +o.min;
            if (typeof o.max === "string") o.max = +o.max;
            if (typeof o.from === "string") o.from = +o.from;
            if (typeof o.to === "string") o.to = +o.to;
            if (typeof o.step === "string") o.step = +o.step;

            if (typeof o.from_min === "string") o.from_min = +o.from_min;
            if (typeof o.from_max === "string") o.from_max = +o.from_max;
            if (typeof o.to_min === "string") o.to_min = +o.to_min;
            if (typeof o.to_max === "string") o.to_max = +o.to_max;

            if (typeof o.keyboard_step === "string") o.keyboard_step = +o.keyboard_step;
            if (typeof o.grid_num === "string") o.grid_num = +o.grid_num;

            if (o.max <= o.min) {
                if (o.min) {
                    o.max = o.min * 2;
                } else {
                    o.max = o.min + 1;
                }
                o.step = 1;
            }

            if (vl) {
                o.p_values = [];
                o.min = 0;
                o.max = vl - 1;
                o.step = 1;
                o.grid_num = o.max;
                o.grid_snap = true;


                for (i = 0; i < vl; i++) {
                    value = +v[i];

                    if (!isNaN(value)) {
                        v[i] = value;
                        value = this._prettify(value);
                    } else {
                        value = v[i];
                    }

                    o.p_values.push(value);
                }
            }

            if (typeof o.from !== "number" || isNaN(o.from)) {
                o.from = o.min;
            }

            if (typeof o.to !== "number" || isNaN(o.from)) {
                o.to = o.max;
            }

            if (o.from < o.min || o.from > o.max) {
                o.from = o.min;
            }

            if (o.to > o.max || o.to < o.min) {
                o.to = o.max;
            }

            if (o.type === "double" && o.from > o.to) {
                o.from = o.to;
            }

            if (typeof o.step !== "number" || isNaN(o.step) || !o.step || o.step < 0) {
                o.step = 1;
            }

            if (typeof o.keyboard_step !== "number" || isNaN(o.keyboard_step) || !o.keyboard_step || o.keyboard_step < 0) {
                o.keyboard_step = 5;
            }

            if (o.from_min && o.from < o.from_min) {
                o.from = o.from_min;
            }

            if (o.from_max && o.from > o.from_max) {
                o.from = o.from_max;
            }

            if (o.to_min && o.to < o.to_min) {
                o.to = o.to_min;
            }

            if (o.to_max && o.from > o.to_max) {
                o.to = o.to_max;
            }

            if (r) {
                if (r.min !== o.min) {
                    r.min = o.min;
                }

                if (r.max !== o.max) {
                    r.max = o.max;
                }

                if (r.from < r.min || r.from > r.max) {
                    r.from = o.from;
                }

                if (r.to < r.min || r.to > r.max) {
                    r.to = o.to;
                }
            }

            if (typeof o.min_interval !== "number" || isNaN(o.min_interval) || !o.min_interval || o.min_interval < 0) {
                o.min_interval = 0;
            }

            if (typeof o.max_interval !== "number" || isNaN(o.max_interval) || !o.max_interval || o.max_interval < 0) {
                o.max_interval = 0;
            }

            if (o.min_interval && o.min_interval > o.max - o.min) {
                o.min_interval = o.max - o.min;
            }

            if (o.max_interval && o.max_interval > o.max - o.min) {
                o.max_interval = o.max - o.min;
            }
        },

        decorate: function (num, original) {
            var decorated = "",
                o = this.options;

            if (o.prefix) {
                decorated += o.prefix;
            }

            decorated += num;

            if (o.max_postfix) {
                if (o.values.length && num === o.p_values[o.max]) {
                    decorated += o.max_postfix;
                    if (o.postfix) {
                        decorated += " ";
                    }
                } else if (original === o.max) {
                    decorated += o.max_postfix;
                    if (o.postfix) {
                        decorated += " ";
                    }
                }
            }

            if (o.postfix) {
                decorated += o.postfix;
            }

            return decorated;
        },

        updateFrom: function () {
            this.result.from = this.options.from;
            this.result.from_percent = this.calcPercent(this.result.from);
            if (this.options.values) {
                this.result.from_value = this.options.values[this.result.from];
            }
        },

        updateTo: function () {
            this.result.to = this.options.to;
            this.result.to_percent = this.calcPercent(this.result.to);
            if (this.options.values) {
                this.result.to_value = this.options.values[this.result.to];
            }
        },

        updateResult: function () {
            this.result.min = this.options.min;
            this.result.max = this.options.max;
            this.updateFrom();
            this.updateTo();
        },


        // =============================================================================================================
        // Grid

        appendGrid: function () {
            if (!this.options.grid) {
                return;
            }

            var o = this.options,
                i, z,

                total = o.max - o.min,
                big_num = o.grid_num,
                big_p = 0,
                big_w = 0,

                small_max = 4,
                local_small_max,
                small_p,
                small_w = 0,

                result,
                html = '';



            this.calcGridMargin();

            if (o.grid_snap) {
                big_num = total / o.step;
                big_p = this.toFixed(o.step / (total / 100));
            } else {
                big_p = this.toFixed(100 / big_num);
            }

            if (big_num > 4) {
                small_max = 3;
            }
            if (big_num > 7) {
                small_max = 2;
            }
            if (big_num > 14) {
                small_max = 1;
            }
            if (big_num > 28) {
                small_max = 0;
            }

            for (i = 0; i < big_num + 1; i++) {
                local_small_max = small_max;

                big_w = this.toFixed(big_p * i);
                if (big_w > 100) {
                    big_w = 100;

                    local_small_max -= 2;
                    if (local_small_max < 0) {
                        local_small_max = 0;
                    }
                }
                this.coords.big[i] = big_w;

                small_p = (big_w - (big_p * (i - 1))) / (local_small_max + 1);

                for (z = 1; z <= local_small_max; z++) {
                    if (big_w === 0) {
                        break;
                    }

                    small_w = this.toFixed(big_w - (small_p * z));

                    html += '<span class="irs-grid-pol small" style="left: ' + small_w + '%"></span>';
                }

                html += '<span class="irs-grid-pol" style="left: ' + big_w + '%"></span>';

                result = this.calcReal(big_w);
                if (o.values.length) {
                    result = o.p_values[result];
                } else {
                    result = this._prettify(result);
                }

                html += '<span class="irs-grid-text js-grid-text-' + i + '" style="left: ' + big_w + '%">' + result + '</span>';
            }
            this.coords.big_num = Math.ceil(big_num + 1);



            this.$cache.cont.addClass("irs-with-grid");
            this.$cache.grid.html(html);
            this.cacheGridLabels();
        },

        cacheGridLabels: function () {
            var $label, i,
                num = this.coords.big_num;

            for (i = 0; i < num; i++) {
                $label = this.$cache.grid.find(".js-grid-text-" + i);
                this.$cache.grid_labels.push($label);
            }

            this.calcGridLabels();
        },

        calcGridLabels: function () {
            var i, label, start = [], finish = [],
                num = this.coords.big_num;

            for (i = 0; i < num; i++) {
                this.coords.big_w[i] = this.$cache.grid_labels[i].outerWidth(false);
                this.coords.big_p[i] = this.toFixed(this.coords.big_w[i] / this.coords.w_rs * 100);
                this.coords.big_x[i] = this.toFixed(this.coords.big_p[i] / 2);

                start[i] = this.toFixed(this.coords.big[i] - this.coords.big_x[i]);
                finish[i] = this.toFixed(start[i] + this.coords.big_p[i]);
            }

            if (this.options.force_edges) {
                if (start[0] < this.coords.grid_gap) {
                    start[0] = this.coords.grid_gap;
                    finish[0] = this.toFixed(start[0] + this.coords.big_p[0]);

                    this.coords.big_x[0] = this.coords.grid_gap;
                }

                if (finish[num - 1] > 100 - this.coords.grid_gap) {
                    finish[num - 1] = 100 - this.coords.grid_gap;
                    start[num - 1] = this.toFixed(finish[num - 1] - this.coords.big_p[num - 1]);

                    this.coords.big_x[num - 1] = this.toFixed(this.coords.big_p[num - 1] - this.coords.grid_gap);
                }
            }

            this.calcGridCollision(2, start, finish);
            this.calcGridCollision(4, start, finish);

            for (i = 0; i < num; i++) {
                label = this.$cache.grid_labels[i][0];
                label.style.marginLeft = -this.coords.big_x[i] + "%";
            }
        },

        // Collisions Calc Beta
        // TODO: Refactor then have plenty of time
        calcGridCollision: function (step, start, finish) {
            var i, next_i, label,
                num = this.coords.big_num;

            for (i = 0; i < num; i += step) {
                next_i = i + (step / 2);
                if (next_i >= num) {
                    break;
                }

                label = this.$cache.grid_labels[next_i][0];

                if (finish[i] <= start[next_i]) {
                    label.style.visibility = "visible";
                } else {
                    label.style.visibility = "hidden";
                }
            }
        },

        calcGridMargin: function () {
            if (!this.options.grid_margin) {
                return;
            }

            this.coords.w_rs = this.$cache.rs.outerWidth(false);
            if (!this.coords.w_rs) {
                return;
            }

            if (this.options.type === "single") {
                this.coords.w_handle = this.$cache.s_single.outerWidth(false);
            } else {
                this.coords.w_handle = this.$cache.s_from.outerWidth(false);
            }
            this.coords.p_handle = this.toFixed(this.coords.w_handle  / this.coords.w_rs * 100);
            this.coords.grid_gap = this.toFixed((this.coords.p_handle / 2) - 0.1);

            this.$cache.grid[0].style.width = this.toFixed(100 - this.coords.p_handle) + "%";
            this.$cache.grid[0].style.left = this.coords.grid_gap + "%";
        },



        // =============================================================================================================
        // Public methods

        update: function (options) {
            if (!this.input) {
                return;
            }

            this.is_update = true;

            this.options.from = this.result.from;
            this.options.to = this.result.to;

            this.options = $.extend(this.options, options);
            this.validate();
            this.updateResult(options);

            this.toggleInput();
            this.remove();
            this.init(true);
        },

        reset: function () {
            if (!this.input) {
                return;
            }

            this.updateResult();
            this.update();
        },

        destroy: function () {
            if (!this.input) {
                return;
            }

            this.toggleInput();
            this.$cache.input.prop("readonly", false);
            $.data(this.input, "ionRangeSlider", null);

            this.remove();
            this.input = null;
            this.options = null;
        }
    };

    $.fn.ionRangeSlider = function (options) {
        return this.each(function() {
            if (!$.data(this, "ionRangeSlider")) {
                $.data(this, "ionRangeSlider", new IonRangeSlider(this, options, plugin_count++));
            }
        });
    };



    // =================================================================================================================
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

    // MIT license

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

} (jQuery, document, window, navigator));

/*!
 * Bootstrap v3.3.2 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.2",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.2",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active"));a&&this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.2",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&"show"==b&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a(this.options.trigger).filter('[href="#'+b.id+'"], [data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.2",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0,trigger:'[data-toggle="collapse"]'},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":a.extend({},e.data(),{trigger:this});c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){b&&3===b.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=c(d),f={relatedTarget:this};e.hasClass("open")&&(e.trigger(b=a.Event("hide.bs.dropdown",f)),b.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger("hidden.bs.dropdown",f)))}))}function c(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.2",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=c(e),g=f.hasClass("open");if(b(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",b);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(b){if(/(38|40|27|32)/.test(b.which)&&!/input|textarea/i.test(b.target.tagName)){var d=a(this);if(b.preventDefault(),b.stopPropagation(),!d.is(".disabled, :disabled")){var e=c(d),g=e.hasClass("open");if(!g&&27!=b.which||g&&27==b.which)return 27==b.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.divider):visible a",i=e.find('[role="menu"]'+h+', [role="listbox"]'+h);if(i.length){var j=i.index(b.target);38==b.which&&j>0&&j--,40==b.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",b).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="menu"]',g.prototype.keydown).on("keydown.bs.dropdown.data-api",'[role="listbox"]',g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$backdrop=this.isShown=null,this.scrollbarWidth=0,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.2",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.options.backdrop&&d.adjustBackdrop(),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in").attr("aria-hidden",!1),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$element.find(".modal-dialog").one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a('<div class="modal-backdrop '+e+'" />').prependTo(this.$element).on("click.dismiss.bs.modal",a.proxy(function(a){a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.options.backdrop&&this.adjustBackdrop(),this.adjustDialog()},c.prototype.adjustBackdrop=function(){this.$backdrop.css("height",0).css("height",this.$element[0].scrollHeight)},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){this.bodyIsOverflowing=document.body.scrollHeight>document.documentElement.clientHeight,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right","")},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||"destroy"!=b)&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};c.VERSION="3.3.2",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(this.options.viewport.selector||this.options.viewport);for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c&&c.$tip&&c.$tip.is(":visible")?void(c.hoverState="in"):(c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide()},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.options.container?a(this.options.container):this.$element.parent(),p=this.getPosition(o);h="bottom"==h&&k.bottom+m>p.bottom?"top":"top"==h&&k.top-m<p.top?"bottom":"right"==h&&k.right+l>p.width?"left":"left"==h&&k.left-l<p.left?"right":h,f.removeClass(n).addClass(h)}var q=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(q,h);var r=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",r).emulateTransitionEnd(c.TRANSITION_DURATION):r()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top=b.top+g,b.left=b.left+h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=this.tip(),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.width&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type)})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||"destroy"!=b)&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.2",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},c.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){var e=a.proxy(this.process,this);this.$body=a("body"),this.$scrollElement=a(a(c).is("body")?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",e),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.2",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b="offset",c=0;a.isWindow(this.$scrollElement[0])||(b="position",c=this.$scrollElement.scrollTop()),this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight();var d=this;this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+c,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){d.offsets.push(this[0]),d.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(!e[a+1]||b<=e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.2",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()
}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.2",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=a("body").height();"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);