import React, { memo } from 'react';
import { Database } from 'lucide-react';
import BaseNode from './BaseNode';

const CollectorNode = ({ id, data, selected }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            color="blue"
            icon={Database}
            title="Info Collector"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span>Target</span>
                    <span className="text-white">{data.target || 'Anyone'}</span>
                </div>
                <div className="text-white italic truncate">"{data.question || 'Ask...'}"</div>
            </div>
        </BaseNode>
    );
};

export default memo(CollectorNode);
