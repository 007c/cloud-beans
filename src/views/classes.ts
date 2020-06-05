export interface ClassItem {
    "articleID": number;
    "title": string;
    "imgUrl": string;
    "articleTypeID": ArticleTypes;
    "articleType": string;
    "content": string;
    "contentTypeID": number;
    "contentType": string;
    "contentUrl": string;
    "readCount": number;
    "collectCount": number;
    "showOrder": number;
    "pubTime": string;
    "isShow": number;
    "editUser": string;
    "id": string;
}

export enum ArticleTypes {
    "不限",
    "志愿填报",
    "高考动态",
    "院校专业"
}


