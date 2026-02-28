import React, { memo } from 'react';
import { Signpost } from 'lucide-react';
import BaseNode from './BaseNode';

const RouterNode = ({ id, data, selected }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            color="orange"
            icon={Signpost}
            title="Router"
        >
            <div className="space-y-2">
                <div className="text-white italic truncate">{data.label || 'Route Flow'}</div>
                {data.routes && (
                    <div className="flex flex-col gap-1">
                        {Object.keys(data.routes).map(route => (
                            <span key={route} className="text-[10px] bg-neutral-800 px-1 rounded text-neutral-400">
                                {route}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

export default memo(RouterNode);
