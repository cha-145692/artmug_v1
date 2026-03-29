    // 포트폴리오 리스트 노출

const portfolio = document.querySelector('.sl_portfolio');
const slides = portfolio.querySelectorAll('.swiper-slide');
const thumb_wrap = document.querySelector('.sl_portfolio_thumb .swiper-wrapper');

slides.forEach(function(slide){
    const video = slide.querySelector('.video');
    const code = video.dataset.code;

    video.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${code}" 
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
    `;
});

let thumbs_html = '';

slides.forEach(function(slide){
    const code = slide.querySelector('.video').dataset.code;

    thumbs_html += `
        <div class="swiper-slide">
            <div class="video">
                <img src="https://img.youtube.com/vi/${code}/0.jpg">
            </div>
        </div>
    `;
});

thumb_wrap.innerHTML = thumbs_html;



// 양식복사
function copy(){
    const text = document.querySelector('.request_txt').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("클립보드에 복사되었습니다.");
    }).catch(err => {
        console.error('복사 실패:', err);
    });
}


var num = 0;
setInterval(function () {
    
    document.querySelectorAll('.rolling').forEach(function (rolling, index) {
        const liList = rolling.querySelectorAll('li');
        const max = liList.length;

        liList.forEach(function (li) {
            li.classList.remove('on');
        });


        if (liList[num]) {
            liList[num].classList.add('on');
        }

        num++;

        if (num === max) num = 0;

    });

}, 1000);



document.addEventListener('DOMContentLoaded', function(){

    var sl_portfolio_thumb = new Swiper(".sl_portfolio_thumb", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        draggable:true,
        

        breakpoints:{
            780:{
                spaceBetween: 20,
            }
        }
    });

    var sl_portfolio = new Swiper(".sl_portfolio", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".sl_portfolio .btn .next",
            prevEl: ".sl_portfolio .btn .prev",
        },
        thumbs: {
            swiper: sl_portfolio_thumb,
        },
        effect:'fade',
    });

})


function scroll_to_anchor(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const offset = 80;
    const rect = target.getBoundingClientRect();
    const top = rect.top + window.scrollY - offset;

    window.scrollTo({
        top: top,
        behavior: 'smooth'
    });
}


var sections = document.querySelectorAll('.nav_sec');
var cateItems = document.querySelectorAll('nav li')
window.addEventListener('scroll', () => {
    const winScr = window.scrollY;
    let activeIdx = -1;

    sections.forEach((section, idx) => {
        const currentTop = section.offsetTop - 120;
        const nextTop = (idx + 1 < sections.length)
        ? sections[idx + 1].offsetTop
        : Infinity;

        if (winScr >= currentTop && winScr < nextTop) {
        activeIdx = idx;
        }
    });

    if (winScr < sections[0].offsetTop) {
        activeIdx = 0;
    }

    cateItems.forEach(item => item.classList.remove('on'));

    if (activeIdx !== -1 && cateItems[activeIdx]) {
        cateItems[activeIdx].classList.add('on');
    }
});