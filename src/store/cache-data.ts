import { Module } from "vuex";
import {
    SET_UNIVERSITY_LEVELS,
    SET_UNIVERSITY_TAGS,
    SET_UNIVERSITY_TYPES,
    SET_AREE_TREE,
    SET_SYSTEM_SUPPORTED_MESSAGES
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
}

const mapToSelectOptions = function (dataModel: DataModel[]): Array<SelectOption<string>> {
    return dataModel.map((item) => {
        return {
            text: item.typeName,
            value: item.typeCode + "|" + item.typeName
        }
    })
}

const cacheDataState: Module<CacheDataState, any> = {
    state: {
        universityTypesData: [],
        universityLevelsData: [],
        universityTagsData: [],
        areaTree: [],
        supportedMessages: []
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
            return mapToSelectOptions(state.universityTagsData);
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
        }
    }
}

export default cacheDataState;

