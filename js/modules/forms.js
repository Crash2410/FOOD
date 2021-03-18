import {
    closeModals,
    openModal
} from './modals';
import {
    postData
} from '../services/services';

function forms(formSelector, modalTimerId) {
    // Forms - Отправка форм на сервер 
    const forms = document.querySelectorAll(formSelector);

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
        openModal('.modal', modalTimerId);

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
            closeModals('.modal');
        }, 4000);
    }
}

export default forms;