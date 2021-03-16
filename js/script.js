window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    // Скрываем табы и контент табов
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    // Показываем табы и контент (по умолчанию показывается 1 таб с его контентом)
    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    // Изменяем контент в табах при нажатии на категории 
    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2021-05-27';

    // Расчет осташегося времени
    function getTimeRemaining(endTime) {
        const t = Date.parse(endTime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            "minutes": minutes,
            'seconds': seconds
        };
    }

    // Установка 0, если значение не десятичное (06, вместо 6)
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    // Установка таймера
    function setClock(selector, endTime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        // Обновление времени в таймере
        function updateClock() {
            const t = getTimeRemaining(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }

    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    // Функция открытия окна
    function openModal() {
        modal.style.display = 'block';
        clearInterval(modalTimerId);
    }

    // Функция закрытия окна
    function closeModals() {
        modal.style.display = 'none';
    }

    // Открытие модального окна по кнопкам
    modalTrigger.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });


    // Закрытие модального окна за его пределами
    modal.addEventListener('click', (e) => {
        if (e.target == modal || e.target.getAttribute('data-close') == '') {
            modal.style.display = 'none';
        }
    });

    // Закрытие модального окна на Escape
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape' && getComputedStyle(modal).display == 'block') {
            modal.style.display = 'none';
        }
    });

    // Таймер открытия модального окна
    // const modalTimerId = setTimeout(function () {
    //     modal.style.display = 'block';
    // }, 50000);

    // Открытие окна при скоролее на подвале(футере) страницы
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Cards - карточки с меню

    let menuField = document.querySelector('.menu__field div');

    // Класс с параметрами для карточки и методом добавления карточки на страницу
    class Cards {
        constructor(src, alt, subtitle, descr, price) {
            this.src = src;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
        }

        addCard() {
            const div = document.createElement('div');
            div.classList.add('menu__item');
            div.innerHTML = `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                   <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>        
            `;
            menuField.append(div);
        }
    }

    // Получение информации с сервера
    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // Добавление карточек на страницу 
    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new Cards(img, altimg, title, descr, price).addCard();
            });
        });

    // Forms - Отправка форм на сервер 
    const forms = document.querySelectorAll('form');

    // Объект с сообщениями для пользователя
    const message = {
        loading: '/img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжимся',
        failure: 'Что-то пошло не так.'
    };

    // Подключаем отправку форм к формам на странице
    forms.forEach((item) => {
        bindPostData(item);
    });

    // Постинг данных на сервер
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    // Функция привязки постинга 
    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            // отключаем стандартные поведения браузера
            e.preventDefault();

            // создание блока для вывода сообщений пользователю
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);
            /*Работа с сервером при помощи XMLHttpRequest*/
            // создаем и настраиваем запрос
            // const request = new XMLHttpRequest();
            // request.open('POST', '/server.php');
            // request.setRequestHeader('Content-Type', 'application/json');

            // формирование данных из формы
            const formData = new FormData(form);

            // преобразование FormData в JSON, путем перебора всех данных в FormData и добавлениях их в объект
            // Старый вариант
            // const object = {};
            // formData.forEach((value, key) => {
            //     object[key] = value;
            // });
            // Новый вариант
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            // const json = JSON.stringify(object);

            // отправляем данные 
            // request.send(json);

            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();

            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // });

            /*Работа с сервером при помощи Fetch API*/
            // fetch('/server.php', {
            //     method: "POST",
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(object)
            // });

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    // Модальное окно благорадности 
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.style.display = 'none';
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.style.display = 'block';
            closeModals();
        }, 4000);
    }


    // Слайдер 'вариант 1'

    const sliders = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        nextSlide = document.querySelector('.offer__slider-next'),
        prevSlide = document.querySelector('.offer__slider-prev'),
        currentCountSlide = document.querySelector('#current'),
        totalCountSlide = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    // Функция подсчитывающая побщее кол-во слайдов
    function currentTotalCount() {
        totalCountSlide.textContent = getZero(sliders.length);
    }

    let currentSlide = 1;
    let offset = 0; // отступ

    // Показ нужного слайда
    // function showSlide(n) {
    //     if (n > sliders.length) {
    //         currentSlide = 1;
    //     }
    //     if (n < 1) {
    //         currentSlide = sliders.length;
    //     }

    //     sliders.forEach(slide => {
    //         slide.style.display = 'none';
    //     });

    //     sliders[currentSlide - 1].style.display = 'block';
    //     currentCountSlide.textContent = getZero(currentSlide);
    // }

    // showSlide(1);
    currentTotalCount();

    // Функция для перелистывания назад/вперед
    // function next(number) {
    //     showSlide(currentSlide += number);
    // }

    // nextSlide.addEventListener('click', (e) => {
    //     next(1);
    // });

    // prevSlide.addEventListener('click', (e) => {
    //     next(-1);
    // });

    // Слайдер 'вариант 2', карусель
    // Навигация для слайдера

    slider.style.position = 'relative';
    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < sliders.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

        if (i == 0) {
            dot.style.opacity = 1;
        }

        indicators.append(dot);
        dots.push(dot);
    }

    if (sliders.length < 10) {
        currentCountSlide.textContent = getZero(currentSlide);
    } else {
        currentCountSlide.textContent = currentSlide;
    }

    // Задаем обвертке ширину всех слайдеров и добавляем стили для правильного отображения слайдов
    slidesField.style.width = 100 * sliders.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    // Скрываем слайдеры которые не попадают в область видимости wrapper`а
    slidesWrapper.style.overflow = 'hidden';

    sliders.forEach(slide => {
        slide.style.width = width;
    });


    nextSlide.addEventListener('click', () => {
        if (offset == +width.replace(/\D/g, '') * (sliders.length - 1)) {
            offset = 0;
        } else {
            offset += +width.replace(/\D/g, '');
        }

        // вычисляем на сколько сдвинится блок
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (currentSlide == sliders.length) {
            currentSlide = 1;
        } else {
            currentSlide++;
        }

        if (sliders.length < 10) {
            currentCountSlide.textContent = getZero(currentSlide);
        } else {
            currentCountSlide.textContent = currentSlide;
        }

        dots.forEach(dot => {
            dot.style.opacity = '.5';
        });
        dots[currentSlide - 1].style.opacity = 1;
    });

    prevSlide.addEventListener('click', () => {

        if (offset == 0) {
            offset = +width.replace(/\D/g, '') * (sliders.length - 1);
        } else {
            offset -= +width.replace(/\D/g, '');
        }
        // вычисляем на сколько сдвинится блок
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (currentSlide == 1) {
            currentSlide = sliders.length;
        } else {
            currentSlide--;
        }

        if (sliders.length < 10) {
            currentCountSlide.textContent = getZero(currentSlide);
        } else {
            currentCountSlide.textContent = currentSlide;
        }

        dots.forEach(dot => {
            dot.style.opacity = '.5';
        });
        dots[currentSlide - 1].style.opacity = 1;
    });

    // Перелистывание слайдов при нажатии на кнопки навигации
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            currentSlide = slideTo;
            offset = +width.replace(/\D/g, '') * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (sliders.length < 10) {
                currentCountSlide.textContent = getZero(currentSlide);
            } else {
                currentCountSlide.textContent = currentSlide;
            }

            dots.forEach(dot => {
                dot.style.opacity = '.5';
            });
            dots[currentSlide - 1].style.opacity = 1;
        });
    });

    // Калькулятор 

    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
        height, weight, age, ratio = '1.375';

    // Полные расчеты по формулам
    function calcTotal() {
        // предусматриваем, чтобы были введены все данные для получения расчета
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '___';
            return;
        }

        // настройка расчетов по формулам, для каждого из полов
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age))) * ratio;
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age))) * ratio;
        }
    }

    calcTotal();

    // Получаем информацию с блоков "физической активности" и "пол"
    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }

                console.log(ratio, sex);

                elements.forEach((elem) => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    // Функция обработки инпутов
    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', (e) => {
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');
});