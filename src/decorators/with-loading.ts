import store from "@/store";
import {
    INCREMENT_REQUEST_COUNT,
    REDUCE_REQUEST_COUNT,
} from "@/store/mutation-types";
export function withLoading() {
    return function handler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = async function() {
            if (method) {
                store.commit(INCREMENT_REQUEST_COUNT);
                try {
                    return await method.apply(this, arguments);
                } catch (ex) {
                    // handle Errors;
                    throw ex;
                } finally {
                    store.commit(REDUCE_REQUEST_COUNT)
                }

            }
        }
    }
}
