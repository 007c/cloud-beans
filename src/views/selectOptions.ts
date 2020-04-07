export const subjectItems: Array<SelectOption<string>> = [
    {
        text: "理科",
        value: "0"
    },
    {
        text: "文科",
        value: "1"
    }
];

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

