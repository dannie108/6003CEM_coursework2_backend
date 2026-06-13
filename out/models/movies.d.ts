export declare const getAll: () => Promise<object[]>;
export declare const getById: (id: number) => Promise<object[]>;
export declare const add: (movie: any) => Promise<{
    status: number;
    error?: never;
} | {
    status: number;
    error: any;
}>;
export declare const update: (id: number, movie: any) => Promise<{
    status: number;
    error?: never;
} | {
    status: number;
    error: any;
}>;
export declare const del: (id: number) => Promise<{
    status: number;
    error?: never;
} | {
    status: number;
    error: any;
}>;
//# sourceMappingURL=movies.d.ts.map