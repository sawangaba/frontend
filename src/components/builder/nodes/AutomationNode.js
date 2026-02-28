import React, { memo } from 'react';
import { Zap } from 'lucide-react';
import BaseNode from './BaseNode';

const AutomationNode = ({ data, selected }) => {
    return (
        <BaseNode
            data={data}
            selected={selected}
            color="orange"
            icon={Zap}
            title="Automation"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span>Trigger</span>
                    <span className="text-white">{data.trigger || 'Manual'}</span>
                </div>
                {data.trigger === 'schedule' && (
                    <div className="flex justify-between items-center">
                        <span>Time</span>
                        <span className="text-white">{data.time || '00:00'}</span>
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

export default memo(AutomationNode);
