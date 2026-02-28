import React from 'react';
import { Check } from 'lucide-react';

const MultiSelect = ({ options, value = [], onChange }) => {
    // Ensure value is an array
    const selectedValues = Array.isArray(value) ? value : [value].filter(Boolean);

    const toggle = (opt) => {
        if (selectedValues.includes(opt)) {
            onChange(selectedValues.filter(v => v !== opt));
        } else {
            onChange([...selectedValues, opt]);
        }
    };

    return (
        <div className="border border-neutral-700 rounded bg-neutral-800 max-h-40 overflow-y-auto custom-scrollbar">
            {options.map(opt => (
                <div
                    key={opt}
                    className="flex items-center p-2 hover:bg-neutral-700 cursor-pointer transition-colors"
                    onClick={() => toggle(opt)}
                >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${selectedValues.includes(opt) ? 'bg-blue-600 border-blue-600' : 'border-neutral-500'}`}>
                        {selectedValues.includes(opt) && <Check size={10} className="text-white" />}
                    </div>
                    <span className="text-sm text-white">{opt}</span>
                </div>
            ))}
        </div>
    );
};

export default MultiSelect;
