import { Module } from "vuex";
import {
    SET_UNIVERSITY_LEVELS,
    SET_UNIVERSITY_TAGS,
    SET_UNIVERSITY_TYPES,
    SET_AREE_TREE,
    SET_SYSTEM_SUPPORTED_MESSAGES,
    SET_JUNIOR_TAGS,
    SET_UNDERGRADUATE_TAGS,
    SET_RECRUIT_BATCH_OPTIONS,
    SET_GRADUATE_YEAR_OPTIONS
} from './mutation-types';

export interface DataModel {
    "typeCode": number;
    "classCode": number;
    "typeName": string;
    "remark": string;
    "createDate": string;
    "modifyTime": string;
    "isValid": 0 | 1;
    "modifyUser": string;
    "showOder": number;
    "id": string;
}

export interface CacheDataState {
    universityTypesData: DataModel[];
    universityLevelsData: DataModel[];
    universityTagsData: DataModel[];
    areaTree: AreaTree[];
    supportedMessages: DataModel[];
    juniorTagsData: DataModel[];
    undergraduateTagsData: DataModel[];
    graduateYearsData: DataModel[];
    recruitBatchsData: DataModel[];
}

const mapToSelectOptions = function (dataModel: DataModel[]): Array<SelectOption<string>> {
    return dataModel.map((item) => {
        return {
            text: item.typeName,
            value: item.typeCode + "|" + item.typeName
        }
    })
}

const mapToCodeOptions = function (dataModel: DataModel[]): Array<SelectOption<number>> {
    return dataModel.map((item) => {
        return {
            text: item.typeName,
            value: item.typeCode
        }
    })
}

const cacheDataState: Module<CacheDataState, any> = {
    state: {
        universityTypesData: [],
        universityLevelsData: [],
        universityTagsData: [],
        areaTree: [],
        supportedMessages: [],
        juniorTagsData: [],
        undergraduateTagsData: [],
        graduateYearsData: [],
        recruitBatchsData: []
    },

    mutations: {
        [SET_UNIVERSITY_LEVELS](state, payload: DataModel[]) {
            state.universityLevelsData = payload;
        },
        [SET_UNIVERSITY_TAGS](state, payload: DataModel[]) {
            state.universityTagsData = payload;
        },
        [SET_UNIVERSITY_TYPES](state, payload: DataModel[]) {
            state.universityTypesData = payload;
        },
        [SET_AREE_TREE](state, payload: AreaTree[]) {
            state.areaTree = payload;
        },
        [SET_SYSTEM_SUPPORTED_MESSAGES](state, payload: DataModel[]) {
            state.supportedMessages = payload;
        },
        [SET_JUNIOR_TAGS](state, payload: DataModel[]) {
            state.juniorTagsData = payload;
        },
        [SET_UNDERGRADUATE_TAGS](state, payload) {
            state.undergraduateTagsData = payload;
        },
        [SET_RECRUIT_BATCH_OPTIONS](state, payload) {
            state.recruitBatchsData = payload;
        },
        [SET_GRADUATE_YEAR_OPTIONS](state, payload) {
            state.graduateYearsData = payload;
        }
    },

    getters: {
        universityTypes(state): Array<SelectOption<string>> {
            return mapToSelectOptions(state.universityTypesData);
        },
        universityLevels(state): Array<SelectOption<string>> {
            return mapToSelectOptions(state.universityLevelsData);
        },
        universityTags(state): Array<SelectOption<string>> {
            return mapToSelectOptions(state.undergraduateTagsData).concat(mapToSelectOptions(state.juniorTagsData));
        },
        juniorTas(state) {
            return mapToSelectOptions(state.juniorTagsData);
        },
        undergraduateTags(state) {
            return mapToSelectOptions(state.undergraduateTagsData);
        },
        areaList(state): AreaTree[] {
            return state.areaTree;
        },
        messageTemplate(state): Dict<string> {
            const ret: Dict<string> = {};
            state.supportedMessages.forEach((item) => {
                ret[item.typeCode] = item.remark;
            })
            return ret;
        },
        yearItems(state): Array<SelectOption<number>> {
            return mapToCodeOptions(state.graduateYearsData);
        },
        batchItems(state): Array<SelectOption<number>> {
            return mapToCodeOptions(state.recruitBatchsData);
        },
    }
}

export default cacheDataState;

