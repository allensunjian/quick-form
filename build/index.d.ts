import { RendererElement, RendererNode, VNode } from "vue";
interface IFunction<T = void> {
    (...items: any): T;
}
interface IObject<T = any> {
    [x: string]: T;
}
export declare const Throttling: (dely: number, fn: IFunction) => (...argus: any[]) => void;
export declare const QuickForm: {
    render(): VNode<RendererNode, RendererElement, {
        [key: string]: any;
    }>;
    directives: {
        sif: {
            updated: (el: any, argus: any) => void;
        };
    };
    methods: {
        getFrom(): any;
        addItem(item: any): void;
        _updateComponents(): void;
        resetRules(resourceRules: IObject<any>): Promise<unknown>;
    };
    data: () => {
        _quickOptions: {};
        defaultValue: string;
        _raw: number;
    };
    props: {
        formData: {
            type: ObjectConstructor;
            default: () => {};
        };
        quickOptions: {
            type: ObjectConstructor;
            default: () => {};
        };
        depOptions: {
            type: ObjectConstructor;
            default: () => {};
        };
        rules: {
            type: ObjectConstructor;
            default: () => {};
        };
    };
};
declare const _default: {
    install: (app: {
        component: (arg0: string, arg1: {
            render(): VNode<RendererNode, RendererElement, {
                [key: string]: any;
            }>;
            directives: {
                sif: {
                    updated: (el: any, argus: any) => void;
                };
            };
            methods: {
                getFrom(): any;
                addItem(item: any): void;
                _updateComponents(): void;
                resetRules(resourceRules: IObject<any>): Promise<unknown>;
            };
            data: () => {
                _quickOptions: {};
                defaultValue: string;
                _raw: number;
            };
            props: {
                formData: {
                    type: ObjectConstructor;
                    default: () => {};
                };
                quickOptions: {
                    type: ObjectConstructor;
                    default: () => {};
                };
                depOptions: {
                    type: ObjectConstructor;
                    default: () => {};
                };
                rules: {
                    type: ObjectConstructor;
                    default: () => {};
                };
            };
        }) => void;
    }) => void;
};
export default _default;
