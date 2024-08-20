import Papa from 'papaparse';

interface Customer {
    "Customer Name": string;
    [key: string]: any;
}

export const generateCSV = (data: Customer[]): string => {
    return Papa.unparse(data);
};

export const parseCSV = (file: File): Promise<Customer[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                resolve(results.data as Customer[]);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};
