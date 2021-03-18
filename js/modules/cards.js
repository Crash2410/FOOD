import {getResource} from '../services/services';

function cards() {
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

}

export default cards;