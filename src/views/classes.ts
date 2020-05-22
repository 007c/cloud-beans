export interface ClassItem {
    imgUrl: string;
    title: string;
    category: number;
    template: string;
    id: number;
}

export const classes: ClassItem[] = [
    {
        imgUrl: "/static/template/0_1.png",
        title: "有喜欢的人生，从喜欢的专业开始!",
        category: 0,
        template: "0.html",
        id: 0,
    },
    {
        imgUrl: "/static/template/1_1.png",
        title: "考前焦虑，如何接招？",
        category: 0,
        template: "1.html",
        id: 1,
    },
    {
        imgUrl: "/static/template/2_1.png",
        title: "关于平行志愿，你必须知道的几件事!",
        category: 0,
        template: "2.html",
        id: 2,
    },
    {
        imgUrl: "/static/template/3_2.jpeg",
        title: "你的职业兴趣测评结果，决定了未来10年的你！",
        category: 0,
        template: "3.html",
        id: 3,
    },
    {
        imgUrl: "/static/template/4_1.jpeg",
        title: "高考推迟一个月，到底有什么影响？",
        category: 0,
        template: "4.html",
        id: 4
    }
]
