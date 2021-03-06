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
        closeModal = document.querySelector('[data-close]'),
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

    // Закрытие модального окна на кнопку 
    closeModal.addEventListener('click', closeModals);

    // Закрытие модального окна за его пределами
    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
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
    // }, 5000);

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
        constructor(src, alt, subtitle, desc, price) {
            this.src = src;
            this.alt = alt;
            this.subtitle = subtitle;
            this.desc = desc;
            this.price = price;
        }

        addCard() {
            const div = document.createElement('div');
            div.classList.add('menu__item');
            div.innerHTML = `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                <div class="menu__item-descr">${this.desc}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                   <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>        
            `;
            menuField.append(div);
        }
    }

    // Добавление карточек на страницу 
    new Cards('img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        229).addCard();

    new Cards('img/tabs/elite.jpg',
        'elite',
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        550).addCard();

    new Cards('img/tabs/post.jpg',
        'post',
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        430).addCard();

    // Forms - Отправка форм на сервер 
    const forms = document.querySelectorAll('form');

    // Объект с сообщениями для пользователя
    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с вами свяжимся',
        failure: 'Что-то пошло не так.'
    };

    // Подключаем отправку форм к формам на странице
    forms.forEach((item) => {
        postData(item);
    });

    // Функция постинга данных
    function postData(form) {
        form.addEventListener('submit', (e) => {
            // отключаем стандартные поведения браузера
            e.preventDefault();

            // создание блока для вывода сообщений пользователю
            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            // создаем и настраиваем запрос
            const request = new XMLHttpRequest();
            request.open('POST', '/server.php');
            // request.setRequestHeader('Content-Type', 'multupart/form-data');

            // формирование данных из формы
            const formData = new FormData(form);
            // отправляем данные 
            request.send(formData);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.failure;
                }
            });

        });
    }

});