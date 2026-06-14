export declare const getAll: () => Promise<object[]>;
export declare const getById: (id: number | string) => Promise<object[]>;
export declare const add: (user: any) => Promise<{
    status: number;
    id: any;
    affectedRows: any;
    error?: never;
} | {
    status: number;
    error: any;
    id?: never;
    affectedRows?: never;
}>;
export declare const update: (id: number, user: any) => Promise<{
    status: number;
    affectedRows: any;
    error?: never;
} | {
    status: number;
    error: any;
    affectedRows?: never;
}>;
export declare const del: (id: number) => Promise<{
    status: number;
    affectedRows: any;
    error?: never;
} | {
    status: number;
    error: any;
    affectedRows?: never;
}>;
export declare const findByUsername: (username: string) => Promise<object[]>;
//# sourceMappingURL=users.d.ts.map