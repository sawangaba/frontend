import React, { memo } from 'react';
import { User } from 'lucide-react';
import BaseNode from './BaseNode';

const PersonalityNode = ({ data, selected }) => {
    return (
        <BaseNode
            data={data}
            selected={selected}
            color="purple"
            icon={User}
            title="Personality"
            isGlobal={true}
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span>Tone</span>
                    <span className="text-white">{data.tone || 'Balanced'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Authority</span>
                    <span className="text-white">{data.authority || 'Assistant'}</span>
                </div>
            </div>
        </BaseNode>
    );
};

export default memo(PersonalityNode);
