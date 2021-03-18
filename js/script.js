window.addEventListener('DOMContentLoaded', () => {
    const tabs = require('./modules/tabs'),
        modal = require('./modules/modals'),
        timer = require('./modules/timers'),
        cards = require('./modules/cards'),
        calc = require('./modules/calculators'),
        form = require('./modules/forms'),
        slider = require('./modules/sliders');

    tabs();
    modal();
    timer();
    cards();
    calc();
    form();
    slider();
});