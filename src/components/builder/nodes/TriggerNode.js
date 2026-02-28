import React, { memo } from 'react';
import { Zap } from 'lucide-react';
import BaseNode from './BaseNode';

const TriggerNode = ({ id, data, selected }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            color="orange"
            icon={Zap}
            title="Trigger"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span>Type</span>
                    <span className="text-white">{data.triggerType || 'Manual'}</span>
                </div>
                {data.triggerType === 'time' && (
                    <div className="flex justify-between items-center">
                        <span>When</span>
                        <span className="text-white">{data.time || 'Daily'}</span>
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

export default memo(TriggerNode);
