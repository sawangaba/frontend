import React, { memo } from 'react';
import { Database } from 'lucide-react';
import BaseNode from './BaseNode';

const DataSourceNode = ({ data, selected }) => {
    return (
        <BaseNode
            data={data}
            selected={selected}
            color="blue"
            icon={Database}
            title="Data Source"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span>Source</span>
                    <span className="text-white truncate max-w-[100px]">{data.sourceType || 'Not Connected'}</span>
                </div>
            </div>
        </BaseNode>
    );
};

export default memo(DataSourceNode);
