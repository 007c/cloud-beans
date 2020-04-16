import { Module } from "vuex";
import { SET_UNIVERSITY_LEVELS, SET_UNIVERSITY_TAGS, SET_UNIVERSITY_TYPES, SET_AREE_TREE } from './mutation-types';

export interface DataModel {
    "typeCode": string;
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
}

const mapToSelectOptions = function (dataModel: DataModel[]): Array<SelectOption<string>> {
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
        areaTree: []
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
        }
    }
}

export default cacheDataState;

