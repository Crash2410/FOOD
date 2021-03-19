require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';

import tabs from './modules/tabs';
import modal from './modules/modals';
import timer from './modules/timers';
import cards from './modules/cards';
import calc from './modules/calculators';
import form from './modules/forms';
import slider from './modules/sliders';
import {
    openModal
} from './modules/modals';

window.addEventListener('DOMContentLoaded', () => {
    // Таймер открытия модального окна
    const modalTimerId = setTimeout(function () {
        openModal('.modal', modalTimerId);
    }, 50000);
    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    modal('[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2021-05-27');
    cards();
    calc();
    form('form', modalTimerId);
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });
});