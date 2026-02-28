import React, { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import BaseNode from './BaseNode';

const ChannelNode = ({ id, data, selected }) => {
    return (
        <BaseNode
            id={id}
            data={data}
            selected={selected}
            color="blue"
            icon={MessageSquare}
            title="Channel"
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span>Method</span>
                    <span className="text-white">{data.channel || 'Chat'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Urgency</span>
                    <span className="text-white">{data.urgency || 'Normal'}</span>
                </div>
            </div>
        </BaseNode>
    );
};

export default memo(ChannelNode);
