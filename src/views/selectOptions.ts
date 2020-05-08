import { Subject } from '@/store/use-state';

export const subjectItems: Array<SelectOption<number>> = [
    {
        text: "理科",
        value: Subject.理科
    },
    {
        text: "文科",
        value: Subject.文科
    }
];

// export const universityTypes: Array<SelectOption<number>> = [
//     {
//         text: "全部",
//         value: 0,
//     },
//     {
//         text: "理工类",
//         value: 1
//     },
//     {
//         text: "综合类",
//         value: 2
//     }
// ]

// export const universityLevels: Array<SelectOption<number>> = [
//     {
//         text: "全部",
//         value: 0,
//     },
//     {
//         text: "本科",
//         value: 1
//     },
//     {
//         text: "专科",
//         value: 2
//     }
// ]

// export const universityTags: Array<SelectOption<number>> = [
//     {
//         text: "全部",
//         value: 0,
//     },
//     {
//         text: "211",
//         value: 1
//     },
//     {
//         text: "985",
//         value: 2
//     },
// ]

type GenerateFn = (count: number, since?: Date) => Array<SelectOption<number>>


const generateLatestYearItems: GenerateFn = function(count, since = new Date()) {
    const sinceYear = since.getFullYear();
    const items = [];
    for (let i = 1; i <= count; i++) {
        items.push({
            text: sinceYear - i + "年",
            value: sinceYear - i
        });
    }

    return items;
}

export const yearItems = generateLatestYearItems(5);

