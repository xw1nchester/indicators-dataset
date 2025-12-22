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

const getSelector = el => {
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
            /* if (nth != 1) */ selector += ':nth-of-type(' + nth + ')';
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(' > ');
};

const data = [
    // {
    //     src: '../html/cleaned/accounts.html',
    //     sourceName: 'ВРП с 1998г',
    //     keywords: ['Валовой региональный продукт', 'XLSX']
    // },
    // {
    //     src: '../html/cleaned/accounts.html',
    //     sourceName: 'ВВП с 1995г.',
    //     keywords: ['Валовой внутренний продукт', 'XLSX']
    // },
    // {
    //     src: '../html/cleaned/50801.html',
    //     sourceName:
    //         'Сельскохозяйственное производство (Производство продукции сельского хозяйства в хозяйствах всех категорий по РФ)',
    //     keywords: ['PDF']
    // },
    // {
    //     src: '../html/cleaned/13259.html',
    //     sourceName:
    //         'Информация для ведения мониторинга социально-экономического положения субъектов Российской Федерации',
    //     keywords: ['RAR']
    // },
    // {
    //     src: '../html/cleaned/30709.html',
    //     sourceName:
    //         'Cоциально-экономическое положение Тюменской области (кроме ХМАО – Югры и ЯНАО)',
    //     keywords: ['Информация за 2025 год', 'XLSX']
    // },
    // {
    //     src: '../html/cleaned/industrial.html',
    //     sourceName: 'Индексы производства по ОКВЭД (КДЕС 2 ред.)',
    //     keywords: [
    //         'Индексы производства',
    //         'Данные по ОКВЭД2 (КДЕС Ред.2) (базисный 2018 год)',
    //         'XLSX'
    //     ]
    // },
    // {
    //     src: '../html/cleaned/13284.html',
    //     sourceName:
    //         'Средний возраст населения на конец года, всего; Средний возраст М/Ж',
    //     keywords: ['RAR']
    // },
    // {
    //     src: '../html/cleaned/salaries.html',
    //     sourceName:
    //         'Просроченная задолженность по заработной плате по состоянию на конец периода',
    //     keywords: [
    //         'Среднемесячная начисленная номинальная и реальная заработная плата работников организаций',
    //         'XLSX'
    //     ]
    // },
    // {
    //     src: '../html/cleaned/13723.html',
    //     sourceName: 'Уровень бедности, в % от общей численности населения',
    //     keywords: ['Уровень бедности', 'XLSX']
    // },
    // {
    //     src: '../html/cleaned/14458.html',
    //     sourceName: 'Ввод жилых домов',
    //     keywords: ['Оперативная информация', 'XLSX']
    // }
    // {
    //     src: '../html/cleaned/12781.html',
    //     sourceName: 'Число родившихся, умерших; Естественный прирост/убыль',
    //     keywords: [
    //         'Оперативная информация',
    //         'HTM'
    //     ]
    // },
    {
        src: '../html/cleaned/50801.html',
        sourceName: 'Уровень зарегистрированной безработицы',
        keywords: [
            'HTM'
        ]
    },
    {
        src: '../html/cleaned/DOKLAD_2025.html',
        sourceName: 'Уровень зарегистрированной безработицы',
        keywords: [
            'Приложение. Некоторые статистические показатели социально-экономического положения субъектов Российской Федерации'
        ]
    },
    {
        src: '../html/cleaned/Pril_Dok_10-2025.html',
        sourceName: 'Уровень зарегистрированной безработицы',
        keywords: [
            'Потребность работодателей в работниках, заявленная'
        ]
    }
];

for (const { src, sourceName, keywords } of data) {
    const html = fs.readFileSync(src, 'utf8');
    const dom = new JSDOM(html);

    const items = [];

    for (const keyword of keywords) {
        const element = findElementByText(dom.window.document, keyword);
        let selector = null;
        if (element) {
            selector = getSelector(element);
        }
        items.push({ keyword, selector });
    }

    console.log({ sourceName, src, items });
}
