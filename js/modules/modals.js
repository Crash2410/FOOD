 // Функция открытия окна
 function openModal(modalSelector, modalTimerId) {
     const modal = document.querySelector(modalSelector);
     modal.style.display = 'block';

     if (modalTimerId) {
         clearInterval(modalTimerId);
     }
 }

 // Функция закрытия окна
 function closeModals(modalSelector) {
     const modal = document.querySelector(modalSelector);
     modal.style.display = 'none';
 }

 function modals(triggerSelector, modalSelector, modalTimerId) {
     // Modal
     const modalTrigger = document.querySelectorAll(triggerSelector),
         modal = document.querySelector(modalSelector);

     // Открытие модального окна по кнопкам
     modalTrigger.forEach(item => {
         item.addEventListener('click', (e) => {
             e.preventDefault();
             openModal(modalSelector, modalTimerId);
         });
     });

     // Закрытие модального окна за его пределами
     modal.addEventListener('click', (e) => {
         if (e.target == modal || e.target.getAttribute('data-close') == '') {
             closeModals(modalSelector);
         }
     });

     // Закрытие модального окна на Escape
     document.addEventListener('keydown', (e) => {
         if (e.code == 'Escape' && getComputedStyle(modal).display == 'block') {
             closeModals(modalSelector);
         }
     });

     // Открытие окна при скоролее на подвале(футере) страницы
     function showModalByScroll() {
         if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
             openModal(modalSelector, modalTimerId);
             window.removeEventListener('scroll', showModalByScroll);
         }
     }

     window.addEventListener('scroll', showModalByScroll);

 }

 export default modals;
 export {
     closeModals
 };
 export {
     openModal
 };