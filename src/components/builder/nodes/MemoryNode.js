import React, { memo } from 'react';
import { HardDrive } from 'lucide-react';
import BaseNode from './BaseNode';

const MemoryNode = ({ id, data, selected }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            color="purple"
            icon={HardDrive}
            title="Memory"
        >
            <div className="space-y-2">
                <div className="text-white italic truncate">{data.label || 'Store Data'}</div>
                {data.schema && (
                    <div className="text-[10px] text-neutral-500">
                        Schema: {data.schema.join(', ')}
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

export default memo(MemoryNode);
