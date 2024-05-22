import { useRef, useState } from 'react';
import Papa from 'papaparse';

interface Customer {
    "Customer Name": string;
    [key: string]: any;
}

function CSVConverter() {

    const fileRef = useRef < HTMLInputElement > (null);
    const typeRef = useRef < HTMLSelectElement > (null);
    const [customers, setCustomers] = useState < Customer[] > ([]);

    const handleCustomerClick = (customer: Customer) => {
        generateCSVAndCallAPI([customer]);
    };

    const generateCSV = (data: Customer[]) => {
        const csv = Papa.unparse(data);
        return csv;
    };

    const uploadCSV = (event: React.FormEvent) => {
        event.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event) {
                    const text = event.target?.result;
                    if (typeof text === 'string') {
                        const parsedData = Papa.parse < Customer > (text, { header: true });
                        setCustomers(parsedData.data);
                    }
                }
            };
            reader.readAsText(file);
        }
    }

    const generateCSVAndCallAPI = async (customerData: Customer[]) => {
        const csv = generateCSV(customerData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const contentType = typeRef.current?.value;
        console.log(blob, contentType);
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('content_type', contentType || '');

        const response = await fetch('http://localhost:8000/upload/', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'text/event-stream',
            },
        });
        const reader = response?.body?.getReader();
        const decoder = new TextDecoder();
        const streamOutput = document.getElementById('streamOutput');
        if (streamOutput && reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                streamOutput.textContent += decoder.decode(value, { stream: true });
            }
        }
    };

    return (
        <div style={{ background: "#000", color: "#fff" }}>
            <h1>Upload a File and Stream Content</h1>
            <form id="uploadForm" onSubmit={uploadCSV}>
                <input type="file" id="fileInput" name="file" required ref={fileRef} />
                <select id="contentType" name="content_type" required ref={typeRef}>
                    <option value="email">Email</option>
                    <option value="blog">Blog</option>
                    <option value="sms">SMS</option>
                </select>
                <button type="submit">Upload</button>
            </form>
            <h2>Streamed Data:</h2>
            <pre id="streamOutput"></pre>

            <ul>
                {customers.map((customer, index) => (
                    <li key={index} onClick={() => handleCustomerClick(customer)} style={{ color: "white", cursor: "pointer" }}>
                        {customer["Customer Name"]}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CSVConverter