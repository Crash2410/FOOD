function modals() {
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

}

module.exports = modals;