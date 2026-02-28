import React, { memo } from 'react';
import { Building2 } from 'lucide-react';
import BaseNode from './BaseNode';

const BusinessNode = ({ data, selected }) => {
    return (
        <BaseNode
            data={data}
            selected={selected}
            color="blue"
            icon={Building2}
            title="Business Setup"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span>Name</span>
                    <span className="text-white truncate max-w-[100px]">{data.businessName || 'Unnamed'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Type</span>
                    <span className="text-white">{data.businessType || 'Generic'}</span>
                </div>
            </div>
        </BaseNode>
    );
};

export default memo(BusinessNode);
