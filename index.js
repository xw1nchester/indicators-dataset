import fs from 'fs';
import { JSDOM } from 'jsdom';

const findElementByText = (document, text) => {
    const elements = document.querySelectorAll('*');
    for (const el of elements) {
        const hasOnlyText =
            el.childNodes.length === 1 &&
            el.childNodes[0].nodeType === 3 &&
            el.textContent.trim() !== '';

        if (hasOnlyText && el.innerHTML.includes(text)) {
            return el;
        }
    }
    return null;
};

const getSelector = (el) => {
    const path = [];
    while (el.nodeType === 1 && el.tagName !== 'HTML') {
        let selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
            path.unshift(selector);
            break;
        } else {
            let sib = el,
                nth = 1;
            while ((sib = sib.previousElementSibling)) {
                if (sib.nodeName.toLowerCase() == selector) nth++;
            }
            if (nth != 1) selector += ':nth-of-type(' + nth + ')';
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(' > ');
};

const data = [
    {
        src: './html/accounts.html',
        sourceName: 'ВРП с 1998г',
        keywords: [
            'Валовой региональный продукт',
            'ВРП с 1998 года'
        ]
    },
    {
        src: './html/accounts.html',
        sourceName: 'ВВП с 1995г.',
        keywords: [
            'Валовой внутренний продукт',
            'ВВП годы (с 1995 г.)'
        ]
    },
    {
        src: './html/50801.html',
        sourceName: 'Сельскохозяйственное производство (Производство продукции сельского хозяйства в хозяйствах всех категорий по РФ)',
        keywords: [
            'Январь-октябрь'
        ]
    },
    {
        src: './html/13259.html',
        sourceName: 'Информация для ведения мониторинга социально-экономического положения субъектов Российской Федерации',
        keywords: [
            'Январь-октябрь 2025'
        ]
    },
    {
        src: './html/30709.html',
        sourceName: 'Cоциально-экономическое положение Тюменской области (кроме ХМАО – Югры и ЯНАО)',
        keywords: [
            'Информация за 2025 год',
            'Cоциально-экономическое положение Тюменской области (кроме Ханты-Мансийского автономного округа – Югры и Ямало-Ненецкого автономного округа) в январе-октябре 2025 года'
        ]
    },
    {
        src: './html/industrial.html',
        sourceName: 'Индексы производства по ОКВЭД (КДЕС 2 ред.)',
        keywords: [
            'Индексы производства',
            'Данные по ОКВЭД2 (КДЕС Ред.2) (базисный 2018 год)',
            'Индексы производства по отдельным видам экономической деятельности по субъектам Российской Федерации'
        ]
    },
    {
        src: './html/13284.html',
        sourceName: 'Средний возраст населения на конец года, всего; Средний возраст М/Ж',
        keywords: [
            'Численность населения Российской Федерации по полу и возрасту на 1 января 2024 года'
        ]
    },
    {
        src: './html/12781.html',
        sourceName: 'Число родившихся, умерших; Естественный прирост/убыль',
        keywords: [
            'Оперативная информация',
            'Естественное движение населения (за март 2025 г.)'
        ]
    },
    {
        src: './html/salaries.html',
        sourceName: 'Просроченная задолженность по заработной плате по состоянию на конец периода',
        keywords: [
            'Среднемесячная начисленная номинальная и реальная заработная плата работников организаций',
            'Просроченная задолженность по заработной плате работникам организаций, не относящихся к субъектам малого предпринимательства, по субъектам Российской Федерации c 2019 года'
        ]
    },
    {
        src: './html/13723.html',
        sourceName: 'Уровень бедности, в % от общей численности населения',
        keywords: [
            'Уровень бедности',
            'Численность населения с денежными доходами ниже границы бедности (величины прожиточного минимума) в целом по России и по субъектам Российской Федерации, в процентах от общей численности населения'
        ]
    },
    {
        src: './html/50801.html',
        sourceName: 'Уровень зарегистрированной безработицы',
        keywords: [
            'Социально-экономическое положение России - 2025 г.'
        ]
    },
    {
        src: './html/14458.html',
        sourceName: 'Ввод жилых домов',
        keywords: [
            'Оперативная информация',
            'Строительство жилых домов по субъектам Российской Федерации'
        ]
    }
];


for (const { src, sourceName, keywords } of data) {
    const html = fs.readFileSync(src, 'utf8');
    const dom = new JSDOM(html);

    for (const keyword of keywords) {
        const element = findElementByText(dom.window.document, keyword);
        let selector = null;
        if (element) {
            selector = getSelector(element);
        }
        console.log({ src, keyword, selector });

        // TODO: advanced
    }
}
