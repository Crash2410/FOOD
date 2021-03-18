function sliders() {
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

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
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
}

module.exports = sliders;